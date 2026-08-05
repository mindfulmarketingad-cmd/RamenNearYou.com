import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Restaurants With Happy Hour | RamenNearYou',
  description: 'Find ramen restaurants with a full bar near you — your best bet for a happy hour that pairs discounted drinks with a hot bowl of ramen. Browse by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-happy-hour' },
  openGraph: {
    title: 'Ramen Restaurants With Happy Hour',
    description: 'Find ramen restaurants near you with a full bar, your best bet for happy hour.',
    url: 'https://www.ramennearyou.com/find/ramen-happy-hour',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenHappyHourPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["full-bar"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked, { verifiedSlugs })
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
        initialFlags={['full-bar']}
        pageTitle="Ramen Restaurants With Happy Hour"
        pageDescription="Showing ramen spots with a full bar near you — your best bet for happy hour. Enter your ZIP or use your location to find one nearby, sorted by rating and distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Restaurants With Happy Hour" }]}
        title={`Ramen Restaurants With Happy Hour — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-happy-hour"
        heading="How I Find Ramen Restaurants With Happy Hour"
        intro={[
          'A good happy hour makes an ordinary ramen run feel like an event — discounted drinks, sometimes a few dollars off appetizers, and a reason to get there before the dinner rush. The map above starts filtered to ramen restaurants with a full bar near you, since a real drink program is the single best predictor of a happy hour menu. Enter your ZIP or tap "Use my location" to find one nearby.',
          'Happy hour specifics (times, prices, what is included) vary restaurant to restaurant and change often, so here is how I confirm the details before I go, plus what to expect once I get there.',
        ]}
        sections={[
          {
            h2: 'Why "Full Bar" is the starting filter',
            body: (
              <p>
                Happy hour is a bar-program feature — a restaurant needs a real liquor license and drink menu to run
                one, so filtering to spots with a full bar is the most reliable way to surface likely candidates.
                Izakaya and full-service Japanese restaurants with a bar are the most common ramen spots to run a
                proper happy hour, often pairing drink specials with a handful of discounted appetizers or small
                plates.
              </p>
            ),
            points: [
              { h3: 'Izakaya & Japanese pubs', text: 'Built around a drink list from the start — the most likely spots to run a real happy hour.' },
              { h3: 'Full-service Japanese restaurants', text: 'Larger sit-down spots with a bar often run early-evening specials to fill seats before the dinner rush.' },
              { h3: 'Ramen bars', text: 'Counter-style ramen shops with a beer and sake list sometimes run simple happy hour pricing on drinks alone.' },
            ],
          },
          {
            h2: 'Confirming the details before you go',
            body: (
              <p>
                Happy hour windows, prices, and what is included are not something this map tracks directly — they
                change often and vary a lot restaurant to restaurant. Once you have a shortlist from the "Full Bar"
                filter, I check the restaurant&apos;s website or call ahead to confirm the actual hours and what is
                discounted before making the trip.
              </p>
            ),
          },
          {
            h2: 'Making the most of it',
            body: (
              <p>
                I treat happy hour as the appetizer round, not the whole meal — a couple of discounted drinks and a
                small plate or two, then a full bowl of ramen at regular price once the kitchen&apos;s dinner menu
                kicks in (or right alongside it, if the shop runs both at once). Going right when happy hour opens
                usually means shorter waits and a full drink selection before anything runs out.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for ramen happy hour"
        tips={[
          'Start with the "Full Bar" filter (already on) — a real drink program is the best predictor of a happy hour menu.',
          'Call ahead or check the restaurant\'s website to confirm exact happy hour times and what is discounted.',
          'Go right when happy hour opens for shorter waits and the fullest drink selection.',
          'Treat it as the appetizer round — order a full bowl of ramen at regular price once happy hour winds down.',
          'Izakaya and full-service Japanese restaurants with a bar are your best bet for a real happy hour menu.',
        ]}
        faqs={[
          { q: 'Where can I find ramen restaurants with happy hour?', a: 'Use the map above — it starts filtered to ramen spots with a full bar, the strongest signal of a happy hour menu. Enter your ZIP or tap "Use my location" to see the closest ones.' },
          { q: 'Does this map show exact happy hour times and prices?', a: 'Not directly — happy hour details change often and vary a lot by restaurant. Once you have a shortlist, check the restaurant\'s website or call ahead to confirm.' },
          { q: 'What kind of ramen restaurants usually run happy hour?', a: 'Izakaya, Japanese pubs, and full-service Japanese restaurants with a real bar program are the most likely to run one — a ramen counter without a liquor license usually will not.' },
          { q: 'Is ramen itself usually discounted during happy hour?', a: 'Sometimes, but happy hour specials more often apply to drinks and appetizers or small plates rather than a full bowl of ramen — confirm with the restaurant directly.' },
        ]}
      />
    </main>
  )
}
