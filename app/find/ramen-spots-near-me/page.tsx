import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Spots Near Me | Find the Best Ramen Places Nearby | RamenNearYou',
  description: 'Find ramen spots near you — browse the best ramen places and noodle shops nearby, sorted by rating and distance. Enter your ZIP or use your location to get started.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-spots-near-me' },
  openGraph: {
    title: 'Ramen Spots Near Me',
    description: 'Find the best ramen places and spots nearby, sorted by rating and distance.',
    url: 'https://www.ramennearyou.com/find/ramen-spots-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenSpotsPage() {
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
          pageTitle="Ramen Spots Near Me"
          pageDescription="Showing ramen spots near you — every ramen place I can find nearby, sorted by rating and distance. Enter your ZIP or tap “Use my location” to find one close by."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-spots-near-me"
        heading="How I Find the Best Ramen Spots Near Me"
        intro={[
          'When I just want a good bowl close by, I do not overthink it — I pull up the map above, drop in my ZIP or tap “Use my location,” and let the closest, best-rated ramen spots sort to the top. It is the fastest way to find a ramen place near you without scrolling through a dozen review sites.',
          'Below is how I separate a great ramen spot from a forgettable one, plus the filters I lean on when I am craving something specific.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen spot?',
            body: (
              <p>
                The best ramen spots tend to do a few things obsessively well rather than offering an enormous menu.
                Look for a house-simmered broth, noodles with real bite, and consistency across a lot of reviews —
                a steady 4.4 over hundreds of reviews beats a perfect score from a handful. A focused menu and a
                loyal local following are two of the clearest signs you have found a real ramen place.
              </p>
            ),
            points: [
              { h3: 'House-made broth', text: 'A broth simmered in-house for hours is the heart of any serious ramen spot.' },
              { h3: 'Fresh noodles with bite', text: 'Springy, properly cooked noodles that hold up in the broth instead of going soft.' },
              { h3: 'Consistent ratings', text: 'A strong rating that holds across many reviews signals a kitchen that delivers every visit.' },
            ],
          },
          {
            h2: 'How to find a ramen spot nearby',
            body: (
              <p>
                The map is the quickest tool — set your location and it ranks every nearby ramen place by distance
                so you can see what is genuinely close. From there I narrow by what I am in the mood for: a rich
                tonkotsu when it is cold, a light shio for lunch, or whatever is open right now. Tap into a listing
                to skim recent reviews and photos before you commit.
              </p>
            ),
          },
          {
            h2: 'Ramen spots vs. ramen shops vs. ramen restaurants',
            body: (
              <p>
                People search for the same thing a dozen ways — ramen spots, ramen places, ramen shops, ramen
                restaurants. They all point to the same goal: a hot, well-made bowl near you. A dedicated ramen
                shop (ramen-ya) usually specializes in noodles and broth, while a broader ramen restaurant may
                serve rice bowls, appetizers, and sushi alongside it. The map covers all of them.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for picking a ramen spot"
        tips={[
          'Set your location first — distance sorting instantly surfaces the closest bowls.',
          'Favor spots that focus on one or two broths and do them well.',
          'Trust a strong rating across many reviews over a perfect score from a few.',
          'Skim recent photos — a bowl that looks carefully made usually is.',
          'Add “Open Now” when you want to head out the door immediately.',
        ]}
        faqs={[
          { q: 'How do I find ramen spots near me?', a: 'Use the map above — enter your ZIP or tap “Use my location.” It shows every ramen spot nearby, sorted by rating and distance, so the closest, best-reviewed bowls rise to the top.' },
          { q: 'What is the best ramen spot near me?', a: 'Set your location on the map and sort by rating to see the top-reviewed ramen places nearby. I also open a couple of listings to check recent reviews and photos before deciding.' },
          { q: 'What is the difference between a ramen spot and a ramen restaurant?', a: 'They overlap. A dedicated ramen spot or shop specializes in noodles and broth, while a ramen restaurant may also serve rice bowls, appetizers, or sushi. The map includes both.' },
          { q: 'Are there ramen spots open now near me?', a: 'Yes — add the “Open Now” filter above the map to show only ramen spots currently serving, then sort by distance to find the closest one.' },
        ]}
      />
    </main>
  )
}
