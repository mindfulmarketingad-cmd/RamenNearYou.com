// Shared adapters that turn the site's various restaurant shapes (DB
// restaurants, Google Places supplements) into the generic ListicleItem
// shape components/pseo-listicle.tsx renders. Kept server-side since
// getOpenStatus/getTodayHoursLabel just need plain data, no client APIs.
import type { Restaurant } from './restaurants'
import type { PlacesRestaurant } from './places-supplements'
import type { PhoRestaurant } from './pho'
import type { ListicleItem } from '@/components/pseo-listicle'
import { getOpenStatus, getTodayHoursLabel } from './hours'
import { FEATURE_META, FEATURE_AMENITY_FIELD } from './ramen-taxonomy'

function tagsFromAmenities(r: Restaurant): string[] {
  const tags: string[] = []
  for (const f of FEATURE_META) {
    const field = FEATURE_AMENITY_FIELD[f.key] as keyof Restaurant['amenities'] | undefined
    if (field && r.amenities?.[field]) tags.push(f.label)
  }
  if (r.priceRange) tags.push(r.priceRange)
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
      locationLabel: `${r.city}, ${r.stateCode}`,
      address: r.address || null,
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
    address: r.address || null,
    phone: null,
    website: null,
    hoursLabel: r.openNow == null ? 'Hours not listed — confirm directly before you go.' : r.openNow ? 'Open now' : 'Closed now',
    hoursOpen: r.openNow ?? null,
    description: i === 0
      ? `${r.name}, in ${r.city}, is our top pick${r.rating ? ` — rated ${r.rating.toFixed(1)} out of 5` : ''}.`
      : `${r.name}, in ${r.city}, is next up${r.rating ? `, rated ${r.rating.toFixed(1)} out of 5` : ''}.`,
    tags: r.priceLevel ? ['$'.repeat(r.priceLevel)] : [],
    lat: r.latitude,
    lng: r.longitude,
    claimHref: `/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    isClaimed: false,
  }))
}

export function phoToListicleItems(listings: PhoRestaurant[]): ListicleItem[] {
  return listings.map((p, i) => {
    const status = getOpenStatus(p.hours)
    return {
      key: p.slug,
      href: `/partners/${p.slug}`,
      photo: p.photo,
      name: p.name,
      rating: p.rating,
      reviewCount: p.reviewCount,
      locationLabel: `${p.city}, ${p.stateCode}`,
      address: p.address || null,
      phone: p.phone || null,
      website: p.website || null,
      hoursLabel: p.hours ? (status?.status === 'closed' ? `Closed — ${getTodayHoursLabel(p.hours)}` : `Open today: ${getTodayHoursLabel(p.hours)}`) : 'Hours not listed — confirm directly before you go.',
      hoursOpen: status?.status === 'open' || status?.status === 'closing-soon',
      description: p.description && p.description.trim().length > 20
        ? p.description.trim()
        : i === 0
          ? `${p.name}, in ${p.city}, is our top pho pick${p.rating ? ` — rated ${p.rating.toFixed(1)} out of 5` : ''}.`
          : `${p.name}, in ${p.city}, is next up${p.rating ? `, rated ${p.rating.toFixed(1)} out of 5` : ''}.`,
      tags: (p.reviewTags ?? []).slice(0, 3),
      lat: p.latitude,
      lng: p.longitude,
      claimHref: `/claim/${p.citySlug}/${p.stateCode.toLowerCase()}/${p.slug}`,
      isClaimed: p.verified,
    }
  })
}
