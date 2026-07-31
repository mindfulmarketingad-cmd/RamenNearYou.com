// SERVER-ONLY pho dataset. Pho listings are kept deliberately separate from the
// ramen dataset (lib/restaurants.ts): they live at their own /partners/{slug}
// URLs and never count toward the ramen totals shown in site stats, ramen city
// pages, or /reviews. They surface alongside ramen only on the search map,
// where they carry a `pho` flag so the client can render them distinctly.
import phoData from './pho-restaurants.json'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from './state-lookups'

export type PhoAmenities = Record<string, boolean>

export type PhoRestaurant = {
  name: string
  slug: string
  citySlug: string
  city: string
  state: string
  stateCode: string
  county: string
  street: string
  address: string
  postalCode: string
  latitude: number
  longitude: number
  phone: string
  website: string
  rating: number | null
  reviewCount: number
  reviewsPerScore: Record<string, number> | null
  reviewsLink: string
  reviewTags: string[]
  photo: string
  photosCount: number
  logo: string
  description: string
  type: string
  subtypes: string
  hours: Record<string, string[]> | null
  typicalTimeSpent: string
  menuLink: string
  orderLinks: string
  reservationLinks: string
  googleMapsLink: string
  placeId: string
  verified: boolean
  amenities: PhoAmenities
}

export const phoRestaurants: PhoRestaurant[] = phoData as PhoRestaurant[]

const BY_SLUG = new Map(phoRestaurants.map(p => [p.slug, p]))

export function getPhoBySlug(slug: string): PhoRestaurant | null {
  return BY_SLUG.get(slug) ?? null
}

export function getAllPhoSlugs(): string[] {
  return phoRestaurants.map(p => p.slug)
}

export function getPhoByCity(citySlug: string, stateCode: string): PhoRestaurant[] {
  return phoRestaurants.filter(p => p.citySlug === citySlug && p.stateCode === stateCode)
}

export function getPhoByState(stateCode: string): PhoRestaurant[] {
  return phoRestaurants.filter(p => p.stateCode === stateCode)
}

export function getPhoStats() {
  return {
    restaurants: phoRestaurants.length,
    cities: new Set(phoRestaurants.map(p => `${p.citySlug}-${p.stateCode}`)).size,
    states: new Set(phoRestaurants.map(p => p.stateCode)).size,
  }
}

// ---------------------------------------------------------------------------
// City pages: /find/pho-restaurants-{citySlug}-{stateCode}
// ---------------------------------------------------------------------------

export const PHO_CITY_PREFIX = 'pho-restaurants-'

export type PhoCityKey = { citySlug: string; stateCode: string }

function cityKey(citySlug: string, stateCode: string): string {
  return `${citySlug}-${stateCode}`
}

const CITY_INDEX = (() => {
  const map = new Map<string, PhoRestaurant[]>()
  for (const p of phoRestaurants) {
    const key = cityKey(p.citySlug, p.stateCode)
    const list = map.get(key)
    if (list) list.push(p)
    else map.set(key, [p])
  }
  return map
})()

export function phoCityParam(citySlug: string, stateCode: string): string {
  return `${PHO_CITY_PREFIX}${citySlug}-${stateCode.toLowerCase()}`
}

export function getPhoCityParams(): string[] {
  return Array.from(CITY_INDEX.keys()).map(key => {
    const stateCode = key.slice(-2).toUpperCase()
    const citySlug = key.slice(0, -3)
    return phoCityParam(citySlug, stateCode)
  })
}

export type PhoCity = {
  citySlug: string
  cityName: string
  stateCode: string
  stateSlug: string
  stateName: string
  listings: PhoRestaurant[]
}

/** Resolves a full param (e.g. "pho-restaurants-atlanta-ga") to its city data,
 *  or null if the prefix doesn't match or the city has no pho listings. */
export function matchPhoCity(param: string): PhoCity | null {
  if (!param.startsWith(PHO_CITY_PREFIX)) return null
  const rest = param.slice(PHO_CITY_PREFIX.length)
  const lastHyphen = rest.lastIndexOf('-')
  if (lastHyphen < 1) return null
  const stateCode = rest.slice(lastHyphen + 1).toUpperCase()
  const citySlug = rest.slice(0, lastHyphen)
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  if (!stateSlug) return null
  const listings = CITY_INDEX.get(cityKey(citySlug, stateCode))
  if (!listings || listings.length === 0) return null
  return {
    citySlug,
    cityName: listings[0].city,
    stateCode,
    stateSlug,
    stateName: STATE_CODE_TO_NAME[stateCode] ?? stateCode,
    listings: [...listings].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount),
  }
}

/** Other pho cities in the same state, most listings first, for internal linking. */
export function getNearbyPhoCities(citySlug: string, stateCode: string, limit = 8): Array<{ city: string; citySlug: string; stateCode: string; count: number }> {
  return getPhoCities()
    .filter(c => c.stateCode === stateCode && c.citySlug !== citySlug)
    .slice(0, limit)
}

