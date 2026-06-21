import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ExternalLink } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import { Loader2 } from 'lucide-react'
import SafeImg from '@/components/safe-img'
import { CAPITAL_BY_PARAM } from '@/lib/capital-cities'
import { getCities, getRestaurantsByCity } from '@/lib/restaurants'
import { getPlacesSupplements } from '@/lib/places-supplements'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from '@/lib/state-lookups'
import { MAJOR_CITIES_PARAMS } from '@/lib/major-cities-list'

function parseParam(cityState: string): { citySlug: string; stateCode: string } | null {
  const lastHyphen = cityState.lastIndexOf('-')
  if (lastHyphen < 1) return null
  const stateCode = cityState.slice(lastHyphen + 1).toUpperCase()
  const citySlug = cityState.slice(0, lastHyphen)
  if (!STATE_CODE_TO_SLUG[stateCode]) return null
  return { citySlug, stateCode }
}

export async function generateStaticParams() {
  // All DB cities with 2+ restaurants
  const dbParams = getCities()
    .filter(c => c.count >= 2)
    .map(c => ({ cityState: `${c.citySlug}-${c.stateCode.toLowerCase()}` }))

  const dbSet = new Set(dbParams.map(p => p.cityState))

  // Capital cities not already in DB params
  const { CAPITAL_CITIES } = await import('@/lib/capital-cities')
  const capitalParams = CAPITAL_CITIES
    .filter(c => !dbSet.has(c.param))
    .map(c => ({ cityState: c.param }))

  // Major cities across all 50 states not already covered
  const majorParams = MAJOR_CITIES_PARAMS
    .filter(p => !dbSet.has(p))
    .map(p => ({ cityState: p }))

  return [...dbParams, ...capitalParams, ...majorParams]
}

export async function generateMetadata(
  { params }: { params: Promise<{ cityState: string }> }
): Promise<Metadata> {
  const { cityState } = await params
  const parsed = parseParam(cityState)
  if (!parsed) return {}

  const { citySlug, stateCode } = parsed
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  const stateName = STATE_CODE_TO_NAME[stateCode] ?? stateCode
  const restaurants = getRestaurantsByCity(citySlug, stateSlug)
  const cityName = restaurants[0]?.city ?? CAPITAL_BY_PARAM[cityState]?.city ?? citySlug

  const count = restaurants.length
  const title = `Best Ramen Restaurants In ${cityName}, ${stateName}`
  const description = count > 0
    ? `Find the best ramen restaurants in ${cityName}, ${stateName}. Browse ${count} top-rated spots with ratings, hours, menus, and directions.`
    : `Find ramen restaurants in ${cityName}, ${stateName}. Browse top-rated spots with ratings, hours, and directions.`

  return {
    title,
    description,
    alternates: { canonical: `https://www.ramennearyou.com/find/${cityState}` },
    openGraph: {
      title,
      description,
      url: `https://www.ramennearyou.com/find/${cityState}`,
      siteName: 'RamenNearYou',
      type: 'website',
    },
  }
}

