import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Restaurants Near Me | Find the Best Ramen | RamenNearYou',
  description: 'Find ramen restaurants near you on an interactive map. Filter by broth, price, hours, and amenities to find the best bowl — plus how I judge a great ramen shop.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-restaurants' },
  openGraph: {
    title: 'Ramen Restaurants Near Me',
    description: 'Find the best ramen restaurants near you on an interactive map.',
    url: 'https://www.ramennearyou.com/find/ramen-restaurants',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenRestaurantsPage() {
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
          pageTitle="Ramen Restaurants Near Me"
          pageDescription="Browse ramen restaurants near you on the map. Enter your ZIP or use your location, then filter by broth, price, and hours."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-restaurants"
        heading="How I Find the Best Ramen Restaurants Near Me"
        intro={[
          'Whether you are new to ramen or chasing your next favorite bowl, the map above is the fastest way to see every ramen restaurant near you at once. Enter your ZIP or tap “Use my location,” and the closest spots sort to the top with ratings, hours, and photos so you can decide in seconds.',
          'Over years of eating ramen everywhere I can, I have developed a quick mental checklist for separating a truly great shop from a forgettable one. Here is how I read the map, what I look for in a restaurant, and how to use the filters to find exactly the bowl you are in the mood for.',
        ]}
        sections={[
          {
            h2: 'What separates a great ramen restaurant',
            body: (
              <p>
                A great ramen shop usually does a few things obsessively well rather than offering everything.
                I look for a focused menu (a kitchen that specializes in one or two broth styles tends to nail
                them), fresh noodles with real bite, and broth with genuine depth rather than a flat,
                salt-forward shortcut. Ratings and recent reviews on each listing are a quick proxy, but the
                tell is consistency — lots of reviews and still a high score.
              </p>
            ),
            points: [
              { h3: 'A focused menu', text: 'Shops that specialize in one or two broths usually execute them far better than do-everything kitchens.' },
              { h3: 'Noodle quality', text: 'Fresh, springy noodles with bite are a hallmark of a shop that cares — they make or break the bowl.' },
              { h3: 'Broth depth', text: 'Real, layered broth beats a thin, oversalted one every time. High ratings across many reviews signal consistency.' },
            ],
          },
          {
            h2: 'Using the filters to find your bowl',
            body: (
              <p>
                The filter bar above the map is where this gets powerful. Crave something specific? Add a broth
                like tonkotsu, miso, or shoyu. Watching the budget? Add a price range. On a schedule? Add
                “Open Now.” Out with the family or want a patio? Those filters are there too. Everything
                combines, so you can dial in from “all ramen near me” to “the exact bowl I want right now.”
              </p>
            ),
          },
          {
            h2: 'Reading a listing before you go',
            body: (
              <p>
                Tap any spot to see its rating, hours, photos, and amenities, then open the full listing for
                the menu, directions, and the option to order. I skim the most recent reviews and the photos —
                fresh, glowing reviews and bowls that look carefully built are reliable signs you are about to
                have a good one. From there it is one tap to directions or to order.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for picking a ramen restaurant"
        tips={[
          'Set your location so the nearest spots sort to the top with live distances.',
          'Favor shops with a focused menu — specialists usually make better broth and noodles.',
          'Check that a high rating holds up across many reviews; consistency is the real signal.',
          'Stack broth, price, and hours filters to narrow to exactly what you are craving.',
          'Skim recent reviews and photos on the listing before committing to the trip.',
        ]}
        faqs={[
          { q: 'How do I find ramen restaurants near me?', a: 'Use the map above — enter your ZIP or tap “Use my location” and the closest ramen restaurants sort to the top with ratings, hours, and photos.' },
          { q: 'What makes a ramen restaurant good?', a: 'A focused menu, fresh noodles with real bite, and broth with genuine depth. A high rating that holds up across many reviews is the best quick signal of consistency.' },
          { q: 'Can I filter ramen restaurants by broth or price?', a: 'Yes. The filter bar above the map lets you combine broth type, price, hours, and amenities to narrow from all nearby spots to the exact bowl you want.' },
          { q: 'How do I choose between two ramen spots?', a: 'Open each listing and compare recent reviews, photos, hours, and amenities. Fresh, glowing reviews and carefully built bowls in the photos are reliable tiebreakers.' },
          { q: 'Are the ramen restaurants on the map open now?', a: 'Not all by default — add the “Open Now” filter to show only spots currently serving, checked against their posted hours.' },
        ]}
      />
    </main>
  )
}
