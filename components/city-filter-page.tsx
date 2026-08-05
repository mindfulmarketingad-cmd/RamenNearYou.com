import Link from 'next/link'
import { MapPin, ChevronRight, Map, Navigation, Info } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import type { MapCard } from '@/components/blog-scroll-map'
import AdUnitHorizontal from '@/components/ad-unit-horizontal'
import AdUnitVertical from '@/components/ad-unit-vertical'
import { getNearbyCities, type Restaurant } from '@/lib/restaurants'
import { getPerfectFor } from '@/lib/perfect-for'
import {
  type FilterSpec,
  type MajorCity,
  filterH1,
  restaurantLocalBusinessSchema,
  getCityFilterLinks,
  getServiceHref,
  DIABETIC_BROTH_NOTE,
  DIABETIC_GENERAL,
  HEALTHY_GENERAL,
} from '@/lib/city-filter-pages'

const BROTH_INTRO: Record<string, string> = {
  Tonkotsu: 'rich, creamy pork-bone broth slow-simmered for hours until silky and milky-white',
  Shoyu: 'clear, soy-seasoned broth — the original Tokyo style, light, savory, and balanced',
  Miso: 'hearty, fermented soybean-paste broth with deep umami and a warming, full-bodied finish',
  Spicy: 'bold, chili-forward broths from tantanmen to spicy miso, built for heat seekers',
  Vegan: 'plant-based broths with rich umami depth, from mushroom dashi to creamy sesame',
}

