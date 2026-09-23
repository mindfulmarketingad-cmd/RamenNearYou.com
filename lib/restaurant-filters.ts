import type { Restaurant } from './restaurants'
import { BOWL_MATCH, MOOD_MATCH, txt } from './ramen-discovery'
import { FEATURE_AMENITY_FIELD, FEATURE_KEYS } from './ramen-taxonomy'
import { isOpenNow, isOpenLate, isOpenPastMidnight, opensEarly, isOpenOnWeekend } from './hours'

// Server-side filter matching for the homepage "near you" feed.
//
// The map does the same job in the browser against a slimmed-down payload
// that only carries a name, so several of its matchers fall back to regexing
// the restaurant name. Here we have the whole record — description, subtypes,
// amenities — so the same filter key gives a strictly better answer. Keys are
// shared with the map's taxonomy so a filter means the same thing on both.

/** Flags that aren't bowls, moods or amenities — computed from hours/rating. */
const MISC_MATCH: Record<string, (r: Restaurant) => boolean> = {
  'open-now': (r) => isOpenNow(r.hours) === true,
  'open-late': (r) => isOpenLate(r.hours, 22 * 60),
  'open-midnight': (r) => isOpenPastMidnight(r.hours),
  'open-early': (r) => opensEarly(r.hours),
  'open-weekends': (r) => isOpenOnWeekend(r.hours),
  'top-rated': (r) => (r.rating ?? 0) >= 4.3 && r.reviewCount >= 20,
  'hidden-gems': (r) => (r.rating ?? 0) >= 4.5 && r.reviewCount < 100,
  'new-ramen': (r) => (r.reviewCount ?? 0) > 0 && (r.reviewCount ?? 0) <= 75,
  'ramen-sushi': (r) => /sushi|sashimi|izakaya/.test(txt(r)),
  'sushi': (r) => /sushi|sashimi|nigiri|omakase/.test(txt(r)),
  'lo-mein': (r) => /lo.?mein|chow mein|chinese|\bwok\b/.test(txt(r)),
  'fish-ramen': (r) => /fish|seafood|gyokai|niboshi|shellfish|crab|shrimp|clam|oyster/.test(txt(r)),
  'korean-style': (r) => /korean|gochujang|kimchi|doenjang/.test(txt(r)),
  'japanese-fusion': (r) => /fusion/.test(txt(r)),
  'halal': (r) => /halal/.test(txt(r)),
  'gluten-free': (r) => /gluten.?free/.test(txt(r)),
}

const PRICE_MATCH: Record<string, (r: Restaurant) => boolean> = {
  budget: (r) => r.priceRange === '$' || r.priceRange === '$10-20',
  premium: (r) => r.priceRange === '$$$' || r.priceRange === '$$$$',
  value: (r) => (r.rating ?? 0) >= 4.3 && (r.priceRange === '$' || r.priceRange === '$$'),
}

/**
 * True when `r` satisfies filter `key`. An unknown key matches nothing, so a
 * stale or hand-typed key empties the list rather than silently passing every
 * restaurant through.
 */
export function matchesFilter(r: Restaurant, key: string): boolean {
  if (key === 'verified') return false // claimed status isn't in this dataset
  if (FEATURE_KEYS.has(key)) {
    const field = FEATURE_AMENITY_FIELD[key]
    return (r.amenities as unknown as Record<string, boolean> | undefined)?.[field] === true
  }
  if (MISC_MATCH[key]) return MISC_MATCH[key](r)
  if (PRICE_MATCH[key]) return PRICE_MATCH[key](r)
  if (BOWL_MATCH[key]) return BOWL_MATCH[key](r)
  if (MOOD_MATCH[key]) return MOOD_MATCH[key](r)
  return false
}

/** AND across every selected filter — each extra chip narrows the results. */
export function matchesAllFilters(r: Restaurant, keys: string[]): boolean {
  for (const k of keys) if (!matchesFilter(r, k)) return false
  return true
}