export default async function CityFindPage(
  { params }: { params: Promise<{ cityState: string }> }
) {
  const { cityState } = await params
  const parsed = parseParam(cityState)
  if (!parsed) notFound()

  const { citySlug, stateCode } = parsed!
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  const stateName = STATE_CODE_TO_NAME[stateCode] ?? stateCode

  const dbRestaurants = getRestaurantsByCity(citySlug, stateSlug)
  const placesResults = dbRestaurants.length === 0 ? getPlacesSupplements(cityState) : []

  const capital = CAPITAL_BY_PARAM[cityState]
  const cityName = dbRestaurants[0]?.city ?? capital?.city ?? citySlug

  // Map center: capital coords if known, otherwise first restaurant with coords
  const lat = capital?.lat ?? dbRestaurants.find(r => r.latitude)?.latitude ?? 39.5
  const lng = capital?.lng ?? dbRestaurants.find(r => r.longitude)?.longitude ?? -98.35

  const count = dbRestaurants.length + placesResults.length

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best ramen restaurant in ${cityName}, ${stateCode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: dbRestaurants.length > 0
            ? `RamenNearYou lists ${dbRestaurants.length} ramen restaurants in ${cityName}, ${stateCode}. Use the map above to find the highest-rated spot near you — filter by broth type, price, and hours.`
            : `Use the map above to find ramen restaurants near ${cityName}, ${stateCode}. Filter by broth type, price, and hours to find your ideal bowl.`,
        },
      },
      {
        '@type': 'Question',
        name: `How many ramen restaurants are in ${cityName}, ${stateCode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: count > 0
            ? `There are ${count} ramen restaurants listed in ${cityName}, ${stateCode} on RamenNearYou. Our directory covers the full city, from quick lunch spots to sit-down ramen bars.`
            : `Use the map above to find ramen restaurants in and around ${cityName}, ${stateCode}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What types of ramen are available in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ramen restaurants in ${cityName} serve a variety of broth styles including tonkotsu, miso, shoyu, and shio. Use the filter bar above the map to narrow by broth type, price, and dietary preference.`,
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
            pageTitle={`Best Ramen Restaurants In ${cityName}, ${stateName}`}
            pageDescription={`Find ramen restaurants in ${cityName}, ${stateName}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

            {/* DB listings */}
            {dbRestaurants.length > 0 && (
              <>
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
                  Ramen Restaurants in {cityName}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm mb-6">
                  {dbRestaurants.length} ramen {dbRestaurants.length === 1 ? 'restaurant' : 'restaurants'} in our directory.
                </p>
                <div className="space-y-3 mb-10">
                  {dbRestaurants
                    .slice()
                    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                    .slice(0, 20)
                    .map(r => (
                      <Link
                        key={r.slug}
                        href={`/${citySlug}/${stateSlug}/${r.slug}`}
                        className="flex items-start gap-3 p-4 bg-[#FAFAF9] border border-black/8 rounded-xl hover:border-[#B57F50]/40 transition-colors group"
                      >
                        <SafeImg src={r.photo} alt={r.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#B57F50] transition-colors truncate">{r.name}</p>
                          {r.address && <p className="text-xs text-[#9B9490] mt-0.5 truncate">{r.address}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            {r.rating && (
                              <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                                <Star className="w-3 h-3 fill-[#B57F50] text-[#B57F50]" />
                                {r.rating.toFixed(1)}
                                {r.reviewCount > 0 && <span className="text-[#9B9490]"> ({r.reviewCount.toLocaleString()})</span>}
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

            {/* Google Places listings (capitals with no DB data) */}
            {placesResults.length > 0 && (
              <>
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
                  Ramen Restaurants in {cityName}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm mb-6">
                  {placesResults.length} ramen spots near {cityName}.
                </p>
                <div className="space-y-3 mb-10">
                  {placesResults.slice(0, 20).map(r => (
                    <a
                      key={r.placeId}
                      href={r.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-[#FAFAF9] border border-black/8 rounded-xl hover:border-[#B57F50]/40 transition-colors group"
                    >
                      <SafeImg src={r.photo} alt={r.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
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
                              {r.reviewCount > 0 && <span className="text-[#9B9490]"> ({r.reviewCount.toLocaleString()})</span>}
                            </span>
                          )}
                          {r.priceLevel && <span className="text-xs text-[#9B9490]">{'$'.repeat(r.priceLevel)}</span>}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {count === 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-3">
                  Ramen in {cityName}, {stateCode}
                </h2>
                <p className="text-[#6B6862] text-sm">
                  We don&apos;t have ramen listings for {cityName} yet. Use the map above to find the nearest ramen restaurants.
                </p>
              </div>
            )}

            {/* SEO content */}
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
              Finding Ramen in {cityName}, {stateName}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              RamenNearYou is the largest ramen restaurant directory in the United States. Use the map above to find every ramen restaurant near {cityName} — filter by broth type (tonkotsu, miso, shoyu, shio), price, dietary preference, and hours.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Enter your ZIP code or tap &quot;Use my location&quot; to sort results by distance from you. The &quot;Open Now&quot; and &quot;Open Late&quot; filters show which {cityName} ramen spots are currently serving.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `What is the best ramen restaurant in ${cityName}, ${stateCode}?`,
                  a: dbRestaurants.length > 0
                    ? `RamenNearYou lists ${dbRestaurants.length} ramen restaurants in ${cityName}, ${stateCode}. Use the map above — sort by rating or distance to find the best bowl near you.`
                    : `Use the map above to find ramen restaurants near ${cityName}, ${stateCode}, sorted by rating and distance.`,
                },
                {
                  q: `How many ramen restaurants are in ${cityName}, ${stateCode}?`,
                  a: count > 0
                    ? `There are ${count} ramen restaurants listed in ${cityName}, ${stateCode} on RamenNearYou — from quick lunch spots to sit-down ramen bars.`
                    : `Use the map above to find ramen spots in and around ${cityName}, ${stateCode}.`,
                },
                {
                  q: `What types of ramen are available in ${cityName}?`,
                  a: `Ramen restaurants in ${cityName} serve a variety of broth styles including tonkotsu, miso, shoyu, and shio. Use the filter bar above to narrow by broth type, price, and dietary preference.`,
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
