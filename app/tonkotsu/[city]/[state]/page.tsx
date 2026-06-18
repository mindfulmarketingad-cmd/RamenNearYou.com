import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ChevronRight, Map, Navigation } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import type { MapCard } from '@/components/blog-scroll-map'
import { getTonkotsuCities, getTonkotsuRestaurantsByCity, getNearbyCities } from '@/lib/restaurants'
import { getPerfectFor } from '@/lib/perfect-for'

interface Props {
  params: Promise<{ city: string; state: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return getTonkotsuCities(2).map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, state } = await params
  const tonkotsuRestaurants = getTonkotsuRestaurantsByCity(city, state)
  if (!tonkotsuRestaurants.length) return {}
  const { city: cityName, state: stateName, stateCode } = tonkotsuRestaurants[0]
  const title = `Ramen Tonkotsu in ${cityName} ${stateName} | Find and Order Ramen Now`
  const url = `https://www.ramennearyou.com/tonkotsu/${city}/${state}`
  return {
    title,
    description: `Find the best tonkotsu ramen in ${cityName}, ${stateCode}. Browse ${tonkotsuRestaurants.length} top-rated restaurants serving rich, creamy pork bone broth. Ratings, menus, and directions.`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: `Find the best tonkotsu ramen in ${cityName}, ${stateCode}. ${tonkotsuRestaurants.length} top-rated restaurants with rich, creamy pork bone broth.`,
      url,
    },
  }
}

