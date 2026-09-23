import {
  restaurants,
  getRestaurantsByCity,
  getRestaurantsByState,
  getBrothTypes,
  type Restaurant,
} from './restaurants'
import { isOpenLate } from './hours'

export type RelatedGroup = {
  key: string
  heading: string
  items: Restaurant[]
}

const byRating = (a: Restaurant, b: Restaurant) =>
  (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0)

// Grouped "where to go next" links for a listing page. A single undifferentiated
// list of nearby spots gets skimmed past; splitting the same links into a few
// labelled reasons ("similar broth", "open late") gives each one a motive to be
// clicked, which is the point — routing readers deeper into pages we already
// publish rather than dead-ending on one listing.
//
// Groups are built from a shared candidate pool and de-duplicated as we go, so
// the same restaurant never appears twice across sections.
export function getRelatedGroups(r: Restaurant, perGroup = 5): RelatedGroup[] {
  const seen = new Set<string>([r.slug])
  const take = (list: Restaurant[]) => {
    const out: Restaurant[] = []
    for (const c of list) {
      if (out.length >= perGroup) break
      if (seen.has(c.slug)) continue
      if (c.businessStatus && c.businessStatus !== 'OPERATIONAL') continue
      seen.add(c.slug)
      out.push(c)
    }
    return out
  }

  const inCity = getRestaurantsByCity(r.citySlug, r.stateSlug).slice().sort(byRating)
  const inState = getRestaurantsByState(r.stateSlug).slice().sort(byRating)
  const groups: RelatedGroup[] = []

  // 1. Same city — the most obvious next click.
  const more = take(inCity)
  if (more.length > 0) {
    groups.push({ key: 'city', heading: `More ramen in ${r.city}`, items: more })
  }

  // 2. Same broth style, anywhere nearby — the strongest "you'll like this too"
  //    signal we can derive without per-restaurant taste data.
  const broths = getBrothTypes(r)
  if (broths.length > 0) {
    const primary = broths[0]
    const sameBroth = take(
      inState.filter(c => getBrothTypes(c).includes(primary))
    )
    if (sameBroth.length > 0) {
      const label = primary.charAt(0).toUpperCase() + primary.slice(1)
      groups.push({ key: 'broth', heading: `More ${label} ramen near ${r.city}`, items: sameBroth })
    }
  }

  // 3. Open late — a genuinely different intent from "best rated".
  const late = take(inState.filter(c => isOpenLate(c.hours)))
  if (late.length > 0) {
    groups.push({ key: 'late', heading: `Open late near ${r.city}`, items: late })
  }

  // 4. Top rated across the state — widens the net once the local pool is used.
  const topState = take(inState.filter(c => (c.rating ?? 0) >= 4.5 && c.reviewCount >= 50))
  if (topState.length > 0) {
    groups.push({ key: 'state', heading: `Top rated in ${r.state}`, items: topState })
  }

  return groups
}

// Nearby cities that have their own directory page — gives the listing page a
// set of onward city links, not just restaurant links.
export function getNearbyCityLinks(r: Restaurant, limit = 6) {
  if (r.latitude == null || r.longitude == null) return []
  const seen = new Map<string, { city: string; stateCode: string; citySlug: string; stateSlug: string; distKm: number; count: number }>()
  for (const c of restaurants) {
    if (c.citySlug === r.citySlug && c.stateSlug === r.stateSlug) continue
    if (c.latitude == null || c.longitude == null) continue
    const key = `${c.citySlug}|${c.stateSlug}`
    const dLat = (c.latitude - r.latitude) * 111
    const dLng = (c.longitude - r.longitude) * 85
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng)
    if (distKm > 60) continue
    const hit = seen.get(key)
    if (hit) { hit.count++; if (distKm < hit.distKm) hit.distKm = distKm }
    else seen.set(key, { city: c.city, stateCode: c.stateCode, citySlug: c.citySlug, stateSlug: c.stateSlug, distKm, count: 1 })
  }
  return Array.from(seen.values())
    .filter(c => c.count >= 2)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, limit)
}