export function getPhoCities(): Array<{ city: string; citySlug: string; stateCode: string; count: number }> {
  const map = new Map<string, { city: string; citySlug: string; stateCode: string; count: number }>()
  for (const p of phoRestaurants) {
    const key = `${p.citySlug}-${p.stateCode}`
    const hit = map.get(key)
    if (hit) hit.count++
    else map.set(key, { city: p.city, citySlug: p.citySlug, stateCode: p.stateCode, count: 1 })
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Nearby pho restaurants, closest first — same city preferred, then within 40 miles. */
export function getNearbyPho(p: PhoRestaurant, limit = 8): Array<PhoRestaurant & { distanceMiles: number }> {
  return phoRestaurants
    .filter(o => o.slug !== p.slug)
    .map(o => ({ ...o, distanceMiles: distanceMiles(p.latitude, p.longitude, o.latitude, o.longitude) }))
    .filter(o => o.distanceMiles <= 40)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit)
}

// Amenity field -> human label, grouped the way Google groups them. Used to
// render only the amenities a restaurant actually has (nothing is inferred).
export const PHO_AMENITY_GROUPS: Array<{ group: string; items: Array<{ key: string; label: string }> }> = [
  {
    group: 'Service Options',
    items: [
      { key: 'dineIn', label: 'Dine-in' },
      { key: 'takeout', label: 'Takeout' },
      { key: 'delivery', label: 'Delivery' },
      { key: 'outdoorSeating', label: 'Outdoor seating' },
      { key: 'catering', label: 'Catering' },
    ],
  },
  {
    group: 'Offerings',
    items: [
      { key: 'vegetarianOptions', label: 'Vegetarian options' },
      { key: 'veganOptions', label: 'Vegan options' },
      { key: 'healthyOptions', label: 'Healthy options' },
      { key: 'halal', label: 'Halal food' },
      { key: 'comfortFood', label: 'Comfort food' },
      { key: 'quickBite', label: 'Quick bite' },
      { key: 'smallPlates', label: 'Small plates' },
      { key: 'dessert', label: 'Dessert' },
      { key: 'alcohol', label: 'Alcohol' },
      { key: 'beer', label: 'Beer' },
      { key: 'wine', label: 'Wine' },
      { key: 'coffee', label: 'Coffee' },
    ],
  },
  {
    group: 'Dining',
    items: [
      { key: 'breakfast', label: 'Breakfast' },
      { key: 'lunch', label: 'Lunch' },
      { key: 'dinner', label: 'Dinner' },
      { key: 'counterService', label: 'Counter service' },
      { key: 'tableService', label: 'Table service' },
      { key: 'seating', label: 'Seating' },
      { key: 'acceptsReservations', label: 'Accepts reservations' },
    ],
  },
  {
    group: 'Atmosphere',
    items: [
      { key: 'casual', label: 'Casual' },
      { key: 'cozy', label: 'Cozy' },
      { key: 'quiet', label: 'Quiet' },
      { key: 'trendy', label: 'Trendy' },
      { key: 'historic', label: 'Historic' },
      { key: 'soloDining', label: 'Good for solo dining' },
      { key: 'groups', label: 'Good for groups' },
      { key: 'collegeStudents', label: 'Popular with students' },
      { key: 'fastService', label: 'Fast service' },
      { key: 'localSpecialty', label: 'Serves local specialty' },
    ],
  },
  {
    group: 'Family',
    items: [
      { key: 'familyFriendly', label: 'Good for kids' },
      { key: 'highChairs', label: 'High chairs' },
      { key: 'kidsMenu', label: "Kids' menu" },
    ],
  },
  {
    group: 'Accessibility & Amenities',
    items: [
      { key: 'wheelchairAccessible', label: 'Wheelchair accessible entrance' },
      { key: 'wheelchairRestroom', label: 'Wheelchair accessible restroom' },
      { key: 'wheelchairParking', label: 'Wheelchair accessible parking' },
      { key: 'restroom', label: 'Restroom' },
      { key: 'wifi', label: 'Wi-Fi' },
    ],
  },
  {
    group: 'Parking',
    items: [
      { key: 'parking', label: 'Free parking lot' },
      { key: 'freeStreetParking', label: 'Free street parking' },
      { key: 'paidParking', label: 'Paid parking' },
    ],
  },
  {
    group: 'Payments',
    items: [
      { key: 'creditCards', label: 'Credit cards' },
      { key: 'debitCards', label: 'Debit cards' },
      { key: 'mobilePayments', label: 'NFC mobile payments' },
      { key: 'cashOnly', label: 'Cash only' },
    ],
  },
]

/** Only the amenity groups where this restaurant has at least one true flag. */
export function getActiveAmenityGroups(p: PhoRestaurant) {
  return PHO_AMENITY_GROUPS
    .map(g => ({ group: g.group, items: g.items.filter(i => p.amenities?.[i.key]) }))
    .filter(g => g.items.length > 0)
}

export function countActiveAmenities(p: PhoRestaurant): number {
  return Object.values(p.amenities ?? {}).filter(Boolean).length
}
