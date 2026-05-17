import { restaurants, type Restaurant } from './restaurants'

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  return restaurants.filter((r) => {
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.postalCode.includes(q) ||
      r.county.toLowerCase().includes(q)
    )
  })
}
