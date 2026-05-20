import { restaurants, type Restaurant } from './restaurants'

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const seen = new Set<string>()

  return restaurants
    .filter((r) => {
      if (seen.has(r.slug)) return false
      seen.add(r.slug)
      return (
        (r.name ?? '').toLowerCase().includes(q) ||
        (r.city ?? '').toLowerCase().includes(q) ||
        (r.address ?? '').toLowerCase().includes(q) ||
        (r.postalCode ?? '').includes(q) ||
        (r.county ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => score(b, q) - score(a, q))
}

function score(r: Restaurant, q: string): number {
  const name = (r.name ?? '').toLowerCase()
  if (name.startsWith(q)) return 3
  if (name.includes(q)) return 2
  return 1
}
