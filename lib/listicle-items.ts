// Shared adapters that turn the site's various restaurant shapes (DB
// restaurants, Google Places supplements) into the generic ListicleItem
// shape components/pseo-listicle.tsx renders. Kept server-side since
// getOpenStatus/getTodayHoursLabel just need plain data, no client APIs.
import type { Restaurant } from './restaurants'
import type { PlacesRestaurant } from './places-supplements'
import type { PhoRestaurant } from './pho'
import type { ListicleItem, ListicleTag } from '@/components/pseo-listicle'
import { getOpenStatus, getTodayHoursLabel } from './hours'
import { FEATURE_META, FEATURE_AMENITY_FIELD } from './ramen-taxonomy'
import { STATE_CODE_TO_SLUG } from './state-lookups'
import { getReviewSlug, hasReviewPage } from './reviews'

// City/state/neighborhood listicles are naturally bounded (California's 319
// is the kind of number these top out at) and render in full. The nationwide
// pages are not: an unfiltered one like /find/ramen-restaurants matches all
// ~7,900 rows, which prerendered to a 76MB HTML file per page and blew past
// the deploy size limit. This caps only those — still far more scrolling than
// anyone does in one sitting, at ~1/30th the page weight.
export const NATIONWIDE_LISTICLE_CAP = 250

/**
 * Picks the capped sample a nationwide listicle ships, guaranteeing every
 * state with a match is represented.
 *
 * Taking a straight top-250-by-rating skews hard to a handful of big states
 * (on /find/ramen-free-parking it covered just 25 of ~50), which makes the
 * page's state filter useless for the rest. This instead round-robins across
 * states — best remaining from each in turn — so every state gets a slot
 * before any state gets a second, then returns the selection re-sorted by
 * rating so the page still reads as a ranked list.
 */
export function pickNationwideSample<T>(
  ranked: T[],
  opts: { cap?: number; stateOf?: (r: T) => string } = {},
): T[] {
  const cap = opts.cap ?? NATIONWIDE_LISTICLE_CAP
  const stateOf = opts.stateOf ?? ((r: T) => (r as { stateCode?: string }).stateCode ?? '')
  if (ranked.length <= cap) return ranked

  const byState = new Map<string, T[]>()
  for (const r of ranked) {
    const key = stateOf(r)
    const bucket = byState.get(key)
    if (bucket) bucket.push(r)
    else byState.set(key, [r])
  }

  const queues = Array.from(byState.values())
  const picked: T[] = []
  let round = 0
  while (picked.length < cap) {
    let tookAny = false
    for (const q of queues) {
      if (round >= q.length) continue
      picked.push(q[round])
      tookAny = true
      if (picked.length >= cap) break
    }
    if (!tookAny) break
    round++
  }

  // `ranked` is already in rating order, so preserving that order across the
  // selection keeps the list ranked without re-reading rating fields.
  const chosen = new Set(picked)
  return ranked.filter(r => chosen.has(r))
}

// Feature key → the /find page that filters to exactly that feature, so a
// listicle card's chip is a real internal link rather than inert text.
const FEATURE_FIND_HREF: Record<string, string> = {
  'delivers': '/find/ramen-delivery',
  'takeout': '/find/ramen-takeout',
  'outdoor-seating': '/find/ramen-outdoor-seating',
  'reservations': '/find/ramen-reservations',
  'full-bar': '/find/ramen-full-bar',
  'family-friendly': '/find/ramen-family-friendly',
  'vegetarian': '/find/vegetarian-ramen',
  'wheelchair': '/find/ramen-wheelchair-accessible',
  'free-parking': '/find/ramen-free-parking',
}

function cityHrefFor(citySlug: string, stateCode: string): string {
  return `/find/${citySlug}-${stateCode.toLowerCase()}`
}

function tagsFromAmenities(r: Restaurant): ListicleTag[] {
  const tags: ListicleTag[] = []
  for (const f of FEATURE_META) {
    const field = FEATURE_AMENITY_FIELD[f.key] as keyof Restaurant['amenities'] | undefined
    if (field && r.amenities?.[field]) tags.push({ label: f.label, href: FEATURE_FIND_HREF[f.key] })
  }
  if (r.priceRange) tags.push({ label: r.priceRange })
  return tags
}

function oneLinerDescription(r: Restaurant, rank: number): string {
  if (r.description && r.description.trim().length > 20) return r.description.trim()
  const ratingBit = r.rating ? ` rated ${r.rating.toFixed(1)} out of 5${r.reviewCount ? ` from ${r.reviewCount.toLocaleString()} reviews` : ''}` : ''
  if (rank === 0) return `${r.name}, out in ${r.city}, is our top pick${ratingBit ? ` —${ratingBit}` : ''}.`
  return `${r.name}, in ${r.city}, is next up${ratingBit ? `,${ratingBit}` : ''}.`
}

