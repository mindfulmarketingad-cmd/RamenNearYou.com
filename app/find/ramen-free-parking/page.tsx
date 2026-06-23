import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Free Parking Near Me | Easy-Park Ramen | RamenNearYou',
  description: 'Find ramen restaurants with free parking near you. Skip circling the block and drive straight to a great bowl — plus how to find easy parking near any spot.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-free-parking' },
  openGraph: {
    title: 'Ramen With Free Parking Near Me',
    description: 'Find ramen restaurants with free parking near you.',
    url: 'https://www.ramennearyou.com/find/ramen-free-parking',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenFreeParkingPage() {
  return (
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
          initialFlags={['free-parking']}
          pageTitle="Ramen With Free Parking Near Me"
          pageDescription="Showing ramen restaurants with parking available. Enter your ZIP or use your location to find easy-to-park spots near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-free-parking"
        heading="Where to Find Ramen With Easy, Free Parking"
        intro={[
          'Parking should not be the hardest part of getting a bowl of ramen, but in plenty of neighborhoods it is. The map above is filtered to ramen restaurants near you that have parking available — so you can drive in, park, and eat instead of circling the block for 20 minutes. Enter your ZIP or use your location to sort the closest easy-park spots to the top.',
          'This filter is especially handy if you are driving in from the suburbs, bringing the family, or grabbing takeout and do not want to leave the car in a loading zone. Here is how I use it and how to scope out parking even when a spot is not flagged.',
        ]}
        sections={[
          {
            h2: 'Where free parking is easy (and where it is not)',
            body: (
              <p>
                Geography drives this more than anything. Ramen shops in suburban strip malls, plazas, and
                standalone buildings almost always have a free lot. Dense downtown and urban-core spots often
                rely on street parking, paid garages, or valet. This filter helps surface the former, which is
                exactly what you want when convenience is the priority.
              </p>
            ),
            points: [
              { h3: 'Strip malls and plazas', text: 'These nearly always have a shared free lot. Great for families and quick takeout runs.' },
              { h3: 'Standalone restaurants', text: 'Dedicated buildings usually come with their own parking — an easy in-and-out.' },
              { h3: 'Downtown and urban cores', text: 'Expect street parking, garages, or valet. If a downtown spot is flagged with parking, grab it; it is the exception.' },
            ],
          },
          {
            h2: 'How to scope parking for any ramen spot',
            body: (
              <p>
                Parking data comes from each restaurant’s listed amenities, and it is not always complete. When
                a place is not flagged, I open the listing, check the map view for a visible lot, and if it
                matters, call to ask. For takeout especially, a quick call about where to pull in for pickup
                saves a lot of hassle.
              </p>
            ),
          },
          {
            h2: 'Pair it with takeout or a family meal',
            body: (
              <p>
                Free parking shines for two situations: grabbing takeout and bringing the family. For pickup, I
                stack the “Delivers” filter is not needed — instead I just confirm parking and order ahead so I
                can run in and out. For a family dinner, stacking “Family-Friendly” with this filter finds
                relaxed, easy-parking spots where the whole outing is low-stress from the moment you arrive.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen parking tips"
        tips={[
          'Filter to “Free Parking,” then sort by distance for the nearest easy-park spot.',
          'Suburban strip malls and standalone buildings are your best bet for free lots.',
          'Not flagged? Open the listing, scan the map for a lot, and call to confirm.',
          'Ordering takeout? Call ahead and ask where to pull in for pickup.',
          'Stack “Family-Friendly” for a low-stress family dinner with easy parking.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants have free parking near me?', a: 'The map above is filtered to spots with parking available. Enter your ZIP or tap “Use my location” to find easy-to-park restaurants nearby.' },
          { q: 'Do ramen restaurants usually have parking?', a: 'It depends on location. Suburban strip-mall and standalone spots usually have free lots, while downtown restaurants often rely on street or paid parking. This page highlights places with parking listed.' },
          { q: 'How do I confirm parking before I go?', a: 'Parking comes from listed amenities and can be incomplete. Open the listing, check the map for a visible lot, and call ahead to confirm — especially for takeout pickup.' },
          { q: 'Where is free ramen parking easiest to find?', a: 'In suburban plazas, strip malls, and standalone buildings, which almost always have a shared or dedicated free lot. Downtown spots are the hardest for free parking.' },
          { q: 'Is free parking worth filtering for takeout?', a: 'Definitely. Confirming parking and ordering ahead lets you pull in, grab your bowl, and go without hunting for a spot or risking a loading zone.' },
        ]}
      />
    </main>
  )
}
