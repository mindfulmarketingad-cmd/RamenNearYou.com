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
  { key: 'rich-creamy',    label: 'Rich & Creamy',      emoji: '🥛', hex: '#d97706' },
  { key: 'light-clean',   label: 'Light & Clean',       emoji: '🍃', hex: '#0ea5e9' },
  { key: 'extra-spicy',   label: 'Extra Spicy',         emoji: '🔥', hex: '#dc2626' },
  { key: 'late-night',    label: 'Late-Night Comfort',  emoji: '🌙', hex: '#6366f1' },
  { key: 'hangover',      label: 'Hangover Cure',       emoji: '🍲', hex: '#ef4444' },
  { key: 'quick-lunch',   label: 'Quick Lunch',         emoji: '⏱️', hex: '#16a34a' },
  { key: 'date-night',    label: 'Date Night',          emoji: '🍷', hex: '#9333ea' },
  { key: 'cozy-intimate', label: 'Cozy & Intimate',     emoji: '🕯️', hex: '#92400e' },
  { key: 'lively-social', label: 'Lively & Social',     emoji: '✨', hex: '#7c3aed' },
  { key: 'izakaya-vibe',  label: 'Izakaya Vibe',        emoji: '🍶', hex: '#1d4ed8' },
  { key: 'solo-dining',   label: 'Solo-Friendly',       emoji: '🪑', hex: '#4b5563' },
  { key: 'sake-drinks',   label: 'Sake & Drinks',       emoji: '🥃', hex: '#b45309' },
]

export const BOWL_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(BOWL_META.map(b => [b.key, b]))
export const MOOD_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(MOOD_META.map(m => [m.key, m]))

// Features & Amenities — derived from each restaurant's Google amenity flags.
// The keys are stored (only when true) in MapPoint.amenities so the client can
// filter without shipping the raw amenities object.
export const FEATURE_META: ChipMeta[] = [
  { key: 'delivers', label: 'Delivers', emoji: '🛵', hex: '#16a34a' },
  { key: 'outdoor-seating', label: 'Outdoor Seating', emoji: '☀️', hex: '#0ea5e9' },
  { key: 'reservations', label: 'Takes Reservations', emoji: '📅', hex: '#9333ea' },
  { key: 'full-bar', label: 'Full Bar', emoji: '🍺', hex: '#d97706' },
  { key: 'family-friendly', label: 'Family-Friendly', emoji: '👨‍👩‍👧', hex: '#f59e0b' },
  { key: 'vegetarian', label: 'Vegetarian Options', emoji: '🥗', hex: '#059669' },
  { key: 'wheelchair', label: 'Wheelchair Accessible', emoji: '♿', hex: '#0284c7' },
  { key: 'free-parking', label: 'Free Parking', emoji: '🅿️', hex: '#64748b' },
]

// Feature key → the raw amenity field on a Restaurant. Used server-side when
// building MapPoint.amenities (kept here so the keys stay in one place).
export const FEATURE_AMENITY_FIELD: Record<string, string> = {
  'delivers': 'delivery',
  'outdoor-seating': 'outdoorSeating',
  'reservations': 'acceptsReservations',
  'full-bar': 'alcohol',
  'family-friendly': 'familyFriendly',
  'vegetarian': 'vegetarianOptions',
  'wheelchair': 'wheelchairAccessible',
  'free-parking': 'parking',
}

export const FEATURE_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(FEATURE_META.map(f => [f.key, f]))
export const FEATURE_KEYS = new Set(FEATURE_META.map(f => f.key))

// Hours & quality / cuisine flags that aren't amenity-derived (computed from
// hours, rating, review count, or the restaurant name) but still need a
// color + label so a matched card can show which active filter it satisfies.
export const MISC_FLAG_META: ChipMeta[] = [
  { key: 'open-now', label: 'Open Now', emoji: '🟢', hex: '#16a34a' },
  { key: 'open-late', label: 'Open Late', emoji: '🌙', hex: '#6366f1' },
  { key: 'open-midnight', label: 'Past Midnight', emoji: '🌃', hex: '#4338ca' },
  { key: 'open-early', label: 'Open Early', emoji: '☕', hex: '#f59e0b' },
  { key: 'open-weekends', label: 'Open Weekends', emoji: '📆', hex: '#0ea5e9' },
  { key: 'top-rated', label: 'Top Rated', emoji: '⭐', hex: '#eab308' },
  { key: 'hidden-gems', label: 'Hidden Gem', emoji: '💎', hex: '#8b5cf6' },
  { key: 'new-ramen', label: 'New Spot', emoji: '🆕', hex: '#ec4899' },
  { key: 'ramen-sushi', label: 'Ramen + Sushi', emoji: '🍣', hex: '#0891b2' },
  { key: 'fish-ramen', label: 'Fish Ramen', emoji: '🐟', hex: '#0369a1' },
  { key: 'korean-style', label: 'Korean-Style', emoji: '🌶', hex: '#dc2626' },
  { key: 'japanese-fusion', label: 'Japanese Fusion', emoji: '🔀', hex: '#7c3aed' },
  { key: 'halal', label: 'Halal-Friendly', emoji: '☪️', hex: '#15803d' },
  { key: 'gluten-free', label: 'Gluten-Free', emoji: '🌾', hex: '#a16207' },
  { key: 'hanabi', label: 'Hanabi', emoji: '🎆', hex: '#db2777' },
  { key: 'shokku', label: 'Shokku', emoji: '⚡', hex: '#ca8a04' },
]

export const MISC_FLAG_BY_KEY: Record<string, ChipMeta> = Object.fromEntries(MISC_FLAG_META.map(f => [f.key, f]))

// A single active-filter badge rendered on a listing card / map popup —
// tells the user which filter(s) this specific result matched.
export type MatchedChip = { label: string; emoji: string; hex: string }

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
  amenities?: string[]    // active FEATURE_META keys (delivers, outdoor-seating, …)
  website?: string        // restaurant's own website (DB entries only)
  googleMapsUrl?: string  // set for Places-supplement entries (no internal page)
  googleMapsLink?: string // set for DB entries (links to the verified listing)
  reviewSlug?: string     // globally-unique /reviews/{slug} page (DB entries only)
  featured?: boolean      // promoted listing — pinned first with a Featured badge
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
