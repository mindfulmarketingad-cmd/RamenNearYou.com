import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import SafeImg from '@/components/safe-img'
import { CAPITAL_BY_PARAM } from '@/lib/capital-cities'
import { getCities, getRestaurantsByCity } from '@/lib/restaurants'
import { getSupplementListings, getSupplementCitiesByState } from '@/lib/places-supplements'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from '@/lib/state-lookups'
import { MAJOR_CITIES_PARAMS } from '@/lib/major-cities-list'
import { getFindCityParams, resolveFindCity } from '@/lib/find-city'
import { matchModifier } from '@/lib/find-modifiers'
import ModifierCityFindPage from '@/components/modifier-city-find-page'

function parseParam(cityState: string): { citySlug: string; stateCode: string } | null {
  const lastHyphen = cityState.lastIndexOf('-')
  if (lastHyphen < 1) return null
  const stateCode = cityState.slice(lastHyphen + 1).toUpperCase()
  const citySlug = cityState.slice(0, lastHyphen)
  if (!STATE_CODE_TO_SLUG[stateCode]) return null
  return { citySlug, stateCode }
}

const MAJOR_SET = new Set(MAJOR_CITIES_PARAMS)

export async function generateStaticParams() {
  // Pre-render only the base city pages. The {broth}-in-{city}-{state} modifier
  // variants (8 per city, ~11k pages) render on demand and cache via ISR
  // (dynamicParams defaults to true) — keeping the build from ballooning.
  return getFindCityParams()
}

