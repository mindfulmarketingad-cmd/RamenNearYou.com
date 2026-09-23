import capitalsRaw from './places-capital-supplements.json'
import majorCitiesRaw from './places-major-cities.json'
import quebecRaw from './places-quebec.json'
import { STATE_CODE_TO_SLUG, STATE_SLUG_TO_CODE, STATE_CODE_TO_NAME } from './state-lookups'
import type { Restaurant } from './restaurants'

export interface PlacesRestaurant {
  placeId: string
  name: string
  address?: string
  rating: number | null
  reviewCount: number
  priceLevel: number | null
  photo: string | null
  latitude: number | null
  longitude: number | null
  openNow?: boolean | null
  googleMapsUrl: string
}

const supplements: Record<string, PlacesRestaurant[]> = {
  ...(capitalsRaw as Record<string, PlacesRestaurant[]>),
  ...(majorCitiesRaw as Record<string, PlacesRestaurant[]>),
  ...(quebecRaw as Record<string, PlacesRestaurant[]>),
}

export function getPlacesSupplements(param: string): PlacesRestaurant[] {
  return supplements[param] ?? []
}

// Name-based slug for a supplement listing, e.g.
// "Itton Ramen & Japanese Street Food" → "itton-ramen-japanese-street-food".
// Used as the third URL segment for the internal listing page.
export function supplementSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'ramen'
}

export interface SupplementListing extends PlacesRestaurant {
  slug: string
  citySlug: string
  stateCode: string
  stateSlug: string
  city: string
}

// Returns the supplement listings for a city with a stable, de-duplicated slug
// per listing. Order is deterministic (matches the JSON), so the same slug is
// produced everywhere (map, city find page, and the detail-page lookup).
export function getSupplementListings(citySlug: string, stateCode: string): SupplementListing[] {
  const sc = stateCode.toUpperCase()
  const key = `${citySlug}-${sc.toLowerCase()}`
  const places = supplements[key] ?? []
  const stateSlug = STATE_CODE_TO_SLUG[sc] ?? ''
  const city = titleCase(citySlug)
  const seen = new Set<string>()
  return places.map(p => {
    let slug = supplementSlug(p.name)
    while (seen.has(slug)) slug = `${slug}-2`
    seen.add(slug)
    return { ...p, slug, citySlug, stateCode: sc, stateSlug, city }
  })
}

// Find a single supplement listing by its city/state/slug — used by the
// restaurant detail page to render an internal page for a Places listing.
export function findSupplementListing(citySlug: string, stateSlug: string, slug: string): SupplementListing | null {
  const stateCode = STATE_SLUG_TO_CODE[stateSlug]
  if (!stateCode) return null
  return getSupplementListings(citySlug, stateCode).find(l => l.slug === slug) ?? null
}

// All supplement listing params (city/state/restaurant) for static generation.
// Capped by review count to bound build time; the rest render on demand
// because the detail route sets `dynamicParams = true`.
export function getSupplementListingParams(limit = 6000): Array<{ city: string; state: string; restaurant: string }> {
  const all: Array<{ city: string; state: string; restaurant: string; reviews: number }> = []
  for (const key of Object.keys(supplements)) {
    const parsed = parseSupplementKey(key)
    if (!parsed) continue
    const stateSlug = STATE_CODE_TO_SLUG[parsed.stateCode]
    if (!stateSlug) continue
    for (const l of getSupplementListings(parsed.citySlug, parsed.stateCode)) {
      all.push({ city: l.citySlug, state: stateSlug, restaurant: l.slug, reviews: l.reviewCount ?? 0 })
    }
  }
  return all
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit)
    .map(({ city, state, restaurant }) => ({ city, state, restaurant }))
}

// Parse supplement key format: "{citySlug}-{stateCode}" e.g. "cheyenne-wy", "las-vegas-nv"
function parseSupplementKey(key: string): { citySlug: string; stateCode: string } | null {
  const parts = key.split('-')
  if (parts.length < 2) return null
  const stateCode = parts[parts.length - 1].toUpperCase()
  if (!STATE_CODE_TO_SLUG[stateCode]) return null
  const citySlug = parts.slice(0, -1).join('-')
  return { citySlug, stateCode }
}

