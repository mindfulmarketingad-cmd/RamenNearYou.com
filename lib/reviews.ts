import { restaurants, type Restaurant } from './restaurants'
import { detectBrothType } from './expand-description'

// ---------------------------------------------------------------------------
// Globally-unique review slugs
// Restaurant slugs are NOT globally unique (385 collisions), so the flat
// /reviews/[restaurant] route needs a deterministic, collision-free slug.
//   unique slug            -> slug
//   collision              -> slug-city
//   still colliding         -> slug-city-2, slug-city-3, ...
// Assignment walks the array in its stable JSON order, so it is identical on
// every build.
// ---------------------------------------------------------------------------

const slugCounts = new Map<string, number>()
for (const r of restaurants) slugCounts.set(r.slug, (slugCounts.get(r.slug) ?? 0) + 1)

const _used = new Set<string>()
const _byReviewSlug = new Map<string, Restaurant>()
const _reviewSlugFor = new Map<Restaurant, string>()

for (const r of restaurants) {
  const base = slugCounts.get(r.slug) === 1 ? r.slug : `${r.slug}-${r.citySlug}`
  let cand = base
  let i = 2
  while (_used.has(cand)) {
    cand = `${base}-${i}`
    i++
  }
  _used.add(cand)
  _byReviewSlug.set(cand, r)
  _reviewSlugFor.set(r, cand)
}

export function getReviewSlug(r: Restaurant): string {
  return _reviewSlugFor.get(r) ?? r.slug
}

export function getRestaurantByReviewSlug(slug: string): Restaurant | null {
  return _byReviewSlug.get(slug) ?? null
}

export function allReviewSlugs(): string[] {
  return Array.from(_byReviewSlug.keys())
}

// Every restaurant gets a review page. Kept as one function so the static
// params, the /reviews index, and lookups all stay in sync.
let _reviewRestaurants: Restaurant[] | null = null
export function getReviewRestaurants(): Restaurant[] {
  if (!_reviewRestaurants) {
    _reviewRestaurants = [...restaurants]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
  }
  return _reviewRestaurants
}

const _reviewSlugSet = new Set(getReviewRestaurants().map((r) => getReviewSlug(r)))
export function hasReviewPage(slug: string): boolean {
  return _reviewSlugSet.has(slug)
}

// ---------------------------------------------------------------------------
// Related-review suggestions — every /reviews/[restaurant] page links out to
// a handful of others (same city first, then same state, then top-rated
// overall) so no review page is an orphan reachable only via the sitemap.
// ---------------------------------------------------------------------------

let _byCity: Map<string, Restaurant[]> | null = null
let _byState: Map<string, Restaurant[]> | null = null

function relatedIndexes() {
  if (!_byCity || !_byState) {
    _byCity = new Map()
    _byState = new Map()
    for (const r of getReviewRestaurants()) {
      const cityKey = `${r.citySlug}|${r.stateSlug}`
      if (!_byCity.has(cityKey)) _byCity.set(cityKey, [])
      _byCity.get(cityKey)!.push(r)
      if (!_byState.has(r.stateSlug)) _byState.set(r.stateSlug, [])
      _byState.get(r.stateSlug)!.push(r)
    }
  }
  return { byCity: _byCity, byState: _byState }
}

export function getRelatedReviewRestaurants(r: Restaurant, limit = 6): Restaurant[] {
  const { byCity, byState } = relatedIndexes()
  const picked: Restaurant[] = []
  const seen = new Set<string>([getReviewSlug(r)])

  function addFrom(pool: Restaurant[] | undefined) {
    if (!pool) return
    for (const cand of pool) {
      if (picked.length >= limit) return
      const slug = getReviewSlug(cand)
      if (seen.has(slug)) continue
      seen.add(slug)
      picked.push(cand)
    }
  }

  addFrom(byCity.get(`${r.citySlug}|${r.stateSlug}`))
  if (picked.length < limit) addFrom(byState.get(r.stateSlug))
  if (picked.length < limit) addFrom(getReviewRestaurants())
  return picked
}

// ---------------------------------------------------------------------------
// Deterministic review generation
// Seeded by the restaurant slug so the same reviews render on every build.
// ---------------------------------------------------------------------------

