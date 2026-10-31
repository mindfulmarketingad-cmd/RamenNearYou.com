'use client'

// Browser-side restaurant search (claim page, compare page). The old
// /api/restaurants/search route searched the dataset on the server; the site
// is static now, so this searches the map's static JSON instead — the same
// file every map page already loads. Same matching rules as the old route:
// name + city + state contains the query, dataset (non-supplement, non-pho)
// restaurants only.
import { STATE_CODE_TO_NAME } from './state-lookups'
import type { MapPoint } from './ramen-taxonomy'

export type RestaurantSearchResult = {
  slug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  priceRange?: string
  citySlug: string
  stateSlug: string
  photo?: string
}

let _points: Promise<MapPoint[]> | null = null
function loadPoints(): Promise<MapPoint[]> {
  _points ??= fetch('/data/ramen-map.json')
    .then((r) => r.json())
    .then((all: MapPoint[]) => all.filter((p) => !p.supp && !p.pho))
    .catch(() => {
      _points = null
      return []
    })
  return _points
}

export async function searchRestaurants(query: string, exclude = ''): Promise<RestaurantSearchResult[]> {
  const q = query.toLowerCase().trim()
  const points = (await loadPoints()).filter((p) => p.slug !== exclude)
  const hits = q.length < 2
    ? points.slice(0, 40)
    : points
        .filter((p) => `${p.name} ${p.city} ${p.stateCode} ${STATE_CODE_TO_NAME[p.stateCode] ?? ''}`.toLowerCase().includes(q))
        .slice(0, 60)
  return hits.map((p) => ({
    slug: p.slug,
    name: p.name,
    city: p.city,
    stateCode: p.stateCode,
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceRange: p.priceRange,
    citySlug: p.citySlug,
    stateSlug: p.stateSlug,
    photo: p.photo,
  }))
}
