// SERVER-ONLY. Which programmatic pages are too thin to index.
//
// Thin pages stay built and live (no 404s, no redirects); they just get
// <meta name="robots" content="noindex, follow"> and are left out of the
// sitemaps, so Google stops ranking a large block of near-empty directory
// pages in and out (the Sep–Nov 2026 Search Console impression swings).
//
// Rules (data-based, evaluated at build time):
//   - /find/{city}-{st} and /find/pho-restaurants-{city}-{st}: fewer than
//     MIN_FIND_LISTINGS restaurants on the page.
//   - /find/{modifier}-{city}-{st}: fewer than MIN_FIND_LISTINGS matching
//     restaurants, or the modifier applies no filter at all (e.g.
//     ramen-spots-near-me-in-*, ramen-shop-in-*), so the page lists exactly
//     the same restaurants as /find/{city}-{st} — a near-duplicate.
//   - Dataset listings (/{city}/{state}/{slug}): permanently closed, or no
//     description and (no rating, fewer than MIN_LISTING_REVIEWS reviews, or
//     no photo).
// Exception: any page in lib/google-traffic-keep.json (earned meaningful
// Google traffic in Vercel Web Analytics) stays indexable regardless.
import keep from './google-traffic-keep.json'
import type { Restaurant } from './restaurants'
import { getRestaurantsByCity } from './restaurants'
import { getSupplementListings } from './places-supplements'
import { resolveFindCity } from './find-city'
import { matchModifier, type ModifierFilter } from './find-modifiers'
import { restaurantMatchesModifier } from './modifier-match'
import { matchNeighborhood, getNeighborhoodRestaurants } from './neighborhoods'
import { matchPhoCity } from './pho'

export const MIN_FIND_LISTINGS = 3
export const MIN_LISTING_REVIEWS = 20

/** Metadata `robots` value for a thin page. */
export const NOINDEX_ROBOTS = { index: false, follow: true } as const

const KEEP = new Set<string>(keep.paths)

function isUnfiltered(f: ModifierFilter): boolean {
  return !f.initialFlags?.length && !f.initialBowls?.length && !f.initialPrices?.length && !f.initialQuery
}

function computeFindThin(param: string): boolean {
  const pho = matchPhoCity(param)
  if (pho) return pho.listings.length < MIN_FIND_LISTINGS
  const hood = matchNeighborhood(param)
  if (hood) return getNeighborhoodRestaurants(hood).length < MIN_FIND_LISTINGS
  const mod = matchModifier(param)
  if (mod) {
    const city = resolveFindCity(mod.rest)
    if (!city || !city.known) return false
    if (isUnfiltered(mod.modifier.filter)) return true
    const db = getRestaurantsByCity(city.citySlug, city.stateSlug).filter(r => restaurantMatchesModifier(r, mod.modifier.filter))
    const count = db.length > 0 ? db.length : getSupplementListings(city.citySlug, city.stateCode).length
    return count < MIN_FIND_LISTINGS
  }
  const city = resolveFindCity(param)
  if (!city || !city.known) return false
  const db = getRestaurantsByCity(city.citySlug, city.stateSlug)
  const count = db.length > 0 ? db.length : getSupplementListings(city.citySlug, city.stateCode).length
  return count < MIN_FIND_LISTINGS
}

const findCache = new Map<string, boolean>()

/** Whether /find/{param} (a /find/[cityState] page) should be noindexed. */
export function isThinFindPage(param: string): boolean {
  let v = findCache.get(param)
  if (v === undefined) {
    v = !KEEP.has(`/find/${param}`) && computeFindThin(param)
    findCache.set(param, v)
  }
  return v
}

/** Whether a dataset listing page should be noindexed. */
export function isThinListing(r: Restaurant): boolean {
  if (KEEP.has(`/${r.citySlug}/${r.stateSlug}/${r.slug}`)) return false
  if (r.businessStatus === 'CLOSED_PERMANENTLY') return true
  const hasDescription = !!r.description?.trim()
  if (hasDescription) return false
  return r.rating == null || (r.reviewCount ?? 0) < MIN_LISTING_REVIEWS || !r.photo
}
