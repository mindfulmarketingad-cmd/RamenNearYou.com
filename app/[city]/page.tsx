import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStates, getRestaurantsByState } from '@/lib/restaurants'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'
import {
  getSupplementCitiesByState,
  getSupplementOnlyStateSlugs,
  getSupplementStateName,
} from '@/lib/places-supplements'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ShareButton from '@/components/share-button'
import BrothStyleLinks from '@/components/broth-style-links'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'

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
    const stateCodeLower = stateCode.toLowerCase()
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

    return (
      <main className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <Navbar />
        <ErrorBoundary fallback={null}>
          <HomeMapHero
            regionBoundary={{ cityName: stateName, stateName, citySlug: '', stateSlug, isState: true }}
            pageTitle={`Best Ramen Restaurants In ${stateName}`}
            pageDescription={`Find ramen restaurants across ${stateName}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
              <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/cities" className="hover:text-[#96602F] transition-colors">Browse Cities &amp; States</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1E2026]">{stateName}</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#6B6862] text-xs">
                  {total} restaurants
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#6B6862] text-xs">
                  {supplementCities.length} {supplementCities.length === 1 ? 'city' : 'cities'}
                </span>
              </div>
              <ShareButton url={pageUrl} title={`Best Ramen Restaurants in ${stateName} — ${total} listings on RamenNearYou`} />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">
              Browse {stateName} by City
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-black/10">
              {supplementCities.map((c) => (
                <Link
                  key={c.citySlug}
                  href={`/find/${c.citySlug}-${stateCodeLower}`}
                  className="flex items-center justify-between px-5 py-4 border-b border-r border-black/10 hover:bg-[#F5F4F0] transition-colors group"
                >
                  <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#96602F] transition-colors">
                    {c.city}
                  </span>
                  <span className="text-[#6B6862] text-xs ml-4 shrink-0">
                    {c.count} {c.count === 1 ? 'restaurant' : 'restaurants'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <BrothStyleLinks place={stateName} />
        <Footer />
      </main>
    )
  }

  const { state, stateCode } = allRestaurants[0]
  const stateCodeLower = (STATE_SLUG_TO_CODE[stateSlug] ?? stateCode).toLowerCase()

  // Build city index sorted alphabetically
  const cityGroups = new Map<string, { city: string; citySlug: string; count: number }>()
  for (const r of allRestaurants) {
    const entry = cityGroups.get(r.citySlug)
    if (entry) entry.count++
    else cityGroups.set(r.citySlug, { city: r.city, citySlug: r.citySlug, count: 1 })
  }
  // Merge in Google Places supplement cities for this state — cities that have
  // fetched listings but few/no DB rows. Without this, a state with even one DB
  // restaurant would hide all of its supplement cities (e.g. Utah).
  for (const sc of getSupplementCitiesByState(stateSlug)) {
    if (!cityGroups.has(sc.citySlug)) {
      cityGroups.set(sc.citySlug, { city: sc.city, citySlug: sc.citySlug, count: sc.count })
    }
  }
  // Exclude single-restaurant cities — those don't have their own city page.
  const cities = Array.from(cityGroups.values()).filter((c) => c.count >= 2).sort((a, b) => a.city.localeCompare(b.city))
  // Total across the cities shown (DB + supplement), so the header counts match
  // the grid rather than only counting DB rows.
  const totalListings = cities.reduce((s, c) => s + c.count, 0)

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

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <ErrorBoundary fallback={null}>
        <HomeMapHero
          initialCenter={initialCenter}
          regionBoundary={{ cityName: state, stateName: state, citySlug: '', stateSlug, isState: true }}
          pageTitle={`Best Ramen Restaurants In ${state}`}
          pageDescription={`Find ramen restaurants across ${state}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
        />
      </ErrorBoundary>

      <div className="relative z-10 bg-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/cities" className="hover:text-[#96602F] transition-colors">Browse Cities &amp; States</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{state}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#6B6862] text-xs">
                {totalListings} restaurants
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#6B6862] text-xs">
                {cities.length} {cities.length === 1 ? 'city' : 'cities'}
              </span>
            </div>
            <ShareButton
              url={pageUrl}
              title={`Best Ramen Restaurants in ${state} — ${totalListings} listings on RamenNearYou`}
            />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">
            Browse {state} by City
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-black/10">
            {cities.map((c) => (
              <Link
                key={c.citySlug}
                href={`/find/${c.citySlug}-${stateCodeLower}`}
                className="flex items-center justify-between px-5 py-4 border-b border-r border-black/10 hover:bg-[#F5F4F0] transition-colors group"
              >
                <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#96602F] transition-colors">
                  {c.city}
                </span>
                <span className="text-[#6B6862] text-xs ml-4 shrink-0">
                  {c.count} {c.count === 1 ? 'restaurant' : 'restaurants'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <BrothStyleLinks place={state} />
      <Footer />
    </main>
  )
}
