// SERVER-ONLY. Programmatic "5 Best Ramen Restaurants in {City}, {State}"
// listicle pages, rendered through the /blog/[slug] catch-all (see
// CITY_LISTICLE_PREFIX matching in app/blog/[slug]/page.tsx). Unlike the
// hand-authored top-10 listicles already in blog-posts.ts, these are
// generated straight from restaurants.ts for any city with 5+ ramen
// listings — cities with fewer are simply never given a page (no
// generateStaticParams entry, so the URL 404s rather than existing thin).
import { getCities, getRestaurantsByCity, type Restaurant } from './restaurants'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from './state-lookups'
import { parseCityState } from './find-city'
import { getPhoByCity, getPhoCities, phoRestaurants, type PhoRestaurant } from './pho'

export const CITY_LISTICLE_PREFIX = 'best-ramen-restaurants-'
export const CITY_PHO_LISTICLE_PREFIX = 'best-pho-restaurants-'
const MIN_RESTAURANTS = 5

export function cityListicleParam(citySlug: string, stateCode: string): string {
  return `${CITY_LISTICLE_PREFIX}${citySlug}-${stateCode.toLowerCase()}`
}

/** Every city/state combo with enough real listings to support a top-5 page. */
export function getCityListicleParams(): string[] {
  return getCities()
    .filter(c => getRestaurantsByCity(c.citySlug, c.stateSlug).length >= MIN_RESTAURANTS)
    .map(c => cityListicleParam(c.citySlug, c.stateCode))
}

/** Same qualifying cities as getCityListicleParams(), with a display label and
 *  restaurant count, sorted by count — used for the /blog hub's browse list
 *  and search index. */
export function getCityListicleEntries(): Array<{ href: string; label: string; count: number }> {
  return getCities()
    .map(c => ({ c, count: getRestaurantsByCity(c.citySlug, c.stateSlug).length }))
    .filter(({ count }) => count >= MIN_RESTAURANTS)
    .map(({ c, count }) => ({
      href: `/blog/${cityListicleParam(c.citySlug, c.stateCode)}`,
      label: `5 Best Ramen Restaurants in ${c.city}, ${c.stateCode}`,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

export type CityListicle = {
  citySlug: string
  stateSlug: string
  stateCode: string
  cityName: string
  stateName: string
  top5: Restaurant[]
  totalCount: number
  hasPho: boolean
}

/** Resolves a full blog slug (e.g. "best-ramen-restaurants-atlanta-ga") to its
 *  city data, or null if the prefix doesn't match or the city doesn't qualify. */
export function matchCityListicle(slug: string): CityListicle | null {
  if (!slug.startsWith(CITY_LISTICLE_PREFIX)) return null
  const parsed = parseCityState(slug.slice(CITY_LISTICLE_PREFIX.length))
  if (!parsed) return null
  const { citySlug, stateCode } = parsed

  // Resolve stateSlug from the dataset rather than assuming the canonical
  // "hawaii"-style slug. Hawaii's 289 rows are stored (and served) under the
  // two-letter "hi" instead, so deriving it from STATE_CODE_TO_SLUG looked up
  // a city that doesn't exist and 404'd a page we'd already listed and
  // sitemapped.
  const known = getCities().find(c => c.citySlug === citySlug && c.stateCode === stateCode)
  const stateSlug = known?.stateSlug ?? STATE_CODE_TO_SLUG[stateCode]
  if (!stateSlug) return null

  const all = getRestaurantsByCity(citySlug, stateSlug)
  if (all.length < MIN_RESTAURANTS) return null

  const top5 = [...all]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 5)

  return {
    citySlug,
    stateSlug,
    stateCode,
    cityName: top5[0].city,
    stateName: STATE_CODE_TO_NAME[stateCode] ?? stateCode,
    top5,
    totalCount: all.length,
    hasPho: getPhoByCity(citySlug, stateCode).length > 0,
  }
}

// ─── Pho version — same shape and rules, sourced from the pho dataset ──────

export function cityPhoListicleParam(citySlug: string, stateCode: string): string {
  return `${CITY_PHO_LISTICLE_PREFIX}${citySlug}-${stateCode.toLowerCase()}`
}

export function getCityPhoListicleParams(): string[] {
  return getPhoCities()
    .filter(c => c.count >= MIN_RESTAURANTS)
    .map(c => cityPhoListicleParam(c.citySlug, c.stateCode))
}

export function getCityPhoListicleEntries(): Array<{ href: string; label: string; count: number }> {
  return getPhoCities()
    .filter(c => c.count >= MIN_RESTAURANTS)
    .map(c => ({
      href: `/blog/${cityPhoListicleParam(c.citySlug, c.stateCode)}`,
      label: `5 Best Pho Restaurants in ${c.city}, ${c.stateCode}`,
      count: c.count,
    }))
    .sort((a, b) => b.count - a.count)
}

export type CityPhoListicle = {
  citySlug: string
  stateSlug: string
  stateCode: string
  cityName: string
  stateName: string
  top5: PhoRestaurant[]
  totalCount: number
}

export function matchCityPhoListicle(slug: string): CityPhoListicle | null {
  if (!slug.startsWith(CITY_PHO_LISTICLE_PREFIX)) return null
  const parsed = parseCityState(slug.slice(CITY_PHO_LISTICLE_PREFIX.length))
  if (!parsed) return null
  const { citySlug, stateCode } = parsed
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  if (!stateSlug) return null

  const all = phoRestaurants.filter(p => p.citySlug === citySlug && p.stateCode === stateCode)
  if (all.length < MIN_RESTAURANTS) return null

  const top5 = [...all]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 5)

  return {
    citySlug,
    stateSlug,
    stateCode,
    cityName: top5[0].city,
    stateName: STATE_CODE_TO_NAME[stateCode] ?? stateCode,
    top5,
    totalCount: all.length,
  }
}
