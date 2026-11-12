// Universal site search behind /search. Where a plain name search only scores
// restaurant rows, this fans a single natural-language query out across every
// content type on the site — restaurant listings, pho partner profiles, blog
// guides, review pages, /find map pages, city listicles, and recipes — and
// figures out what the visitor actually meant.
//
// Pure and client-safe: it runs in the browser over the static index built by
// lib/site-search-corpus.ts (/data/search-index.json), since the site has no
// server.
//
// The whole trick is that real queries are phrased like sentences ("best ramen
// in phoenix", "closest ramen bar near me"), so the filler words that make them
// readable are exactly the words that break naive matching. Intent parsing
// strips those out, works out whether the query names a place, a broth, or the
// visitor's own location, and routes it accordingly.
import { STATE_CODE_TO_NAME } from './state-lookups'

export type SearchRestaurant = {
  slug: string
  name: string
  city: string
  state: string
  stateCode: string
  citySlug: string
  stateSlug: string
  postalCode?: string
  address?: string
  rating: number | null
  reviewCount: number
  photo?: string
  /** Set when the restaurant has a live /reviews page. */
  reviewSlug?: string
}

export type SearchPho = {
  slug: string; name: string; city: string; citySlug: string; stateCode: string
  description: string; rating: number | null; reviewCount: number; photo?: string
}