export async function generateMetadata(
  { params }: { params: Promise<{ cityState: string }> }
): Promise<Metadata> {
  const { cityState } = await params

  // Modifier page (e.g. tonkotsu-ramen-in-dallas-tx)
  const mod = matchModifier(cityState)
  if (mod) {
    const city = resolveFindCity(mod.rest)
    if (!city || !city.known) return {}
    const title = mod.modifier.title(city.cityName, city.stateName)
    const description = `Find ${mod.modifier.metaNoun} in ${city.cityName}, ${city.stateName}. Browse spots near ${city.cityName} — filter by location, price, and hours.`
    return {
      title,
      description,
      alternates: { canonical: `https://www.ramennearyou.com/find/${cityState}` },
      openGraph: { title, description, url: `https://www.ramennearyou.com/find/${cityState}`, siteName: 'RamenNearYou', type: 'website' },
    }
  }

  const parsed = parseParam(cityState)
  if (!parsed) return {}

  const { citySlug, stateCode } = parsed
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  const stateName = STATE_CODE_TO_NAME[stateCode] ?? stateCode
  const restaurants = getRestaurantsByCity(citySlug, stateSlug)
  // Skip metadata for unrecognized cities (junk URLs 404 in the page body).
  const isKnown = restaurants.length > 0 || getSupplementListings(citySlug, stateCode).length > 0 || !!CAPITAL_BY_PARAM[cityState] || MAJOR_SET.has(cityState)
  if (!isKnown) return {}
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

  // Modifier page (e.g. tonkotsu-ramen-in-dallas-tx) — rendered by the shared
  // ModifierCityFindPage. Lives in this catch-all because Next does not support
  // partial dynamic route segments.
  const mod = matchModifier(cityState)
  if (mod) {
    const city = resolveFindCity(mod.rest)
    if (!city || !city.known) notFound()
    return <ModifierCityFindPage modifier={mod.modifier} city={city} cityState={cityState} />
  }

  const parsed = parseParam(cityState)
  if (!parsed) notFound()

  const { citySlug, stateCode } = parsed!
  const stateSlug = STATE_CODE_TO_SLUG[stateCode]
  const stateName = STATE_CODE_TO_NAME[stateCode] ?? stateCode

  const dbRestaurants = getRestaurantsByCity(citySlug, stateSlug)
  const placesResults = dbRestaurants.length === 0 ? getSupplementListings(citySlug, stateCode) : []

  // Guard: 404 unrecognized "{junk}-{state}" URLs (e.g. japanese-ramen-near-va)
  // instead of rendering an empty city page. A city is real if it has DB or
  // supplement listings, or is a known capital or major city.
  const capital = CAPITAL_BY_PARAM[cityState]
  if (dbRestaurants.length === 0 && placesResults.length === 0 && !capital && !MAJOR_SET.has(cityState)) {
    notFound()
  }

  // Title-case the citySlug as a fallback name ("green-river" → "Green River")
  const citySlugTitle = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const cityName = dbRestaurants[0]?.city ?? capital?.city ?? citySlugTitle

  // Map center: capital → DB restaurant → first supplement result → USA center
  const lat = capital?.lat ?? dbRestaurants.find(r => r.latitude)?.latitude ?? placesResults.find(r => r.latitude)?.latitude ?? 39.5
  const lng = capital?.lng ?? dbRestaurants.find(r => r.longitude)?.longitude ?? placesResults.find(r => r.longitude)?.longitude ?? -98.35

  const count = dbRestaurants.length + placesResults.length

  // Nearby ramen cities in the same state — used for keyword-rich internal links.
  const nearbyCitiesMap = new Map<string, { city: string; citySlug: string; stateCode: string }>()
  for (const c of getCities().filter(c => c.stateSlug === stateSlug && c.citySlug !== citySlug)) {
    nearbyCitiesMap.set(c.citySlug, { city: c.city, citySlug: c.citySlug, stateCode: c.stateCode })
  }
  for (const c of getSupplementCitiesByState(stateSlug).filter(c => c.citySlug !== citySlug)) {
    if (!nearbyCitiesMap.has(c.citySlug)) nearbyCitiesMap.set(c.citySlug, { city: c.city, citySlug: c.citySlug, stateCode: c.stateCode })
  }
  const nearbyCities = Array.from(nearbyCitiesMap.values()).slice(0, 12)

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
        <ErrorBoundary fallback={null}>
          <HomeMapHero
            initialCenter={{ lat, lng }}
            pageTitle={`Best Ramen Restaurants In ${cityName}, ${stateName}`}
            pageDescription={`Find ramen restaurants in ${cityName}, ${stateName}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

            {/* Breadcrumb anchor text */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#9B9490] mb-6">
              <Link href="/" className="hover:text-[#B57F50] transition-colors">Ramen Near You</Link>
              <span>/</span>
              <Link href="/cities" className="hover:text-[#B57F50] transition-colors">Browse Cities &amp; States</Link>
              <span>/</span>
              <Link href={`/${stateSlug}`} className="hover:text-[#B57F50] transition-colors">Ramen in {stateName}</Link>
              <span>/</span>
              <span className="text-[#6B6862]">{cityName}</span>
            </nav>

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
                    <Link
                      key={r.placeId}
                      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
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
                          {r.priceLevel && <span className="text-xs text-[#9B9490]">{'$'.repeat(r.priceLevel)}</span>}
                        </div>
                      </div>
                    </Link>
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
              RamenNearYou is the largest <Link href="/" className="text-[#B57F50] hover:underline">ramen restaurant directory</Link> in the United States. Use the map above to find every ramen restaurant near {cityName} — or browse by broth style:{' '}
              <Link href="/find/tonkotsu-ramen" className="text-[#B57F50] hover:underline">tonkotsu ramen</Link>,{' '}
              <Link href="/find/miso-ramen" className="text-[#B57F50] hover:underline">miso ramen</Link>,{' '}
              <Link href="/find/shoyu-ramen" className="text-[#B57F50] hover:underline">shoyu ramen</Link>, and{' '}
              <Link href="/find/shio-ramen" className="text-[#B57F50] hover:underline">shio ramen</Link>.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Looking for something specific in {cityName}? Find{' '}
              <Link href="/find/ramen-open-now" className="text-[#B57F50] hover:underline">ramen open now</Link>,{' '}
              <Link href="/find/ramen-open-late" className="text-[#B57F50] hover:underline">ramen open late</Link>,{' '}
              <Link href="/find/spicy-ramen" className="text-[#B57F50] hover:underline">spicy ramen</Link>,{' '}
              <Link href="/find/vegan-ramen" className="text-[#B57F50] hover:underline">vegan ramen</Link>, or the{' '}
              <Link href="/find/top-rated-ramen" className="text-[#B57F50] hover:underline">top rated ramen restaurants near you</Link>.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Enter your ZIP code or tap &quot;Use my location&quot; to sort results by distance. You can also explore{' '}
              <Link href={`/${stateSlug}`} className="text-[#B57F50] hover:underline">all ramen restaurants in {stateName}</Link> or{' '}
              <Link href="/cities" className="text-[#B57F50] hover:underline">browse every city and state</Link> in our directory.
            </p>

            {/* Nearby cities — keyword-rich internal links */}
            {nearbyCities.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
                  More Ramen Near {cityName} in {stateName}
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                  Browse ramen restaurants in other {stateName} cities near {cityName}:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {nearbyCities.map(c => (
                    <Link
                      key={c.citySlug}
                      href={`/find/${c.citySlug}-${c.stateCode.toLowerCase()}`}
                      className="text-sm text-[#B57F50] hover:underline"
                    >
                      Ramen in {c.city}, {c.stateCode}
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
