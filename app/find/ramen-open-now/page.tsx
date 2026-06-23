import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Now Near Me | Ramen Restaurants Open Right Now',
  description: 'Find ramen restaurants open right now near you. See which spots are currently serving, sorted by distance — plus how to lock in a bowl before the kitchen closes.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-now' },
  openGraph: {
    title: 'Ramen Open Now Near Me',
    description: 'Find ramen restaurants open right now near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-now',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenOpenNowPage() {
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
          initialFlags={['open-now']}
          pageTitle="Ramen Open Now Near Me"
          pageDescription="Showing ramen restaurants open right now. Enter your ZIP or use your location to find the closest ones."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-open-now"
        heading="How I Find Ramen Open Right Now Near Me"
        intro={[
          'When a ramen craving hits, the only question that matters is: who is actually serving right now? The map above is already filtered to ramen restaurants open at this moment, checked against each spot’s posted hours in real time. Enter your ZIP or tap “Use my location” and the closest open bowls jump to the top of the list.',
          'I have been burned too many times driving to a shop that closed 20 minutes ago, so this is the filter I use most. Here is how to read it, how to avoid the dreaded last-call letdown, and how to find a bowl fast no matter the hour.',
        ]}
        sections={[
          {
            h2: 'How the “open now” filter works',
            body: (
              <p>
                Every restaurant on this map is matched against its posted hours for the current day and time.
                The green “Open” badge in the list confirms a spot is serving right now, and the results sort by
                distance once you set your location, so the nearest open kitchen is always first. It is the
                fastest way to go from craving to a confirmed bowl.
              </p>
            ),
          },
          {
            h2: 'Avoiding the last-call letdown',
            body: (
              <p>
                “Open” and “still seating you for a full meal” are not always the same thing. Kitchens often
                stop taking orders before the posted close, and a popular spot can sell out of a broth late in
                the night. If it is getting close to closing, I call ahead to confirm they are still serving,
                and I keep a backup from the list ready just in case.
              </p>
            ),
            points: [
              { h3: 'Watch the clock', text: 'If you are within 30–45 minutes of closing, call first — many kitchens stop orders before the door officially locks.' },
              { h3: 'Have a backup', text: 'Keep the second and third nearest open spots in mind so a sold-out broth does not end your night.' },
              { h3: 'Stack “Open Late”', text: 'Late at night, add the “Open Late” filter to focus on spots that will still be going for a while.' },
            ],
          },
          {
            h2: 'Narrowing down once you see what is open',
            body: (
              <p>
                Once the map shows what is serving, layer on what you are craving. Add a broth like tonkotsu or
                miso, a price range, or a vibe like “Date Night.” The filters combine, so you can go from
                “anything that is open” to “the exact bowl I want, open right now, closest to me” in a couple of
                taps.
              </p>
            ),
          },
        ]}
        tipsHeading="My open-now tips"
        tips={[
          'Set your location so open spots sort by distance — the nearest bowl is always on top.',
          'Look for the green “Open” badge to confirm a spot is serving this minute.',
          'Within 45 minutes of closing? Call ahead; kitchens often stop orders before the posted time.',
          'Stack a broth, price, or vibe filter to find exactly what you want among the open spots.',
          'Late at night, add “Open Late” to focus on places that will keep serving a while.',
        ]}
        faqs={[
          { q: 'What ramen restaurants are open right now near me?', a: 'The map above is pre-filtered to ramen restaurants currently open, checked against their posted hours. Enter your ZIP or tap “Use my location” to sort the open spots by distance.' },
          { q: 'How do I know if a ramen restaurant is open now?', a: 'Each spot is checked against its hours in real time, and a green “Open” badge in the list confirms it is currently serving.' },
          { q: 'What time do ramen restaurants open and close?', a: 'Most open for lunch around 11 AM or noon and serve into the evening; some are dinner-only from 5 PM. Hours vary, and the map reflects each spot’s current schedule.' },
          { q: 'Will a spot marked open still serve me a full meal?', a: 'Usually, but kitchens often stop taking orders before the posted close, and broths can sell out late. If it is near closing, call ahead and keep a backup spot in mind.' },
          { q: 'Can I filter open spots by broth or price?', a: 'Yes. Once the map shows what is open, add a broth, price range, or vibe filter and they combine — so you get exactly the bowl you want, open right now and closest to you.' },
        ]}
      />
    </main>
  )
}
