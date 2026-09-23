// SERVER-ONLY universal site search behind /search. Where lib/search.ts only
// scores restaurant rows, this fans a single natural-language query out across
// every content type on the site — restaurant listings, pho partner profiles,
// blog guides, review pages, /find map pages, city listicles, and recipes —
// and figures out what the visitor actually meant.
//
// The whole trick is that real queries are phrased like sentences ("best ramen
// in phoenix", "closest ramen bar near me"), so the filler words that make them
// readable are exactly the words that break naive matching. Intent parsing
// strips those out, works out whether the query names a place, a broth, or the
// visitor's own location, and routes it accordingly.
import { restaurants, getCities, type Restaurant } from './restaurants'
import { phoRestaurants, phoCityParam, type PhoRestaurant } from './pho'
import { blogPosts } from './blog-posts'
import { getReviewSlug, hasReviewPage } from './reviews'
import { getAllRecipes } from './recipes'
import { searchRestaurants } from './search'
import { getSupplementListings, supplementToRestaurant } from './places-supplements'
import { FIND_PAGES } from '@/components/find-cross-links'
import { CITY_GUIDE_REDIRECTS } from './city-guide-migration'
import { getCityListicleEntries, getCityPhoListicleEntries } from './city-listicles'
import { STATE_CODE_TO_NAME, STATE_CODE_TO_SLUG } from './state-lookups'
import { CAPITAL_CITIES } from './capital-cities'
import { MAJOR_CITIES } from './major-cities-list'

const STATE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_NAME).map(([code, name]) => [name.toLowerCase(), code]),
)

// Words that carry no matching signal in a food-search sentence. Dropped before
// we try to recognise a place name, so "best ramen in phoenix" reduces to
// "phoenix" and actually resolves to a city.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'at', 'on', 'of', 'for', 'to', 'by', 'with', 'and', 'or',
  'me', 'my', 'i', 'is', 'are', 'was', 'im', 'find', 'show', 'get', 'want', 'need',
  'looking', 'look', 'search', 'where', 'whats', 'what', 'can', 'you', 'some', 'any',
  'good', 'great', 'best', 'top', 'nice', 'cool', 'nearby', 'near', 'close', 'closest',
  'around', 'here', 'now', 'today', 'tonight', 'place', 'places', 'spot', 'spots',
  'restaurant', 'restaurants', 'shop', 'shops', 'bar', 'bars', 'joint', 'joints',
  'food', 'eat', 'eats', 'eating', 'dinner', 'lunch', 'open',
])

// "ramen"/"pho" are meaningful as a cuisine switch but useless as a text match
// against a directory where nearly everything is already ramen.
const CUISINE_WORDS = new Set(['ramen', 'noodle', 'noodles', 'pho', 'vietnamese', 'japanese'])

const NEAR_ME_RE = /\b(near\s*(me|by)|nearby|closest|close\s+to\s+me|around\s+me|my\s+area|near\s+my)\b/i
const BEST_RE = /\b(best|top|highest[\s-]?rated|greatest|favou?rite)\b/i
const OPEN_NOW_RE = /\b(open\s*(now|late|24)|late\s*night|24\s*hours?)\b/i

export type SearchIntent = {
  raw: string
  /** Query with filler stripped — what we actually match place names against. */
  core: string
  tokens: string[]
  nearMe: boolean
  wantsBest: boolean
  wantsOpen: boolean
  /** True when the visitor asked about pho rather than ramen. */
  phoIntent: boolean
  city: { city: string; citySlug: string; stateCode: string; stateSlug: string } | null
  stateCode: string | null
}

export type SearchHit = {
  href: string
  title: string
  subtitle?: string
  meta?: string
  rating?: number | null
  reviewCount?: number
  photo?: string
  score: number
}

