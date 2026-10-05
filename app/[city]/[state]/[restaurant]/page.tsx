import { notFound } from 'next/navigation'
import { getRestaurant, getRestaurantsByCity, restaurants, type Restaurant } from '@/lib/restaurants'
import {
  findSupplementListing,
  getSupplementListings,
  getSupplementListingParams,
  getSupplementStateName,
  supplementToRestaurant,
} from '@/lib/places-supplements'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'
import RestaurantListingPage from '@/components/restaurant-listing-page'
import { createAdminClient } from '@/lib/supabase-admin'
import { getApprovedListing, getAllApprovedListings, approvedListingToRestaurant } from '@/lib/approved-listings'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'
import CityFilterPage from '@/components/city-filter-page'
import { getListingMonthlyViews } from '@/lib/listing-stats'
import { isRetiredPage } from '@/lib/retired-pages'
import {
  parseFilterSlug,
  getMajorCity,
  getFilterRestaurants,
  getCityFilterStaticParams,
  MIN_FILTER_MATCHES,
  filterTitle,
  filterDescription,
} from '@/lib/city-filter-pages'

// Hand-placed verified overrides — confirmed claimed outside the DB-driven
// claims flow, so the badge/ad-removal don't depend on that lookup at all.
const MANUALLY_VERIFIED_SLUGS = new Set(['momonoki', 'ikedo-ramen'])

// Build-only. Every listing page is generated during `next build` and served
// as a static file until the next deploy: no revalidate window, no on-demand
// purges, and dynamicParams = false so a URL that wasn't built is a plain 404
// rather than a render. That means owner edits, claim approvals and approved
// owner-submitted listings all go live on the next deploy.
//
// The build list below must cover exactly what the page accepts — anything it
// misses is now a 404 rather than a render — so it walks the same four sources
// in the same order as the page: city x filter pages, dataset restaurants,
// Places supplement listings, then approved owner-submitted listings.
//
// Pages retired for zero search impressions (lib/retired-pages.ts) are left
// out; proxy.ts redirects them to the city page before they'd reach here.
// Owner-submitted listings are never retired.
export const dynamicParams = false

export async function generateStaticParams() {
  const seen = new Set<string>()
  const params: Array<{ city: string; state: string; restaurant: string }> = []
  const add = (city: string, state: string, restaurant: string, retirable = true) => {
    const key = `${city}/${state}/${restaurant}`
    if (seen.has(key)) return
    seen.add(key)
    if (retirable && isRetiredPage(`/${key}`)) return
    params.push({ city, state, restaurant })
  }

  for (const p of getCityFilterStaticParams()) add(p.city, p.state, p.restaurant)
  for (const r of restaurants) add(r.citySlug, r.stateSlug, r.slug)
  for (const p of getSupplementListingParams()) add(p.city, p.state, p.restaurant)
  for (const row of await getAllApprovedListings()) {
    const r = approvedListingToRestaurant(row)
    add(r.citySlug, r.stateSlug, r.slug, false)
  }
  return params
}

const isLiveListing = (r: Restaurant) => !isRetiredPage(`/${r.citySlug}/${r.stateSlug}/${r.slug}`)

