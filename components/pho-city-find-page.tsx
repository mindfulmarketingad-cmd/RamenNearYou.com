import Link from 'next/link'
import { Star } from 'lucide-react'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import UgcFeature from '@/components/ugc-feature'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import AdUnitInFeed from '@/components/ad-unit-infeed'
import RestaurantImage from '@/components/restaurant-image'
import { Loader2 } from 'lucide-react'
import type { PhoCity } from '@/lib/pho'
import { phoCityParam } from '@/lib/pho'
import { buildPhoCitySections } from '@/lib/pho-city-content'

export default function PhoCityFindPage({
  city,
  nearbyCities,
}: {
  city: PhoCity
  nearbyCities: Array<{ city: string; citySlug: string; stateCode: string; count: number }>
}) {
  const { cityName, stateName, stateCode, stateSlug, citySlug, listings } = city
  const count = listings.length
  const sections = buildPhoCitySections(city, nearbyCities)
  const cityStateParam = `${citySlug}-${stateCode.toLowerCase()}`
  const ramenCityHref = `/find/${cityStateParam}`

  const faqs = [
    {
      q: `How many pho restaurants are in ${cityName}, ${stateCode}?`,
      a: `There are ${count} pho ${count === 1 ? 'restaurant' : 'restaurants'} listed in ${cityName}, ${stateName} on RamenNearYou.`,
    },
    {
      q: `What is the best pho restaurant in ${cityName}?`,
      a: listings[0]
        ? `By rating, ${listings[0].name}${listings[0].rating != null ? ` at ${listings[0].rating.toFixed(1)} stars` : ''} currently leads ${cityName}. I'd still open the listing and skim recent reviews before deciding.`
        : `Use the map above to browse pho restaurants in and around ${cityName}.`,
    },
    {
      q: `Is pho different from ramen?`,
      a: `Yes. Pho is a Vietnamese dish built on a clear beef or chicken broth with flat rice noodles, finished by the diner with fresh herbs and lime. Ramen is Japanese, uses alkaline wheat noodles, and arrives with a richer, pre-composed broth.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />
        <ErrorBoundary
          fallback={
            <section className="pt-16 bg-[#F5F4F0]">
              <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
              </div>
            </section>
          }
        >
          <HomeMapHero
            initialCenter={{ lat: listings[0]?.latitude ?? 39.5, lng: listings[0]?.longitude ?? -98.35 }}
            initialFlags={['pho']}
            regionBoundary={{ cityName, stateName, citySlug, stateSlug }}
            pageTitle={`Pho Restaurants in ${cityName} ${stateCode}`}
            pageDescription={`There are ${count} pho restaurants in ${cityName} ${stateName}.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-6">
              <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
              <span>/</span>
              <Link href="/find/pho-restaurants" className="hover:text-[#96602F] transition-colors">Pho Restaurants</Link>
              <span>/</span>
              <span className="text-[#6B6862]">{cityName}, {stateCode}</span>
            </nav>

            <div className="mb-6">
              <AdUnitInArticle />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">
              Pho Restaurants in {cityName} {stateCode}
            </h2>
            <p className="text-[#6B6862] text-sm mb-8">
              There are {count} pho {count === 1 ? 'restaurant' : 'restaurants'} in {cityName} {stateName}.
            </p>

            {/* Listing preview */}
            <div className="space-y-3 mb-10">
              {listings.slice(0, 20).map((p, i) => (
                <div key={p.slug}>
                  <Link
                    href={`/partners/${p.slug}`}
                    className="flex items-start gap-3 p-4 bg-[#FAFAF9] border border-black/8 rounded-xl hover:border-[#16a34a]/40 transition-colors group"
                  >
                    <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ECEAE4]">
                      <RestaurantImage src={p.photo} alt={p.name} fill className="object-cover" sizes="56px" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#16a34a] transition-colors truncate">{p.name}</p>
                      {p.address && <p className="text-xs text-[#6B6862] mt-0.5 truncate">{p.address}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {p.rating != null && (
                          <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                            <Star className="w-3 h-3 fill-[#B57F50] text-[#96602F]" />
                            {p.rating.toFixed(1)}
                            {p.reviewCount > 0 && <span className="text-[#6B6862]"> ({p.reviewCount.toLocaleString()})</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {i === 3 && <div className="mt-3"><AdUnitInFeed /></div>}
                </div>
              ))}
            </div>

            {/* SEO content */}
            {sections.map((s, i) => (
              <div key={s.id} className={i > 0 ? 'mt-8' : ''}>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">{s.heading}</h2>
                {s.paragraphs.map((html, j) => (
                  <p key={j} className="text-[#6B6862] text-sm leading-relaxed mb-3.5" dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            ))}

            <p className="text-[#6B6862] text-sm leading-relaxed mt-8 mb-8">
              Ready to look outside {cityName}? Browse{' '}
              <Link href={ramenCityHref} className="text-[#96602F] hover:underline">
                ramen restaurants in {cityName}, {stateCode}
              </Link>{' '}
              or every{' '}
              <Link href={`/${stateSlug}`} className="text-[#96602F] hover:underline">
                ramen restaurant in {stateName}
              </Link>.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#96602F] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-black/8">
              <p className="text-xs text-[#6B6862]">
                Also browsing:{' '}
                <Link href={ramenCityHref} className="hover:text-[#96602F] underline">
                  Ramen in {cityName}, {stateCode}
                </Link>
                {' · '}
                <Link href={`/${stateSlug}`} className="hover:text-[#96602F] underline">
                  Ramen in {stateName}
                </Link>
                {' · '}
                <Link href="/find/pho-restaurants" className="hover:text-[#96602F] underline">Pho Restaurants Near Me</Link>
                {' · '}
                <Link href="/partners" className="hover:text-[#96602F] underline">Partners Directory</Link>
              </p>
            </div>
          </section>

          <UgcFeature seed={`/find/${phoCityParam(citySlug, stateCode)}`} />
          <FindCrossLinks currentHref={`/find/${phoCityParam(citySlug, stateCode)}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
