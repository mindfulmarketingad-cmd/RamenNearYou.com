import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Noodles Near Me | Fresh Ramen Noodle Restaurants | RamenNearYou',
  description: 'Find ramen noodles near you — real ramen noodle restaurants serving fresh, springy noodles in house-made broth. Browse nearby spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-noodles' },
  openGraph: {
    title: 'Ramen Noodles Near Me',
    description: 'Find ramen noodle restaurants serving fresh noodles in house-made broth, near you.',
    url: 'https://www.ramennearyou.com/find/ramen-noodles',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenNoodlesPage() {
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
          pageTitle="Ramen Noodles Near Me"
          pageDescription="Showing ramen noodle restaurants near you — real bowls of fresh noodles in house-made broth, sorted by rating and distance. Enter your ZIP or tap “Use my location.”"
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-noodles"
        heading="How I Find Real Ramen Noodles Near Me"
        intro={[
          'There is a world of difference between a 25-cent instant brick and a proper bowl of fresh ramen noodles in a long-simmered broth. When I want the real thing, I use the map above to find ramen noodle restaurants near me — set your ZIP or location and the closest, best-rated spots sort straight to the top.',
          'Here is what separates great ramen noodles from the rest, and how to find a restaurant serving them nearby.',
        ]}
        sections={[
          {
            h2: 'What are real ramen noodles?',
            body: (
              <p>
                Authentic ramen noodles are wheat noodles made with kansui — an alkaline mineral water that gives
                them their signature springy, chewy bite and pale yellow color. They come in many shapes: thin and
                straight for tonkotsu, thick and wavy for miso, extra-thick for tsukemen. The best ramen noodle
                restaurants either make their noodles in-house or source them fresh, never from a dried instant pack.
              </p>
            ),
            points: [
              { h3: 'Made with kansui', text: 'Alkaline water gives ramen noodles their springy bite and golden color.' },
              { h3: 'Matched to the broth', text: 'Thin noodles for rich tonkotsu, thick wavy noodles for miso, extra-thick for tsukemen.' },
              { h3: 'Fresh, not instant', text: 'Top shops make noodles in-house or source them fresh daily for the best texture.' },
            ],
          },
          {
            h2: 'How to find a ramen noodle restaurant nearby',
            body: (
              <p>
                Use the map to see every ramen noodle spot near you sorted by distance, then read the menu and recent
                reviews. Shops that mention house-made or fresh noodles — and reviews that praise the noodle texture,
                not just the broth — are the ones worth the trip. Dedicated ramen shops almost always take their
                noodles seriously.
              </p>
            ),
          },
          {
            h2: 'Restaurant ramen noodles vs. instant',
            body: (
              <p>
                Instant ramen has its place, but restaurant ramen noodles are a different dish entirely: cooked to
                order, served with a firm bite in a broth simmered for hours, and finished with chashu, egg, and
                fresh toppings. If you have only had instant, your first bowl of fresh restaurant ramen noodles is
                usually a revelation.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for great ramen noodles"
        tips={[
          'Look for “house-made” or “fresh” noodles on the menu — texture is everything.',
          'Read reviews for praise of the noodles specifically, not just the broth.',
          'Match the noodle to the bowl: thin for tonkotsu, thick wavy for miso.',
          'Ask for kaedama (a noodle refill) at shops that offer it if you are still hungry.',
          'Eat fast — fresh noodles soften the longer they sit in hot broth.',
        ]}
        faqs={[
          { q: 'How do I find ramen noodles near me?', a: 'Use the map above — enter your ZIP or tap “Use my location.” It shows ramen noodle restaurants nearby, sorted by rating and distance, so the best fresh-noodle bowls are easy to find.' },
          { q: 'What are ramen noodles made of?', a: 'Authentic ramen noodles are wheat noodles made with kansui, an alkaline mineral water that gives them their springy, chewy texture and pale yellow color.' },
          { q: 'Are restaurant ramen noodles different from instant?', a: 'Very. Restaurant ramen noodles are cooked to order and served firm in a broth simmered for hours, while instant noodles are pre-fried and dried. The texture and flavor are in a different league.' },
          { q: 'Which ramen noodle restaurants are best near me?', a: 'Sort the map by rating and look for shops that make noodles in-house or source them fresh. Reviews that specifically praise the noodle texture are a strong sign.' },
        ]}
      />
    </main>
  )
}
