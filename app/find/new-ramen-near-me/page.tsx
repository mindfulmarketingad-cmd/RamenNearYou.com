import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New Ramen Places Near Me | Newly Opened Ramen Spots | RamenNearYou',
  description: 'Find new ramen places near you — newly opened ramen shops and the latest spots to try. Discover fresh openings before the crowds, sorted by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/new-ramen-near-me' },
  openGraph: {
    title: 'New Ramen Places Near Me',
    description: 'Discover newly opened ramen spots near you before the crowds.',
    url: 'https://www.ramennearyou.com/find/new-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function NewRamenPage() {
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
          initialFlags={['new-ramen']}
          pageTitle="New Ramen Places Near Me"
          pageDescription="Showing newer ramen spots near you — recently opened shops that are still building a following. Enter your ZIP or use your location to find one nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/new-ramen-near-me"
        heading="How I Find New Ramen Places Near Me"
        intro={[
          'There is something fun about being early to a new ramen spot — beating the lines, watching a kitchen find its rhythm, and being the friend who knew about it first. The map above is filtered to newer ramen places near you, the kind that are still building up reviews. Enter your ZIP or tap “Use my location” and the closest fresh openings sort to the top.',
          'Brand-new shops do not have hundreds of reviews yet, so I use that as the signal: rated, but still early in their run. Here is how I find them and decide which ones are worth a first visit.',
        ]}
        sections={[
          {
            h2: 'How I spot a newly opened ramen shop',
            body: (
              <p>
                The clearest tell is the review count. A spot that has been around for years racks up hundreds or
                thousands of reviews; a place that just opened has a few dozen at most. This page leans on that —
                surfacing rated ramen shops that are still early, so you can catch the new openings before they blow
                up. From there, I read the most recent reviews to see how the kitchen is doing out of the gate.
              </p>
            ),
            points: [
              { h3: 'Low review count', text: 'Newer spots have a handful of reviews, not thousands — the simplest sign a place just opened.' },
              { h3: 'Recent first reviews', text: 'Check the dates on the earliest reviews to confirm a spot is genuinely new.' },
              { h3: 'Buzz and grand openings', text: 'Pair this list with a quick local search for “grand opening” to catch the very latest arrivals.' },
            ],
          },
          {
            h2: 'Why try a new ramen place?',
            body: (
              <p>
                New shops often bring something different — a chef testing a signature broth, a regional style that
                was missing from your area, or simply shorter waits while word gets out. Going early also means your
                review actually helps; a thoughtful write-up in a shop’s first weeks carries real weight and helps a
                good spot get the attention it deserves.
              </p>
            ),
          },
          {
            h2: 'What to expect on a first visit',
            body: (
              <p>
                Give a new kitchen a little grace — menus and hours can shift in the early days as they settle in. I
                order a signature bowl to taste what they are most proud of, go at an off-peak time while they find
                their footing, and call ahead to confirm hours, since brand-new spots do not always have accurate
                listings yet.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for trying new ramen spots"
        tips={[
          'Sort by distance, then check the earliest review dates to confirm a spot is genuinely new.',
          'Order the signature bowl — it is what a new kitchen most wants to show off.',
          'Go at off-peak hours in the first few weeks while the kitchen finds its rhythm.',
          'Call ahead — new shops do not always have accurate hours posted yet.',
          'Leave an honest review; early feedback helps a good new spot get noticed.',
        ]}
        faqs={[
          { q: 'How do I find new ramen places near me?', a: 'Use the map above — enter your ZIP or tap “Use my location.” It is filtered to newer ramen spots near you, the kind still building up reviews, sorted by rating and distance.' },
          { q: 'How do you know which ramen spots are new?', a: 'Newly opened shops have far fewer reviews than established ones, so this page surfaces rated spots with a low review count. Checking the dates on the earliest reviews confirms how new a place really is.' },
          { q: 'Is it worth trying a brand-new ramen shop?', a: 'Often yes — new spots bring fresh ideas, shorter waits, and the chance to discover a favorite early. Just give the kitchen a little grace while it settles into its routine.' },
          { q: 'What should I order at a new ramen place?', a: 'Start with the signature or house bowl — it is what the kitchen most wants to be known for and the best way to judge whether you will come back.' },
          { q: 'Are the hours accurate for new ramen spots?', a: 'Not always — brand-new shops sometimes have incomplete or outdated listings. It is smart to call ahead before making the trip.' },
        ]}
      />
    </main>
  )
}
