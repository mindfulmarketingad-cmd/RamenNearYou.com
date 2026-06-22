// SERVER-ONLY. Imports the heavy restaurants dataset, so this must never be
// imported by a client component. It precomputes the slim MapPoint records
// (with bowl/mood tags) that the homepage map fetches via /api/ramen-map.
import { restaurants, getBrothTypes, type Restaurant } from './restaurants'
import { isOpenLate } from './hours'
import { BOWL_META, MOOD_META, type MapPoint } from './ramen-taxonomy'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from './state-lookups'
import { getSupplementListings } from './places-supplements'
import capitalsRaw from './places-capital-supplements.json'
import majorCitiesRaw from './places-major-cities.json'

const allSupplements = {
  ...(capitalsRaw as Record<string, Array<{ placeId: string; name: string; latitude: number | null; longitude: number | null; rating: number | null; reviewCount: number; priceLevel: number | null; photo: string | null; googleMapsUrl: string }>>),
  ...(majorCitiesRaw as Record<string, Array<{ placeId: string; name: string; latitude: number | null; longitude: number | null; rating: number | null; reviewCount: number; priceLevel: number | null; photo: string | null; googleMapsUrl: string }>>),
}

function priceLevelToRange(level: number | null): string {
  if (level === 1) return '$'
  if (level === 2) return '$$'
  if (level === 3) return '$$$'
  if (level === 4) return '$$$$'
  return ''
}

function supplementMapPoints(): MapPoint[] {
  const points: MapPoint[] = []

  for (const key of Object.keys(allSupplements)) {
    const parts = key.split('-')
    if (parts.length < 2) continue
    const stateCode = parts[parts.length - 1].toUpperCase()
    const stateSlug = STATE_CODE_TO_SLUG[stateCode]
    if (!stateSlug) continue
    const citySlug = parts.slice(0, -1).join('-')

    // Use the shared listing builder so the slug matches the internal
    // detail-page URL (/{city}/{state}/{slug}) exactly.
    for (const l of getSupplementListings(citySlug, stateCode)) {
      if (!l.latitude || !l.longitude) continue
      points.push({
        name: l.name,
        slug: l.slug,
        citySlug: l.citySlug,
        stateSlug: l.stateSlug,
        city: l.city,
        stateCode: l.stateCode,
        zip: '',
        latitude: l.latitude,
        longitude: l.longitude,
        rating: l.rating,
        reviewCount: l.reviewCount ?? 0,
        priceRange: priceLevelToRange(l.priceLevel),
        photo: l.photo ?? '',
        hours: null,
        bowls: [],
        moods: [],
        googleMapsUrl: l.googleMapsUrl,
      })
    }
  }
  return points
}

function txt(r: Restaurant): string {
  return `${r.name} ${r.description ?? ''} ${r.subtypes ?? ''}`.toLowerCase()
}

function isUpscale(r: Restaurant): boolean {
  return r.priceRange === '$$$' || r.priceRange === '$$$$' || !!r.amenities?.trendy
}

// Bowl matchers, keyed to BOWL_META.
const BOWL_MATCH: Record<string, (r: Restaurant) => boolean> = {
  'tonkotsu': r => getBrothTypes(r).includes('Tonkotsu') || /tonkotsu|pork bone|hakata/.test(txt(r)),
  'spicy-miso': r => { const t = txt(r); return t.includes('spicy miso') || (t.includes('spicy') && t.includes('miso')) },
  'miso': r => getBrothTypes(r).includes('Miso') || /miso ramen|miso broth/.test(txt(r)),
  'shoyu': r => getBrothTypes(r).includes('Shoyu') || /shoyu|soy sauce broth/.test(txt(r)),
  'shio': r => /shio ramen|shio broth|salt broth|salt-based|sea salt broth/.test(txt(r)),
  'tsukemen': r => /tsukemen|dipping noodle|dipping ramen|dipping-style/.test(txt(r)),
  'mazemen': r => /mazemen|mazesoba|maze soba|abura\s?soba|brothless|soupless/.test(txt(r)),
  'chicken-paitan': r => /paitan|tori paitan|chicken paitan|torigara/.test(txt(r)),
  'black-garlic': r => /black garlic|mayu|garlic oil ramen/.test(txt(r)),
  'tantanmen': r => /tantanmen|tan tan|tan-tan|dan dan|sesame ramen/.test(txt(r)),
  'vegan': r => !!r.amenities?.veganOptions || /vegan ramen/.test(txt(r)),
}

// Mood matchers, keyed to MOOD_META.
const MOOD_MATCH: Record<string, (r: Restaurant) => boolean> = {
  'rich-creamy': r => getBrothTypes(r).includes('Tonkotsu') || /paitan|creamy|rich broth|velvety/.test(txt(r)),
  'light-clean': r => getBrothTypes(r).includes('Shoyu') || /shio|clear broth|light broth|delicate broth/.test(txt(r)),
  'extra-spicy': r => getBrothTypes(r).includes('Spicy'),
  'late-night': r => isOpenLate(r.hours, 22 * 60),
  'hangover': r => (getBrothTypes(r).includes('Tonkotsu') || getBrothTypes(r).includes('Spicy')) && isOpenLate(r.hours, 21 * 60),
  'quick-lunch': r => !!r.amenities?.takeout,
  'date-night': r => isUpscale(r) || !!r.amenities?.acceptsReservations,
}

export function computeMapData(): MapPoint[] {
  const dbPoints = restaurants
    .filter(r => r.latitude && r.longitude)
    .map(r => ({
      name: r.name,
      slug: r.slug,
      citySlug: r.citySlug,
      stateSlug: r.stateSlug,
      city: r.city,
      stateCode: r.stateCode,
      zip: r.postalCode ?? '',
      latitude: r.latitude,
      longitude: r.longitude,
      rating: r.rating,
      reviewCount: r.reviewCount ?? 0,
      priceRange: r.priceRange,
      photo: r.photo,
      hours: r.hours,
      bowls: BOWL_META.filter(b => BOWL_MATCH[b.key]?.(r)).map(b => b.key),
      moods: MOOD_META.filter(m => MOOD_MATCH[m.key]?.(r)).map(m => m.key),
      googleMapsLink: r.googleMapsLink || undefined,
    }))

  return [...dbPoints, ...supplementMapPoints()]
}
