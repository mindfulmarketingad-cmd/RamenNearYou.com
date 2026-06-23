import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen for Lunch Near Me | Quick Lunch Ramen Spots | RamenNearYou',
  description: 'Find ramen for lunch near you — quick, satisfying bowls that fit a lunch break. My picks for fast service, lunch deals, and bowls that won’t put you to sleep at your desk.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-lunch' },
  openGraph: {
    title: 'Ramen for Lunch Near Me',
    description: 'Find quick, satisfying ramen for lunch near you.',
    url: 'https://www.ramennearyou.com/find/ramen-lunch',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenLunchPage() {
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
          initialMoods={['quick-lunch']}
          pageTitle="Ramen for Lunch Near Me"
          pageDescription="Showing quick, satisfying ramen spots for lunch. Enter your ZIP or use your location to find a fast bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-lunch"
        heading="How I Squeeze Great Ramen Into a Lunch Break"
        intro={[
          'Ramen is one of the best lunches going — hot, filling, and fast when you pick the right spot. The map above is filtered toward quick, satisfying lunch bowls near you. Enter your ZIP or use your location to find a spot close to the office so you spend your break eating, not commuting.',
          'The trick to ramen at lunch is choosing a place and a bowl that work with the clock. Here is how I get in and out in under an hour, plus how to avoid the bowl that leaves you ready for a nap at 2 PM.',
        ]}
        sections={[
          {
            h2: 'What makes ramen a great lunch',
            body: (
              <p>
                Ramen comes out fast — often within minutes of ordering — which makes it ideal for a lunch
                break in a way that a sit-down restaurant rarely is. Counter seating moves quickly, takeout is
                easy, and a single bowl is a complete, satisfying meal. For the fastest turnaround I look for
                walk-in counters and spots that offer takeout, both flagged in the listings.
              </p>
            ),
            points: [
              { h3: 'Fast service', text: 'Counter-style shops are built for speed — you can be eating within five minutes of sitting down.' },
              { h3: 'Takeout option', text: 'Ordering ahead for pickup turns ramen into a grab-and-go lunch you can eat back at your desk.' },
              { h3: 'Lunch specials', text: 'Many shops run weekday lunch sets — a smaller bowl plus gyoza or rice at a better price.' },
            ],
          },
          {
            h2: 'Bowls that won’t make you sleepy',
            body: (
              <p>
                A giant, ultra-rich tonkotsu is glorious, but at noon it can send you straight into an
                afternoon slump. For a midday bowl I lean lighter — a clean shoyu or shio, or a regular-size
                portion rather than the heaviest option. You still get the full ramen hit without the food coma
                derailing your afternoon.
              </p>
            ),
          },
          {
            h2: 'Beating the lunch rush',
            body: (
              <p>
                Popular spots get slammed from about noon to 1 PM. If your schedule is flexible, going a little
                before noon or after 1 means a shorter wait and faster food. Stacking the “Open Now” filter
                confirms a spot is serving, and adding a price filter helps you find a quick bowl that fits the
                budget too.
              </p>
            ),
          },
        ]}
        tipsHeading="My lunch-ramen tips"
        tips={[
          'Sort by distance to find a spot close enough to fit your break.',
          'Choose counter-style shops or takeout for the fastest turnaround.',
          'Go lighter — shoyu, shio, or a regular size — to avoid the afternoon slump.',
          'Look for weekday lunch sets for a better price on a smaller bowl plus a side.',
          'Beat the noon–1 PM rush by going a little earlier or later if you can.',
        ]}
        faqs={[
          { q: 'Where can I get ramen for lunch near me?', a: 'The map above is filtered toward quick lunch spots. Enter your ZIP or tap “Use my location” to find a fast, satisfying bowl close to you.' },
          { q: 'Is ramen a good quick lunch?', a: 'Yes — it comes out fast, counter seating moves quickly, and takeout is easy, so a complete bowl fits neatly into a lunch break.' },
          { q: 'What ramen should I order for lunch?', a: 'Go a little lighter — a clean shoyu or shio, or a regular-size portion — so you get the full ramen hit without an afternoon food coma.' },
          { q: 'Do ramen restaurants have lunch specials?', a: 'Many run weekday lunch sets — a smaller bowl plus gyoza or rice at a better price. Check the listing or ask when you order.' },
          { q: 'How do I beat the ramen lunch rush?', a: 'Go just before noon or after 1 PM, choose a counter or takeout spot for speed, and stack the “Open Now” filter to confirm they are serving.' },
        ]}
      />
    </main>
  )
}
