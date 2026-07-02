import {
  restaurants,
  getRestaurantsByCity,
  getBrothTypes,
  getCitiesForBroth,
  type Restaurant,
  type BrothType,
} from './restaurants'

// ---------------------------------------------------------------------------
// City × filter programmatic pages
// These render at the third URL segment of the existing city route:
//   /[city]/[state]/[filter]-ramen        e.g. /atlanta/georgia/tonkotsu-ramen
//   /[city]/[state]/[broth]-ramen-for-diabetics
//   /[city]/[state]/vegan-ramen | vegetarian-ramen | healthy-ramen
// Only the curated major US cities get these pages.
// ---------------------------------------------------------------------------

// Major US cities, paired with their state code so we resolve the correct
// metro (e.g. Portland OR vs ME, Columbus OH vs GA). City/state SLUGS are read
// from the real data so they always match the live URLs (e.g. Honolulu -> /hi).
const MAJOR_CITY_KEYS: Array<[string, string]> = [
  ['New York', 'NY'], ['Los Angeles', 'CA'], ['Chicago', 'IL'], ['Houston', 'TX'],
  ['San Antonio', 'TX'], ['San Diego', 'CA'], ['Dallas', 'TX'], ['San Jose', 'CA'],
  ['Austin', 'TX'], ['Charlotte', 'NC'], ['San Francisco', 'CA'], ['Indianapolis', 'IN'],
  ['Seattle', 'WA'], ['Denver', 'CO'], ['Washington', 'DC'], ['Boston', 'MA'],
  ['Nashville', 'TN'], ['Portland', 'OR'], ['Las Vegas', 'NV'], ['Detroit', 'MI'],
  ['Memphis', 'TN'], ['Atlanta', 'GA'], ['Sacramento', 'CA'], ['Miami', 'FL'],
  ['Honolulu', 'HI'], ['Minneapolis', 'MN'], ['Oakland', 'CA'], ['Raleigh', 'NC'],
  ['Brooklyn', 'NY'],
]

export interface MajorCity {
  city: string
  state: string
  stateCode: string
  citySlug: string
  stateSlug: string
  total: number
}

// Minimum number of total restaurants for a city to qualify for filter pages.
const MIN_CITY_TOTAL = 5

const _majorCities: MajorCity[] = (() => {
  const wanted = new Set(MAJOR_CITY_KEYS.map(([n, s]) => `${n.toLowerCase()}|${s.toUpperCase()}`))
  const byKey = new Map<string, MajorCity>()
  for (const r of restaurants) {
    const key = `${r.city.toLowerCase()}|${r.stateCode.toUpperCase()}`
    if (!wanted.has(key)) continue
    const slugKey = `${r.citySlug}|${r.stateSlug}`
    const entry = byKey.get(slugKey)
    if (entry) entry.total++
    else byKey.set(slugKey, { city: r.city, state: r.state, stateCode: r.stateCode, citySlug: r.citySlug, stateSlug: r.stateSlug, total: 1 })
  }
  return Array.from(byKey.values()).filter((c) => c.total >= MIN_CITY_TOTAL)
})()

const _majorBySlug = new Map(_majorCities.map((c) => [`${c.citySlug}|${c.stateSlug}`, c]))

export function getMajorCities(): MajorCity[] {
  return _majorCities
}

export function getMajorCity(citySlug: string, stateSlug: string): MajorCity | null {
  return _majorBySlug.get(`${citySlug}|${stateSlug}`) ?? null
}

// ---------------------------------------------------------------------------
// Filter specs
// ---------------------------------------------------------------------------

export type FilterKind = 'broth' | 'diabetic' | 'vegan' | 'vegetarian' | 'healthy'

export interface FilterSpec {
  kind: FilterKind
  broth?: BrothType
}

const BROTH_SLUGS: Record<string, BrothType> = {
  tonkotsu: 'Tonkotsu',
  shoyu: 'Shoyu',
  miso: 'Miso',
  spicy: 'Spicy',
  vegan: 'Vegan',
}