export default async function TonkotsuCityPage({ params }: Props) {
  const { city, state } = await params
  const tonkotsuRestaurants = getTonkotsuRestaurantsByCity(city, state)
  if (!tonkotsuRestaurants.length) notFound()

  const { city: cityName, state: stateName, stateCode } = tonkotsuRestaurants[0]
  const nearbyCities = getNearbyCities(city, state)

  const sorted = [...tonkotsuRestaurants].sort((a, b) => {
    const ra = a.rating ?? 0
    const rb = b.rating ?? 0
    if (rb !== ra) return rb - ra
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
  })

  const scrollMapCards: MapCard[] = sorted.slice(0, 30).map((r, i) => ({
    rank: i + 1,
    slug: r.slug,
    citySlug: r.citySlug,
    stateSlug: r.stateSlug,
    name: r.name,
    rating: r.rating ?? 0,
    reviewCount: r.reviewCount ?? 0,
    address: r.address ?? '',
    phone: r.phone ?? '',
    description: r.description ?? '',
    photo: r.photo ?? '',
    tags: r.subtypes ? r.subtypes.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 2) : [],
    lat: r.latitude ?? null,
    lng: r.longitude ?? null,
    perfectFor: getPerfectFor(r),
  }))

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Ramen in ${stateName}`, item: `https://www.ramennearyou.com/${state}` },
      { '@type': 'ListItem', position: 3, name: `Ramen in ${cityName}, ${stateCode}`, item: `https://www.ramennearyou.com/${city}/${state}` },
      { '@type': 'ListItem', position: 4, name: `Tonkotsu Ramen in ${cityName}`, item: `https://www.ramennearyou.com/tonkotsu/${city}/${state}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Tonkotsu Ramen Restaurants in ${cityName}, ${stateCode}`,
    description: `Top-rated tonkotsu ramen restaurants in ${cityName}, ${stateCode}`,
    numberOfItems: tonkotsuRestaurants.length,
    itemListElement: sorted.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${city}/${state}/${r.slug}`,
      name: r.name,
    })),
  }

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Navbar />

      {/* Hero banner */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${state}`} className="hover:text-[#1E2026] transition-colors">{stateName}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${city}/${state}`} className="hover:text-[#1E2026] transition-colors">{cityName}, {stateCode}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Tonkotsu</span>
          </nav>

          <div>
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Tonkotsu Ramen</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
              Ramen Tonkotsu in {cityName} {stateName}
            </h1>
            <p className="text-[#6B6862] text-lg mb-4">
              Rich, creamy pork bone broth slow-simmered for hours. Browse the best tonkotsu ramen spots in {cityName}, {stateCode}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#6B6862]/60 text-sm">
                {tonkotsuRestaurants.length} tonkotsu restaurant{tonkotsuRestaurants.length !== 1 ? 's' : ''} · {stateName}
              </span>
              <Link
                href={`/searchmap?city=${city}&state=${state}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#B57F50] text-xs font-medium transition-colors border border-[#B57F50]/20"
              >
                <Map className="w-3.5 h-3.5" />
                View on Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find CTA */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/searchmap?city=${city}&state=${state}`}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white font-semibold text-sm shadow-md shadow-[#B57F50]/25 transition-all duration-200"
          >
            <Navigation className="w-4 h-4" />
            Find Tonkotsu Ramen in {cityName}, {stateCode}
          </Link>
        </div>
      </section>

      {/* Listings */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1E2026] font-semibold text-sm mb-2">
            {tonkotsuRestaurants.length} tonkotsu ramen restaurant{tonkotsuRestaurants.length !== 1 ? 's' : ''} in {cityName}, {stateCode}
          </p>
          <BlogScrollMapWrapper
            cards={scrollMapCards}
            listHeading={`The Best Tonkotsu Ramen in ${cityName}, ${stateCode}`}
          />
        </div>
      </section>

      {/* What is tonkotsu */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-[#F5F4F0]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-4">
            What Is Tonkotsu Ramen?
          </h2>
          <p className="text-[#6B6862] leading-relaxed mb-4">
            Tonkotsu ramen originated in Fukuoka, Japan and is defined by its thick, milky-white broth made from pork bones boiled at high heat for 8–18 hours. This extended cook breaks down collagen into gelatin, creating the signature creamy, rich consistency. It&apos;s the most umami-forward style of ramen — intensely savory, slightly fatty, and deeply satisfying.
          </p>
          <p className="text-[#6B6862] leading-relaxed mb-6">
            Classic tonkotsu is served with thin straight noodles and topped with chashu pork belly, a soft-boiled marinated egg, green onions, bamboo shoots, nori, and black garlic oil (mayu). The restaurants listed above have been identified as serving tonkotsu or tonkotsu-style ramen in {cityName}, {stateCode}.
          </p>
          <Link
            href="/tonkotsu-ramen-near-me"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B57F50] hover:text-[#c8934f] transition-colors"
          >
            Explore tonkotsu ramen nationwide
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Nearby cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Explore Nearby</p>
            <p className="text-[#1E2026] font-semibold text-lg mb-6">More ramen near {cityName}</p>
            <div className="flex flex-wrap gap-3">
              {nearbyCities.map((c) => (
                <div key={`${c.citySlug}-${c.stateSlug}`} className="flex items-stretch rounded-xl overflow-hidden border border-black/5 hover:border-[#B57F50]/40 transition-colors group bg-[#F5F4F0]">
                  <Link
                    href={`/${c.citySlug}/${c.stateSlug}`}
                    className="flex items-center gap-2 px-4 py-2.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                    <span>
                      <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors">{c.city}, {c.stateCode}</span>
                      <span className="text-[#6B6862]/60 text-xs ml-1.5">{c.count} spot{c.count !== 1 ? 's' : ''} · {Math.round(c.distanceMiles)} mi</span>
                    </span>
                  </Link>
                  <Link
                    href={`/searchmap?city=${c.citySlug}&state=${c.stateSlug}`}
                    title="View on map"
                    className="flex items-center px-3 border-l border-black/5 text-[#6B6862]/50 hover:text-[#B57F50] hover:bg-[#B57F50]/10 transition-colors"
                  >
                    <Map className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to full city */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Explore More</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-3">
            See all ramen in {cityName}
          </h2>
          <p className="text-[#6B6862] text-sm mb-5 max-w-xl mx-auto">
            Browse every ramen restaurant in {cityName}, {stateCode} — all styles, all broth types.
          </p>
          <Link
            href={`/${city}/${state}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
          >
            All ramen in {cityName}, {stateCode} →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
