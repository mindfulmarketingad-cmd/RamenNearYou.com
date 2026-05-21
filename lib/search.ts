import { restaurants, type Restaurant } from './restaurants'

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)
  const isZip = /^\d{3,5}$/.test(q)

  const seen = new Set<string>()
  const scored: { r: Restaurant; score: number }[] = []

  for (const r of restaurants) {
    if (seen.has(r.slug)) continue
    seen.add(r.slug)

    const name      = r.name?.toLowerCase() ?? ''
    const city      = r.city?.toLowerCase() ?? ''
    const state     = r.state?.toLowerCase() ?? ''
    const stateCode = r.stateCode?.toLowerCase() ?? ''
    const zip       = r.postalCode ?? ''
    const addr      = r.address?.toLowerCase() ?? ''

    let score = -1

    // ── Zip code ─────────────────────────────────────────────────────────────
    if (isZip) {
      if (zip === q)             score = Math.max(score, 8)
      else if (zip.startsWith(q)) score = Math.max(score, 4)
    }

    // ── Name: phrase match ────────────────────────────────────────────────────
    if (name === q)               score = Math.max(score, 10)
    else if (name.startsWith(q))  score = Math.max(score, 9)
    else if (name.includes(q))    score = Math.max(score, 7)

    // ── Name: token match ─────────────────────────────────────────────────────
    const nameHits = tokens.filter(t => name.includes(t)).length
    if (nameHits === tokens.length && nameHits > 0) score = Math.max(score, 6)
    else if (nameHits > 0)                          score = Math.max(score, nameHits)

    // ── City: phrase match ────────────────────────────────────────────────────
    // "north bellmore" → city === "north bellmore" → score 9
    if (city === q)               score = Math.max(score, 9)
    else if (city.includes(q))    score = Math.max(score, 8)

    // ── City: token match — ALL tokens must appear in city ───────────────────
    // "north bellmore" → both "north" AND "bellmore" must be in city
    // prevents partial-token false positives like "north miami beach" scoring as a city match
    const cityHits = tokens.filter(t => city.includes(t)).length
    if (cityHits === tokens.length && cityHits > 0) score = Math.max(score, 7)
    // single stray token in city is weak — only use as tiebreaker if nothing else matched
    else if (cityHits > 0 && score < 0)             score = Math.max(score, 1)

    // ── State match ───────────────────────────────────────────────────────────
    if (stateCode === q || state === q)  score = Math.max(score, 6)
    else if (state.startsWith(q) || stateCode.startsWith(q)) score = Math.max(score, 3)

    // ── Cross-field: tokens split across name + city ──────────────────────────
    // "jinya atlanta" → "jinya" in name AND "atlanta" in city → strong match
    // Requires the UNION of matched tokens to cover all query tokens
    // (avoids double-counting: "north" in both name and city of "North Miami Beach"
    //  would cover {north} ∪ {north} = {north}, not {north, bellmore})
    if (nameHits > 0 && cityHits > 0 && nameHits < tokens.length) {
      const nameTokensCovered = new Set(tokens.filter(t => name.includes(t)))
      const cityTokensCovered = new Set(tokens.filter(t => city.includes(t)))
      const allCovered = new Set([...nameTokensCovered, ...cityTokensCovered])
      if (allCovered.size === tokens.length) score = Math.max(score, 7)
    }

    // ── Address fallback: only full-phrase, no token expansion ────────────────
    // Prevents street directions like "123 North Ave" matching the token "north"
    if (score < 0 && addr.includes(q)) score = 0

    if (score >= 0) scored.push({ r, score })
  }

  // Sort by score desc, then rating desc as tiebreaker
  scored.sort((a, b) => b.score - a.score || (b.r.rating ?? 0) - (a.r.rating ?? 0))

  // For multi-token queries with strong matches (≥7), filter out weak stragglers
  // e.g. "north bellmore" has score-9 city matches → don't show score-1 noise
  if (tokens.length > 1 && scored.length > 0) {
    const best = scored[0].score
    if (best >= 7) {
      const threshold = Math.max(best - 2, 5)
      const tight = scored.filter(x => x.score >= threshold)
      if (tight.length > 0) return tight.map(x => x.r)
    }
  }

  return scored.map(x => x.r)
}