// Parse an EXACT third-segment slug into a filter spec, or null if it is not a
// recognized filter (in which case it should be treated as a restaurant slug).
// Matching is whole-string only, so real slugs like "silverlake-ramen" are safe.
export function parseFilterSlug(slug: string): FilterSpec | null {
  if (slug === 'vegan-ramen') return { kind: 'vegan' }
  if (slug === 'vegetarian-ramen') return { kind: 'vegetarian' }
  if (slug === 'healthy-ramen') return { kind: 'healthy' }

  const diabetic = slug.match(/^([a-z]+)-ramen-for-diabetics$/)
  if (diabetic && BROTH_SLUGS[diabetic[1]]) {
    return { kind: 'diabetic', broth: BROTH_SLUGS[diabetic[1]] }
  }

  const broth = slug.match(/^([a-z]+)-ramen$/)
  if (broth && broth[1] !== 'vegan' && BROTH_SLUGS[broth[1]]) {
    return { kind: 'broth', broth: BROTH_SLUGS[broth[1]] }
  }
  return null
}

export function isShoyuOrLighter(r: Restaurant): boolean {
  return getBrothTypes(r).includes('Shoyu')
}

// Restaurants in a city that match a given filter, sorted best-first.
export function getFilterRestaurants(citySlug: string, stateSlug: string, spec: FilterSpec): Restaurant[] {
  const inCity = getRestaurantsByCity(citySlug, stateSlug)
  let matched: Restaurant[]
  switch (spec.kind) {
    case 'broth':
    case 'diabetic':
      matched = inCity.filter((r) => spec.broth != null && getBrothTypes(r).includes(spec.broth))
      break
    case 'vegan':
      matched = inCity.filter((r) => r.amenities.veganOptions)
      break
    case 'vegetarian':
      matched = inCity.filter((r) => r.amenities.vegetarianOptions || r.amenities.veganOptions)
      break
    case 'healthy':
      matched = inCity.filter(
        (r) => r.amenities.veganOptions || r.amenities.vegetarianOptions || isShoyuOrLighter(r)
      )
      break
  }
  return [...matched].sort((a, b) => {
    const ra = a.rating ?? 0
    const rb = b.rating ?? 0
    if (rb !== ra) return rb - ra
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
  })
}

// ---------------------------------------------------------------------------
// Copy helpers
// ---------------------------------------------------------------------------

const BROTH_LABEL: Record<BrothType, string> = {
  Tonkotsu: 'Tonkotsu', Shoyu: 'Shoyu', Miso: 'Miso', Spicy: 'Spicy', Vegan: 'Vegan',
}

export function filterH1(spec: FilterSpec, city: string, state: string): string {
  switch (spec.kind) {
    case 'broth': return `${BROTH_LABEL[spec.broth!]} Ramen in ${city}, ${state}`
    case 'diabetic': return `Best ${BROTH_LABEL[spec.broth!]} Ramen for Diabetics in ${city}, ${state}`
    case 'vegan': return `Best Vegan Ramen in ${city}, ${state}`
    case 'vegetarian': return `Best Vegetarian Ramen in ${city}, ${state}`
    case 'healthy': return `Healthiest Ramen Restaurants in ${city}, ${state}`
  }
}

export function filterTitle(spec: FilterSpec, city: string, stateCode: string): string {
  switch (spec.kind) {
    case 'broth': return `Best ${BROTH_LABEL[spec.broth!]} Ramen in ${city}, ${stateCode} | Ramen Near You`
    case 'diabetic': return `Best ${BROTH_LABEL[spec.broth!]} Ramen for Diabetics in ${city}, ${stateCode} | Ramen Near You`
    case 'vegan': return `Best Vegan Ramen in ${city}, ${stateCode} | Ramen Near You`
    case 'vegetarian': return `Best Vegetarian Ramen in ${city}, ${stateCode} | Ramen Near You`
    case 'healthy': return `Healthy Ramen in ${city}, ${stateCode} | Ramen Near You`
  }
}

