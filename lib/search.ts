import { restaurants, type Restaurant } from './restaurants'

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)
  const seen = new Set<string>()
  const scored: { r: Restaurant; score: number }[] = []

  for (const r of restaurants) {
    if (seen.has(r.slug)) continue
    seen.add(r.slug)

    const name = (r.name ?? '').toLowerCase()
    const city = (r.city ?? '').toLowerCase()

    // Whole-phrase name match (highest)
    if (name.includes(q)) {
      scored.push({ r, score: tokens.length * 2 + (name.startsWith(q) ? 1 : 0) })
      continue
    }

    // Token-based name matching
    const nameHits = tokens.filter(t => name.includes(t)).length
    if (nameHits > 0) {
      scored.push({ r, score: nameHits })
      continue
    }

    // City/other field match — only include if no name-based results beat it
    if (tokens.some(t => city.includes(t))) {
      scored.push({ r, score: 0 })
    }
  }

  scored.sort((a, b) => b.score - a.score)

  // If any result matches all tokens by name, hide the partial-token and city-only results
  const maxScore = scored[0]?.score ?? 0
  if (tokens.length > 1 && maxScore >= tokens.length) {
    return scored.filter(x => x.score >= tokens.length).map(x => x.r)
  }

  return scored.map(x => x.r)
}