export type SearchCorpus = {
  restaurants: SearchRestaurant[]
  supplements: SearchRestaurant[]
  cities: Array<{ city: string; citySlug: string; stateCode: string; stateSlug: string; count: number; major: boolean }>
  pho: SearchPho[]
  blog: Array<{ slug: string; title: string; description: string; category?: string; readTime?: string }>
  listicles: Array<{ href: string; label: string; count: number }>
  findPages: Array<{ href: string; label: string }>
  recipes: Array<{ slug: string; title: string; description: string }>
}

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
  restaurants: Array<SearchRestaurant & { _score: number }>
  pho: SearchPho[]
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
function detectCity(normalized: string, stateHint: string | null, corpus: SearchCorpus) {
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

  for (const c of corpus.cities) add(c.city, c.citySlug, c.stateCode, c.stateSlug, c.count, c.major)
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

export function parseIntent(raw: string, corpus: SearchCorpus): SearchIntent {
  const normalized = normalize(raw)
  const nearMe = NEAR_ME_RE.test(raw)
  const wantsBest = BEST_RE.test(raw)
  const wantsOpen = OPEN_NOW_RE.test(raw)
  const phoIntent = /\b(pho|vietnamese)\b/i.test(raw)

  // Strip the near-me phrasing before any place detection, so its own words
  // can't be read as a location ("near me" → the ME state code).
  const geoText = normalized.replace(NEAR_ME_RE, ' ').replace(/\s+/g, ' ').trim()
  const explicitState = detectState(geoText)
  const city = detectCity(geoText, explicitState, corpus)
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

export function searchSite(raw: string, corpus: SearchCorpus): SiteSearchResults {
  const intent = parseIntent(raw, corpus)
  const { tokens, core, city, phoIntent } = intent
  const normalized = normalize(raw)

  // ── Restaurants ────────────────────────────────────────────────────────
  // A recognised city short-circuits to that city's listings ranked by rating,
  // which is what "best ramen in phoenix" is really asking for. Otherwise fall
  // back to the existing name/city/zip scorer on the raw query.
  let restaurantHits: Array<SearchRestaurant & { _score: number }> = []
  if (city && tokens.length === 0) {
    restaurantHits = corpus.restaurants
      .filter(r => r.citySlug === city.citySlug && r.stateSlug === city.stateSlug)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .map(r => ({ ...r, _score: 10 }))
    // Plenty of real cities (Phoenix AZ among them) have no DB rows but are
    // covered by the Google Places supplements the /find map pages run on.
    // Without this a perfectly good city query returns an empty page.
    if (restaurantHits.length === 0) {
      restaurantHits = corpus.supplements
        .filter(r => r.citySlug === city.citySlug && r.stateCode === city.stateCode)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
        .map(r => ({ ...r, _score: 9 }))
    }
  } else {
    const base = searchRestaurants(corpus.restaurants, core || normalized)
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
  let phoHits: SearchPho[] = []
  if (phoIntent || city) {
    phoHits = corpus.pho.filter(p => {
      if (city && p.citySlug !== city.citySlug) return false
      if (!city && !phoIntent) return false
      if (tokens.length > 0) {
        const blob = `${p.name} ${p.city} ${p.description}`.toLowerCase()
        return tokens.some(t => blob.includes(t))
      }
      return true
    })
    if (phoIntent && phoHits.length === 0 && tokens.length > 0) {
      phoHits = corpus.pho.filter(p => tokens.some(t => p.name.toLowerCase().includes(t)))
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
  const blog: SearchHit[] = corpus.blog
    .map(p => {
      const title = p.title
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
    for (const e of corpus.listicles) {
      if (!e.label.toLowerCase().includes(wanted)) continue
      const isPho = e.label.toLowerCase().includes('pho')
      if (isPho && !phoIntent) continue
      blog.unshift({ href: e.href, title: e.label, subtitle: 'Best Of', meta: `${e.count} spots`, score: 100 })
    }
  }

  // ── Reviews ────────────────────────────────────────────────────────────
  const reviews: SearchHit[] = restaurantHits
    .slice(0, 30)
    .filter(r => r.reviewSlug)
    .slice(0, 6)
    .map(r => ({
      href: `/reviews/${r.reviewSlug}`,
      title: `${r.name} Reviews`,
      subtitle: `${r.city}, ${r.stateCode}`,
      rating: r.rating,
      reviewCount: r.reviewCount,
      photo: r.photo,
      score: 5,
    }))

  // ── /find map pages ────────────────────────────────────────────────────
  const findPages: SearchHit[] = corpus.findPages
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
        href: `/find/pho-restaurants-${city.citySlug}-${city.stateCode.toLowerCase()}`,
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
  const recipes: SearchHit[] = (city && !cookingIntent) ? [] : corpus.recipes
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

/** Name / city / state / ZIP scorer for restaurant rows. */
function searchRestaurants(rows: SearchRestaurant[], query: string): SearchRestaurant[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)
  const isZip = /^\d{3,5}$/.test(q)

  const seen = new Set<string>()
  const scored: { r: SearchRestaurant; score: number }[] = []

  for (const r of rows) {
    if (seen.has(r.slug)) continue
    seen.add(r.slug)

    const name      = r.name?.toLowerCase() ?? ''
    const city      = r.city?.toLowerCase() ?? ''
    const state     = r.state?.toLowerCase() ?? ''
    const stateCode = r.stateCode?.toLowerCase() ?? ''
    const zip       = r.postalCode ?? ''
    const addr      = r.address?.toLowerCase() ?? ''

    let score = -1

    // ── Zip code ─────────────────────────────────────────────────────────────
    if (isZip) {
      if (zip === q)             score = Math.max(score, 8)
      else if (zip.startsWith(q)) score = Math.max(score, 4)
    }

    // ── Name: phrase match ────────────────────────────────────────────────────
    if (name === q)               score = Math.max(score, 10)
    else if (name.startsWith(q))  score = Math.max(score, 9)
    else if (name.includes(q))    score = Math.max(score, 7)

    // ── Name: token match ─────────────────────────────────────────────────────
    const nameHits = tokens.filter(t => name.includes(t)).length
    if (nameHits === tokens.length && nameHits > 0) score = Math.max(score, 6)
    else if (nameHits > 0)                          score = Math.max(score, nameHits)

    // ── City: phrase match ────────────────────────────────────────────────────
    // "north bellmore" → city === "north bellmore" → score 9
    if (city === q)               score = Math.max(score, 9)
    else if (city.includes(q))    score = Math.max(score, 8)

    // ── City: token match — ALL tokens must appear in city ───────────────────
    // "north bellmore" → both "north" AND "bellmore" must be in city
    // prevents partial-token false positives like "north miami beach" scoring as a city match
    const cityHits = tokens.filter(t => city.includes(t)).length
    if (cityHits === tokens.length && cityHits > 0) score = Math.max(score, 7)
    // single stray token in city is weak — only use as tiebreaker if nothing else matched
    else if (cityHits > 0 && score < 0)             score = Math.max(score, 1)

    // ── State match ───────────────────────────────────────────────────────────
    if (stateCode === q || state === q)  score = Math.max(score, 6)
    else if (state.startsWith(q) || stateCode.startsWith(q)) score = Math.max(score, 3)

    // ── Cross-field: tokens split across name + city ──────────────────────────
    // "jinya atlanta" → "jinya" in name AND "atlanta" in city → strong match
    // Requires the UNION of matched tokens to cover all query tokens
    // (avoids double-counting: "north" in both name and city of "North Miami Beach"
    //  would cover {north} ∪ {north} = {north}, not {north, bellmore})
    if (nameHits > 0 && cityHits > 0 && nameHits < tokens.length) {
      const nameTokensCovered = new Set(tokens.filter(t => name.includes(t)))
      const cityTokensCovered = new Set(tokens.filter(t => city.includes(t)))
      const allCovered = new Set([...nameTokensCovered, ...cityTokensCovered])
      if (allCovered.size === tokens.length) score = Math.max(score, 7)
    }

    // ── Address fallback: only full-phrase, no token expansion ────────────────
    // Prevents street directions like "123 North Ave" matching the token "north"
    if (score < 0 && addr.includes(q)) score = 0

    if (score >= 0) scored.push({ r, score })
  }

  // Sort by score desc, then rating desc as tiebreaker
  scored.sort((a, b) => b.score - a.score || (b.r.rating ?? 0) - (a.r.rating ?? 0))

  // For multi-token queries with strong matches (≥7), filter out weak stragglers
  // e.g. "north bellmore" has score-9 city matches → don't show score-1 noise
  if (tokens.length > 1 && scored.length > 0) {
    const best = scored[0].score
    if (best >= 7) {
      const threshold = Math.max(best - 2, 5)
      const tight = scored.filter(x => x.score >= threshold)
      if (tight.length > 0) return tight.map(x => x.r)
    }
  }

  return scored.map(x => x.r)
}
