import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Top Rated Ramen Near Me | Highest-Rated Ramen Spots | RamenNearYou',
  description: 'Find the top rated ramen near you — the highest-rated bowls by real reviews. How I read ratings, why review count matters, and how to pick the best spot.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/top-rated-ramen' },
  openGraph: {
    title: 'Top Rated Ramen Near Me',
    description: 'Find the highest-rated ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/top-rated-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TopRatedRamenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
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
          initialFlags={['top-rated']}
          pageTitle="Top Rated Ramen Near Me"
          pageDescription="Showing the highest-rated ramen spots. Enter your ZIP or use your location to find the best bowls near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/top-rated-ramen"
        heading="How I Find the Top Rated Ramen Near Me"
        intro={[
          'When I just want the best bowl in the area, I start here. The map above is filtered to the highest-rated ramen restaurants near you — strong star ratings backed by a real volume of reviews. Enter your ZIP or use your location and the best-reviewed spots closest to you rise to the top.',
          'Ratings are useful, but only if you know how to read them. A 5.0 from eight reviews is not the same as a 4.6 from two thousand. Here is exactly how I interpret ratings to find a bowl that is genuinely great, not just statistically lucky.',
        ]}
        sections={[
          {
            h2: 'How to read ramen ratings the right way',
            body: (
              <p>
                The number I trust most is a high rating that holds up across a large number of reviews. That
                combination means the quality is consistent, not a fluke or a handful of friends. This filter
                weights toward exactly that — well-rated spots with enough reviews to be believable — so you are
                not chasing a perfect score that falls apart on a busy night.
              </p>
            ),
            points: [
              { h3: 'Rating and review count together', text: 'A 4.6 across 1,500 reviews usually beats a 4.9 across 20. Volume proves the kitchen delivers night after night.' },
              { h3: 'Recent reviews', text: 'Skim the latest few. A spot can coast on an old reputation; recent praise confirms it is still excellent now.' },
              { h3: 'What people rave about', text: 'If reviewers keep naming the same bowl, that is the dish to order — the kitchen’s proven highlight.' },
            ],
          },
          {
            h2: 'Top rated vs. hidden gems',
            body: (
              <p>
                This filter surfaces the established, proven favorites — the spots everyone agrees are great.
                The tradeoff is that they are often busy. If you love a top-rated bowl but not the line, try the
                “Hidden Gems” filter for high-rated places that have not been discovered at scale yet. I bounce
                between the two depending on whether I am chasing a sure thing or an adventure.
              </p>
            ),
          },
          {
            h2: 'Getting into the best spots',
            body: (
              <p>
                Top-rated places draw crowds, so a little strategy helps. Go at opening or during the
                mid-afternoon lull, stack “Takes Reservations” where available, and add “Open Now” so you are
                not driving to a closed door. A few taps gets you from “the best ramen near me” to a seat at one.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for top-rated ramen"
        tips={[
          'Trust a high rating that holds up across many reviews over a perfect score from a few.',
          'Skim recent reviews to confirm a spot is still excellent, not coasting on reputation.',
          'Order the dish reviewers keep raving about — it is the kitchen’s proven best.',
          'Beat the crowds by going at opening or the mid-afternoon lull.',
          'Stack “Takes Reservations” and “Open Now” to actually get a seat.',
        ]}
        faqs={[
          { q: 'What is the top rated ramen near me?', a: 'The map above is filtered to the highest-rated ramen restaurants near you, weighted toward strong ratings with enough reviews to be reliable. Enter your ZIP or tap “Use my location” to see the best closest to you.' },
          { q: 'How should I read ramen ratings?', a: 'Favor a high rating that holds up across many reviews over a perfect score from only a few. Then skim recent reviews to confirm the spot is still great now.' },
          { q: 'Does a 5.0 rating mean it is the best ramen?', a: 'Not necessarily — a 5.0 from a handful of reviews is less reliable than a 4.6 from thousands. Volume proves consistency, which matters more than a perfect average.' },
          { q: 'What is the difference between top-rated and hidden-gem ramen?', a: 'Top-rated spots are the established, proven favorites (often busy). Hidden gems are high-rated places that have not been discovered at scale yet, with shorter waits. Use whichever fits your mood.' },
          { q: 'How do I get into a popular top-rated ramen spot?', a: 'Go at opening or the mid-afternoon lull, stack “Takes Reservations” where available, and add “Open Now” so you do not arrive to a closed kitchen.' },
        ]}
      />
    </main>
  )
}