export function filterDescription(spec: FilterSpec, city: string, stateCode: string, count: number): string {
  const n = `${count} ramen ${count === 1 ? 'spot' : 'spots'}`
  switch (spec.kind) {
    case 'broth':
      return `Find the best ${BROTH_LABEL[spec.broth!].toLowerCase()} ramen in ${city}, ${stateCode}. Browse ${n} serving ${BROTH_LABEL[spec.broth!].toLowerCase()} broth, with ratings, menus, and directions.`
    case 'diabetic':
      return `${BROTH_LABEL[spec.broth!]} ramen options in ${city}, ${stateCode} with tips for managing blood sugar — lighter broths, lower sodium, and smart noodle swaps. ${n}.`
    case 'vegan':
      return `Find the best vegan ramen in ${city}, ${stateCode}. ${n} with plant-based broths and toppings, ratings, menus, and directions.`
    case 'vegetarian':
      return `Find the best vegetarian ramen in ${city}, ${stateCode}. ${n} with meat-free options, ratings, menus, and directions.`
    case 'healthy':
      return `The healthiest ramen restaurants in ${city}, ${stateCode}. ${n} with lighter broths and customizable, veggie-forward bowls.`
  }
}

export const DIABETIC_BROTH_NOTE: Record<BrothType, string> = {
  Tonkotsu: 'Tonkotsu is the richest, highest-fat broth on the menu — simmered pork bones give it that creamy body, but also more saturated fat and sodium. If you are managing blood sugar, enjoy it in moderation: ask for lighter seasoning, balance the bowl with extra protein and vegetables, and consider halving the noodles.',
  Shoyu: 'Shoyu broth is clear and comparatively low in fat, which makes it one of the friendlier choices. The catch is sodium — the soy-based tare is salt-heavy, so request less salt where you can and drink the broth sparingly.',
  Miso: 'Miso broth is fermented, savory, and full of flavor, but miso paste is high in sodium. Go easy on added salt, pair the bowl with vegetables, and watch the noodle portion to keep carbohydrates in check.',
  Spicy: 'Spicy ramen leans on chili oil and bold tare that can add fat and sodium. Capsaicin from chilies may have modest metabolic benefits, but the extras are what to watch — ask for lighter oil and load up on vegetables.',
  Vegan: 'Plant-based broths are often lighter in saturated fat, which can be a plus, but they can still be high in sodium and the noodles are the main carbohydrate source. Favor vegetable-forward bowls and mind the noodle portion.',
}

export const DIABETIC_GENERAL =
  'Ramen can fit a balanced, diabetes-aware diet with a few smart choices: pick lighter, clearer broths, ask for reduced sodium, load the bowl with vegetables and lean protein, and consider halving the noodles or choosing a lower-carb noodle. This is general information, not medical advice — talk with your doctor or a registered dietitian about what is right for you.'

export const HEALTHY_GENERAL =
  'What makes a bowl of ramen healthy? Start with the broth — it is hydrating and, in lighter shoyu or vegetable styles, relatively low in fat. Ramen is also highly customizable: choose a clear broth, add extra vegetables, pick lean protein like chicken, egg, or tofu, request less salt, and swap or halve the noodles to cut carbohydrates. The restaurants below are a strong starting point for a lighter, more balanced bowl.'

// ---------------------------------------------------------------------------
// Static params for the restaurant route to pre-render
// ---------------------------------------------------------------------------

const ALL_FILTER_SLUGS: string[] = [
  'tonkotsu-ramen', 'shoyu-ramen', 'miso-ramen', 'spicy-ramen',
  'tonkotsu-ramen-for-diabetics', 'shoyu-ramen-for-diabetics',
  'miso-ramen-for-diabetics', 'spicy-ramen-for-diabetics', 'vegan-ramen-for-diabetics',
  'vegan-ramen', 'vegetarian-ramen', 'healthy-ramen',
]