export function restaurantsToListicleItems(
  restaurants: Restaurant[],
  opts: { verifiedSlugs?: Set<string> } = {},
): ListicleItem[] {
  return restaurants.map((r, i) => {
    const status = getOpenStatus(r.hours)
    return {
      key: r.slug,
      href: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
      photo: r.photo,
      name: r.name,
      rating: r.rating,
      reviewCount: r.reviewCount,
      reviewHref: hasReviewPage(getReviewSlug(r)) ? `/reviews/${getReviewSlug(r)}` : null,
      locationLabel: `${r.city}, ${r.stateCode}`,
      cityHref: cityHrefFor(r.citySlug, r.stateCode),
      stateHref: `/${r.stateSlug}`,
      address: r.address || null,
      directionsUrl: r.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`,
      phone: r.phone || null,
      website: r.website || null,
      hoursLabel: r.hours ? (status?.status === 'closed' ? `Closed — ${getTodayHoursLabel(r.hours)}` : `Open today: ${getTodayHoursLabel(r.hours)}`) : 'Hours not listed — confirm directly before you go.',
      hoursOpen: status?.status === 'open' || status?.status === 'closing-soon',
      description: oneLinerDescription(r, i),
      tags: tagsFromAmenities(r),
      lat: r.latitude,
      lng: r.longitude,
      claimHref: `/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`,
      isClaimed: opts.verifiedSlugs?.has(r.slug) ?? false,
    }
  })
}

export function placesToListicleItems(
  listings: (PlacesRestaurant & { slug: string; citySlug: string; stateSlug: string; city: string; stateCode: string })[],
): ListicleItem[] {
  return listings.map((r, i) => ({
    key: r.placeId,
    href: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    photo: r.photo,
    name: r.name,
    rating: r.rating,
    reviewCount: r.reviewCount,
    locationLabel: `${r.city}, ${r.stateCode}`,
    cityHref: cityHrefFor(r.citySlug, r.stateCode),
    stateHref: `/${r.stateSlug}`,
    address: r.address || null,
    directionsUrl: r.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`,
    phone: null,
    website: null,
    hoursLabel: r.openNow == null ? 'Hours not listed — confirm directly before you go.' : r.openNow ? 'Open now' : 'Closed now',
    hoursOpen: r.openNow ?? null,
    description: i === 0
      ? `${r.name}, in ${r.city}, is our top pick${r.rating ? ` — rated ${r.rating.toFixed(1)} out of 5` : ''}.`
      : `${r.name}, in ${r.city}, is next up${r.rating ? `, rated ${r.rating.toFixed(1)} out of 5` : ''}.`,
    tags: r.priceLevel ? [{ label: '$'.repeat(r.priceLevel) }] : [],
    lat: r.latitude,
    lng: r.longitude,
    claimHref: `/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    isClaimed: false,
  }))
}

export function phoToListicleItems(listings: PhoRestaurant[]): ListicleItem[] {
  return listings.map((p, i) => {
    const status = getOpenStatus(p.hours)
    const stateSlug = STATE_CODE_TO_SLUG[p.stateCode] ?? p.stateCode.toLowerCase()
    return {
      key: p.slug,
      href: `/partners/${p.slug}`,
      photo: p.photo,
      name: p.name,
      rating: p.rating,
      reviewCount: p.reviewCount,
      locationLabel: `${p.city}, ${p.stateCode}`,
      cityHref: cityHrefFor(p.citySlug, p.stateCode),
      stateHref: `/${stateSlug}`,
      address: p.address || null,
      directionsUrl: p.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.city} ${p.stateCode}`)}`,
      phone: p.phone || null,
      website: p.website || null,
      hoursLabel: p.hours ? (status?.status === 'closed' ? `Closed — ${getTodayHoursLabel(p.hours)}` : `Open today: ${getTodayHoursLabel(p.hours)}`) : 'Hours not listed — confirm directly before you go.',
      hoursOpen: status?.status === 'open' || status?.status === 'closing-soon',
      description: p.description && p.description.trim().length > 20
        ? p.description.trim()
        : i === 0
          ? `${p.name}, in ${p.city}, is our top pho pick${p.rating ? ` — rated ${p.rating.toFixed(1)} out of 5` : ''}.`
          : `${p.name}, in ${p.city}, is next up${p.rating ? `, rated ${p.rating.toFixed(1)} out of 5` : ''}.`,
      tags: (p.reviewTags ?? []).slice(0, 3).map(label => ({ label })),
      lat: p.latitude,
      lng: p.longitude,
      claimHref: `/claim/${p.citySlug}/${p.stateCode.toLowerCase()}/${p.slug}`,
      isClaimed: p.verified,
    }
  })
}
