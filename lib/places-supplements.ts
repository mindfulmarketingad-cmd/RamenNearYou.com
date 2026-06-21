import capitalsRaw from './places-capital-supplements.json'
import majorCitiesRaw from './places-major-cities.json'
import { STATE_CODE_TO_SLUG, STATE_SLUG_TO_CODE, STATE_CODE_TO_NAME } from './state-lookups'

export interface PlacesRestaurant {
  placeId: string
  name: string
  address: string
  rating: number | null
  reviewCount: number
  priceLevel: number | null
  photo: string | null
  latitude: number | null
  longitude: number | null
  openNow: boolean | null
  googleMapsUrl: string
}

const supplements: Record<string, PlacesRestaurant[]> = {
  ...(capitalsRaw as Record<string, PlacesRestaurant[]>),
  ...(majorCitiesRaw as Record<string, PlacesRestaurant[]>),
}

export function getPlacesSupplements(param: string): PlacesRestaurant[] {
  return supplements[param] ?? []
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
