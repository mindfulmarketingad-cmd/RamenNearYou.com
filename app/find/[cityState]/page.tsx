import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, ExternalLink } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import { Loader2 } from 'lucide-react'
import { CAPITAL_CITIES, CAPITAL_BY_PARAM } from '@/lib/capital-cities'
import { getRestaurantsByCity } from '@/lib/restaurants'
import { getPlacesSupplements } from '@/lib/places-supplements'

export async function generateStaticParams() {
  return CAPITAL_CITIES.map(c => ({ cityState: c.param }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ cityState: string }> }
): Promise<Metadata> {
  const { cityState } = await params
  const capital = CAPITAL_BY_PARAM[cityState]
  if (!capital) return {}
  const { city, stateCode } = capital
  return {
    title: `Ramen in ${city}, ${stateCode} | Find Ramen Restaurants Near You`,
    description: `Find the best ramen restaurants in ${city}, ${stateCode}. Browse top-rated ramen spots near the ${stateCode} state capital — filter by broth type, price, and hours.`,
    alternates: { canonical: `https://www.ramennearyou.com/find/${cityState}` },
    openGraph: {
      title: `Ramen in ${city}, ${stateCode}`,
      description: `Find ramen restaurants in ${city}, ${stateCode} — browse by broth type, price, and hours.`,
      url: `https://www.ramennearyou.com/find/${cityState}`,
      siteName: 'RamenNearYou',
      type: 'website',
    },
  }
}

export default async function CapitalCityPage(
  { params }: { params: Promise<{ cityState: string }> }
) {
  const { cityState } = await params
  const capital = CAPITAL_BY_PARAM[cityState]
  if (!capital) notFound()

  const { city, stateCode, citySlug, stateSlug, lat, lng } = capital
  const dbRestaurants = getRestaurantsByCity(citySlug, stateSlug)
  const placesResults = dbRestaurants.length === 0 ? getPlacesSupplements(cityState) : []

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Where can I find ramen in ${city}, ${stateCode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the map above to find ramen restaurants in ${city}, ${stateCode}. Enter your ZIP code or click "Use my location" to sort by distance. You can filter by broth type, price, and hours.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best ramen in ${city}, ${stateCode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best ramen in ${city}, ${stateCode} depends on what you are craving. Use our filters to find tonkotsu, miso, shoyu, or spicy ramen near you, sorted by rating and distance.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are there ramen restaurants open late in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the "Open Late" filter on the map to find ramen restaurants in ${city} that are open past 10pm. Many ramen bars and casual spots stay open until midnight or later.`,
        },
      },
    ],
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
                <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
              </div>
            </section>
          }
        >
          <HomeMapHero
            initialCenter={{ lat, lng }}
            pageTitle={`Ramen in ${city}, ${stateCode}`}
            pageDescription={`Find ramen restaurants in ${city}, ${stateCode}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

            {/* DB listings */}
            {dbRestaurants.length > 0 && (
              <>
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
                  Ramen Restaurants in {city}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm mb-6">
                  {dbRestaurants.length} ramen {dbRestaurants.length === 1 ? 'restaurant' : 'restaurants'} in our directory for {city}.
                  {' '}<Link href={`/${citySlug}/${stateSlug}`} className="text-[#B57F50] underline hover:text-[#9a6c42]">
                    View full {city} directory →
                  </Link>
                </p>
                <div className="space-y-3 mb-10">
                  {dbRestaurants.slice(0, 12).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map(r => (
                    <Link
                      key={r.slug}
                      href={`/${citySlug}/${stateSlug}/${r.slug}`}
                      className="flex items-start gap-3 p-4 bg-[#FAFAF9] border border-black/8 rounded-xl hover:border-[#B57F50]/40 transition-colors group"
                    >
                      {r.photo && (
                        <img src={r.photo} alt={r.name} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#F0EDE8]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#B57F50] transition-colors truncate">{r.name}</p>
                        {r.address && <p className="text-xs text-[#9B9490] mt-0.5 truncate">{r.address}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                              <Star className="w-3 h-3 fill-[#B57F50] text-[#B57F50]" />
                              {r.rating.toFixed(1)}
                              {r.reviewCount > 0 && <span className="text-[#9B9490]">({r.reviewCount.toLocaleString()})</span>}
                            </span>
                          )}
                          {r.priceRange && <span className="text-xs text-[#9B9490]">{r.priceRange}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Google Places listings (for capitals with no DB data) */}
            {placesResults.length > 0 && (
              <>
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
                  Ramen Restaurants in {city}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm mb-6">
                  {placesResults.length} ramen spots near {city} via Google Places.
                </p>
                <div className="space-y-3 mb-10">
                  {placesResults.slice(0, 12).map(r => (
                    <a
                      key={r.placeId}
                      href={r.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-[#FAFAF9] border border-black/8 rounded-xl hover:border-[#B57F50]/40 transition-colors group"
                    >
                      {r.photo && (
                        <img src={r.photo} alt={r.name} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#F0EDE8]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#B57F50] transition-colors truncate">{r.name}</p>
                          <ExternalLink className="w-3 h-3 text-[#9B9490] shrink-0" />
                        </div>
                        {r.address && <p className="text-xs text-[#9B9490] mt-0.5 truncate">{r.address}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                              <Star className="w-3 h-3 fill-[#B57F50] text-[#B57F50]" />
                              {r.rating.toFixed(1)}
                              {r.reviewCount > 0 && <span className="text-[#9B9490]">({r.reviewCount.toLocaleString()})</span>}
                            </span>
                          )}
                          {r.priceLevel && (
                            <span className="text-xs text-[#9B9490]">{'$'.repeat(r.priceLevel)}</span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* No results at all */}
            {dbRestaurants.length === 0 && placesResults.length === 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-3">
                  Ramen in {city}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm">
                  We don&apos;t have ramen listings for {city} yet. Use the map above to find the nearest ramen restaurants — or check nearby cities.
                </p>
              </div>
            )}

            {/* SEO content */}
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
              Finding Ramen in {city}, {stateCode}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              RamenNearYou is the largest ramen restaurant directory in the United States. Use the map above to find every ramen restaurant near {city} — filter by broth type (tonkotsu, miso, shoyu, shio), price, dietary preference, and hours.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Enter your ZIP code or tap &quot;Use my location&quot; to sort results by distance from you. The &quot;Open Now&quot; and &quot;Open Late&quot; filters show which {city} ramen spots are currently serving.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Where can I find ramen in ${city}, ${stateCode}?`,
                  a: `Use the map above to find ramen restaurants in ${city}, ${stateCode}. Enter your ZIP code or click "Use my location" to sort by distance. Filter by broth type, price, and hours.`,
                },
                {
                  q: `What is the best ramen in ${city}?`,
                  a: `The best ramen in ${city} depends on what you're craving. Use the filters to find tonkotsu, miso, shoyu, or spicy ramen near you, sorted by rating and distance.`,
                },
                {
                  q: `Are there ramen restaurants open late in ${city}?`,
                  a: `Use the "Open Late" filter on the map to find ramen in ${city} open past 10pm. Many ramen bars and casual spots stay open until midnight or later.`,
                },
              ].map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#B57F50] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <FindCrossLinks />
          <Footer />
        </div>
      </main>
    </>
  )
}
