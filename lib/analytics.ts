// SERVER-ONLY. Imports the restaurant/pho datasets to resolve a URL path to
// a real listing, so this must never be pulled into a client bundle — the
// browser side lives in lib/analytics-client.ts.
import { getRestaurant } from './restaurants'
import { getPhoBySlug } from './pho'
import { getMiscPartnerBySlug } from './misc-partners'
import { STATE_SLUG_TO_CODE } from './state-lookups'

// Re-exported from the client-safe module so server code has one import.
export { ANALYTICS_TABLE } from './analytics-table'

export const ANALYTICS_EVENTS = [
  'pageview',
  'listing_view',
  'call_click',
  'directions_click',
  'search',
  'review_click',
] as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number]

export function isAnalyticsEvent(v: unknown): v is AnalyticsEvent {
  return typeof v === 'string' && (ANALYTICS_EVENTS as readonly string[]).includes(v)
}

/** The events that represent a visitor trying to reach a business, as
 *  opposed to just browsing. Drives the "Lead Actions" stat. */
export const LEAD_ACTION_EVENTS: AnalyticsEvent[] = ['call_click', 'directions_click', 'review_click']

export type ClassifiedListing = {
  listingSlug: string
  listingName: string
  city: string
}

/**
 * Maps a URL path to the listing it represents, or null if the path isn't a
 * business detail page.
 *
 * This site has two detail-page shapes:
 *   /{citySlug}/{stateSlug}/{slug}  — ramen restaurants
 *   /partners/{slug}                — pho listings and misc partners
 *
 * The three-segment shape is also used by the city x filter pages
 * (/chicago/illinois/vegan-ramen), so resolution goes through the real data
 * module — a filter slug simply finds no restaurant and returns null rather
 * than being logged as a phantom listing.
 */
export function classifyListingPath(path: string): ClassifiedListing | null {
  if (!path) return null
  const clean = path.split('?')[0].split('#')[0]
  const parts = clean.split('/').filter(Boolean)

  if (parts.length === 2 && parts[0] === 'partners') {
    const slug = parts[1]
    const pho = getPhoBySlug(slug)
    if (pho) return { listingSlug: pho.slug, listingName: pho.name, city: `${pho.city}, ${pho.stateCode}` }
    const misc = getMiscPartnerBySlug(slug)
    if (misc) return { listingSlug: misc.slug, listingName: misc.name, city: `${misc.city}, ${misc.stateCode}` }
    return null
  }

  if (parts.length === 3) {
    const [citySlug, stateSlug, slug] = parts
    const r = getRestaurant(citySlug, stateSlug, slug)
    if (r) return { listingSlug: r.slug, listingName: r.name, city: `${r.city}, ${r.stateCode}` }
    // Google Places supplement listings live at the same URL shape but have
    // no DB row; fall back to a readable name from the slug so their traffic
    // still shows up per-business instead of vanishing into pageviews.
    const stateCode = STATE_SLUG_TO_CODE[stateSlug]
    if (stateCode && !isReservedThirdSegment(slug)) {
      return {
        listingSlug: slug,
        listingName: titleCase(slug),
        city: `${titleCase(citySlug)}, ${stateCode}`,
      }
    }
  }

  return null
}

// Third segments that are city x filter pages rather than restaurants.
const RESERVED_THIRD_SEGMENTS = new Set([
  'vegan-ramen', 'vegetarian-ramen', 'healthy-ramen',
  'tonkotsu-ramen', 'shoyu-ramen', 'miso-ramen', 'spicy-ramen',
  'tonkotsu-ramen-for-diabetics', 'shoyu-ramen-for-diabetics',
  'miso-ramen-for-diabetics', 'spicy-ramen-for-diabetics',
])

function isReservedThirdSegment(slug: string): boolean {
  return RESERVED_THIRD_SEGMENTS.has(slug)
}

function titleCase(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