export type SiteSearchResults = {
  intent: SearchIntent
  restaurants: Array<Restaurant & { _score: number }>
  pho: PhoRestaurant[]
  blog: SearchHit[]
  reviews: SearchHit[]
  findPages: SearchHit[]
  recipes: SearchHit[]
  total: number
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Best city name appearing in the query.
 *
 *  Candidates come from three registries, because the one with our deepest
 *  listings isn't always the one a visitor means: the DB (cities with real
 *  ramen rows), state capitals, and major US cities. "Phoenix" is the case
 *  that forced this — the DB only has a Phoenix in Oregon with four listings,
 *  but someone typing "best ramen in phoenix" means Arizona, which we cover
 *  through /find rather than the DB.
 *
 *  Ranked by: an explicit state in the query, then longest name matched (so
 *  "north miami beach" beats the "miami" inside it), then major/capital
 *  status, then how many DB listings we hold. */
function detectCity(normalized: string, stateHint: string | null) {
  type Cand = {
    city: string; citySlug: string; stateCode: string; stateSlug: string
    len: number; count: number; major: boolean
  }
  const candidates: Cand[] = []

  const add = (city: string, citySlug: string, stateCode: string, stateSlug: string, count: number, major: boolean) => {
    const cityLower = city.toLowerCase()
    if (cityLower.length < 3) return
    const re = new RegExp(`\\b${cityLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (!re.test(normalized)) return
    candidates.push({ city, citySlug, stateCode, stateSlug, len: cityLower.length, count, major })
  }

  for (const c of getCities()) add(c.city, c.citySlug, c.stateCode, c.stateSlug, c.count, false)
  for (const c of CAPITAL_CITIES) add(c.city, c.citySlug, c.stateCode, c.stateSlug, 0, true)
  for (const c of MAJOR_CITIES) {
    const slug = c.city.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    add(c.city, slug, c.stateCode, STATE_CODE_TO_SLUG[c.stateCode] ?? '', 0, true)
  }
  if (candidates.length === 0) return null

  // Merge duplicates of the same city across registries, keeping the richest.
  const merged = new Map<string, Cand>()
  for (const c of candidates) {
    const key = `${c.citySlug}-${c.stateCode}`
    const prev = merged.get(key)
    if (!prev) merged.set(key, c)
    else merged.set(key, { ...prev, count: Math.max(prev.count, c.count), major: prev.major || c.major })
  }

  let best: Cand | null = null
  for (const cand of merged.values()) {
    if (!best) { best = cand; continue }
    const candState = stateHint != null && cand.stateCode === stateHint
    const bestState = stateHint != null && best.stateCode === stateHint
    if (candState !== bestState) { if (candState) best = cand; continue }
    if (cand.len !== best.len) { if (cand.len > best.len) best = cand; continue }
    if (cand.major !== best.major) { if (cand.major) best = cand; continue }
    if (cand.count > best.count) best = cand
  }
  if (!best) return null
  const { len: _len, count: _count, major: _major, ...rest } = best
  return rest
}

function detectState(normalized: string): string | null {
  for (const [name, code] of Object.entries(STATE_NAME_TO_CODE)) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (re.test(normalized)) return code
  }
  // Trailing two-letter state code. The near-me phrasing is stripped by the
  // caller first, otherwise "vegan ramen near me" reads its own "me" as Maine.
  const m = normalized.match(/\b([a-z]{2})\b\s*$/)
  if (m && STATE_CODE_TO_NAME[m[1].toUpperCase()]) return m[1].toUpperCase()
  return null
}

export function parseIntent(raw: string): SearchIntent {
  const normalized = normalize(raw)
  const nearMe = NEAR_ME_RE.test(raw)
  const wantsBest = BEST_RE.test(raw)
  const wantsOpen = OPEN_NOW_RE.test(raw)
  const phoIntent = /\b(pho|vietnamese)\b/i.test(raw)

  // Strip the near-me phrasing before any place detection, so its own words
  // can't be read as a location ("near me" → the ME state code).
  const geoText = normalized.replace(NEAR_ME_RE, ' ').replace(/\s+/g, ' ').trim()
  const explicitState = detectState(geoText)
  const city = detectCity(geoText, explicitState)
  const stateCode = city?.stateCode ?? explicitState

  // Strip filler + the city we already resolved, so what's left is the part of
  // the query that should be matched as free text (a restaurant or dish name).
  let core = normalized
  if (city) core = core.replace(new RegExp(`\\b${city.city.toLowerCase()}\\b`, 'g'), ' ')
  const tokens = core
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t) && !CUISINE_WORDS.has(t))

  return { raw, core: tokens.join(' '), tokens, nearMe, wantsBest, wantsOpen, phoIntent, city, stateCode }
}

function scoreText(haystack: string, tokens: string[], phrase: string): number {
  if (!tokens.length) return 0
  const h = haystack.toLowerCase()
  let score = 0
  if (phrase && h.includes(phrase)) score += 6
  for (const t of tokens) if (h.includes(t)) score += 2
  return score
}

export function searchSite(raw: string): SiteSearchResults {
  const intent = parseIntent(raw)
  const { tokens, core, city, phoIntent } = intent
  const normalized = normalize(raw)

  // ── Restaurants ────────────────────────────────────────────────────────
  // A recognised city short-circuits to that city's listings ranked by rating,
  // which is what "best ramen in phoenix" is really asking for. Otherwise fall
  // back to the existing name/city/zip scorer on the raw query.
  let restaurantHits: Array<Restaurant & { _score: number }> = []
  if (city && tokens.length === 0) {
    restaurantHits = restaurants
      .filter(r => r.citySlug === city.citySlug && r.stateSlug === city.stateSlug)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .map(r => ({ ...r, _score: 10 }))
    // Plenty of real cities (Phoenix AZ among them) have no DB rows but are
    // covered by the Google Places supplements the /find map pages run on.
    // Without this a perfectly good city query returns an empty page.
    if (restaurantHits.length === 0) {
      restaurantHits = getSupplementListings(city.citySlug, city.stateCode)
        .map(supplementToRestaurant)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
        .map(r => ({ ...r, _score: 9 }))
    }
  } else {
    const base = searchRestaurants(core || normalized)
    restaurantHits = base.map((r, i) => ({ ...r, _score: Math.max(1, 10 - i * 0.01) }))
    if (city) {
      // Query named both a place and something else — keep the place.
      const inCity = restaurantHits.filter(r => r.citySlug === city.citySlug)
      if (inCity.length > 0) restaurantHits = inCity
    }
  }
  if (intent.wantsBest) {
    restaurantHits = [...restaurantHits].sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
    )
  }

  // ── Pho partner listings ───────────────────────────────────────────────
  let phoHits: PhoRestaurant[] = []
  if (phoIntent || city) {
    phoHits = phoRestaurants.filter(p => {
      if (city && p.citySlug !== city.citySlug) return false
      if (!city && !phoIntent) return false
      if (tokens.length > 0) {
        const blob = `${p.name} ${p.city} ${p.description}`.toLowerCase()
        return tokens.some(t => blob.includes(t))
      }
      return true
    })
    if (phoIntent && phoHits.length === 0 && tokens.length > 0) {
      phoHits = phoRestaurants.filter(p => tokens.some(t => p.name.toLowerCase().includes(t)))
    }
    phoHits = phoHits
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
      .slice(0, 12)
  }

  // Matchable terms for the content types below.
  //
  // The bare cuisine word is deliberately excluded whenever the query carries
  // any other signal — nearly every page on a ramen site contains "ramen", so
  // including it made "best ramen in phoenix" match every generic guide and
  // every "… Ramen Near Me" map page. It's only added back for a bare cuisine
  // query, where showing the general ramen content genuinely is the right answer.
  const contentTokens = [...tokens]
  if (phoIntent) contentTokens.push('pho')
  if (city) contentTokens.push(city.city.toLowerCase())
  if (contentTokens.length === 0 && /\bramen\b/i.test(raw)) contentTokens.push('ramen')
  const contentPhrase = normalized.length >= 4 ? normalized : ''

  // ── Blog ───────────────────────────────────────────────────────────────
  const blog: SearchHit[] = blogPosts
    .filter(p => !CITY_GUIDE_REDIRECTS[p.slug])
    .map(p => {
      const title = p.h1 ?? p.title
      let score = scoreText(`${title} ${p.description} ${p.category ?? ''}`, contentTokens, contentPhrase)
      // A generic cuisine-only query shouldn't rank every post equally — give
      // the title a stronger say than the description.
      score += scoreText(title, contentTokens, contentPhrase)
      // Only nudge "Best …" posts that already matched the query on their own.
      // Applied unconditionally it pulled every listicle on the site into
      // unrelated searches, just because the word "best" was in the query.
      if (score > 0 && intent.wantsBest && /\bbest\b/i.test(title)) score += 3
      return { href: `/blog/${p.slug}`, title, subtitle: p.category, meta: p.readTime, score }
    })
    .filter(h => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  // City listicles are blog pages too, and they're the most on-point answer for
  // a "best ramen in {city}" query, so they're merged in and boosted.
  if (city) {
    const wanted = `in ${city.city}, ${city.stateCode}`.toLowerCase()
    for (const e of [...getCityListicleEntries(), ...getCityPhoListicleEntries()]) {
      if (!e.label.toLowerCase().includes(wanted)) continue
      const isPho = e.label.toLowerCase().includes('pho')
      if (isPho && !phoIntent) continue
      blog.unshift({ href: e.href, title: e.label, subtitle: 'Best Of', meta: `${e.count} spots`, score: 100 })
    }
  }

  // ── Reviews ────────────────────────────────────────────────────────────
  const reviews: SearchHit[] = restaurantHits
    .slice(0, 30)
    .filter(r => hasReviewPage(getReviewSlug(r)))
    .slice(0, 6)
    .map(r => ({
      href: `/reviews/${getReviewSlug(r)}`,
      title: `${r.name} Reviews`,
      subtitle: `${r.city}, ${r.stateCode}`,
      rating: r.rating,
      reviewCount: r.reviewCount,
      photo: r.photo,
      score: 5,
    }))

  // ── /find map pages ────────────────────────────────────────────────────
  const findPages: SearchHit[] = FIND_PAGES
    .map(p => ({
      href: p.href,
      title: p.label,
      subtitle: 'Map search',
      score: scoreText(p.label, contentTokens, contentPhrase),
    }))
    .filter(h => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  // The city's own map page is the single most useful /find result when the
  // query named a place, so it goes first regardless of text score.
  if (city) {
    findPages.unshift({
      href: `/find/${city.citySlug}-${city.stateCode.toLowerCase()}`,
      title: `Ramen in ${city.city}, ${city.stateCode}`,
      subtitle: 'Map search',
      score: 100,
    })
    if (phoIntent && phoHits.length > 0) {
      findPages.unshift({
        href: `/find/${phoCityParam(city.citySlug, city.stateCode)}`,
        title: `Pho in ${city.city}, ${city.stateCode}`,
        subtitle: 'Map search',
        score: 101,
      })
    }
  }
  if (intent.nearMe && !findPages.some(f => f.href === '/find/best-ramen-near-me')) {
    findPages.unshift({
      href: phoIntent ? '/find/pho-restaurants' : '/find/best-ramen-near-me',
      title: phoIntent ? 'Pho Restaurants Near Me' : 'Best Ramen Near Me',
      subtitle: 'Map search',
      score: 99,
    })
  }

  // ── Recipes ────────────────────────────────────────────────────────────
  // Skipped for place-based queries: someone asking "best ramen in phoenix"
  // wants restaurants, and every ramen recipe would otherwise match on the
  // bare word "ramen" and pad the page with irrelevant results.
  const cookingIntent = /\b(recipe|recipes|make|making|cook|cooking|homemade|diy|how\s+to)\b/i.test(raw)
  const recipes: SearchHit[] = (city && !cookingIntent) ? [] : getAllRecipes()
    .map(r => ({
      href: `/recipes/${r.slug}`,
      title: r.title,
      subtitle: 'Recipe',
      score: scoreText(`${r.title} ${r.description}`, contentTokens, contentPhrase)
        + (cookingIntent ? 4 : 0),
    }))
    .filter(h => h.score > (cookingIntent ? 0 : 3))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  return {
    intent,
    restaurants: restaurantHits.slice(0, 24),
    pho: phoHits,
    blog: blog.slice(0, 8),
    reviews,
    findPages: findPages.slice(0, 6),
    recipes,
    total: restaurantHits.length + phoHits.length + blog.length + reviews.length + findPages.length + recipes.length,
  }
}