// Minimum matches required to pre-render a page (avoids thin/empty pages).
const MIN_FILTER_MATCHES = 2

export function getCityFilterStaticParams(): Array<{ city: string; state: string; restaurant: string }> {
  const params: Array<{ city: string; state: string; restaurant: string }> = []
  for (const c of _majorCities) {
    for (const slug of ALL_FILTER_SLUGS) {
      const spec = parseFilterSlug(slug)
      if (!spec) continue
      const matches = getFilterRestaurants(c.citySlug, c.stateSlug, spec)
      if (matches.length >= MIN_FILTER_MATCHES) {
        params.push({ city: c.citySlug, state: c.stateSlug, restaurant: slug })
      }
    }
  }
  return params
}

// Internal-linking: the filter pages that actually exist for a given city,
// so the city page (and sibling filter pages) can link to them — no orphans.
export interface CityFilterLink {
  href: string
  label: string
  group: 'broth' | 'diet'
  slug: string
}

export function getCityFilterLinks(citySlug: string, stateSlug: string): CityFilterLink[] {
  const c = getMajorCity(citySlug, stateSlug)
  if (!c) return []
  const links: CityFilterLink[] = []
  for (const slug of ALL_FILTER_SLUGS) {
    const spec = parseFilterSlug(slug)
    if (!spec) continue
    const matches = getFilterRestaurants(citySlug, stateSlug, spec)
    if (matches.length < MIN_FILTER_MATCHES) continue
    const href = `/${citySlug}/${stateSlug}/${slug}`
    let label: string
    let group: 'broth' | 'diet'
    switch (spec.kind) {
      case 'broth': label = `${BROTH_LABEL[spec.broth!]} Ramen`; group = 'broth'; break
      case 'diabetic': label = `${BROTH_LABEL[spec.broth!]} Ramen for Diabetics`; group = 'diet'; break
      case 'vegan': label = 'Vegan Ramen'; group = 'diet'; break
      case 'vegetarian': label = 'Vegetarian Ramen'; group = 'diet'; break
      case 'healthy': label = 'Healthy Ramen'; group = 'diet'; break
    }
    links.push({ href, label, group, slug })
  }
  return links
}

// ---------------------------------------------------------------------------
// Service axis: Homepage > Service page (/[broth]-ramen-near-me) >
//               Service+City page (/tonkotsu/[city]/[state] or
//               /[city]/[state]/[broth]-ramen)
// ---------------------------------------------------------------------------

// The eight top-level service pages, in homepage display order.
export const SERVICE_PAGES: Array<{ broth: string; href: string; label: string }> = [
  { broth: 'Tonkotsu', href: '/find/tonkotsu-ramen', label: 'Tonkotsu Ramen' },
  { broth: 'Spicy', href: '/find/spicy-ramen', label: 'Spicy Ramen' },
  { broth: 'Miso', href: '/find/miso-ramen', label: 'Miso Ramen' },
  { broth: 'Shoyu', href: '/find/shoyu-ramen', label: 'Shoyu Ramen' },
  { broth: 'Vegan', href: '/find/vegan-ramen', label: 'Vegan Ramen' },
  { broth: 'Vegetarian', href: '/find/vegetarian-ramen', label: 'Vegetarian Ramen' },
  { broth: 'Korean', href: '/find/korean-ramen', label: 'Korean Ramen' },
  { broth: 'Japanese', href: '/find/japanese-ramen', label: 'Japanese Ramen' },
]

export interface ServiceCityLink {
  href: string
  city: string
  stateCode: string
  count: number
}

