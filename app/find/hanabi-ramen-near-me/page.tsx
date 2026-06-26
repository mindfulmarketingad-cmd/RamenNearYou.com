import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hanabi Ramen Near Me | Find Hanabi Ramen Restaurants | RamenNearYou',
  description: 'Find Hanabi Ramen near you — browse Hanabi Ramen restaurant locations by rating, hours, and distance. See menus, directions, and reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hanabi-ramen-near-me' },
  openGraph: {
    title: 'Hanabi Ramen Near Me',
    description: 'Find Hanabi Ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/hanabi-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function HanabiRamenPage() {
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
          initialFlags={['hanabi']}
          pageTitle="Hanabi Ramen Near Me"
          pageDescription="Showing Hanabi Ramen locations near you. Enter your ZIP or use your location to find the closest one."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/hanabi-ramen-near-me"
        heading="How I Find Hanabi Ramen Near Me"
        intro={[
          'Hanabi Ramen is a popular ramen chain known for its rich broths and generous bowls. The map above is filtered to Hanabi Ramen locations near you. Enter your ZIP or tap "Use my location" and the closest spots sort to the top.',
          'Here is what to expect at Hanabi Ramen and how to make the most of your visit.',
        ]}
        sections={[
          {
            h2: 'What is Hanabi Ramen?',
            body: (
              <p>
                Hanabi Ramen is a ramen restaurant known for serving Japanese-style ramen in a comfortable,
                welcoming setting. "Hanabi" (花火) means fireworks in Japanese — a nod to the bold, vibrant
                flavors in every bowl. Locations typically offer a range of broth styles including tonkotsu,
                shoyu, and spicy ramen alongside classic Japanese sides.
              </p>
            ),
            points: [
              { h3: 'Rich broths', text: 'House-simmered broths across multiple styles — tonkotsu, shoyu, miso, and spicy.' },
              { h3: 'Classic toppings', text: 'Chashu pork belly, soft-boiled egg, bamboo shoots, nori, and scallions.' },
              { h3: 'Japanese sides', text: 'Gyoza, rice dishes, and small plates round out the menu at most locations.' },
            ],
          },
          {
            h2: 'What to order at Hanabi Ramen',
            body: (
              <p>
                First visit? Start with the tonkotsu or house signature bowl to taste what the kitchen does best.
                If you like heat, the spicy ramen is a popular order — check with your server on the spice level.
                Add a soft-boiled egg (ajitama) for extra richness and a side of gyoza while the bowl arrives.
              </p>
            ),
          },
          {
            h2: 'Tips for visiting',
            body: (
              <p>
                Hanabi Ramen locations can get busy at peak lunch and dinner hours. Going on a weekday or
                arriving right when they open is the easiest way to skip the wait. Check the listing above for
                hours and call ahead if you have a large group.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for Hanabi Ramen"
        tips={[
          'Order the tonkotsu or signature bowl on your first visit to benchmark the kitchen.',
          'Add a soft-boiled egg — it makes the bowl richer and more satisfying.',
          'Go on a weekday or arrive at opening to skip peak-hour waits.',
          'Check the listing for current hours — some locations adjust seasonally.',
          'Gyoza is a reliable side order at most Hanabi locations.',
        ]}
        faqs={[
          { q: 'Is there a Hanabi Ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" to see the closest Hanabi Ramen locations, sorted by distance and rating.' },
          { q: 'What does Hanabi mean?', a: '"Hanabi" (花火) means fireworks in Japanese, reflecting the vibrant, bold flavors the restaurant aims to deliver in every bowl.' },
          { q: 'What kind of ramen does Hanabi serve?', a: 'Hanabi Ramen typically offers a range of Japanese ramen styles including tonkotsu, shoyu, miso, and spicy ramen, along with classic toppings and Japanese sides like gyoza.' },
          { q: 'Does Hanabi Ramen take reservations?', a: 'Reservation policies vary by location. Check the listing for your nearest Hanabi Ramen to see if reservations are available, or call ahead for large groups.' },
          { q: 'What are the hours for Hanabi Ramen?', a: 'Hours vary by location. Check the listing for your nearest Hanabi Ramen on the map above for current hours.' },
        ]}
      />
    </main>
  )
}
