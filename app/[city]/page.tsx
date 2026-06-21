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
      <main className="min-h-screen bg-[#ffffff]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <Navbar />
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
          <div className="max-w-7xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
              <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1E2026]">Ramen in {stateName}</span>
            </nav>
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
              Best Ramen Restaurants in {stateName}
            </h1>
            <p className="text-[#6B6862] text-lg mb-5">
              Browse ramen restaurants in {stateName} ({stateCode}) by city — {total} locations across {supplementCities.length} {supplementCities.length === 1 ? 'city' : 'cities'}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
                {total} restaurants
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
                {supplementCities.length} {supplementCities.length === 1 ? 'city' : 'cities'}
              </span>
              <ShareButton url={pageUrl} title={`Best Ramen Restaurants in ${stateName} — ${total} listings on RamenNearYou`} />
            </div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-8">
              {stateName}, {stateCode} ({total} listings)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
              {supplementCities.map((c) => (
                <Link
                  key={c.citySlug}
                  href={`/find/${c.citySlug}-${stateCodeLower}`}
                  className="flex items-center justify-between px-5 py-4 border-b border-r border-black/10 hover:bg-[#F5F4F0] transition-colors group"
                >
                  <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors">
                    {c.city}
                  </span>
                  <span className="text-[#6B6862] text-xs ml-4 shrink-0">
                    {c.count} {c.count === 1 ? 'restaurant' : 'restaurants'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
  // Exclude single-restaurant cities — those don't have their own city page.
  const cities = Array.from(cityGroups.values()).filter((c) => c.count >= 2).sort((a, b) => a.city.localeCompare(b.city))

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
    <main className="min-h-screen bg-[#ffffff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Ramen in {state}</span>
          </nav>

          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
            Best Ramen Restaurants in {state}
          </h1>
          <p className="text-[#6B6862] text-lg mb-5">
            Browse ramen restaurants in {state} ({stateCode}) by city — {allRestaurants.length} locations across {cities.length} {cities.length === 1 ? 'city' : 'cities'}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
              {allRestaurants.length} restaurants
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
              {cities.length} {cities.length === 1 ? 'city' : 'cities'}
            </span>
            <ShareButton
              url={pageUrl}
              title={`Best Ramen Restaurants in ${state} — ${allRestaurants.length} listings on RamenNearYou`}
            />
          </div>
        </div>
      </section>

      {/* City grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-8">
            {state}, {stateCode} ({allRestaurants.length} listings)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
            {cities.map((c) => (
              <Link
                key={c.citySlug}
                href={`/find/${c.citySlug}-${stateCodeLower}`}
                className="flex items-center justify-between px-5 py-4 border-b border-r border-black/10 hover:bg-[#F5F4F0] transition-colors group"
              >
                <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors">
                  {c.city}
                </span>
                <span className="text-[#6B6862] text-xs ml-4 shrink-0">
                  {c.count} {c.count === 1 ? 'restaurant' : 'restaurants'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
