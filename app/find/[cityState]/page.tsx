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
import { matchModifier, FIND_MODIFIERS } from '@/lib/find-modifiers'
import ModifierCityFindPage from '@/components/modifier-city-find-page'
import { getCityFilterLinks, getMajorCity } from '@/lib/city-filter-pages'
import { getBlogPost } from '@/lib/blog-posts'
import { CITY_GUIDE_CONTENT_SOURCE } from '@/lib/city-guide-migration'

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
  const supplements = restaurants.length === 0 ? getSupplementListings(citySlug, stateCode) : []
  // Skip metadata for unrecognized cities (junk URLs 404 in the page body).
  const isKnown = restaurants.length > 0 || supplements.length > 0 || !!CAPITAL_BY_PARAM[cityState] || MAJOR_SET.has(cityState)
  if (!isKnown) return {}
  // Title-case the slug as a last resort so the title never shows a raw slug
  // (e.g. "quebec" → "Quebec", "maple-grove" → "Maple Grove").
  const citySlugTitle = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const cityName = restaurants[0]?.city ?? CAPITAL_BY_PARAM[cityState]?.city ?? supplements[0]?.city ?? citySlugTitle

  // Listing count drives the Zillow-style title/description ("… - 12 Spots").
  const count = restaurants.length + supplements.length
  const baseTitle = `Best Ramen Restaurants In ${cityName}, ${stateName}`
  const title = count > 0 ? `${baseTitle} - ${count} ${count === 1 ? 'Spot' : 'Spots'}` : baseTitle
  const description = count > 0
    ? `Find the best ramen restaurants in ${cityName}, ${stateName} — ${count} ${count === 1 ? 'spot' : 'spots'} with ratings, hours, menus, and directions. Use our filters to find the perfect bowl near you.`
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

  // Preserved editorial content from a migrated /blog/ "Best Ramen in X" post,
  // if this city has one — spliced into the page rather than lost.
  const cityGuideSlug = CITY_GUIDE_CONTENT_SOURCE[cityState]
  const cityGuidePost = cityGuideSlug ? getBlogPost(cityGuideSlug) : undefined

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

  // Per-city facts so the editorial copy below is unique to each city rather
  // than boilerplate: the top-rated spot by name, and a price/known-for hint.
  const ranked = [...(dbRestaurants.length > 0 ? dbRestaurants : placesResults)]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || ((b.reviewCount ?? 0) - (a.reviewCount ?? 0)))
  const topSpot = ranked[0] as (typeof ranked[number] & { rating?: number | null; reviewCount?: number }) | undefined
  const topName = topSpot?.name ?? ''
  const topRating = topSpot?.rating ?? null
  const runnerUp = ranked[1]?.name ?? ''

  // Nearby ramen cities in the same state — used for keyword-rich internal links.
  const nearbyCitiesMap = new Map<string, { city: string; citySlug: string; stateCode: string }>()
  for (const c of getCities().filter(c => c.stateSlug === stateSlug && c.citySlug !== citySlug)) {
    nearbyCitiesMap.set(c.citySlug, { city: c.city, citySlug: c.citySlug, stateCode: c.stateCode })
  }
  for (const c of getSupplementCitiesByState(stateSlug).filter(c => c.citySlug !== citySlug)) {
    if (!nearbyCitiesMap.has(c.citySlug)) nearbyCitiesMap.set(c.citySlug, { city: c.city, citySlug: c.citySlug, stateCode: c.stateCode })
  }
  const nearbyCities = Array.from(nearbyCitiesMap.values()).slice(0, 12)

  // City-filter pages that exist for this city (major cities only) — e.g.
  // /{city}/{state}/tonkotsu-ramen — so they have a real inbound link.
  const majorCity = getMajorCity(citySlug, stateSlug)
  const filterLinks = majorCity ? getCityFilterLinks(citySlug, stateSlug) : []
  const brothFilterLinks = filterLinks.filter(l => l.group === 'broth')
  const dietFilterLinks = filterLinks.filter(l => l.group === 'diet')

  // Every /find/{modifier}-in-{city}-{state} variant for this city — these
  // render on demand (not statically pre-built) and are otherwise only
  // reachable via the sitemap, so link them all from their base city page.
  const modifierLinks = FIND_MODIFIERS.map(m => ({
    href: `/find/${m.prefix}-${cityState}`,
    label: m.title(cityName, stateName),
  }))

  // Single source of truth for the FAQ — rendered on the page and emitted as
  // FAQPage schema, so the structured data always matches the visible content.
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the best ramen restaurant in ${cityName}, ${stateCode}?`,
      a: topName
        ? `By rating, ${topName} is currently the top ramen spot in ${cityName}${topRating ? ` at ${topRating.toFixed(1)} stars` : ''}. I still recommend opening a couple of listings to skim recent reviews and photos, then sorting the map by rating or distance to pick your bowl.`
        : `Use the map above to find ramen restaurants near ${cityName}, ${stateCode}, sorted by rating and distance, then check recent reviews and photos to choose.`,
    },
    {
      q: `How many ramen restaurants are in ${cityName}, ${stateCode}?`,
      a: count > 0
        ? `There ${count === 1 ? 'is' : 'are'} ${count} ramen ${count === 1 ? 'spot' : 'spots'} listed in ${cityName}, ${stateCode} on RamenNearYou — from quick counter shops to sit-down ramen bars. The map keeps the closest ones at the top once you set your location.`
        : `We are still building out ${cityName}, ${stateCode}, so the map pulls in the nearest ramen spots around it. Enter your ZIP to sort them by distance.`,
    },
    {
      q: `What types of ramen are available in ${cityName}?`,
      a: `You will typically find the classic broths in ${cityName} — tonkotsu, miso, shoyu, and shio — plus styles like tsukemen and spicy bowls at some shops. Use the filter bar above the map to narrow by broth type, price, and dietary preference like vegan or vegetarian.`,
    },
    {
      q: `Is there ramen open late or open now in ${cityName}?`,
      a: `Often, yes. Add the "Open Now" filter to see what is serving this minute in ${cityName}, or "Open Late" for spots going past 10 PM. Hours are checked against each restaurant's posted schedule, and a green "Open" badge confirms it.`,
    },
    {
      q: `How do I find ramen delivery near ${cityName}?`,
      a: `Add the "Delivers" filter above the map to show ${cityName} spots that offer delivery, then open a listing to order. For the freshest bowl, choose a place close to you or one that packs broth and noodles separately.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />
        <ErrorBoundary fallback={null}>
          <HomeMapHero
            initialCenter={{ lat, lng }}
            regionBoundary={{ cityName, stateName, citySlug, stateSlug }}
            pageTitle={`Best Ramen Restaurants In ${cityName}, ${stateName}`}
            pageDescription={`Find ramen restaurants in ${cityName}, ${stateName}. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

            {/* Breadcrumb anchor text */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-6">
              <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
              <span>/</span>
              <Link href="/cities" className="hover:text-[#96602F] transition-colors">Browse Cities &amp; States</Link>
              <span>/</span>
              <Link href={`/${stateSlug}`} className="hover:text-[#96602F] transition-colors">Ramen in {stateName}</Link>
              <span>/</span>
              <span className="text-[#6B6862]">{cityName}</span>
            </nav>

            {/* Preserved editorial guide content, if this city has one */}
            {cityGuidePost && (
              <div className="prose-ramen mb-10 pb-8 border-b border-black/8" dangerouslySetInnerHTML={{ __html: cityGuidePost.content }} />
            )}

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
                          <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">{r.name}</p>
                          {r.address && <p className="text-xs text-[#6B6862] mt-0.5 truncate">{r.address}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            {r.rating && (
                              <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                                <Star className="w-3 h-3 fill-[#B57F50] text-[#96602F]" />
                                {r.rating.toFixed(1)}
                                {r.reviewCount > 0 && <span className="text-[#6B6862]"> ({r.reviewCount.toLocaleString()})</span>}
                              </span>
                            )}
                            {r.priceRange && <span className="text-xs text-[#6B6862]">{r.priceRange}</span>}
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
                        <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">{r.name}</p>
                        {r.address && <p className="text-xs text-[#6B6862] mt-0.5 truncate">{r.address}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-[#6B6862]">
                              <Star className="w-3 h-3 fill-[#B57F50] text-[#96602F]" />
                              {r.rating.toFixed(1)}
                              {r.reviewCount > 0 && <span className="text-[#6B6862]"> ({r.reviewCount.toLocaleString()})</span>}
                            </span>
                          )}
                          {r.priceLevel && <span className="text-xs text-[#6B6862]">{'$'.repeat(r.priceLevel)}</span>}
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

            {/* SEO content — first-person, data-driven so each city reads uniquely */}
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
              Finding Great Ramen in {cityName}, {stateName}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Whenever I am hunting for a bowl in {cityName}, I start with the map above — it shows every
              ramen spot I can find near {cityName}, {stateCode}, and once you drop in your ZIP or tap
              &quot;Use my location,&quot; it sorts them by distance so the closest bowl is right at the top.
              {count > 0
                ? ` Right now I am tracking ${count} ramen ${count === 1 ? 'spot' : 'spots'} in and around ${cityName}, so there is plenty to work with.`
                : ` ${cityName} is still filling in, so I have the map pull in the nearest ramen spots around it too.`}
            </p>
            {topName && (
              <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                If you just want my quick steer, {topName}
                {topRating ? ` is the highest-rated ramen in ${cityName} right now at ${topRating.toFixed(1)} stars` : ` is one of the best-reviewed spots in ${cityName}`}
                {runnerUp ? `, with ${runnerUp} close behind` : ''}. That said, I always check a couple of
                listings myself — skim the recent reviews and the photos, since the bowl that looks carefully
                made usually is.
              </p>
            )}
            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">How I pick a ramen spot in {cityName}</h3>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              My rule of thumb is to favor shops that focus on one or two broths and do them obsessively well,
              and to trust a strong rating that holds up across a lot of reviews over a perfect score from only
              a handful. Then I match the bowl to the moment — something rich and creamy when it is cold out,
              something light and clean for lunch. You can do the same right on the map: filter by broth style
              like{' '}
              <Link href="/find/tonkotsu-ramen" className="text-[#96602F] hover:underline">tonkotsu</Link>,{' '}
              <Link href="/find/miso-ramen" className="text-[#96602F] hover:underline">miso</Link>,{' '}
              <Link href="/find/shoyu-ramen" className="text-[#96602F] hover:underline">shoyu</Link>, or{' '}
              <Link href="/find/shio-ramen" className="text-[#96602F] hover:underline">shio</Link>, then layer on
              what matters that day.
            </p>
            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">Narrowing down what you are craving</h3>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Some nights I just need a bowl that is open this minute; other times I am planning ahead. The
              filters handle both. In {cityName} you can jump straight to{' '}
              <Link href="/find/ramen-open-now" className="text-[#96602F] hover:underline">ramen open now</Link>,{' '}
              <Link href="/find/ramen-open-late" className="text-[#96602F] hover:underline">ramen open late</Link>,{' '}
              <Link href="/find/spicy-ramen" className="text-[#96602F] hover:underline">spicy ramen</Link>,{' '}
              <Link href="/find/vegan-ramen" className="text-[#96602F] hover:underline">vegan ramen</Link>, or the{' '}
              <Link href="/find/top-rated-ramen" className="text-[#96602F] hover:underline">top-rated ramen near you</Link>.
              If you are driving in, the &quot;Free Parking&quot; and &quot;Delivers&quot; filters save a lot of hassle too.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              When you have exhausted {cityName}, it is easy to keep going — explore{' '}
              <Link href={`/${stateSlug}`} className="text-[#96602F] hover:underline">all ramen restaurants in {stateName}</Link> or{' '}
              <Link href="/cities" className="text-[#96602F] hover:underline">browse every city and state</Link> in the directory.
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
                      className="text-sm text-[#96602F] hover:underline"
                    >
                      Ramen in {c.city}, {c.stateCode}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* City-filter pages (major cities only) — broth & diet type links */}
            {filterLinks.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
                  Ramen in {cityName} by Type &amp; Diet
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                  Narrow down what you&apos;re craving in {cityName} with these focused guides:
                </p>
                {brothFilterLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                    {brothFilterLinks.map(l => (
                      <Link key={l.href} href={l.href} className="text-sm text-[#96602F] hover:underline">
                        {l.label} in {cityName}
                      </Link>
                    ))}
                  </div>
                )}
                {dietFilterLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {dietFilterLinks.map(l => (
                      <Link key={l.href} href={l.href} className="text-sm text-[#96602F] hover:underline">
                        {l.label} in {cityName}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modifier variants (open now, tonkotsu-in-city, etc.) for this city */}
            <div className="mb-10">
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
                More Ramen Searches in {cityName}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {modifierLinks.map(l => (
                  <Link key={l.href} href={l.href} className="text-sm text-[#96602F] hover:underline">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {cityGuidePost?.outroContent && (
              <div className="prose-ramen mb-10 pt-2" dangerouslySetInnerHTML={{ __html: cityGuidePost.outroContent }} />
            )}

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
          </section>

          <FindCrossLinks />
          <Footer />
        </div>
      </main>
    </>
  )
}
