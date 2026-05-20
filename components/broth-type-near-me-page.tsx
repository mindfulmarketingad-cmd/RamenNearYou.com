import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Utensils, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Restaurant } from '@/lib/restaurants'

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
          <div className="max-w-4xl mx-auto">
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
        </section>

        {/* Restaurant grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#6B6862] text-sm mb-6">{restaurants.length} ramen restaurants found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="group flex flex-col bg-[#ffffff] rounded-xl border border-black/5 hover:border-[#B57F50]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
                >
                  <div className="relative w-full h-44 bg-[#F5F4F0] overflow-hidden">
                    {r.photo ? (
                      <Image
                        src={r.photo}
                        alt={r.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B57F50]/30">
                        <Utensils className="w-12 h-12" />
                      </div>
                    )}
                    {r.priceRange && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-[#1E2026] text-xs font-medium backdrop-blur-sm">
                        {r.priceRange}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-2">
                    <h2 className="font-semibold text-[#1E2026] text-base leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">
                      {r.name}
                    </h2>
                    {(r.rating || r.reviewCount > 0) && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-[#1E2026] text-sm font-medium">{r.rating?.toFixed(1)}</span>
                        <span className="text-[#6B6862]/60 text-xs">({r.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 text-[#6B6862] text-xs">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#B57F50]" />
                      <span className="line-clamp-1">{r.address}</span>
                    </div>
                    <div className="mt-auto pt-2 border-t border-black/5 flex justify-between items-center">
                      <span className="text-xs text-[#6B6862]/60">{r.city}, {r.stateCode}</span>
                      <span className="text-[#B57F50] text-xs font-medium group-hover:underline">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/broth" className="px-4 py-2.5 rounded-lg border border-[#B57F50]/40 text-[#B57F50] text-sm font-medium hover:bg-[#B57F50]/10 transition-colors">
                Browse All Broth Types
              </Link>
              <Link href="/cities" className="px-4 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors">
                Browse All Cities
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
