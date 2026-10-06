'use client'

// Browser-side replacement for the old /api/nearby route: loads the static
// grid-cell files around a point (lib/nearby-data.ts) and filters, sorts and
// trims them exactly the way the route did.
import { isOpenNow, getTodayHoursLabel } from './hours'
import type { NearbyRow } from './nearby-data'

export type SortKey = 'closest' | 'rating' | 'reviews'

export type NearbyResult = Omit<NearbyRow, 'hours' | 'filterKeys' | 'lat' | 'lng'> & {
  openNow: boolean | null
  hoursLabel: string | null
  distanceMiles: number
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

let _index: Promise<Set<string>> | null = null
const _cells = new Map<string, Promise<NearbyRow[]>>()

function loadIndex(): Promise<Set<string>> {
  _index ??= fetch('/data/nearby-cells.json').then((r) => r.json()).then((keys: string[]) => new Set(keys))
  return _index
}

function loadCell(key: string): Promise<NearbyRow[]> {
  if (!_cells.has(key)) _cells.set(key, fetch(`/data/nearby/${key}.json`).then((r) => r.json()).catch(() => []))
  return _cells.get(key)!
}

export async function fetchNearby(opts: {
  lat: number
  lng: number
  radius: number
  sort: SortKey
  filters: string[]
  limit: number
}): Promise<{ results: NearbyResult[]; total: number }> {
  const { lat, lng, sort, filters, limit } = opts
  const radius = Math.min(opts.radius || 50, 50)
  const dLat = radius / 69
  const dLng = radius / (69 * Math.max(Math.cos(lat * Math.PI / 180), 0.2))
  const index = await loadIndex()
  const keys: string[] = []
  for (let a = Math.floor(lat - dLat); a <= Math.floor(lat + dLat); a++) {
    for (let b = Math.floor(lng - dLng); b <= Math.floor(lng + dLng); b++) {
      if (index.has(`${a}_${b}`)) keys.push(`${a}_${b}`)
    }
  }
  const rows = (await Promise.all(keys.map(loadCell))).flat()

  const nearby = rows
    .filter((r) => filters.every((k) => (k === 'open-now' ? isOpenNow(r.hours) === true : r.filterKeys.includes(k))))
    .map(({ hours, filterKeys: _f, lat: rLat, lng: rLng, ...r }) => ({
      ...r,
      openNow: isOpenNow(hours),
      hoursLabel: hours ? getTodayHoursLabel(hours) : null,
      distanceMiles: haversine(lat, lng, rLat, rLng),
    }))
    .filter((r) => r.distanceMiles <= radius)
    // Distance is the tiebreak for the other two sorts, so equally-rated spots
    // still come back nearest-first rather than in dataset order.
    .sort((a, b) => {
      if (sort === 'rating') {
        return (b.rating ?? 0) - (a.rating ?? 0) ||
          (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
          a.distanceMiles - b.distanceMiles
      }
      if (sort === 'reviews') {
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0) || a.distanceMiles - b.distanceMiles
      }
      return a.distanceMiles - b.distanceMiles
    })

  return { results: nearby.slice(0, limit), total: nearby.length }
}
