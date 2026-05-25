export type Amenities = {
  delivery: boolean; takeout: boolean; dineIn: boolean; outdoorSeating: boolean;
  alcohol: boolean; veganOptions: boolean; vegetarianOptions: boolean;
  acceptsReservations: boolean; wheelchairAccessible: boolean;
  casual: boolean; cozy: boolean; trendy: boolean; familyFriendly: boolean;
  parking: boolean; creditCards: boolean;
}

export type Restaurant = {
  name: string; slug: string; citySlug: string; stateSlug: string;
  phone: string; website: string; address: string; street: string;
  city: string; county: string; state: string; stateCode: string; postalCode: string;
  latitude: number | null; longitude: number | null;
  rating: number | null; reviewCount: number; reviewsPerScore: Record<string,number> | null;
  photosCount: number; photo: string; logo: string; businessStatus: string;
  hours: Record<string, string[]> | null; priceRange: string;
  description: string; menuLink: string; orderLinks: string; googleMapsLink: string;
  placeId: string; subtypes: string; amenities: Amenities;
}

import restaurantsData from './restaurants.json'

export const restaurants: Restaurant[] = restaurantsData as Restaurant[]

export function getCities() {
  const map = new Map<string, { city: string; stateCode: string; citySlug: string; stateSlug: string; count: number }>()
  for (const r of restaurants) {
    const key = `${r.citySlug}-${r.stateSlug}`
    if (map.has(key)) { map.get(key)!.count++ } else {
      map.set(key, { city: r.city, stateCode: r.stateCode, citySlug: r.citySlug, stateSlug: r.stateSlug, count: 1 })
    }
  }
  return Array.from(map.values()).sort((a,b) => b.count - a.count)
}

export function getStates() {
  const map = new Map<string, { state: string; stateCode: string; stateSlug: string; count: number; cityCount: number; citySlugs: Set<string> }>()
  for (const r of restaurants) {
    const key = r.stateSlug
    let entry = map.get(key)
    if (!entry) {
      entry = { state: r.state, stateCode: r.stateCode, stateSlug: r.stateSlug, count: 0, cityCount: 0, citySlugs: new Set() }
      map.set(key, entry)
    }
    entry.count++
    entry.citySlugs.add(r.citySlug)
  }
  return Array.from(map.values())
    .map(e => ({ state: e.state, stateCode: e.stateCode, stateSlug: e.stateSlug, count: e.count, cityCount: e.citySlugs.size }))
    .sort((a, b) => b.count - a.count)
}

export function getRestaurantsByState(stateSlug: string) {
  return restaurants.filter(r => r.stateSlug === stateSlug)
}

export function getRestaurantsByCity(citySlug: string, stateSlug: string) {
  return restaurants.filter(r => r.citySlug === citySlug && r.stateSlug === stateSlug)
}

export function getRestaurant(citySlug: string, stateSlug: string, slug: string): Restaurant | null {
  return restaurants.find(r => r.slug === slug && r.citySlug === citySlug && r.stateSlug === stateSlug) ?? null
}

export function getRestaurantBySlug(slug: string): Restaurant | null {
  return restaurants.find(r => r.slug === slug) ?? null
}

export const BROTH_TYPES = ['Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan'] as const
export type BrothType = typeof BROTH_TYPES[number]

export function getBrothTypes(r: Restaurant): BrothType[] {
  const name = r.name.toLowerCase()
  const text = `${name} ${r.description ?? ''} ${r.subtypes ?? ''}`.toLowerCase()
  const nameWords = name.split(/\s+/)
  const types: BrothType[] = []

  if (
    name.includes('jinya ramen') || name.includes('tatsu-ya') || name.includes('ramen tatsu') ||
    text.includes('tonkotsu') || text.includes('pork bone') || text.includes('hakata ramen') ||
    text.includes('hakata style') || text.includes('hakata-style')
  ) types.push('Tonkotsu')

  if (
    text.includes('shoyu') || text.includes('soy sauce broth') || text.includes('soy broth') ||
    text.includes('tokyo ramen') || text.includes('tokyo-style') || text.includes('tokyo style') ||
    text.includes('shoyu tare') || text.includes('soy-based')
  ) types.push('Shoyu')

  if (
    name.includes('moonlight miso') || nameWords.includes('miso') || nameWords.includes('sapporo') ||
    text.includes('miso ramen') || text.includes('miso broth') || text.includes('miso base') ||
    text.includes('miso tare') || text.includes('sapporo ramen') || text.includes('sapporo style') ||
    text.includes('hokkaido') || text.includes('red miso') || text.includes('white miso')
  ) types.push('Miso')

  if (
    text.includes('spicy') || text.includes('tantanmen') || text.includes('tan tan') ||
    text.includes('tori paitan') || text.includes('chili oil') || text.includes('doubanjiang') ||
    text.includes('fire ramen') || text.includes('hot ramen')
  ) types.push('Spicy')

  if (r.amenities.veganOptions) types.push('Vegan')

  return types
}

export function getRestaurantsByBrothType(type: BrothType): Restaurant[] {
  return restaurants.filter(r => getBrothTypes(r).includes(type))
}

export function getNearbyCities(citySlug: string, stateSlug: string, maxCount = 6): Array<{ city: string; stateCode: string; citySlug: string; stateSlug: string; count: number; distanceMiles: number }> {
  const cityRestaurants = restaurants.filter(r => r.citySlug === citySlug && r.stateSlug === stateSlug && r.latitude && r.longitude)
  if (!cityRestaurants.length) return []

  const avgLat = cityRestaurants.reduce((s, r) => s + r.latitude!, 0) / cityRestaurants.length
  const avgLng = cityRestaurants.reduce((s, r) => s + r.longitude!, 0) / cityRestaurants.length

  const cities = getCities()
  const results: Array<{ city: string; stateCode: string; citySlug: string; stateSlug: string; count: number; distanceMiles: number }> = []

  for (const c of cities) {
    if (c.citySlug === citySlug && c.stateSlug === stateSlug) continue
    const cityRests = restaurants.filter(r => r.citySlug === c.citySlug && r.stateSlug === c.stateSlug && r.latitude && r.longitude)
    if (!cityRests.length) continue
    const cLat = cityRests.reduce((s, r) => s + r.latitude!, 0) / cityRests.length
    const cLng = cityRests.reduce((s, r) => s + r.longitude!, 0) / cityRests.length

    const R = 3958.8
    const dLat = (cLat - avgLat) * Math.PI / 180
    const dLng = (cLng - avgLng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(avgLat * Math.PI / 180) * Math.cos(cLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    const distanceMiles = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    if (distanceMiles <= 60) results.push({ ...c, distanceMiles })
  }

  return results.sort((a, b) => a.distanceMiles - b.distanceMiles).slice(0, maxCount)
}
