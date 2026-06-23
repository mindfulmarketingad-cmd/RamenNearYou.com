import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Bars Near Me | Ramen & Sake Bars | RamenNearYou',
  description: 'Find ramen bars near you — counter-seat shops and izakaya-style spots with noodles, sake, and small plates. What a ramen bar is and how to enjoy one.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-bars' },
  openGraph: {
    title: 'Ramen Bars Near Me',
    description: 'Find ramen bars and izakaya-style spots near you.',
    url: 'https://www.ramennearyou.com/find/ramen-bars',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenBarsPage() {
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
          initialFlags={['open-late']}
          pageTitle="Ramen Bars Near Me"
          pageDescription="Showing ramen bars and late-serving spots. Enter your ZIP or use your location to find a ramen bar near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-bars"
        heading="What I Look for in a Great Ramen Bar Near Me"
        intro={[
          'A ramen bar is more than a place that sells noodles — it is an experience. Counter seating where you watch the cooks work, a sake or beer list, small plates between bowls, and a buzz that turns dinner into a night out. The map above is filtered toward ramen bars and later-serving spots near you. Enter your ZIP or use your location to find one close by.',
          'I love a good ramen bar because it captures the spirit of how ramen is eaten in Japan. Here is what sets a ramen bar apart from a quick noodle counter, and how I get the most out of one.',
        ]}
        sections={[
          {
            h2: 'What exactly is a ramen bar?',
            body: (
              <p>
                The term covers a spectrum. At one end is the classic ramen-ya — a tight counter focused purely
                on bowls. At the other is the izakaya-leaning ramen bar with a full drink program, gyoza,
                karaage, and small plates designed for grazing while you drink. Most great ramen bars sit
                somewhere in the middle: serious noodles plus a real bar you can settle into.
              </p>
            ),
            points: [
              { h3: 'Counter seating', text: 'The heart of a ramen bar — a front-row seat to the cooks assembling bowls and torching chashu.' },
              { h3: 'Drinks and small plates', text: 'Sake, beer, highballs, and shareable starters turn a quick bowl into a lingering meal.' },
              { h3: 'Late-night energy', text: 'Many ramen bars serve late, which is exactly when their atmosphere is at its best.' },
            ],
          },
          {
            h2: 'How to order at a ramen bar',
            body: (
              <p>
                Treat it like a bar crawl in one seat: start with a drink and a small plate — gyoza or
                edamame — then move to your bowl. If you are with friends, order a few different broths and
                share. A ramen bar rewards taking your time, so I rarely rush; the second drink and a side of
                karaage are part of the fun.
              </p>
            ),
          },
          {
            h2: 'Finding the right ramen bar for the night',
            body: (
              <p>
                Stack filters to match your plan. Add “Full Bar” to guarantee a real drink list, “Open Late”
                for after-hours energy (already applied here), “Date Night” for a cozier room, or
                “Takes Reservations” when you are bringing a group. That combination gets you from “a ramen bar”
                to “the right ramen bar for tonight.”
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen bar tips"
        tips={[
          'Grab counter seating when you can — watching the cooks is half the experience.',
          'Start with a drink and gyoza, then move to your bowl; ramen bars reward taking your time.',
          'Stack “Full Bar” to ensure a real sake and cocktail list.',
          'Order different broths with friends and share to taste more of the menu.',
          'Add “Takes Reservations” for groups and “Open Late” for the best after-hours atmosphere.',
        ]}
        faqs={[
          { q: 'What is a ramen bar?', a: 'A ramen bar centers on counter seating and noodles, usually with a drink program and small plates. It ranges from a focused ramen-ya to an izakaya-style spot with a full bar.' },
          { q: 'How are ramen bars different from regular ramen restaurants?', a: 'Ramen bars emphasize the bar experience — counter seating, sake and cocktails, shareable plates, and often late hours — turning a quick bowl into a night out.' },
          { q: 'How do I find a ramen bar near me?', a: 'The map above is filtered toward ramen bars and later-serving spots. Enter your ZIP or tap “Use my location,” and add “Full Bar” for a guaranteed drink list.' },
          { q: 'What should I order at a ramen bar?', a: 'Start with a drink and a small plate like gyoza or edamame, then move to your bowl. With friends, order different broths and share.' },
          { q: 'Are ramen bars good for groups?', a: 'Yes, especially ones that take reservations. Stack “Takes Reservations” to lock in seating, and “Full Bar” for drinks to go around.' },
        ]}
      />
    </main>
  )
}
