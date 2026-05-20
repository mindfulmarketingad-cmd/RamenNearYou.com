import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ChevronRight, Map, Star } from 'lucide-react'
import { getRestaurantsByCity, getCities, getNearbyCities } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CityRestaurantGrid from '@/components/city-restaurant-grid'
import CityFollowButton from '@/components/city-follow-button'
import CityFeaturedCTA from '@/components/city-featured-cta'
import { createClient } from '@/lib/supabase/server'

export async function generateStaticParams() {
  return getCities().map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; state: string }> }) {
  const { city, state } = await params
  const restaurants = getRestaurantsByCity(city, state)
  if (!restaurants.length) return {}
  const { city: cityName, stateCode } = restaurants[0]
  return {
    title: `Ramen In ${cityName}, ${stateCode}`,
    description: `Find the best ramen restaurants in ${cityName}, ${stateCode}. Browse ${restaurants.length} top-rated spots with ratings, hours, menus, and directions.`,
    alternates: {
      canonical: `https://www.ramennearyou.com/${city}/${state}`,
    },
    openGraph: {
      title: `Ramen In ${cityName}, ${stateCode}`,
      description: `Find the best ramen restaurants in ${cityName}, ${stateCode}. Browse ${restaurants.length} top-rated spots.`,
      url: `https://www.ramennearyou.com/${city}/${state}`,
    },
  }
}


export default async function CityPage({ params }: { params: Promise<{ city: string; state: string }> }) {
  const { city, state } = await params
  const restaurants = getRestaurantsByCity(city, state)
  if (!restaurants.length) notFound()

  const { city: cityName, stateCode, state: stateName } = restaurants[0]
  const nearbyCities = getNearbyCities(city, state)

  const supabase = await createClient()
  let verifiedSlugs: string[] = []
  if (supabase) {
    const slugs = restaurants.map(r => r.slug)
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
      { '@type': 'ListItem', position: 2, name: `Ramen in ${cityName}, ${stateCode}`, item: `https://www.ramennearyou.com/${city}/${state}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Ramen Restaurants in ${cityName}, ${stateCode}`,
    description: `Top-rated ramen restaurants in ${cityName}, ${stateCode}`,
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${city}/${state}/${r.slug}`,
      name: r.name,
    })),
  }

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Navbar />

      {/* Hero banner */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#1E2026] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#B0B3BB] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{cityName}, {stateCode}</span>
          </nav>

          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            Ramen In {cityName}, {stateCode}
          </h1>
          <p className="text-[#B0B3BB] text-lg mb-4">
            Browse Ramen Restaurants In {cityName}, {stateCode}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#B0B3BB]/60 text-sm">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} · {stateName}
            </span>
            <Link
              href={`/searchmap?city=${city}&state=${state}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#77567A]/15 hover:bg-[#77567A]/25 text-[#77567A] text-xs font-medium transition-colors border border-[#77567A]/20"
            >
              <Map className="w-3.5 h-3.5" />
              View City Map
            </Link>
            <CityFollowButton city={city} state={state} />
          </div>
        </div>
      </section>

      {/* Business owner featured listing CTA */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CityFeaturedCTA cityName={cityName} stateCode={stateCode} />
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-white font-semibold text-sm mb-6">
            {restaurants.length} ramen restaurant{restaurants.length !== 1 ? 's' : ''} in {cityName}, {stateCode}
          </p>
          <CityRestaurantGrid restaurants={restaurants} city={city} state={state} verifiedSlugs={verifiedSlugs} />
        </div>
      </section>

      {/* Nearby cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-2">Explore Nearby</p>
            <p className="text-white font-semibold text-lg mb-6">Ramen near {cityName}</p>
            <div className="flex flex-wrap gap-3">
              {nearbyCities.map((c) => (
                <div key={`${c.citySlug}-${c.stateSlug}`} className="flex items-stretch rounded-xl overflow-hidden border border-white/5 hover:border-[#77567A]/40 transition-colors group bg-[#1E2026]">
                  <Link
                    href={`/${c.citySlug}/${c.stateSlug}`}
                    className="flex items-center gap-2 px-4 py-2.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#77567A] shrink-0" />
                    <span>
                      <span className="text-white text-sm font-medium group-hover:text-[#77567A] transition-colors">{c.city}, {c.stateCode}</span>
                      <span className="text-[#B0B3BB]/60 text-xs ml-1.5">{c.count} spot{c.count !== 1 ? 's' : ''} · {Math.round(c.distanceMiles)} mi</span>
                    </span>
                  </Link>
                  <Link
                    href={`/searchmap?city=${c.citySlug}&state=${c.stateSlug}`}
                    title="View on map"
                    className="flex items-center px-3 border-l border-white/5 text-[#B0B3BB]/50 hover:text-[#77567A] hover:bg-[#77567A]/10 transition-colors"
                  >
                    <Map className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ambassador CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#77567A]/30 via-[#1E2026] to-[#1E2026] border border-[#77567A]/30 p-8 sm:p-10">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">City Ambassador Program</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                  Be the voice of ramen in {cityName}
                </h2>
                <p className="text-[#B0B3BB] text-sm leading-relaxed max-w-lg">
                  Help your city&apos;s ramen lovers find the best bowls. As a RamenNearYou ambassador you&apos;ll write reviews, spotlight new spots, and grow the community.
                </p>
              </div>
              <Link
                href={`/ambassador?city=${encodeURIComponent(cityName)}`}
                className="shrink-0 px-6 py-3 rounded-xl bg-[#77567A] text-white text-sm font-semibold hover:bg-[#8a6a8d] transition-colors"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
