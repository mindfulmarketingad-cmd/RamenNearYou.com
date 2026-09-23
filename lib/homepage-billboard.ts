import { getRestaurantBySlug, type Restaurant } from './restaurants'

// The homepage billboard: one full-bleed hero at the top of the site that a
// restaurant pays to occupy. It rotates between however many slots are sold,
// and the empty-slot count below is what the "Use This Space" bar advertises.

/** Total slots the billboard rotates between when it is fully sold. */
export const BILLBOARD_SLOTS = 5

export const BILLBOARD_PRICE = '$99'
export const BILLBOARD_PERIOD = 'month'
export const BILLBOARD_CHECKOUT_URL = 'https://buy.stripe.com/5kQ8wQciu9oYd6SdFYfrW0n'

type OccupiedSlot = {
  slug: string
  /**
   * Overrides the restaurant's dataset photo. A subscriber supplying their own
   * shot is the normal case — the Google Places photo is only a stand-in, and
   * it is cropped for a card, not for a full-bleed hero.
   */
  image?: string
}

/**
 * Who currently occupies the billboard, in display order.
 *
 * Kept as a hand-edited list rather than read from `featured_listings` on
 * purpose: the homepage is statically rendered, and a DB read here would make
 * every homepage request dynamic. Adding an entry plus a deploy is the whole
 * fulfilment step when someone subscribes.
 */
const OCCUPIED: OccupiedSlot[] = [
  {
    slug: 'shibuya-ramen-atlanta',
    image: '/images/featured-shibuya-ramen-atlanta.webp',
  },
]

export type BillboardSlot = {
  slug: string
  name: string
  city: string
  stateCode: string
  photo: string
  /** The business's own page on this site. */
  listingUrl: string
  directionsUrl: string
  /** Where the second CTA points — their site when we have one, ours if not. */
  orderUrl: string
  /** False when orderUrl is our own listing page, so the link stays internal. */
  orderIsExternal: boolean
  /**
   * "Order Now" is only honest when we hold a real ordering link. A general
   * website gets "View Menu & Hours", which is what that click actually does.
   */
  orderLabel: 'Order Now' | 'View Menu & Hours'
}

/** First usable http(s) URL out of a field that may hold several, comma or space separated. */
function firstUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  for (const part of raw.split(/[\s,]+/)) {
    const v = part.trim()
    if (/^https?:\/\//i.test(v)) return v
  }
  return null
}

function buildDirectionsUrl(r: Restaurant): string {
  // Address-based destinations are the most reliable across devices; the place
  // id, when we have one, pins it to the exact business rather than a
  // same-named neighbour.
  const destination = r.address || `${r.name} ${r.city} ${r.stateCode}`
  const base = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
  return r.placeId ? `${base}&destination_place_id=${encodeURIComponent(r.placeId)}` : base
}

function toSlot(r: Restaurant, override?: OccupiedSlot): BillboardSlot {
  const listingUrl = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
  const orderLink = firstUrl(r.orderLinks)
  const site = firstUrl(r.website)
  const external = orderLink ?? site

  return {
    slug: r.slug,
    name: r.name,
    city: r.city,
    stateCode: r.stateCode,
    photo: override?.image ?? r.photo,
    listingUrl,
    directionsUrl: buildDirectionsUrl(r),
    orderUrl: external ?? listingUrl,
    orderIsExternal: external !== null,
    orderLabel: orderLink ? 'Order Now' : 'View Menu & Hours',
  }
}

/** The filled slots, in order. Unknown slugs are skipped rather than rendered blank. */
export function getBillboardSlots(): BillboardSlot[] {
  const out: BillboardSlot[] = []
  for (const entry of OCCUPIED) {
    const r = getRestaurantBySlug(entry.slug)
    // A photo is the whole billboard — a slot without one would render as a
    // grey box, so it is better left out until the image is sorted.
    if (r && (entry.image || r.photo)) out.push(toSlot(r, entry))
  }
  return out
}

/** Never negative, so overselling the list can't print "-1 spots left". */
export function billboardSpotsLeft(filled: number): number {
  return Math.max(0, BILLBOARD_SLOTS - filled)
}
