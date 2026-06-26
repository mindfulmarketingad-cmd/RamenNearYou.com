import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shokku Ramen Near Me | Find Shokku Ramen Restaurants | RamenNearYou',
  description: 'Find Shokku Ramen near you — browse Shokku Ramen restaurant locations by rating, hours, and distance. See menus, directions, and reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shokku-ramen-near-me' },
  openGraph: {
    title: 'Shokku Ramen Near Me',
    description: 'Find Shokku Ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/shokku-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ShokkuRamenPage() {
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
          initialFlags={['shokku']}
          pageTitle="Shokku Ramen Near Me"
          pageDescription="Showing Shokku Ramen locations near you. Enter your ZIP or use your location to find the closest one."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/shokku-ramen-near-me"
        heading="How I Find Shokku Ramen Near Me"
        intro={[
          'Shokku Ramen is a Japanese ramen concept known for bold flavors and a modern take on classic ramen styles. The map above is filtered to Shokku Ramen locations near you. Enter your ZIP or tap "Use my location" and the closest spots sort to the top.',
          'Here is what to expect at Shokku Ramen and how to get the most out of your visit.',
        ]}
        sections={[
          {
            h2: 'What is Shokku Ramen?',
            body: (
              <p>
                Shokku Ramen brings a bold, modern approach to Japanese ramen. "Shokku" (衝撃) means shock or
                impact in Japanese — a fitting name for a restaurant that aims to surprise with intensely
                flavored broths and creative toppings. Locations typically serve a curated menu of Japanese
                ramen styles alongside sides and Japanese-inspired drinks.
              </p>
            ),
            points: [
              { h3: 'Impact-forward flavors', text: 'Bold, deeply seasoned broths designed to make an impression from the first sip.' },
              { h3: 'Curated menu', text: 'A focused selection of ramen styles rather than an overwhelming list — every bowl is dialed in.' },
              { h3: 'Modern Japanese atmosphere', text: 'Contemporary Japanese design and a comfortable, fast-casual or sit-down dining experience.' },
            ],
          },
          {
            h2: 'What to order at Shokku Ramen',
            body: (
              <p>
                On your first visit, go with the house signature bowl — it showcases what makes Shokku distinct.
                If the menu offers a spicy option, it is worth trying since bold-flavored concepts usually nail
                heat. Add a soft-boiled egg for richness and check for any limited specials the kitchen is
                running.
              </p>
            ),
          },
          {
            h2: 'When to go',
            body: (
              <p>
                Shokku Ramen locations tend to be busiest at weekend dinners. A weekday lunch or an early dinner
                right at opening is the easiest way to get seated quickly. Check the listing above for current
                hours before heading out.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for Shokku Ramen"
        tips={[
          'Order the house signature bowl first — it reveals what the kitchen is proudest of.',
          'Try the spicy option if available; bold ramen concepts usually execute heat well.',
          'Add the soft-boiled egg for an extra layer of richness.',
          'Go on a weekday or arrive at opening to avoid peak waits.',
          'Check the listing for current hours before heading out.',
        ]}
        faqs={[
          { q: 'Is there a Shokku Ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" to see the closest Shokku Ramen locations, sorted by distance and rating.' },
          { q: 'What does Shokku mean?', a: '"Shokku" (衝撃) means shock or impact in Japanese, reflecting the bold, intense flavors the restaurant delivers in every bowl.' },
          { q: 'What kind of ramen does Shokku serve?', a: 'Shokku Ramen focuses on bold, intensely flavored Japanese ramen styles with a modern twist. Menus vary by location but typically include a signature tonkotsu or rich broth alongside spicy and classic options.' },
          { q: 'Does Shokku Ramen take reservations?', a: 'Reservation policies vary by location. Check the listing for your nearest Shokku Ramen or call ahead for large groups.' },
          { q: 'What are the hours for Shokku Ramen?', a: 'Hours vary by location. Check the listing on the map above for your nearest Shokku Ramen.' },
        ]}
      />
    </main>
  )
}