export default function CityFilterPage({
  spec,
  cityInfo,
  restaurants,
}: {
  spec: FilterSpec
  cityInfo: MajorCity
  restaurants: Restaurant[]
}) {
  const { city, state, stateCode, citySlug, stateSlug } = cityInfo
  const h1 = filterH1(spec, city, state)
  const nearbyCities = getNearbyCities(citySlug, stateSlug)

  const baseUrl = `https://www.ramennearyou.com/${citySlug}/${stateSlug}`
  let filterSlug: string
  switch (spec.kind) {
    case 'broth': filterSlug = `${spec.broth!.toLowerCase()}-ramen`; break
    case 'diabetic': filterSlug = `${spec.broth!.toLowerCase()}-ramen-for-diabetics`; break
    case 'vegan': filterSlug = 'vegan-ramen'; break
    case 'vegetarian': filterSlug = 'vegetarian-ramen'; break
    case 'healthy': filterSlug = 'healthy-ramen'; break
  }
  const pageUrl = `${baseUrl}/${filterSlug}`
  const relatedLinks = getCityFilterLinks(citySlug, stateSlug).filter((l) => l.slug !== filterSlug)
  const servicePage = getServiceHref(spec)

  const cards: MapCard[] = restaurants.slice(0, 30).map((r, i) => ({
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

  // ItemList with embedded LocalBusiness (Restaurant) items.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: h1,
    description: `${restaurants.length} ramen restaurants matching this search in ${city}, ${stateCode}`,
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${r.citySlug}/${r.stateSlug}/${r.slug}`,
      item: restaurantLocalBusinessSchema(r),
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Ramen in ${state}`, item: `https://www.ramennearyou.com/${stateSlug}` },
      { '@type': 'ListItem', position: 3, name: `Ramen in ${city}, ${stateCode}`, item: baseUrl },
      { '@type': 'ListItem', position: 4, name: h1, item: pageUrl },
    ],
  }

  const eyebrow =
    spec.kind === 'broth' || spec.kind === 'diabetic'
      ? `${spec.broth} Ramen`
      : spec.kind === 'vegan'
      ? 'Vegan Ramen'
      : spec.kind === 'vegetarian'
      ? 'Vegetarian Ramen'
      : 'Healthy Ramen'

  const subhead =
    spec.kind === 'broth'
      ? `Browse the best spots for ${BROTH_INTRO[spec.broth!]} in ${city}, ${stateCode}.`
      : spec.kind === 'diabetic'
      ? `${spec.broth} ramen options in ${city}, ${stateCode}, with guidance for managing blood sugar.`
      : spec.kind === 'vegan'
      ? `Plant-based ramen in ${city}, ${stateCode} — bowls with vegan broths and toppings.`
      : spec.kind === 'vegetarian'
      ? `Meat-free ramen in ${city}, ${stateCode} — bowls with vegetarian options.`
      : `Lighter, customizable bowls in ${city}, ${stateCode} for a more balanced ramen night.`

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
            <Link href={`/${stateSlug}`} className="hover:text-[#1E2026] transition-colors">{state}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={baseUrl} className="hover:text-[#1E2026] transition-colors">{city}, {stateCode}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{eyebrow}</span>
          </nav>

          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">{eyebrow}</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">{h1}</h1>
          <p className="text-[#6B6862] text-lg mb-4">{subhead}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#6B6862]/60 text-sm">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} · {city}, {stateCode}
            </span>
            <Link
              href={`/searchmap?city=${citySlug}&state=${stateSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#96602F] text-xs font-medium transition-colors border border-[#B57F50]/20"
            >
              <Map className="w-3.5 h-3.5" />
              View on Map
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial blurb for diabetic + healthy pages */}
      {(spec.kind === 'diabetic' || spec.kind === 'healthy') && (
        <section className="pt-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-[#B57F50]/20 bg-[#B57F50]/5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#96602F] shrink-0 mt-0.5" />
                <div className="space-y-3 text-sm leading-relaxed text-[#6B6862]">
                  {spec.kind === 'diabetic' ? (
                    <>
                      <p>{DIABETIC_BROTH_NOTE[spec.broth!]}</p>
                      <p>{DIABETIC_GENERAL}</p>
                    </>
                  ) : (
                    <p>{HEALTHY_GENERAL}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Find CTA */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/searchmap?city=${citySlug}&state=${stateSlug}`}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white font-semibold text-sm shadow-md shadow-[#B57F50]/25 transition-all duration-200"
          >
            <Navigation className="w-4 h-4" />
            Find ramen in {city}, {stateCode}
          </Link>
        </div>
      </section>

      {/* These city × filter pages carried no ads at all — one above the
          listings and one below covers the two spots a visitor actually
          dwells on. */}
      <section className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto"><AdUnitHorizontal /></div>
      </section>

      {/* Listings */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1E2026] font-semibold text-sm mb-2">
            {restaurants.length} ramen restaurant{restaurants.length !== 1 ? 's' : ''} in {city}, {stateCode}
          </p>
          <BlogScrollMapWrapper cards={cards} listHeading={h1} />
          <div className="mt-8"><AdUnitVertical /></div>
        </div>
      </section>

      {/* Related filters in this city (interlink siblings) */}
      {relatedLinks.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-[#F5F4F0]">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">More in {city}</p>
            <p className="text-[#1E2026] font-semibold text-lg mb-5">Other ways to browse ramen in {city}</p>
            <div className="flex flex-wrap gap-2.5">
              {relatedLinks.map((l) => (
                <Link
                  key={l.slug}
                  href={l.href}
                  className="px-4 py-2 rounded-full bg-white border border-black/8 text-[#1E2026] text-sm font-medium hover:border-[#B57F50]/50 hover:text-[#96602F] transition-colors"
                >
                  {l.label} in {city}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Explore Nearby</p>
            <p className="text-[#1E2026] font-semibold text-lg mb-6">More ramen near {city}</p>
            <div className="flex flex-wrap gap-3">
              {nearbyCities.map((c) => (
                <div key={`${c.citySlug}-${c.stateSlug}`} className="flex items-stretch rounded-xl overflow-hidden border border-black/5 hover:border-[#B57F50]/40 transition-colors group bg-[#F5F4F0]">
                  <Link href={`/${c.citySlug}/${c.stateSlug}`} className="flex items-center gap-2 px-4 py-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#96602F] shrink-0" />
                    <span>
                      <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#96602F] transition-colors">{c.city}, {c.stateCode}</span>
                      <span className="text-[#6B6862]/60 text-xs ml-1.5">{c.count} spot{c.count !== 1 ? 's' : ''} · {Math.round(c.distanceMiles)} mi</span>
                    </span>
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
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Explore More</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-3">See all ramen in {city}</h2>
          <p className="text-[#6B6862] text-sm mb-5 max-w-xl mx-auto">
            Browse every ramen restaurant in {city}, {stateCode} — all styles and broth types.
          </p>
          <Link
            href={baseUrl}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
          >
            All ramen in {city}, {stateCode} →
          </Link>
          {servicePage && (
            <p className="mt-5 text-sm text-[#6B6862]">
              Or explore{' '}
              <Link href={servicePage.href} className="font-semibold text-[#96602F] hover:text-[#c8934f] transition-colors">
                {servicePage.label.toLowerCase()}
              </Link>{' '}
              nationwide.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
