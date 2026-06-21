// Client-safe taxonomy: chip metadata (labels, emoji, colors) and the slim
// map-point shape the homepage map consumes. NOTHING here imports the heavy
// restaurants dataset, so it can be bundled into client components safely.
import { isOpenNow } from './hours'

export type ChipMeta = { key: string; label: string; emoji: string; hex: string }

// Instant Bowl Finder — specific bowls, each with a brand color used for both
// the filter chip and the map pins when that bowl is the active filter.
export const BOWL_META: ChipMeta[] = [
  { key: 'tonkotsu', label: 'Tonkotsu', emoji: '🍜', hex: '#d97706' },
  { key: 'spicy-miso', label: 'Spicy Miso', emoji: '🌶️', hex: '#dc2626' },
  { key: 'miso', label: 'Miso', emoji: '🥣', hex: '#ea580c' },
  { key: 'shoyu', label: 'Shoyu', emoji: '🍶', hex: '#78716c' },
  { key: 'shio', label: 'Shio', emoji: '🧂', hex: '#0ea5e9' },
  { key: 'tsukemen', label: 'Tsukemen', emoji: '🥢', hex: '#7c3aed' },
  { key: 'mazemen', label: 'Mazemen', emoji: '🍝', hex: '#ca8a04' },
  { key: 'chicken-paitan', label: 'Chicken Paitan', emoji: '🐔', hex: '#f59e0b' },
  { key: 'black-garlic', label: 'Black Garlic', emoji: '🧄', hex: '#374151' },
  { key: 'tantanmen', label: 'Tantanmen', emoji: '🥜', hex: '#b91c1c' },
  { key: 'vegan', label: 'Vegan', emoji: '🌱', hex: '#059669' },
]

export const MOOD_META: ChipMeta[] = [
  { key: 'rich-creamy', label: 'Rich & Creamy', emoji: '🥛', hex: '#d97706' },
  { key: 'light-clean', label: 'Light & Clean', emoji: '🍃', hex: '#0ea5e9' },
  { key: 'extra-spicy', label: 'Extra Spicy', emoji: '🔥', hex: '#dc2626' },
  { key: 'late-night', label: 'Late-Night Comfort', emoji: '🌙', hex: '#6366f1' },
  { key: 'hangover', label: 'Hangover Cure', emoji: '🍲', hex: '#ef4444' },
  { key: 'quick-lunch', label: 'Quick Lunch', emoji: '⏱️', hex: '#16a34a' },
  { key: 'date-night', label: 'Date Night', emoji: '🍷', hex: '#9333ea' },
]

export const BOWL_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(BOWL_META.map(b => [b.key, b]))
export const MOOD_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(MOOD_META.map(m => [m.key, m]))

export const PRICE_META: { key: string; label: string }[] = [
  { key: 'budget', label: 'Under ~$15' },
  { key: 'premium', label: 'Premium' },
  { key: 'value', label: 'Best Value' },
]

// Slim record shipped to the client (no description/subtypes — keeps payload small).
export type MapPoint = {
  name: string
  slug: string
  citySlug: string
  stateSlug: string
  city: string
  stateCode: string
  zip: string
  latitude: number | null
  longitude: number | null
  rating: number | null
  reviewCount: number
  priceRange: string
  photo: string
  hours: Record<string, string[]> | null
  bowls: string[]
  moods: string[]
  googleMapsUrl?: string  // set for Places-supplement entries (no internal page)
}

export function matchesPrice(p: MapPoint, key: string): boolean {
  const budget = p.priceRange === '$' || p.priceRange === '$$'
  const premium = p.priceRange === '$$$' || p.priceRange === '$$$$'
  if (key === 'budget') return budget
  if (key === 'premium') return premium
  if (key === 'value') return budget && (p.rating ?? 0) >= 4.3 && p.reviewCount >= 50
  return false
}

// Composite "best bowl right now": rating, open status, proximity, popularity.
export function bestBowlScore(p: MapPoint & { distKm?: number }, hasLocation: boolean): number {
  let score = (p.rating ?? 0) * 2
  score += Math.min(p.reviewCount, 1000) / 500 // up to +2 for popularity
  if (isOpenNow(p.hours)) score += 2.5
  if (hasLocation && typeof p.distKm === 'number') score -= Math.min(p.distKm, 40) * 0.06
  return score
}
