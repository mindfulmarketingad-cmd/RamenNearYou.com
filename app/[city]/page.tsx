import { notFound } from 'next/navigation'
import { getStates, getRestaurantsByState } from '@/lib/restaurants'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'
import {
  getSupplementCitiesByState,
  getSupplementOnlyStateSlugs,
  getSupplementStateName,
  getSupplementListings,
} from '@/lib/places-supplements'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BrothStyleLinks from '@/components/broth-style-links'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import PseoListicle from '@/components/pseo-listicle'
import { restaurantsToListicleItems, placesToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export async function generateStaticParams() {
  const dbStates = getStates()
  const dbStateSlugs = new Set(dbStates.map(s => s.stateSlug))
  const supplementSlugs = getSupplementOnlyStateSlugs(dbStateSlugs)
  return [
    ...dbStates.map((s) => ({ city: s.stateSlug })),
    ...supplementSlugs.map((slug) => ({ city: slug })),
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const stateSlug = city.toLowerCase()
  const allRestaurants = getRestaurantsByState(stateSlug)

  // Supplement-only state (no DB rows)
  if (!allRestaurants.length) {
    const supplementCities = getSupplementCitiesByState(stateSlug)
    if (!supplementCities.length) return {}
    const stateName = getSupplementStateName(stateSlug)
    const stateCode = STATE_SLUG_TO_CODE[stateSlug] ?? ''
    const total = supplementCities.reduce((s, c) => s + c.count, 0)
    return {
      title: `Best Ramen Restaurants in ${stateName} (${stateCode}) — Full Directory`,
      description: `Find the best ramen restaurants in ${stateName}. Browse ${total} top-rated spots across ${supplementCities.length} cities in ${stateCode}.`,
      alternates: { canonical: `https://www.ramennearyou.com/${stateSlug}` },
      openGraph: {
        title: `Best Ramen Restaurants in ${stateName} (${stateCode})`,
        description: `Find the best ramen restaurants in ${stateName} — ${total} locations across ${supplementCities.length} cities.`,
        url: `https://www.ramennearyou.com/${stateSlug}`,
      },
    }
  }

  const { state, stateCode } = allRestaurants[0]
  const cityCount = new Set(allRestaurants.map(r => r.citySlug)).size

  return {
    title: `Best Ramen Restaurants in ${state} (${stateCode}) — Full Directory`,
    description: `Find the best ramen restaurants in ${state}. Browse ${allRestaurants.length} top-rated spots across ${cityCount} cities in ${stateCode}.`,
    alternates: {
      canonical: `https://www.ramennearyou.com/${stateSlug}`,
    },
    openGraph: {
      title: `Best Ramen Restaurants in ${state} (${stateCode})`,
      description: `Find the best ramen restaurants in ${state} — ${allRestaurants.length} locations across ${cityCount} cities.`,
      url: `https://www.ramennearyou.com/${stateSlug}`,
    },
  }
}

export default async function StatePage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const stateSlug = city.toLowerCase()
  const allRestaurants = getRestaurantsByState(stateSlug)

  // Supplement-only state (no DB rows) — build page from Places supplement data
  if (!allRestaurants.length) {
    const supplementCities = getSupplementCitiesByState(stateSlug).filter(c => c.count >= 2).sort((a, b) => a.city.localeCompare(b.city))
    if (!supplementCities.length) notFound()

    const stateName = getSupplementStateName(stateSlug)
    const stateCode = STATE_SLUG_TO_CODE[stateSlug] ?? ''
    const total = supplementCities.reduce((s, c) => s + c.count, 0)
    const pageUrl = `https://www.ramennearyou.com/${stateSlug}`

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
        { '@type': 'ListItem', position: 2, name: `Best Ramen Restaurants in ${stateName}`, item: pageUrl },
      ],
    }

    // No DB rows for this state — pull every Google Places supplement listing
    // across its cities so the listicle is individual restaurants, same as
    // the DB-backed branch below, not just a city index.
    const allPlaces = supplementCities.flatMap(c => getSupplementListings(c.citySlug, stateCode))
    const rankedPlaces = [...allPlaces].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    const listicleItems = placesToListicleItems(rankedPlaces)

    const mapSlot = (
      <ErrorBoundary fallback={null}>
        <HomeMapHero
          mapOnly={false}
          regionBoundary={{ cityName: stateName, stateName, citySlug: '', stateSlug, isState: true }}
          pageTitle={`Best Ramen Restaurants In ${stateName}`}
          pageDescription={`Find ramen restaurants across ${stateName}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
        />
      </ErrorBoundary>
    )

    return (
      <main className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <Navbar />

        <PseoListicle
          breadcrumb={[
            { label: 'Ramen Near You', href: '/' },
            { label: 'Browse Cities & States', href: '/cities' },
            { label: stateName },
          ]}
          title={`${total} Ramen Restaurants in ${stateName}`}
          subtitle={`Every ramen restaurant we track across ${stateName}, ranked by rating and review volume. Search by name or town, or switch to the map.`}
          items={listicleItems}
          noun="ramen restaurant"
          nounPlural="ramen restaurants"
          searchPlaceholder="Search by name or town..."
          filterLabel="Feature"
          primaryCtaLabel="View details"
          mapSlot={mapSlot}
        />

        <BrothStyleLinks place={stateName} />
        <Footer />
      </main>
    )
  }

  const { state } = allRestaurants[0]
  const cityCount = new Set(allRestaurants.map(r => r.citySlug)).size

  // Rough center so the map doesn't flash a full-USA view before the state
  // boundary fetch resolves and fits the real outline.
  const withCoords = allRestaurants.filter(r => r.latitude && r.longitude)
  const initialCenter = withCoords.length
    ? {
        lat: withCoords.reduce((s, r) => s + (r.latitude ?? 0), 0) / withCoords.length,
        lng: withCoords.reduce((s, r) => s + (r.longitude ?? 0), 0) / withCoords.length,
      }
    : undefined

  const pageUrl = `https://www.ramennearyou.com/${stateSlug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Best Ramen Restaurants in ${state}`, item: pageUrl },
    ],
  }

  const ranked = [...allRestaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked, { verifiedSlugs })

  const mapSlot = (
    <ErrorBoundary fallback={null}>
      <HomeMapHero
        initialCenter={initialCenter}
        mapOnly={false}
        regionBoundary={{ cityName: state, stateName: state, citySlug: '', stateSlug, isState: true }}
        pageTitle={`Best Ramen Restaurants In ${state}`}
        pageDescription={`Find ramen restaurants across ${state}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <PseoListicle
        breadcrumb={[
          { label: 'Ramen Near You', href: '/' },
          { label: 'Browse Cities & States', href: '/cities' },
          { label: state },
        ]}
        title={`${allRestaurants.length} Ramen Restaurants in ${state}`}
        subtitle={`Every ramen restaurant we track across ${state}'s ${cityCount} ${cityCount === 1 ? 'city' : 'cities'}, ranked by rating and review volume. Search by name or town, or switch to the map.`}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or town..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <BrothStyleLinks place={state} />
      <Footer />
    </main>
  )
}
