import { revalidatePath } from 'next/cache'
import { isExactPath } from './revalidate-guard'
import { getReviewSlug, hasReviewPage } from './reviews'
import { getFindCityParams } from './find-city'
import { approvedListingToRestaurant, type ApprovedListingRow } from './approved-listings'
import type { Restaurant } from './restaurants'

// Every on-demand purge on the site goes through here, so there is one place
// that says which pages a given change touches — and it only ever names single
// pages. The long time-based windows on the listing and review pages are safe
// because of this file: a content change purges the exact pages that show it
// instead of waiting out the timer.
//
// Why paths and not tags: a page can't be tagged directly, only the data it
// reads can, which would mean moving every Supabase read behind a cache
// wrapper. A concrete-path purge reaches the same two or three pages with none
// of that, and cannot be widened by a typo the way a shared tag can.

/** The map payload bakes in each pin's `featured` and `claimed` flags. */
export const RAMEN_MAP_PATH = '/api/ramen-map'

/**
 * Purges one cache entry. Never passes revalidatePath's second argument:
 * 'layout' would purge everything beneath the layout, and a pattern path needs
 * 'page' and then purges every match. Failures are logged — and only
 * failures, since a success is the expected case and not worth an event — so a
 * broken purge is visible instead of leaving a page stale for the whole window.
 */
export function purge(path: string, why: string): boolean {
  if (!isExactPath(path)) {
    console.error(`[revalidate] refused non-exact path ${JSON.stringify(path)} (${why})`)
    return false
  }
  try {
    revalidatePath(path)
    return true
  } catch (err) {
    console.error(`[revalidate] failed to purge ${path} (${why}):`, err)
    return false
  }
}

export function listingPath(r: Pick<Restaurant, 'citySlug' | 'stateSlug' | 'slug'>): string {
  return `/${r.citySlug}/${r.stateSlug}/${r.slug}`
}

/** Null when this restaurant has no review page. */
export function reviewsPath(r: Restaurant): string | null {
  const slug = getReviewSlug(r)
  return hasReviewPage(slug) ? `/reviews/${slug}` : null
}

let _findCities: Set<string> | null = null
/** Null when this restaurant's city has no dedicated /find page. */
export function findCityPath(r: Restaurant): string | null {
  _findCities ??= new Set(getFindCityParams().map((p) => p.cityState))
  const param = `${r.citySlug}-${r.stateCode.toLowerCase()}`
  return _findCities.has(param) ? `/find/${param}` : null
}

/** An owner's edits to their own listing (hours, phone, description…) went live. */
export function revalidateRestaurantContent(r: Restaurant): void {
  purge(listingPath(r), 'listing content changed')
}

/**
 * A claim for this restaurant was approved, rejected or manually registered, so
 * its Verified state changed. That shows on its own listing and review pages,
 * on its city's /find page, and as a gold pin in the map payload — four pages,
 * all named exactly.
 *
 * The ~100 nationwide /find/* pages, /partners and the homepage showcase also
 * read the claimed set but are deliberately not purged here: reaching them
 * means invalidating all of them for one restaurant's change. They pick it up
 * on the next deploy.
 */
export function revalidateRestaurantClaim(r: Restaurant): void {
  purge(listingPath(r), 'claim changed')
  const reviews = reviewsPath(r)
  if (reviews) purge(reviews, 'claim changed')
  const city = findCityPath(r)
  if (city) purge(city, 'claim changed')
  purge(RAMEN_MAP_PATH, 'claim changed')
}

/** Featured listings started or stopped, which changes pins in the map payload. */
export function revalidateRamenMap(why: string): void {
  purge(RAMEN_MAP_PATH, why)
}

/**
 * An owner-submitted listing was approved or rejected. Its page either now
 * exists or must stop existing, and it is the only page that reflects that.
 * Without this the page's old answer — including a cached 404 — would outlive
 * the decision for the length of the revalidate window.
 */
export function revalidateApprovedListing(row: ApprovedListingRow): void {
  purge(listingPath(approvedListingToRestaurant(row)), 'owner-submitted listing reviewed')
}
