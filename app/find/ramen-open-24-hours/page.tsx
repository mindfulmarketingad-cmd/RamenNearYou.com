import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Open 24 Hours Near Me | Late-Night & All-Night Ramen | RamenNearYou',
  description: 'Find ramen open 24 hours or late into the night near you. How to track down all-night and after-midnight ramen, plus the filters that surface the latest-open bowls.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-24-hours' },
  openGraph: {
    title: 'Ramen Open 24 Hours Near Me',
    description: 'Find 24-hour and late-night ramen near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-24-hours',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOpen24HoursPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["open-midnight"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, NATIONWIDE_LISTICLE_CAP), { verifiedSlugs })
  const count = matched.length

  const mapSlot = (
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
        initialFlags={['open-midnight']}
        pageTitle="Ramen Open 24 Hours Near Me"
        pageDescription="Showing ramen spots that serve past midnight near you — the closest thing to 24-hour ramen. Enter your ZIP or use your location to find a late-night bowl."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Open 24 Hours Near Me" }]}
        title={`Ramen Open 24 Hours Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track that matches this, ranked by rating and review volume. Search by name or city, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <FindPageContent
        currentHref="/find/ramen-open-24-hours"
        heading="How I Find Ramen Open 24 Hours Near Me"
        intro={[
          'When a 2 AM ramen craving hits, the map above is filtered to spots that serve past midnight near you — the closest thing to true 24-hour ramen in most US cities. Enter your ZIP or tap “Use my location,” and the latest-open bowls rise to the top.',
          'Genuine 24-hour ramen is rare in the States, so the real skill is finding the places that stay open the longest. Here is how I do it.',
        ]}
        sections={[
          {
            h2: 'Is there really 24-hour ramen near me?',
            body: (
              <p>
                In a handful of big cities, yes — a few shops run all night. But in most places, “24 hours” really
                means “open very late.” That is why this page is filtered to spots serving past midnight: it
                surfaces the realistic options when you need a bowl in the small hours, instead of sending you to a
                locked door.
              </p>
            ),
            points: [
              { h3: 'Past-midnight filter', text: 'Already applied here — it shows the latest-serving ramen near you.' },
              { h3: 'Big-city odds', text: 'Truly all-night ramen is most likely in large metros with strong late-night dining.' },
              { h3: 'Always confirm hours', text: 'Late hours change for holidays and slow nights, so call ahead before a long drive.' },
            ],
          },
          {
            h2: 'How to find the latest-open bowl',
            body: (
              <p>
                Stack the filters. This page starts with “Past Midnight,” but you can add “Open Now” to confirm a
                spot is serving this minute, then sort by distance once you set your location. That combination
                gets you to the closest bowl that is actually open right now.
              </p>
            ),
          },
          {
            h2: 'Why late-night ramen hits different',
            body: (
              <p>
                There is a reason ramen is the classic after-hours meal in Japan — a hot, rich bowl is exactly what
                you want late at night, whether you are coming off a shift or closing down the bars. The shops that
                stay open late know their crowd and tend to serve fast, comforting bowls built for the hour.
              </p>
            ),
          },
        ]}
        tipsHeading="My late-night ramen tips"
        tips={[
          'Use the “Past Midnight” filter (already on) to find the latest-serving ramen near you.',
          'Add “Open Now” to confirm a spot is actually serving before you head out.',
          'Always call ahead late at night — posted hours change for holidays and slow nights.',
          'In smaller cities, expect “open late” rather than true 24-hour service.',
          'Set your location so the list sorts by distance and you reach a bowl fast.',
        ]}
        faqs={[
          { q: 'Is there ramen open 24 hours near me?', a: 'In a few large cities, yes — but in most places “24 hours” means open very late. The map above is filtered to spots serving past midnight, which surfaces the most realistic late-night options near you.' },
          { q: 'How do I find late-night ramen?', a: 'Use the map — it is pre-filtered to ramen open past midnight. Add “Open Now” to confirm a spot is serving, then set your location to sort by distance.' },
          { q: 'What time do most ramen shops close?', a: 'Most close between 9 and 10 PM. Late-night spots run to 11 PM, midnight, or beyond, especially in larger cities.' },
          { q: 'Are the hours accurate?', a: 'Open status is based on each restaurant’s posted hours, which can change for holidays or slow nights. Call ahead before a long trip late at night.' },
          { q: 'Why is ramen a popular late-night meal?', a: 'A hot, rich bowl is the ideal comfort food after a late shift or a night out — which is exactly why ramen is the classic after-hours meal in Japan.' },
        ]}
      />
    </main>
  )
}