export type ReviewAspect = 'Taste' | 'Noodle Size' | 'Bowl Size' | 'Broth' | 'Value'

export interface GeneratedReview {
  author: string
  rating: number
  date: string // ISO yyyy-mm-dd
  body: string
  aspects: { label: ReviewAspect; value: string }[]
}

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST_NAMES = [
  'Jessica', 'Michael', 'Emily', 'David', 'Sarah', 'Daniel', 'Ashley', 'James',
  'Megan', 'Kevin', 'Rachel', 'Brian', 'Lauren', 'Justin', 'Amanda', 'Tyler',
  'Nicole', 'Andrew', 'Stephanie', 'Ryan', 'Hannah', 'Eric', 'Olivia', 'Jason',
  'Grace', 'Aaron', 'Vanessa', 'Kenji', 'Yuki', 'Sophia', 'Marcus', 'Priya',
  'Carlos', 'Mei', 'Tony', 'Linda', 'Derek', 'Natalie', 'Sam', 'Christina',
]
const LAST_INITIALS = 'ABCDEFGHJKLMNPRSTW'.split('')

const TASTE_OPENERS_HIGH = [
  'Honestly one of the best bowls of ramen I have had in a long time.',
  'The flavor here is on another level — rich, balanced, and deeply savory.',
  'Came in skeptical and left a believer. The broth alone is worth the trip.',
  'Every spoonful was packed with umami. You can tell they take this seriously.',
  'This is the real deal. Authentic flavor that reminds me of bowls I had in Japan.',
  'Absolutely delicious from the first bite to the last drop of broth.',
]
const TASTE_OPENERS_MID = [
  'Solid bowl of ramen — nothing crazy, but consistently good.',
  'Decent flavor overall. It hit the spot on a cold day.',
  'Pretty good ramen. The broth was tasty even if not super memorable.',
  'A reliable spot when you are craving a warm bowl of noodles.',
  'Tasty enough and fairly priced. I would come back.',
]
const TASTE_OPENERS_LOW = [
  'Was hoping for more — the flavor fell a little flat for me.',
  'It was okay. The broth needed a bit more depth in my opinion.',
  'Not bad, but I have had better ramen elsewhere in town.',
  'Service was friendly but the bowl itself was just average.',
]

const NOODLE_NOTES = [
  'The noodles had a perfect chew and held up well in the broth.',
  'Noodles were springy and cooked exactly to that ideal firmness.',
  'Generous portion of noodles — I did not run out before the broth.',
  'The noodle texture was spot on, not mushy at all.',
  'Could have used a touch more noodles for the price, but the texture was great.',
  'Thick, satisfying noodles that soaked up all that flavor.',
]
const BOWL_NOTES = [
  'The bowl is huge — easily enough to fill you up for the night.',
  'Portion size is generous; I could barely finish the whole bowl.',
  'A hearty, large bowl that is well worth the price.',
  'Bowl was a good size, just right for a satisfying lunch.',
  'Wish the bowl were a little bigger, but the quality made up for it.',
  'Massive serving — bring your appetite, you will need it.',
]
const TOPPING_NOTES = [
  'The chashu was tender and melted in my mouth.',
  'Loved the soft-boiled egg — perfectly jammy yolk.',
  'Fresh toppings and a beautifully marinated egg.',
  'Pork was fatty in the best way and the green onions added a nice bite.',
  'Toppings were fresh and generous, especially the bamboo shoots.',
  'The nori and scallions really rounded out the bowl.',
]
const SERVICE_NOTES = [
  'Staff were friendly and the service was quick.',
  'Cozy atmosphere and attentive service.',
  'Got a bit busy at peak hours, but the wait was worth it.',
  'Clean spot with a welcoming vibe.',
  'Service was fast even though it was packed.',
  'Great spot to bring friends — we will definitely be back.',
]

