import Link from 'next/link'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import UgcFeature from '@/components/ugc-feature'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import PseoListicle from '@/components/pseo-listicle'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'
import type { NeighborhoodDef } from '@/lib/neighborhoods'
import { getNeighborhoodRestaurants, getSiblingNeighborhoods, neighborhoodParam, neighborhoodStateSlug, neighborhoodStateName } from '@/lib/neighborhoods'
import { getReviewSlug, hasReviewPage } from '@/lib/reviews'

export default async function NeighborhoodFindPage({ hood }: { hood: NeighborhoodDef }) {
  const stateSlug = neighborhoodStateSlug(hood)
  const stateName = neighborhoodStateName(hood)
  const cityHref = `/find/${hood.citySlug}-${hood.stateCode.toLowerCase()}`
  const list = getNeighborhoodRestaurants(hood)
  const count = list.length
  const top = list[0]
  const topReviewSlug = top ? getReviewSlug(top) : undefined
  const topHasReview = topReviewSlug ? hasReviewPage(topReviewSlug) : false
  const siblings = getSiblingNeighborhoods(hood)

  const title = `Ramen Restaurants in ${hood.name}`
  const description = `There are ${count} ramen restaurants in ${hood.name} ${stateName}`

  const faqs = [
    {
      q: `How many ramen restaurants are in ${hood.name}?`,
      a: `There are ${count} ramen ${count === 1 ? 'restaurant' : 'restaurants'} listed in ${hood.name}, ${hood.cityName} on RamenNearYou, drawn from a ${hood.radiusMi}-mile radius around the neighborhood's core.`,
    },
    {
      q: `What is the best ramen restaurant in ${hood.name}?`,
      a: top
        ? `By rating, ${top.name}${top.rating ? ` at ${top.rating.toFixed(1)} stars` : ''} currently leads ${hood.name}. I'd still open a couple of the top listings and skim recent reviews before deciding, since ratings can shift.`
        : `Use the map above to browse ramen restaurants in and around ${hood.name}, sorted by rating and distance.`,
    },
    {
      q: `Is there ramen delivery or takeout in ${hood.name}?`,
      a: `Many restaurants in ${hood.name} offer delivery or takeout. Use the Filters button above the map to narrow the list to spots that deliver or that you can order ahead from.`,
    },
    {
      q: `What ramen styles can I find in ${hood.name}?`,
      a: `${hood.name} typically has a mix of the classic broths — tonkotsu, shoyu, shio, and miso — plus lighter and vegetarian options at some shops. Use the broth filters on the map to narrow it down.`,
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

  const verifiedSlugs = count > 0 ? await getAllVerifiedSlugs() : undefined
  const listicleItems = restaurantsToListicleItems(list, { verifiedSlugs })

  const mapSlot = (
    <ErrorBoundary fallback={null}>
      <HomeMapHero
        initialCenter={{ lat: hood.lat, lng: hood.lng }}
        regionBoundary={{ cityName: hood.cityName, stateName, citySlug: hood.citySlug, stateSlug }}
        pageTitle={title}
        pageDescription={`Showing ramen restaurants in and around ${hood.name}, ${hood.cityName}. Enter your ZIP or use your location to sort by distance.`}
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
            { label: `Ramen in ${hood.cityName}, ${hood.stateCode}`, href: cityHref },
            { label: hood.name },
          ]}
          title={count > 0 ? `${count} Ramen Restaurant${count === 1 ? '' : 's'} in ${hood.name}` : `Ramen in ${hood.name}`}
          subtitle={`Every ramen restaurant within about ${hood.radiusMi} miles of ${hood.name}'s center, ranked by rating and review volume. Search by name, or switch to the map.`}
          items={listicleItems}
          noun="ramen restaurant"
          nounPlural="ramen restaurants"
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

            {/* SEO content — neighborhood-specific, first-person */}
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
              Eating Ramen in {hood.name}, {hood.cityName}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">{hood.vibe}</p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              I built this page by pulling every ramen restaurant within about {hood.radiusMi} miles of {hood.name}&apos;s
              center, so what you see above is genuinely local to this neighborhood — not just {hood.cityName} in
              general. Right now that&apos;s {count} {count === 1 ? 'spot' : 'spots'}, and the map at the top of this
              page keeps the list live: enter your ZIP or tap &quot;Use my location&quot; and it re-sorts by distance
              from exactly where you are standing in {hood.name}.
            </p>
            {top && (
              <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                Right now, {top.name}
                {top.rating ? ` is the highest-rated ramen spot in ${hood.name} at ${top.rating.toFixed(1)} stars` : ` is one of the best-reviewed spots in ${hood.name}`}
                {list[1] ? `, with ${list[1].name} close behind` : ''}. I&apos;d still open both listings and skim the
                most recent reviews and photos before deciding — a rating is a good starting filter, not the final word.
                {topHasReview && topReviewSlug && (
                  <>
                    {' '}You can read our full{' '}
                    <Link href={`/reviews/${topReviewSlug}`} className="text-[#96602F] hover:underline">
                      review of {top.name}
                    </Link>{' '}
                    for more detail.
                  </>
                )}
              </p>
            )}

            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">
              How I pick a bowl in {hood.name}
            </h3>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              My rule of thumb anywhere, including {hood.name}, is to favor shops that specialize in one or two
              broths and clearly obsess over them, rather than a long menu that does everything adequately. I also
              weigh a strong rating that holds up across hundreds of reviews more heavily than a perfect score from
              a handful. From there it&apos;s about matching the bowl to the moment — something rich like{' '}
              <Link href="/find/tonkotsu-ramen" className="text-[#96602F] hover:underline">tonkotsu</Link> on a cold
              night, something lighter like{' '}
              <Link href="/find/shio-ramen" className="text-[#96602F] hover:underline">shio</Link> or{' '}
              <Link href="/find/light-ramen" className="text-[#96602F] hover:underline">light &amp; clean ramen</Link>{' '}
              for lunch.
            </p>

            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">
              Narrowing down what you&apos;re craving in {hood.name}
            </h3>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              If you need something serving right now, jump straight to{' '}
              <Link href="/find/ramen-open-now" className="text-[#96602F] hover:underline">ramen open now</Link> or{' '}
              <Link href="/find/ramen-open-late" className="text-[#96602F] hover:underline">ramen open late</Link>.
              Craving something specific? Try{' '}
              <Link href="/find/spicy-ramen" className="text-[#96602F] hover:underline">spicy ramen</Link>,{' '}
              <Link href="/find/vegan-ramen" className="text-[#96602F] hover:underline">vegan ramen</Link>, or{' '}
              <Link href="/find/vegetarian-ramen" className="text-[#96602F] hover:underline">vegetarian ramen</Link>.
              And if you&apos;re heading out on foot, the &quot;Delivers&quot; and &quot;Takeout&quot; filters on the map save a trip
              to a spot that can&apos;t actually get a bowl to your door in one piece — I cover exactly how to pack
              ramen for takeout in{' '}
              <Link href="/blog/what-are-ramen-noodles-made-of" className="text-[#96602F] hover:underline">
                what ramen noodles are made of
              </Link>.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Ready to look outside {hood.name}? Browse all{' '}
              <Link href={cityHref} className="text-[#96602F] hover:underline">
                ramen restaurants in {hood.cityName}, {hood.stateCode}
              </Link>{' '}
              or every{' '}
              <Link href={`/${stateSlug}`} className="text-[#96602F] hover:underline">
                ramen restaurant in {stateName}
              </Link>.
            </p>

            {/* Sibling neighborhoods in the same city */}
            {siblings.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
                  More {hood.cityName} Neighborhoods
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                  Compare {hood.name} against other {hood.cityName} neighborhoods:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {siblings.map(s => (
                    <Link
                      key={s.slug}
                      href={`/find/${neighborhoodParam(s)}`}
                      className="text-sm text-[#96602F] hover:underline"
                    >
                      Ramen in {s.name}
                    </Link>
                  ))}
                </div>
              </div>
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
                <Link href={cityHref} className="hover:text-[#96602F] underline">
                  Ramen in {hood.cityName}, {hood.stateCode}
                </Link>
                {' · '}
                <Link href={`/${stateSlug}`} className="hover:text-[#96602F] underline">
                  Ramen in {stateName}
                </Link>
                {' · '}
                <Link href="/find" className="hover:text-[#96602F] underline">Find Ramen Near Me</Link>
              </p>
            </div>
          </section>

          <UgcFeature seed={`/find/${neighborhoodParam(hood)}`} />
          <FindCrossLinks currentHref={`/find/${neighborhoodParam(hood)}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
