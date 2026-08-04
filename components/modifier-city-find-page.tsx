import Link from 'next/link'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import UgcFeature from '@/components/ugc-feature'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import PseoListicle from '@/components/pseo-listicle'
import { restaurantsToListicleItems, placesToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { getRestaurantsByCity } from '@/lib/restaurants'
import { getSupplementListings } from '@/lib/places-supplements'
import type { ResolvedCity } from '@/lib/find-city'
import type { FindModifier } from '@/lib/find-modifiers'
import { getBlogPost } from '@/lib/blog-posts'
import { CITY_GUIDE_CONTENT_SOURCE } from '@/lib/city-guide-migration'

export default async function ModifierCityFindPage({
  modifier,
  city,
  cityState,
}: {
  modifier: FindModifier
  city: ResolvedCity
  cityState: string
}) {
  const title = modifier.title(city.cityName, city.stateName)
  const faqs = modifier.faqs(city.cityName, city.stateCode)
  const about = typeof modifier.about === 'function'
    ? modifier.about(city.cityName, city.stateName, city.stateCode)
    : modifier.about
  const cityGuideSlug = CITY_GUIDE_CONTENT_SOURCE[cityState]
  const cityGuidePost = cityGuideSlug ? getBlogPost(cityGuideSlug) : undefined

  // Filter DB restaurants against the modifier's flags/bowls/prices/query so
  // the listicle actually shows matching spots, not just every restaurant in
  // the city — see lib/modifier-match.ts for the shared matching logic.
  const dbRestaurants = getRestaurantsByCity(city.citySlug, city.stateSlug).filter(r => restaurantMatchesModifier(r, modifier.filter))
  const placesResults = dbRestaurants.length === 0 ? getSupplementListings(city.citySlug, city.stateCode) : []
  const ranked = [...dbRestaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = dbRestaurants.length > 0 ? await getAllVerifiedSlugs() : undefined
  const listicleItems = dbRestaurants.length > 0
    ? restaurantsToListicleItems(ranked.slice(0, 24), { citySlug: city.citySlug, stateSlug: city.stateSlug, verifiedSlugs })
    : placesToListicleItems(placesResults.slice(0, 24))
  const count = dbRestaurants.length > 0 ? dbRestaurants.length : placesResults.length

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const mapSlot = (
    <ErrorBoundary fallback={null}>
      <HomeMapHero
        initialBowls={modifier.filter.initialBowls}
        initialFlags={modifier.filter.initialFlags}
        initialPrices={modifier.filter.initialPrices}
        initialQuery={modifier.filter.initialQuery}
        initialCenter={{ lat: city.lat, lng: city.lng }}
        regionBoundary={{ cityName: city.cityName, stateName: city.stateName, citySlug: city.citySlug, stateSlug: city.stateSlug }}
        pageTitle={title}
        pageDescription={`Showing ${modifier.metaNoun} in ${city.cityName}. Enter your ZIP or use your location to sort by distance.`}
      />
    </ErrorBoundary>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />

        <PseoListicle
          breadcrumb={[
            { label: 'Ramen Near You', href: '/' },
            { label: modifier.hubLabel, href: modifier.hubHref },
            { label: `Ramen in ${city.stateName}`, href: `/${city.stateSlug}` },
            { label: city.cityName },
          ]}
          title={count > 0 ? `${title} — ${count} Spot${count === 1 ? '' : 's'}` : title}
          subtitle={`Every spot we track for ${modifier.metaNoun} in ${city.cityName}, ranked by rating and review volume. Search by name, or switch to the map.`}
          items={listicleItems}
          noun="restaurant"
          nounPlural="restaurants"
          searchPlaceholder="Search by name..."
          filterLabel="Feature"
          primaryCtaLabel="View details"
          mapSlot={mapSlot}
        />

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-6">
              <AdUnitInArticle />
            </div>

            {cityGuidePost && (
              <div className="prose-ramen mb-10 pb-8 border-b border-black/8" dangerouslySetInnerHTML={{ __html: cityGuidePost.content }} />
            )}

            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              {title}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              When I am after {modifier.metaNoun} in {city.cityName}, the list above is where I start. It is
              already filtered toward {modifier.metaNoun}, so it is easy to compare ratings, hours, and photos
              and pick the bowl you actually want — or switch to the map and tap &quot;Use my location&quot; to
              sort the same list by distance.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3">
              What makes great {modifier.metaNoun}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-6">{about}</p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3">
              How I find the best {modifier.metaNoun} in {city.cityName}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              My approach is simple: I favor shops that specialize rather than do a little of everything, and I
              trust a strong rating that holds up across plenty of reviews over a perfect score from just a
              few. In {city.cityName}, I open a couple of listings, skim the most recent reviews and the
              photos, and go with the bowl that looks carefully made. The map keeps everything sorted by
              distance, so you are never trading quality for a long drive.
            </p>
            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">
              Tips for ordering {modifier.metaNoun}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {[
                `Sort by distance once you set your location so the nearest ${modifier.metaNoun} in ${city.cityName} is on top.`,
                'Open a few listings and read the most recent reviews — fresh, specific praise is the best signal.',
                'Use the Filters button to stack on what matters: open now, price, or dietary needs.',
                'Ask the shop for noodle firmness and spice level so the bowl arrives exactly how you like it.',
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-[#6B6862] text-sm leading-relaxed">
                  <span className="text-[#96602F] shrink-0 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Prefer to widen the search? You can browse all{' '}
              <Link href={`/find/${city.citySlug}-${city.stateCode.toLowerCase()}`} className="text-[#96602F] hover:underline">
                ramen in {city.cityName}, {city.stateCode}
              </Link>{' '}
              or jump to{' '}
              <Link href={modifier.hubHref} className="text-[#96602F] hover:underline">{modifier.hubLabel.toLowerCase()} near you</Link>{' '}
              nationwide.
            </p>

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

            <div className="mt-10 pt-8 border-t border-black/8">
              <p className="text-xs text-[#6B6862]">
                Also browsing:{' '}
                <Link href={modifier.hubHref} className="hover:text-[#96602F] underline">{modifier.hubLabel} Near Me</Link>
                {' · '}
                <Link href={`/find/${city.citySlug}-${city.stateCode.toLowerCase()}`} className="hover:text-[#96602F] underline">
                  Ramen in {city.cityName}, {city.stateCode}
                </Link>
                {' · '}
                <Link href={`/${city.stateSlug}`} className="hover:text-[#96602F] underline">
                  Ramen in {city.stateName}
                </Link>
              </p>
            </div>
          </section>

          <UgcFeature seed={`/find/${cityState}`} />
          <FindCrossLinks currentHref={`/find/${cityState}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
