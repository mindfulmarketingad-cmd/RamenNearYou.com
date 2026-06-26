import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Shop Near Me | Find Local Ramen Shops | RamenNearYou',
  description: 'Find a ramen shop near you — browse local ramen-ya by rating, broth, hours, and distance. Discover the best ramen shops in your neighborhood.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-shop' },
  openGraph: {
    title: 'Ramen Shop Near Me',
    description: 'Find a ramen shop near you.',
    url: 'https://www.ramennearyou.com/find/ramen-shop',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenShopNearMePage() {
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
          pageTitle="Ramen Shop Near Me"
          pageDescription="Showing ramen shops near you sorted by rating and distance. Enter your ZIP or use your location to find the closest one."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-shop-near-me"
        heading="How I Find a Great Ramen Shop Near Me"
        intro={[
          'A great ramen shop — a ramen-ya — does a few things obsessively well: a house-simmered broth, noodles with real bite, and consistency every time. The map above shows ramen shops near you sorted by rating and distance. Enter your ZIP or tap "Use my location" and the closest, best-rated options sort to the top.',
          'Here is how I pick a ramen shop and what to look for once I get there.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen shop?',
            body: (
              <p>
                The best ramen shops (ramen-ya) have a focused menu, house-made broth, and consistent quality
                across hundreds of reviews. Look for a spot where the kitchen is proud of one or two signature
                bowls — not a place trying to do everything. Counter seating, a steaming pot visible behind the
                pass, and a queue out the door are all good signs.
              </p>
            ),
            points: [
              { h3: 'House-simmered broth', text: 'Made in-house from pork bones, chicken, dashi, or seafood — not poured from a bag.' },
              { h3: 'Focused menu', text: 'A few bowls done well beats a long menu done halfway.' },
              { h3: 'Consistent reviews', text: 'Many reviews praising the broth and noodles specifically signal a reliable kitchen.' },
            ],
          },
          {
            h2: 'How to pick a ramen shop near you',
            body: (
              <p>
                I filter by rating first, then read the most recent reviews for mentions of broth, noodles, and
                consistency. A shop with a 4.5-star rating and 200+ reviews is almost always a safe bet. Check
                the hours in the listing — many ramen shops close between lunch and dinner service and sell out
                of broth on busy nights.
              </p>
            ),
          },
          {
            h2: 'What to order on your first visit',
            body: (
              <p>
                Always start with the house signature bowl — it is what the kitchen is most confident in.
                Add the soft-boiled egg (ajitama) and a side of gyoza. If the shop offers noodle firmness
                choices, go firm (kata) on your first visit so the noodles hold up while you eat. Eat it hot
                and fast — ramen waits for no one.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding a ramen shop"
        tips={[
          'Sort by rating and look for 4.5 stars with 100+ reviews — a reliable signal of a consistent kitchen.',
          'Read recent reviews for specific praise of the broth, not just "great food."',
          'Check hours before going — many shops close between lunch and dinner and sell out on busy nights.',
          'Order the house signature bowl on your first visit.',
          'Eat it hot; ramen loses its texture and flavor as it cools.',
        ]}
        faqs={[
          { q: 'How do I find a ramen shop near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." Ramen shops near you are sorted by rating and distance. Filter by broth, hours, or price to narrow it down.' },
          { q: 'What is a ramen shop called in Japanese?', a: 'A ramen shop is called a ramen-ya (ラーメン屋) in Japanese. "Ya" means shop or restaurant, so ramen-ya literally means ramen place.' },
          { q: 'What makes a ramen shop different from a ramen restaurant?', a: 'A ramen shop (ramen-ya) typically has a focused menu, counter seating, and a fast, casual atmosphere built around the bowl. A ramen restaurant may have a broader menu, table service, and a more relaxed pace.' },
          { q: 'What broth should I order at a ramen shop?', a: 'On a first visit, order whatever the shop is known for — their signature bowl. If you are unsure, tonkotsu and shoyu are the most widely available and universally popular styles.' },
          { q: 'Do ramen shops take reservations?', a: 'Most dedicated ramen shops do not take reservations — they run on a first-come, first-served basis. Arriving at opening or during off-peak hours is the best way to avoid a wait.' },
        ]}
      />
    </main>
  )
}