const ASPECT_HIGH = {
  'Taste': ['Excellent', 'Rich & Savory', 'Outstanding'],
  'Noodle Size': ['Perfect Chew', 'Generous', 'Just Right'],
  'Bowl Size': ['Large', 'Very Filling', 'Generous'],
  'Broth': ['Deep & Rich', 'Flavorful', 'Excellent'],
  'Value': ['Great Value', 'Worth It', 'Fair Price'],
}
const ASPECT_MID = {
  'Taste': ['Good', 'Solid', 'Tasty'],
  'Noodle Size': ['Decent', 'Adequate', 'Good'],
  'Bowl Size': ['Standard', 'Average', 'Decent'],
  'Broth': ['Good', 'Balanced', 'Decent'],
  'Value': ['Fair', 'Reasonable', 'Okay'],
}
const ASPECT_LOW = {
  'Taste': ['Average', 'Could Improve', 'Just Okay'],
  'Noodle Size': ['A Bit Small', 'Light', 'Average'],
  'Bowl Size': ['Smallish', 'Average', 'Modest'],
  'Broth': ['Mild', 'Needs Depth', 'Light'],
  'Value': ['Pricey', 'So-So', 'Average'],
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

// Build a 1-5 rating weighted by the restaurant's real score distribution.
function weightedRating(rng: () => number, r: Restaurant): number {
  const dist = r.reviewsPerScore
  if (dist) {
    const weights = [
      dist['1'] ?? 0,
      dist['2'] ?? 0,
      dist['3'] ?? 0,
      dist['4'] ?? 0,
      dist['5'] ?? 0,
    ]
    const total = weights.reduce((a, b) => a + b, 0)
    if (total > 0) {
      let roll = rng() * total
      for (let i = 0; i < 5; i++) {
        roll -= weights[i]
        if (roll <= 0) return i + 1
      }
      return 5
    }
  }
  // Fallback: cluster around the average rating.
  const avg = r.rating ?? 4
  const jitter = Math.round((rng() - 0.5) * 2)
  return Math.max(1, Math.min(5, Math.round(avg) + jitter))
}

function aspectFor(rng: () => number, label: ReviewAspect, rating: number): string {
  const table = rating >= 5 ? ASPECT_HIGH : rating >= 4 ? ASPECT_HIGH : rating >= 3 ? ASPECT_MID : ASPECT_LOW
  return pick(rng, table[label])
}

export function generateReviews(r: Restaurant): GeneratedReview[] {
  const rng = mulberry32(hashString(r.slug + '|' + r.citySlug))
  const count = 5 + Math.floor(rng() * 7) // 5..11

  const reviews: GeneratedReview[] = []
  const now = new Date('2026-06-01').getTime()
  const twoYears = 1000 * 60 * 60 * 24 * 730

  for (let i = 0; i < count; i++) {
    const rating = weightedRating(rng, r)

    const opener =
      rating >= 5
        ? pick(rng, TASTE_OPENERS_HIGH)
        : rating >= 4
        ? pick(rng, TASTE_OPENERS_HIGH)
        : rating >= 3
        ? pick(rng, TASTE_OPENERS_MID)
        : pick(rng, TASTE_OPENERS_LOW)

    const parts = [opener, pick(rng, NOODLE_NOTES), pick(rng, BOWL_NOTES)]
    if (rng() > 0.4) parts.push(pick(rng, TOPPING_NOTES))
    if (rng() > 0.5) parts.push(pick(rng, SERVICE_NOTES))

    const author = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_INITIALS)}.`
    const date = new Date(now - Math.floor(rng() * twoYears)).toISOString().slice(0, 10)

    const aspects: { label: ReviewAspect; value: string }[] = (
      ['Taste', 'Noodle Size', 'Bowl Size', 'Broth', 'Value'] as ReviewAspect[]
    ).map((label) => ({ label, value: aspectFor(rng, label, rating) }))

    reviews.push({ author, rating, date, body: parts.join(' '), aspects })
  }

  // Newest first.
  reviews.sort((a, b) => (a.date < b.date ? 1 : -1))
  return reviews
}

// ---------------------------------------------------------------------------
// Review summary + pros/cons — a short editorial paragraph and a simple
// pros/cons table, derived from the aggregated aspect ratings above plus the
// restaurant's real amenities, rating, and review count.
// ---------------------------------------------------------------------------

export interface ReviewSummary {
  paragraph: string
  pros: string[]
  cons: string[]
}

const BROTH_SUMMARY_LABELS: Record<string, string> = {
  tonkotsu: 'rich, pork-bone tonkotsu broth',
  tsukemen: 'concentrated tsukemen dipping broth',
  miso: 'hearty, fermented miso broth',
  shoyu: 'clear, soy-seasoned shoyu broth',
  shio: 'light, salt-seasoned shio broth',
  chicken: 'creamy chicken paitan broth',
  spicy: 'bold, chili-forward spicy broth',
}

function aspectTier(label: ReviewAspect, value: string): 'high' | 'mid' | 'low' {
  if ((ASPECT_HIGH[label] as string[]).includes(value)) return 'high'
  if ((ASPECT_LOW[label] as string[]).includes(value)) return 'low'
  return 'mid'
}

function modeAspect(reviews: GeneratedReview[], label: ReviewAspect): string {
  const counts = new Map<string, number>()
  for (const rev of reviews) {
    const a = rev.aspects.find((x) => x.label === label)
    if (a) counts.set(a.value, (counts.get(a.value) ?? 0) + 1)
  }
  let best = ''
  let bestCount = -1
  for (const [v, c] of counts) {
    if (c > bestCount) { best = v; bestCount = c }
  }
  return best
}

export function generateReviewSummary(r: Restaurant, reviews: GeneratedReview[]): ReviewSummary {
  const tasteTier = aspectTier('Taste', modeAspect(reviews, 'Taste'))
  const noodleTier = aspectTier('Noodle Size', modeAspect(reviews, 'Noodle Size'))
  const bowlTier = aspectTier('Bowl Size', modeAspect(reviews, 'Bowl Size'))
  const valueTier = aspectTier('Value', modeAspect(reviews, 'Value'))

  const rating = r.rating
  const reviewCount = r.reviewCount ?? 0
  const brothType = detectBrothType(r)
  const brothDesc = brothType ? BROTH_SUMMARY_LABELS[brothType] : null

  const sentences: string[] = []

  sentences.push(
    rating != null
      ? `${r.name} in ${r.city}, ${r.stateCode} holds a ${rating.toFixed(1)}-star rating from ${reviewCount.toLocaleString()} Google reviews, based on our read of the aggregated diner feedback.`
      : `${r.name} in ${r.city}, ${r.stateCode} is still building up its review history, so early diner feedback carries extra weight here.`
  )

  sentences.push(
    tasteTier === 'high'
      ? 'Taste is where this spot consistently earns praise, with reviewers describing the flavor as rich, balanced, and deeply savory.'
      : tasteTier === 'low'
      ? 'Taste feedback is mixed — several reviewers found the flavor just okay rather than a standout.'
      : 'Taste lands in the "good, reliable" range rather than a wow factor, based on reviewer feedback.'
  )

  sentences.push(
    brothDesc
      ? `The kitchen is known for its ${brothDesc}, which reviewers frequently call out as the highlight of the bowl.`
      : 'The broth draws a mix of feedback across the classic styles on the menu, from rich and creamy to light and clean.'
  )

  sentences.push(
    noodleTier === 'high'
      ? 'Noodles get consistent praise for their chew and texture, holding up well even after sitting in hot broth.'
      : noodleTier === 'low'
      ? 'A handful of reviewers wished for a slightly larger noodle portion.'
      : 'Noodle portions are described as adequate — enough to satisfy without overloading the bowl.'
  )

  sentences.push(
    bowlTier === 'high'
      ? 'Bowl sizes run generous, with diners regularly mentioning leaving full and satisfied.'
      : bowlTier === 'low'
      ? 'Bowl sizes trend on the smaller side according to some reviewers, though quality generally makes up for it.'
      : 'Bowl sizes are about what you would expect for a sit-down ramen restaurant — standard portions.'
  )

  sentences.push(
    valueTier === 'high'
      ? `Value for the price is a recurring positive${r.priceRange ? ` at the ${r.priceRange} price range` : ''}, with diners feeling the portion and quality justify the cost.`
      : valueTier === 'low'
      ? `Some reviewers felt the price${r.priceRange ? ` (${r.priceRange})` : ''} runs a bit high relative to the portion.`
      : `Pricing is viewed as fair${r.priceRange ? ` at ${r.priceRange}` : ''} for a casual ramen meal.`
  )

  const amenityBits: string[] = []
  if (r.amenities.dineIn) amenityBits.push('dine-in')
  if (r.amenities.takeout) amenityBits.push('takeout')
  if (r.amenities.delivery) amenityBits.push('delivery')
  sentences.push(
    amenityBits.length > 0
      ? `${r.name} offers ${amenityBits.join(', ')}, so there are multiple ways to enjoy a bowl.`
      : `${r.name} is set up primarily as a sit-down restaurant experience.`
  )

  if (r.amenities.veganOptions || r.amenities.vegetarianOptions) {
    sentences.push('Vegan and/or vegetarian options are available for diners with dietary restrictions.')
  }

  sentences.push(
    rating != null && rating >= 4.5 && reviewCount >= 100
      ? `With a strong rating backed by a large volume of reviews, ${r.name} is a safe bet for most ramen cravings in ${r.city}.`
      : rating != null && rating >= 4
      ? `Overall, ${r.name} is a solid choice worth trying if you're in ${r.city} craving ramen.`
      : `Overall, ${r.name} is worth a visit if you're curious, though it's worth skimming recent reviews before making a special trip.`
  )

  const paragraph = sentences.slice(0, 10).join(' ')

  const pros: string[] = []
  const cons: string[] = []

  if (rating != null && rating >= 4.5) pros.push(`Strong ${rating.toFixed(1)}-star rating`)
  if (reviewCount >= 200) pros.push(`Well-reviewed with ${reviewCount.toLocaleString()}+ Google reviews`)
  if (tasteTier === 'high') pros.push('Reviewers consistently praise the taste')
  if (bowlTier === 'high') pros.push('Generous bowl portions')
  if (noodleTier === 'high') pros.push('Noodles cooked with great texture')
  if (valueTier === 'high') pros.push('Good value for the price')
  if (r.amenities.delivery) pros.push('Delivery available')
  if (r.amenities.outdoorSeating) pros.push('Outdoor seating available')
  if (r.amenities.acceptsReservations) pros.push('Accepts reservations')
  if (r.amenities.alcohol) pros.push('Full bar / alcohol served')
  if (r.amenities.veganOptions || r.amenities.vegetarianOptions) pros.push('Vegan/vegetarian options on the menu')
  if (r.amenities.wheelchairAccessible) pros.push('Wheelchair accessible')
  if (r.amenities.parking) pros.push('On-site or nearby parking')

  if (reviewCount < 50) cons.push('Still building up a longer review history')
  if (rating != null && rating < 4.3) cons.push('Rating trails top-tier spots in the area')
  if (tasteTier === 'low') cons.push('Some reviewers found the flavor merely average')
  if (bowlTier === 'low') cons.push('Portions run smaller than some diners expect')
  if (noodleTier === 'low') cons.push('Noodle portion is modest for some diners')
  if (valueTier === 'low') cons.push('Value is seen as so-so for the price')
  if (!r.amenities.delivery) cons.push('No delivery listed')
  if (!r.amenities.acceptsReservations) cons.push('Walk-in only — no reservations')
  if (!r.amenities.outdoorSeating) cons.push('No outdoor seating')
  if (!r.amenities.parking) cons.push('Parking may be limited nearby')

  const finalPros = pros.slice(0, 5)
  const finalCons = cons.slice(0, 5)
  if (finalPros.length === 0) finalPros.push('Serves a full menu of classic ramen styles')
  if (finalCons.length === 0) finalCons.push('No major drawbacks noted in aggregated reviews')

  return { paragraph, pros: finalPros, cons: finalCons }
}

// Link out to the restaurant's Google reviews (by Place ID when available).
export function googleReviewsUrl(r: Restaurant): string {
  if (r.placeId) {
    return `https://search.google.com/local/reviews?placeid=${encodeURIComponent(r.placeId)}`
  }
  if (r.googleMapsLink) return r.googleMapsLink
  return `https://www.google.com/search?q=${encodeURIComponent(r.name + ' ' + r.city + ' reviews')}`
}

// Google's photo gallery for the business — mirrors googleReviewsUrl above,
// using the same local/ panel so the two buttons behave consistently. Falls
// back to the Maps listing, then to a Google Images search for the shop.
export function googlePhotosUrl(r: Restaurant): string {
  if (r.placeId) {
    return `https://search.google.com/local/photos?placeid=${encodeURIComponent(r.placeId)}`
  }
  if (r.googleMapsLink) return r.googleMapsLink
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`
}
