// SERVER-ONLY (build time). The homepage "near you" feed used to call an API
// route; the site is static now, so the same data ships as JSON files split
// into ~1°×1° grid cells (about 70 miles a side). The browser loads only the
// cells around the visitor (lib/nearby-client.ts) instead of all ~8k
// restaurants.
import { restaurants } from './restaurants'
import { staticFilterKeys } from './restaurant-filters'

export type NearbyRow = {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  photo: string
  description: string
  subtypes: string
  priceRange: string
  address: string
  phone: string
  website: string
  googleMapsLink: string
  lat: number
  lng: number
  hours: Record<string, string[]> | null
  filterKeys: string[]
}

export const cellKey = (lat: number, lng: number) => `${Math.floor(lat)}_${Math.floor(lng)}`

let _cells: Map<string, NearbyRow[]> | null = null
export function getNearbyCells(): Map<string, NearbyRow[]> {
  if (_cells) return _cells
  _cells = new Map()
  for (const r of restaurants) {
    if (r.latitude == null || r.longitude == null || r.businessStatus !== 'OPERATIONAL') continue
    const key = cellKey(r.latitude, r.longitude)
    if (!_cells.has(key)) _cells.set(key, [])
    _cells.get(key)!.push({
      slug: r.slug,
      citySlug: r.citySlug,
      stateSlug: r.stateSlug,
      name: r.name,
      city: r.city,
      stateCode: r.stateCode,
      rating: r.rating,
      reviewCount: r.reviewCount ?? 0,
      photo: r.photo,
      description: r.description,
      subtypes: r.subtypes,
      priceRange: r.priceRange,
      address: r.address,
      phone: r.phone,
      website: r.website,
      googleMapsLink: r.googleMapsLink,
      lat: r.latitude,
      lng: r.longitude,
      hours: r.hours && Object.keys(r.hours).length ? r.hours : null,
      filterKeys: staticFilterKeys(r),
    })
  }
  return _cells
}