function titleCase(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export interface SupplementCity {
  city: string
  citySlug: string
  stateCode: string
  stateSlug: string
  count: number
}

export function getSupplementCitiesByState(stateSlug: string): SupplementCity[] {
  const stateCode = STATE_SLUG_TO_CODE[stateSlug]
  if (!stateCode) return []
  const suffix = `-${stateCode.toLowerCase()}`
  return Object.entries(supplements)
    .filter(([key]) => key.endsWith(suffix))
    .map(([key, places]) => {
      const parsed = parseSupplementKey(key)
      if (!parsed) return null
      return {
        city: titleCase(parsed.citySlug),
        citySlug: parsed.citySlug,
        stateCode,
        stateSlug,
        count: places.length,
      }
    })
    .filter((x): x is SupplementCity => x !== null)
}

// Returns all supplement-only states (states that have supplement data but no DB restaurants).
// Used by the state page's generateStaticParams to include these states.
export function getSupplementOnlyStateSlugs(dbStateSlugs: Set<string>): string[] {
  const seen = new Set<string>()
  for (const key of Object.keys(supplements)) {
    const parsed = parseSupplementKey(key)
    if (!parsed) continue
    const stateSlug = STATE_CODE_TO_SLUG[parsed.stateCode]
    if (stateSlug && !dbStateSlugs.has(stateSlug)) seen.add(stateSlug)
  }
  return Array.from(seen)
}

export function getSupplementStateName(stateSlug: string): string {
  const stateCode = STATE_SLUG_TO_CODE[stateSlug]
  return stateCode ? (STATE_CODE_TO_NAME[stateCode] ?? stateSlug) : stateSlug
}

function priceLevelToRange(level: number | null): string {
  if (level === 1) return '$'
  if (level === 2) return '$$'
  if (level === 3) return '$$$'
  if (level === 4) return '$$$$'
  return ''
}

// Adapts a Google Places supplement listing into the same Restaurant shape
// the DB dataset uses, so supplement listings can render through
// RestaurantListingPage (the Google-Maps-style listing layout) instead of a
// separate page format. Fields Places doesn't provide (phone, website,
// hours, amenities, etc.) fall back to their "unknown" defaults, which the
// listing page already treats as "hide this section."
export function supplementToRestaurant(sup: SupplementListing): Restaurant {
  return {
    name: sup.name,
    slug: sup.slug,
    citySlug: sup.citySlug,
    stateSlug: sup.stateSlug,
    phone: '',
    website: '',
    address: sup.address ?? '',
    street: '',
    city: sup.city,
    county: '',
    state: getSupplementStateName(sup.stateSlug),
    stateCode: sup.stateCode,
    postalCode: '',
    latitude: sup.latitude,
    longitude: sup.longitude,
    rating: sup.rating,
    reviewCount: sup.reviewCount ?? 0,
    reviewsPerScore: null,
    photosCount: 0,
    photo: sup.photo ?? '',
    logo: '',
    businessStatus: '',
    hours: null,
    priceRange: priceLevelToRange(sup.priceLevel),
    description: '',
    menuLink: '',
    orderLinks: '',
    googleMapsLink: sup.googleMapsUrl,
    placeId: sup.placeId,
    subtypes: '',
    amenities: {
      delivery: false, takeout: false, dineIn: false, outdoorSeating: false,
      alcohol: false, veganOptions: false, vegetarianOptions: false,
      acceptsReservations: false, wheelchairAccessible: false,
      casual: false, cozy: false, trendy: false, familyFriendly: false,
      parking: false, creditCards: false,
    },
  }
}

// Returns one entry per state that has supplement data, with city count.
// Used by the cities page to fill in supplement-only states.
export function getSupplementStateStats(): Array<{ state: string; stateSlug: string; cityCount: number }> {
  const map = new Map<string, Set<string>>() // stateSlug → unique city slugs
  for (const key of Object.keys(supplements)) {
    const parsed = parseSupplementKey(key)
    if (!parsed) continue
    const stateSlug = STATE_CODE_TO_SLUG[parsed.stateCode]
    if (!stateSlug) continue
    if (!map.has(stateSlug)) map.set(stateSlug, new Set())
    map.get(stateSlug)!.add(parsed.citySlug)
  }
  return Array.from(map.entries()).map(([stateSlug, cities]) => ({
    state: getSupplementStateName(stateSlug),
    stateSlug,
    cityCount: cities.size,
  }))
}
