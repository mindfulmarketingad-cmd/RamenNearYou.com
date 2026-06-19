import Link from 'next/link'
import { MapPin, ChevronRight, Map, Navigation } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import type { MapCard } from '@/components/blog-scroll-map'
import { getNearbyCities } from '@/lib/restaurants'
import { getPerfectFor } from '@/lib/perfect-for'
import type { Restaurant } from '@/lib/restaurants'

export interface BrothCityConfig {
  broth: string        // display name e.g. "Miso"
  slug: string         // URL segment e.g. "miso"
  nearMeSlug: string   // e.g. "miso-ramen-near-me"
  tagline: string      // short line under the H1
  whatIs: string       // body paragraph for "What is X ramen?" section
}

interface Props {
  config: BrothCityConfig
  cityName: string
  stateName: string
  stateCode: string
  citySlug: string
  stateSlug: string
  restaurants: Restaurant[]
}

export default function BrothCityPage({ config, cityName, stateName, stateCode, citySlug, stateSlug, restaurants }: Props) {
  const nearbyCities = getNearbyCities(citySlug, stateSlug)

  const sorted = [...restaurants].sort((a, b) => {
    const ra = a.rating ?? 0, rb = b.rating ?? 0
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
      { '@type': 'ListItem', position: 2, name: `Ramen in ${stateName}`, item: `https://www.ramennearyou.com/${stateSlug}` },
      { '@type': 'ListItem', position: 3, name: `Ramen in ${cityName}, ${stateCode}`, item: `https://www.ramennearyou.com/${citySlug}/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: `${config.broth} Ramen in ${cityName}`, item: `https://www.ramennearyou.com/${config.slug}/${citySlug}/${stateSlug}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${config.broth} Ramen Restaurants in ${cityName}, ${stateCode}`,
    description: `Top-rated ${config.broth.toLowerCase()} ramen restaurants in ${cityName}, ${stateCode}`,
    numberOfItems: restaurants.length,
    itemListElement: sorted.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${citySlug}/${stateSlug}/${r.slug}`,
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${stateSlug}`} className="hover:text-[#1E2026] transition-colors">{stateName}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${citySlug}/${stateSlug}`} className="hover:text-[#1E2026] transition-colors">{cityName}, {stateCode}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{config.broth}</span>
          </nav>

          <div>
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">{config.broth} Ramen</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
              {config.broth} Ramen in {cityName}, {stateCode}
            </h1>
            <p className="text-[#6B6862] text-lg mb-4">{config.tagline.replace('{{city}}', cityName).replace('{{stateCode}}', stateCode)}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#6B6862]/60 text-sm">
                {restaurants.length} {config.broth.toLowerCase()} restaurant{restaurants.length !== 1 ? 's' : ''} · {stateName}
              </span>
              <Link
                href={`/searchmap?city=${citySlug}&state=${stateSlug}`}
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
            href={`/searchmap?city=${citySlug}&state=${stateSlug}`}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white font-semibold text-sm shadow-md shadow-[#B57F50]/25 transition-all duration-200"
          >
            <Navigation className="w-4 h-4" />
            Find {config.broth} Ramen in {cityName}, {stateCode}
          </Link>
        </div>
      </section>

      {/* Listings */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1E2026] font-semibold text-sm mb-2">
            {restaurants.length} {config.broth.toLowerCase()} ramen restaurant{restaurants.length !== 1 ? 's' : ''} in {cityName}, {stateCode}
          </p>
          <BlogScrollMapWrapper
            cards={scrollMapCards}
            listHeading={`The Best ${config.broth} Ramen in ${cityName}, ${stateCode}`}
          />
        </div>
      </section>

      {/* What is X ramen */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-[#F5F4F0]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-4">
            What Is {config.broth} Ramen?
          </h2>
          <p className="text-[#6B6862] leading-relaxed mb-6">
            {config.whatIs.replace('{{city}}', cityName).replace('{{stateCode}}', stateCode)}
          </p>
          <Link
            href={`/${config.nearMeSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B57F50] hover:text-[#c8934f] transition-colors"
          >
            Explore {config.broth.toLowerCase()} ramen nationwide
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
                  <Link href={`/${c.citySlug}/${c.stateSlug}`} className="flex items-center gap-2 px-4 py-2.5">
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

      {/* Back to city */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Explore More</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-3">See all ramen in {cityName}</h2>
          <p className="text-[#6B6862] text-sm mb-5 max-w-xl mx-auto">
            Browse every ramen restaurant in {cityName}, {stateCode} — all styles, all broth types.
          </p>
          <Link
            href={`/${citySlug}/${stateSlug}`}
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
