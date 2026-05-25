import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStates, getRestaurantsByState } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ShareButton from '@/components/share-button'

export async function generateStaticParams() {
  return getStates().map((s) => ({ city: s.stateSlug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const stateSlug = city.toLowerCase()
  const allRestaurants = getRestaurantsByState(stateSlug)
  if (!allRestaurants.length) return {}
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
  if (!allRestaurants.length) notFound()

  const { state, stateCode } = allRestaurants[0]

  // Build city index sorted alphabetically
  const cityGroups = new Map<string, { city: string; citySlug: string; count: number }>()
  for (const r of allRestaurants) {
    const entry = cityGroups.get(r.citySlug)
    if (entry) entry.count++
    else cityGroups.set(r.citySlug, { city: r.city, citySlug: r.citySlug, count: 1 })
  }
  const cities = Array.from(cityGroups.values()).sort((a, b) => a.city.localeCompare(b.city))

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
            Browse by City
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
            {cities.map((c) => (
              <Link
                key={c.citySlug}
                href={`/${c.citySlug}/${stateSlug}`}
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