// Owner overrides, loaded once per build worker rather than once per page —
// with every listing built at deploy time, a per-page query would be ~8k
// round trips per build for a table that holds a handful of rows.
type OverrideRow = {
  restaurant_slug: string
  description: string | null
  phone: string | null
  website: string | null
  menu_link: string | null
  hours: Record<string, string[]> | null
}
let _overrides: Promise<Map<string, OverrideRow>> | null = null
function getOverrides(): Promise<Map<string, OverrideRow>> {
  _overrides ??= (async () => {
    const admin = createAdminClient()
    if (!admin) return new Map()
    const { data, error } = await admin
      .from('restaurant_overrides')
      .select('restaurant_slug, description, phone, website, menu_link, hours')
    if (error || !data) {
      console.error('[listing page] overrides query failed, building without them:', error?.message)
      return new Map()
    }
    return new Map((data as OverrideRow[]).map((row) => [row.restaurant_slug, row]))
  })()
  return _overrides
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params

  // City × filter page metadata (e.g. /atlanta/georgia/tonkotsu-ramen)
  const spec = parseFilterSlug(restaurant)
  const cityInfo = spec ? getMajorCity(city, state) : null
  if (spec && cityInfo) {
    const matches = getFilterRestaurants(city, state, spec)
    if (matches.length >= MIN_FILTER_MATCHES) {
      const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`
      const title = filterTitle(spec, cityInfo.city, cityInfo.stateCode)
      const description = filterDescription(spec, cityInfo.city, cityInfo.stateCode, matches.length)
      return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url },
      }
    }
  }

  const r = getRestaurant(city, state, restaurant)
  if (!r) {
    // Owner-submitted (admin-approved) listing metadata
    const approved = await getApprovedListing(city, state, restaurant)
    if (approved) {
      const ar = approvedListingToRestaurant(approved)
      const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`
      const title = `${ar.name} - ${ar.city}, ${ar.stateCode}`
      const metaDesc = `${ar.name} in ${ar.city}, ${ar.state}. Hours, directions, menu, and reviews.`.slice(0, 160)
      return {
        title,
        description: metaDesc,
        alternates: { canonical: url },
        openGraph: { title, description: metaDesc, url },
      }
    }

    // Supplement (Google Places) listing metadata
    const sup = findSupplementListing(city, state, restaurant)
    if (sup) {
      const stateName = getSupplementStateName(state)
      const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`
      const parts: string[] = [`${sup.name} in ${sup.city}, ${stateName}.`]
      if (sup.rating && sup.reviewCount > 0) {
        parts.push(`Rated ${sup.rating.toFixed(1)}/5 from ${sup.reviewCount.toLocaleString()} reviews.`)
      }
      parts.push('Hours, directions, menu, and reviews.')
      const metaDesc = parts.join(' ').slice(0, 160)
      const title = `${sup.name} - ${sup.city}, ${sup.stateCode}`
      return {
        title,
        description: metaDesc,
        alternates: { canonical: url },
        openGraph: {
          title,
          description: metaDesc,
          url,
          images: sup.photo ? [{ url: sup.photo, alt: sup.name }] : [],
        },
      }
    }
    return {}
  }
  const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`

  const parts: string[] = [`${r.name}.`]
  if (r.address) parts.push(r.address + '.')
  if (r.phone) parts.push(r.phone + '.')
  if (r.rating && r.reviewCount > 0) {
    parts.push(`Rated ${r.rating.toFixed(1)}/5 from ${r.reviewCount.toLocaleString()} reviews.`)
  }
  const metaDesc = parts.join(' ').slice(0, 160)
  const title = `${r.name} - ${r.city}, ${r.state}`

  return {
    title,
    description: metaDesc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: metaDesc,
      url,
      images: r.photo ? [{ url: r.photo, alt: r.name }] : [],
    },
  }
}

export default async function RestaurantPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params

  // City × filter page (e.g. /atlanta/georgia/tonkotsu-ramen). Only major
  // cities get these; anything else falls through to restaurant lookup.
  const spec = parseFilterSlug(restaurant)
  const cityInfo = spec ? getMajorCity(city, state) : null
  if (spec && cityInfo) {
    const matches = getFilterRestaurants(city, state, spec)
    // Same bar as the build list and every place these pages are linked.
    if (matches.length >= MIN_FILTER_MATCHES) {
      return <CityFilterPage spec={spec} cityInfo={cityInfo} restaurants={matches} />
    }
    notFound()
  }

  const dbr = getRestaurant(city, state, restaurant)
  if (!dbr) {
    // Not a DB restaurant — check Google Places supplement listings. These
    // power map pins and cards too, and previously had no internal page at
    // all (they linked straight out to Google Maps instead). Adapted into
    // the same Restaurant shape so they render through the same
    // Google-Maps-style RestaurantListingPage as every other listing.
    const stateCode = STATE_SLUG_TO_CODE[state]
    const sup = stateCode ? findSupplementListing(city, state, restaurant) : null
    if (!sup) {
      // Owner-submitted restaurants approved at /admin/listings — these have
      // no static-data row but still deserve a working page at the same URL.
      const approved = await getApprovedListing(city, state, restaurant)
      if (!approved) notFound()
      return (
        <RestaurantListingPage
          r={approvedListingToRestaurant(approved)}
          city={city}
          state={state}
          nearby={getRestaurantsByCity(city, state).filter(isLiveListing).slice(0, 6)}
          isVerified={false}
          monthlyViews={await getListingMonthlyViews(restaurant)}
        />
      )
    }
    const nearbyListings = getSupplementListings(city, sup.stateCode)
      .filter(n => n.slug !== sup.slug)
      .map(supplementToRestaurant)
      .filter(isLiveListing)
      .slice(0, 6)
    return (
      <RestaurantListingPage
        r={supplementToRestaurant(sup)}
        city={city}
        state={state}
        nearby={nearbyListings}
        monthlyViews={await getListingMonthlyViews(sup.slug)}
      />
    )
  }
  const r2 = { ...dbr } as Restaurant

  // Per-visitor owner status is resolved client-side, so nothing here reads
  // cookies and the page can be built once for everyone.

  // Apply owner-submitted overrides.
  {
    const ov = (await getOverrides()).get(r2.slug)
    if (ov) {
      if (ov.description?.trim()) r2.description = ov.description
      if (ov.phone?.trim())       r2.phone       = ov.phone
      if (ov.website?.trim())     r2.website     = ov.website
      if (ov.menu_link?.trim())   r2.menuLink    = ov.menu_link
      if (ov.hours && Object.keys(ov.hours).length > 0) r2.hours = ov.hours
    }
  }

  const nearbyListings = getRestaurantsByCity(city, state)
    .filter(n => n.slug !== r2.slug && isLiveListing(n))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)

  // Claim/verification status, from the build-wide approved-claims set (one
  // query per worker). MANUALLY_VERIFIED_SLUGS covers listings confirmed
  // claimed outside the DB flow.
  const isVerified = MANUALLY_VERIFIED_SLUGS.has(r2.slug) || (await getAllVerifiedSlugs()).has(r2.slug)

  return (
    <RestaurantListingPage
      r={r2}
      city={city}
      state={state}
      nearby={nearbyListings}
      isVerified={isVerified}
      monthlyViews={isVerified ? null : await getListingMonthlyViews(r2.slug)}
    />
  )
}
