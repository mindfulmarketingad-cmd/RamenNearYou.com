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
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
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
    if (!sup) notFound()
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

  // Apply owner-submitted overrides.
  const sb = await createClient()
  if (sb) {
    const { data: ov } = await sb
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

  // Claim/verification status — every restaurant checks this, not just one
  // hardcoded listing, so the page knows whether it's already claimed and,
  // if so, whether the current visitor owns it.
  let isVerified = false
  let isOwner = false
  let canSelfLink = false
  const claimsClient = createAdminClient() ?? sb
  if (claimsClient) {
    const { data: claim } = await claimsClient
      .from('claims')
      .select('id, user_id, contact_email')
      .eq('restaurant_slug', r2.slug)
      .eq('status', 'approved')
      .maybeSingle()
    isVerified = !!claim

    if (claim && sb) {
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        if (user.id === claim.user_id) {
          isOwner = true
        } else if (
          claim.contact_email &&
          claim.contact_email.toLowerCase() === user.email?.toLowerCase()
        ) {
          canSelfLink = true
        }
      }
    }
  }

  return (
    <RestaurantListingPage
      r={r2}
      city={city}
      state={state}
      nearby={nearbyListings}
      isVerified={isVerified}
      isOwner={isOwner}
      canSelfLink={canSelfLink}
    />
  )
}