// Maps a service page's broth to the city-filter spec + slug used for its
// service+city pages. Tonkotsu is handled separately (dedicated route).
function serviceCitySpec(brothType: string): { spec: FilterSpec; slug: string } | null {
  switch (brothType) {
    case 'Spicy': return { spec: { kind: 'broth', broth: 'Spicy' }, slug: 'spicy-ramen' }
    case 'Miso': return { spec: { kind: 'broth', broth: 'Miso' }, slug: 'miso-ramen' }
    case 'Shoyu': return { spec: { kind: 'broth', broth: 'Shoyu' }, slug: 'shoyu-ramen' }
    case 'Vegan': return { spec: { kind: 'vegan' }, slug: 'vegan-ramen' }
    case 'Vegetarian': return { spec: { kind: 'vegetarian' }, slug: 'vegetarian-ramen' }
    default: return null
  }
}

// Dedicated /{broth}/{city}/{state} routes and the minimum-count threshold
// their generateStaticParams uses — must stay in sync with those routes so
// every pre-rendered page gets a matching internal link (no orphans).
const DEDICATED_BROTH_ROUTE: Record<string, { prefix: string; minCount: number }> = {
  Tonkotsu: { prefix: 'tonkotsu', minCount: 1 },
  Miso: { prefix: 'miso', minCount: 2 },
  Spicy: { prefix: 'spicy', minCount: 2 },
  Vegan: { prefix: 'vegan', minCount: 5 },
}

// The service+city pages that EXIST for a given service, so the service page
// can link down to them (and they link back up) — no orphans.
export function getServiceCityLinks(brothType: string): ServiceCityLink[] {
  const dedicated = DEDICATED_BROTH_ROUTE[brothType]
  if (dedicated) {
    return getCitiesForBroth(brothType as BrothType, dedicated.minCount).map((c) => ({
      href: `/${dedicated.prefix}/${c.citySlug}/${c.stateSlug}`,
      city: c.city,
      stateCode: c.stateCode,
      count: c.count,
    }))
  }
  const mapped = serviceCitySpec(brothType)
  if (!mapped) return []
  const links: ServiceCityLink[] = []
  for (const c of _majorCities) {
    const matches = getFilterRestaurants(c.citySlug, c.stateSlug, mapped.spec)
    if (matches.length < MIN_FILTER_MATCHES) continue
    links.push({
      href: `/${c.citySlug}/${c.stateSlug}/${mapped.slug}`,
      city: c.city,
      stateCode: c.stateCode,
      count: matches.length,
    })
  }
  return links.sort((a, b) => b.count - a.count)
}

// The parent service page for a city-filter spec, so service+city pages can
// link back up. Returns null for specs with no service page (diabetic, healthy).
export function getServiceHref(spec: FilterSpec): { href: string; label: string } | null {
  if (spec.kind === 'broth') {
    const match = SERVICE_PAGES.find((s) => s.broth === spec.broth)
    return match ? { href: match.href, label: `${match.label} Near Me` } : null
  }
  if (spec.kind === 'vegan') return { href: '/vegan-ramen-near-me', label: 'Vegan Ramen Near Me' }
  if (spec.kind === 'vegetarian') return { href: '/vegetarian-ramen-near-me', label: 'Vegetarian Ramen Near Me' }
  return null
}

// LocalBusiness JSON-LD for a single restaurant (for embedding in ItemList).
export function restaurantLocalBusinessSchema(r: Restaurant) {
  return {
    '@type': 'Restaurant',
    name: r.name,
    servesCuisine: 'Ramen',
    url: `https://www.ramennearyou.com/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    ...(r.photo ? { image: r.photo } : {}),
    ...(r.phone ? { telephone: r.phone } : {}),
    ...(r.priceRange ? { priceRange: r.priceRange } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.street,
      addressLocality: r.city,
      addressRegion: r.stateCode,
      postalCode: r.postalCode,
      addressCountry: 'US',
    },
    ...(r.latitude != null && r.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude } }
      : {}),
    ...(r.rating != null
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: r.rating,
            reviewCount: r.reviewCount ?? 0,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }
}
