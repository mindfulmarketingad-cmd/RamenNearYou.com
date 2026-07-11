import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BrothRestaurantGrid from '@/components/broth-restaurant-grid'
import RestaurantImage from '@/components/restaurant-image'
import type { Restaurant } from '@/lib/restaurants'
import { getServiceCityLinks, SERVICE_PAGES } from '@/lib/city-filter-pages'
import { pickStockPhoto } from '@/lib/stock-photos'

interface BrothInfo {
  type: string
  slug: string
  headline: string
  subhead: string
  intro: string
  whatIs: string
  characteristics: string[]
  jsonLdName: string
}

interface Props {
  broth: BrothInfo
  restaurants: Restaurant[]
}

export default function BrothTypeNearMePage({ broth, restaurants }: Props) {
  const cityLinks = getServiceCityLinks(broth.type)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: broth.jsonLdName,
    description: broth.subhead,
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ramennearyou.com/${r.citySlug}/${r.stateSlug}/${r.slug}`,
      name: r.name,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: broth.headline, item: `https://www.ramennearyou.com/${broth.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4]">

        {/* Hero */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#ffffff] border-b border-black/5">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
                <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#1E2026]">{broth.headline}</span>
              </nav>
              <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Local Ramen Guide</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E2026] leading-tight mb-4">
                {broth.headline}
              </h1>
              <p className="text-[#6B6862] text-lg leading-relaxed max-w-2xl">
                {broth.subhead}
              </p>
            </div>
            <div className="relative w-full sm:w-48 h-40 sm:h-48 rounded-2xl overflow-hidden shrink-0 hidden sm:block">
              <RestaurantImage src={pickStockPhoto(broth.type)} alt={`${broth.type} ramen`} fill className="object-cover" sizes="192px" />
            </div>
          </div>
        </section>

        {/* Restaurant grid + ZIP filter */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <BrothRestaurantGrid
            brothType={broth.type}
            restaurants={restaurants.map((r) => ({
              slug: r.slug,
              citySlug: r.citySlug,
              stateSlug: r.stateSlug,
              name: r.name,
              city: r.city,
              stateCode: r.stateCode,
              address: r.address,
              rating: r.rating,
              reviewCount: r.reviewCount,
              photo: r.photo,
              priceRange: r.priceRange,
              latitude: r.latitude,
              longitude: r.longitude,
            }))}
          />
        </section>

        {/* Browse this broth by city (service > service+city links) */}
        {cityLinks.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#ffffff] border-t border-black/5">
            <div className="max-w-7xl mx-auto">
              <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Browse by City</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-6">
                {broth.type} Ramen by City
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {cityLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-sm font-medium hover:border-[#B57F50]/50 hover:text-[#B57F50] transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                    {broth.type} Ramen in {c.city}, {c.stateCode}
                    <span className="text-[#6B6862]/60 text-xs">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What is this broth type */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ffffff] border-t border-black/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-4">What Is {broth.type} Ramen?</h2>
            <p className="text-[#6B6862] leading-relaxed mb-6">{broth.whatIs}</p>
            <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6">
              <h3 className="text-[#1E2026] font-semibold mb-3">What to expect</h3>
              <ul className="space-y-2">
                {broth.characteristics.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[#6B6862] text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B57F50] mt-2 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* First-person guidance — finding and ordering this broth */}
            <h3 className="font-serif text-2xl font-bold text-[#1E2026] mt-12 mb-3">
              How I find the best {broth.type} ramen near me
            </h3>
            <p className="text-[#6B6862] leading-relaxed mb-4">
              When I am chasing a great bowl of {broth.type.toLowerCase()} ramen, I lean on a couple of habits.
              First, I favor shops that specialize — a kitchen that builds its name on {broth.type.toLowerCase()}
              broth almost always makes it better than a place trying to do every style at once. Second, I trust
              a strong rating that holds up across a lot of reviews more than a perfect score from only a handful.
              The list above is sorted by rating and distance, so you can spot the standouts fast — then I open a
              few listings and skim the most recent reviews and photos before committing.
            </p>
            <h3 className="font-serif text-2xl font-bold text-[#1E2026] mt-8 mb-3">
              How I order {broth.type} ramen
            </h3>
            <p className="text-[#6B6862] leading-relaxed mb-4">
              Half the bowl is in how you order it. Here is what I do to get the most out of a
              {' '}{broth.type.toLowerCase()} bowl every time:
            </p>
            <ul className="space-y-2.5 mb-2">
              {[
                `Ask for the noodle firmness you like — firmer noodles hold up better in ${broth.type.toLowerCase()} broth.`,
                'Add a soft, marinated egg; it is the single best upgrade on almost any bowl.',
                'Skim the most recent reviews and photos before you go — fresh, specific praise is the best signal.',
                'Use your ZIP code or location above to sort by distance so you never trade quality for a long drive.',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[#6B6862] text-sm leading-relaxed">
                  <span className="text-[#B57F50] shrink-0 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/broth" className="px-4 py-2.5 rounded-lg border border-[#B57F50]/40 text-[#B57F50] text-sm font-medium hover:bg-[#B57F50]/10 transition-colors">
                Browse All Broth Types
              </Link>
              <Link href="/cities" className="px-4 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors">
                Browse All Cities
              </Link>
            </div>
          </div>
        </section>

        {/* Cross-links to sibling ramen style pages */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">Explore More Ramen Styles Near You</h2>
            <div className="flex flex-wrap gap-2.5">
              {SERVICE_PAGES.filter((s) => s.broth !== broth.type).map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#ffffff] border border-black/8 text-[#1E2026] text-sm font-medium hover:border-[#B57F50]/50 hover:text-[#B57F50] transition-colors"
                >
                  {s.label} Near Me
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
