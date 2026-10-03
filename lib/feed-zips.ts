import { restaurants, type Restaurant } from './restaurants'

// ZIP → the restaurants in it, built once per server process. The dataset is
// ~7,900 rows across ~2,600 ZIPs, so an index costs almost nothing and saves a
// full scan on every page of every member's feed.

export function zip5(raw: string | null | undefined): string | null {
  if (!raw) return null
  const m = String(raw).match(/\d{5}/)
  return m ? m[0] : null
}

let index: Map<string, Restaurant[]> | null = null

function getIndex(): Map<string, Restaurant[]> {
  if (index) return index
  const m = new Map<string, Restaurant[]>()
  for (const r of restaurants) {
    if (r.businessStatus !== 'OPERATIONAL') continue
    const z = zip5(r.postalCode)
    if (!z) continue
    const list = m.get(z)
    if (list) list.push(r)
    else m.set(z, [r])
  }
  index = m
  return m
}

export function zipExists(zip: string): boolean {
  return getIndex().has(zip)
}

export function restaurantsInZip(zip: string): Restaurant[] {
  return getIndex().get(zip) ?? []
}

/** "Atlanta, GA · 30309" — the chip label for a followed ZIP. */
export function zipLabel(zip: string): string {
  const first = restaurantsInZip(zip)[0]
  if (!first) return zip
  return `${first.city}, ${first.stateCode}`
}

export function countInZip(zip: string): number {
  return restaurantsInZip(zip).length
}
