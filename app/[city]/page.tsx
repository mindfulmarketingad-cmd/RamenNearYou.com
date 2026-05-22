import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStates, getRestaurantsByState } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CityRestaurantGrid from '@/components/city-restaurant-grid'
import StateCityList from '@/components/state-city-list'
import { createClient } from '@/lib/supabase/server'

export async function generateStaticParams() {
  return getStates().map((s) => ({ city: s.stateSlug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const stateSlug = city.toLowerCase()
  const allRestaurants = getRestaurantsByState(stateSlug)
  if (!allRestaurants.length) return {}
  const { state, stateCode } = allRestaurants[0]
  return {
    title: `Best Ramen Restaurants in ${state} (${stateCode}) — Full Directory`,
    description: `Find the best ramen restaurants in ${state}. Browse all ${allRestaurants.length} top-rated spots with ratings, hours, menus, and directions across every city in ${stateCode}.`,
    alternates: {
      canonical: `https://www.ramennearyou.com/${stateSlug}`,
    },
    openGraph: {
      title: `Best Ramen Restaurants in ${state} (${stateCode})`,
      description: `Find the best ramen restaurants in ${state} — all ${allRestaurants.length} locations with ratings and directions.`,
      url: `https://www.ramennearyou.com/${stateSlug}`,
    },
  }
}

export default async function StatePage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const stateSlug = city.toLowerCase()
  const allRestaurants = getRestaurantsByState(stateSlug)
  if (!allRestaurants.length) notFound()

  const { state, stateCode } = allRestaurants[0]

  // Build city index sorted by restaurant count
  const cityGroups = new Map<string, { city: string; citySlug: string; count: number }>()
  for (const r of allRestaurants) {
    const entry = cityGroups.get(r.citySlug)
    if (entry) entry.count++
    else cityGroups.set(r.citySlug, { city: r.city, citySlug: r.citySlug, count: 1 })
  }
  const cities = Array.from(cityGroups.values()).sort((a, b) => b.count - a.count)

  const supabase = await createClient()
  let verifiedSlugs: string[] = []
  if (supabase) {
    const slugs = allRestaurants.map(r => r.slug)
    const { data } = await supabase
      .from('claims')
      .select('restaurant_slug')
      .in('restaurant_slug', slugs)
      .eq('status', 'approved')
    verifiedSlugs = data?.map(d => d.restaurant_slug) ?? []
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Best Ramen Restaurants in ${state}`, item: `https://www.ramennearyou.com/${stateSlug}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Ramen Restaurants in ${state}`,
    description: `Top-rated ramen restaurants in ${state} (${stateCode})`,
    numberOfItems: allRestaurants.length,
    itemListElement: allRestaurants.slice(0, 50).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${r.citySlug}/${r.stateSlug}/${r.slug}`,
      name: r.name,
    })),
  }

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
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
          <p className="text-[#6B6862] text-lg mb-4">
            The best ramen restaurants in {state} ({stateCode}) — {allRestaurants.length} locations across {cities.length} {cities.length === 1 ? 'city' : 'cities'}, ranked by Google rating and review count.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
              {allRestaurants.length} restaurants
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#6B6862] text-xs">
              {cities.length} {cities.length === 1 ? 'city' : 'cities'}
            </span>
          </div>
        </div>
      </section>

      {/* Browse by city */}
      {cities.length > 1 && (
        <StateCityList cities={cities} stateSlug={stateSlug} stateName={state} />
      )}

      {/* All listings */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1E2026] font-semibold text-sm mb-6">
            All {allRestaurants.length} ramen restaurants in {state}
          </p>
          <CityRestaurantGrid restaurants={allRestaurants} city="" state={stateSlug} verifiedSlugs={verifiedSlugs} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
