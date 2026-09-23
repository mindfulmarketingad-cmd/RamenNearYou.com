// SERVER-ONLY. Reproduces the client-side filter logic in
// components/home-map-hero.tsx (the flags/bowls/prices matching starting
// around its `list = enriched.filter(...)` block) but operating directly on
// full Restaurant rows, so a /find/{modifier}-in-{city}-{state} page can
// build a real, server-rendered listicle instead of only configuring the
// client map's initial filters.
import type { Restaurant } from './restaurants'
import { isOpenNow, isOpenLate, isOpenPastMidnight, opensEarly, isOpenOnWeekend } from './hours'
import { FEATURE_AMENITY_FIELD } from './ramen-taxonomy'
import { BOWL_MATCH, MOOD_MATCH, txt } from './ramen-discovery'
import type { ModifierFilter } from './find-modifiers'

// Superset of ModifierFilter — the standalone nationwide /find/* pages (open
// now, tonkotsu, date-night, etc.) also use initialMoods, which per-city
// modifier pages never do.
export type NationwideFilter = ModifierFilter & { initialMoods?: string[] }

export function restaurantMatchesModifier(r: Restaurant, filter: NationwideFilter): boolean {
  const flags = new Set(filter.initialFlags ?? [])
  const bowls = new Set(filter.initialBowls ?? [])
  const moods = new Set(filter.initialMoods ?? [])
  const prices = new Set(filter.initialPrices ?? [])
  const query = filter.initialQuery?.toLowerCase().trim()

  if (query && !txt(r).includes(query)) return false

  if (flags.has('open-now') && !isOpenNow(r.hours)) return false
  if (flags.has('open-late') && !isOpenLate(r.hours, 22 * 60)) return false
  if (flags.has('open-midnight') && !isOpenPastMidnight(r.hours)) return false
  if (flags.has('top-rated') && ((r.rating ?? 0) < 4.3 || r.reviewCount < 20)) return false
  if (flags.has('hidden-gems') && !((r.rating ?? 0) >= 4.5 && r.reviewCount < 100)) return false
  if (flags.has('open-early') && !opensEarly(r.hours)) return false
  if (flags.has('open-weekends') && !isOpenOnWeekend(r.hours)) return false
  if (flags.has('ramen-sushi') && !/sushi|sashimi|izakaya|japanese/i.test(r.name)) return false
  if (flags.has('korean-style') && !/korean|gochujang|kimchi|doenjang/i.test(r.name)) return false
  if (flags.has('japanese-fusion') && !/fusion/i.test(r.name)) return false
  if (flags.has('halal') && !/halal/i.test(r.name)) return false
  if (flags.has('gluten-free') && !/gluten.free|gluten free/i.test(r.name)) return false
  if (flags.has('new-ramen') && !((r.reviewCount ?? 0) > 0 && (r.reviewCount ?? 0) <= 75)) return false
  if (flags.has('fish-ramen') && !/fish|seafood|gyokai|niboshi|shellfish|crab|shrimp|clam|oyster|sushi/i.test(r.name)) return false
  if (flags.has('hanabi') && !/hanabi/i.test(r.name)) return false
  if (flags.has('shokku') && !/shokku/i.test(r.name)) return false
  if (flags.has('muroran-curry') && !/muroran|curry/i.test(r.name)) return false
  if (flags.has('kagoshima') && !/kagoshima/i.test(r.name)) return false
  if (flags.has('hakata') && !/hakata/i.test(r.name)) return false
  if (flags.has('champon') && !/champon/i.test(r.name)) return false
  if (flags.has('sushi') && !/sushi|sashimi|nigiri|omakase/i.test(r.name)) return false
  if (flags.has('lo-mein') && !/lo.?mein|chow mein|chinese|\bwok\b/i.test(r.name)) return false

  for (const f of flags) {
    const field = FEATURE_AMENITY_FIELD[f] as keyof Restaurant['amenities'] | undefined
    if (field && !r.amenities?.[field]) return false
  }

  if (bowls.size > 0) {
    const matchesBowl = [...bowls].some(k => BOWL_MATCH[k]?.(r))
    const nameMatchesMiso = bowls.has('miso') && /miso/i.test(r.name)
    if (!matchesBowl && !nameMatchesMiso) return false
  }

  if (moods.size > 0 && ![...moods].some(k => MOOD_MATCH[k]?.(r))) return false

  if (prices.size > 0) {
    const budget = r.priceRange === '$' || r.priceRange === '$$'
    const premium = r.priceRange === '$$$' || r.priceRange === '$$$$'
    const matchesAnyPrice = [...prices].some(k =>
      k === 'budget' ? budget
        : k === 'premium' ? premium
        : k === 'value' ? budget && (r.rating ?? 0) >= 4.3 && r.reviewCount >= 50
        : false,
    )
    if (!matchesAnyPrice) return false
  }

  return true
}
