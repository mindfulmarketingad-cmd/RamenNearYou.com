import { notFound } from 'next/navigation'
import { getRestaurant, getRestaurantsByCity, type Restaurant } from '@/lib/restaurants'
import {
  findSupplementListing,
  getSupplementListings,
  getSupplementStateName,
  supplementToRestaurant,
} from '@/lib/places-supplements'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'
import RestaurantListingPage from '@/components/restaurant-listing-page'
import { createAdminClient } from '@/lib/supabase-admin'
import { getApprovedListing, approvedListingToRestaurant } from '@/lib/approved-listings'
import CityFilterPage from '@/components/city-filter-page'
import {
  parseFilterSlug,
  getMajorCity,
  getFilterRestaurants,
  getCityFilterStaticParams,
  filterTitle,
  filterDescription,
} from '@/lib/city-filter-pages'

export const dynamicParams = true
// ISR: these ~12k listing pages are the site's most important SEO surface,
// and they used to be force-dynamic (every visit paid a full server render
// plus 2-3 Supabase round-trips) because the render path read cookies for
// per-visitor owner status. That per-visitor state now resolves client-side
// (/api/owner/listing-status via useOwnerStatus), and the remaining Supabase
// reads (owner overrides, claim/verified status) are per-restaurant and go
// through the cookie-free admin client — so pages render once, cache at the
// CDN, and revalidate hourly.
export const revalidate = 3600

export async function generateStaticParams() {
  // Every restaurant (DB or Places-supplement) renders on demand via
  // dynamicParams — only the city × filter pages are pre-rendered here.
  return getCityFilterStaticParams()
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params

  // City × filter page metadata (e.g. /atlanta/georgia/tonkotsu-ramen)
  const spec = parseFilterSlug(restaurant)
  const cityInfo = spec ? getMajorCity(city, state) : null
  if (spec && cityInfo) {
    const matches = getFilterRestaurants(city, state, spec)
    if (matches.length > 0) {
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
    if (matches.length > 0) {
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
          nearby={getRestaurantsByCity(city, state).slice(0, 6)}
          isVerified={false}
        />
      )
    }
    const nearbyListings = getSupplementListings(city, sup.stateCode)
      .filter(n => n.slug !== sup.slug)
      .slice(0, 6)
      .map(supplementToRestaurant)
    return (
      <RestaurantListingPage
        r={supplementToRestaurant(sup)}
        city={city}
        state={state}
        nearby={nearbyListings}
      />
    )
  }
  const r2 = { ...dbr } as Restaurant

  // Per-restaurant Supabase reads go through the admin client (no cookies),
  // which is what lets this page stay statically cached. Per-visitor owner
  // status is resolved client-side instead.
  const admin = createAdminClient()

  // Apply owner-submitted overrides.
  if (admin) {
    const { data: ov } = await admin
      .from('restaurant_overrides')
      .select('description, phone, website, menu_link, hours')
      .eq('restaurant_slug', r2.slug)
      .maybeSingle()
    if (ov) {
      if (ov.description?.trim()) r2.description = ov.description
      if (ov.phone?.trim())       r2.phone       = ov.phone
      if (ov.website?.trim())     r2.website     = ov.website
      if (ov.menu_link?.trim())   r2.menuLink    = ov.menu_link
      if (ov.hours && Object.keys(ov.hours).length > 0) r2.hours = ov.hours
    }
  }

  const nearbyListings = getRestaurantsByCity(city, state)
    .filter(n => n.slug !== r2.slug)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)

  // Claim/verification status — per-restaurant, so it caches with the page.
  let isVerified = false
  if (admin) {
    const { data: claim } = await admin
      .from('claims')
      .select('id')
      .eq('restaurant_slug', r2.slug)
      .eq('status', 'approved')
      .maybeSingle()
    isVerified = !!claim
  }

  return (
    <RestaurantListingPage
      r={r2}
      city={city}
      state={state}
      nearby={nearbyListings}
      isVerified={isVerified}
    />
  )
}
