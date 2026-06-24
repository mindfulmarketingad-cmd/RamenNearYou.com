import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Shop Near Me | Find Local Ramen Shops | RamenNearYou',
  description: 'Find a ramen shop near you — browse local ramen-ya by rating, broth, hours, and distance. What makes a great ramen shop and how to pick the right one nearby.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-shop' },
  openGraph: {
    title: 'Ramen Shop Near Me',
    description: 'Find a local ramen shop near you.',
    url: 'https://www.ramennearyou.com/find/ramen-shop',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenShopPage() {
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
          pageDescription="Showing ramen shops near you. Enter your ZIP or use your location to find a local ramen shop, then filter by broth, hours, and rating."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-shop"
        heading="How I Find the Best Ramen Shop Near Me"
        intro={[
          'A great ramen shop is a neighborhood treasure — a place you come back to again and again. The map above shows ramen shops near you; enter your ZIP or tap “Use my location,” and the closest, best-rated spots rise to the top.',
          'Whether you want a quick counter bowl or a sit-down meal, the right filters get you there fast. Here is how I pick a ramen shop worth becoming a regular at.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen shop?',
            body: (
              <p>
                The best ramen shops do a few things obsessively well: a broth simmered in-house, noodles with
                real bite, and consistency you can count on every visit. A focused menu is usually a good sign —
                it means the kitchen has decided what it does best and committed to it. Friendly service and a
                steady local crowd seal the deal.
              </p>
            ),
            points: [
              { h3: 'Consistent quality', text: 'A reliable bowl every visit matters more than a single perfect night.' },
              { h3: 'House-made broth and noodles', text: 'The mark of a shop that takes its craft seriously.' },
              { h3: 'A loyal local following', text: 'Lots of recent, repeat reviews signal a shop people return to.' },
            ],
          },
          {
            h2: 'How to choose the right shop nearby',
            body: (
              <p>
                Set your location so the list sorts by distance, then scan the ratings and review counts. I trust a
                strong rating that holds up across many reviews over a perfect score from only a few. From there,
                filter by the broth you are craving or add “Open Now” so you never arrive to a closed kitchen.
              </p>
            ),
          },
          {
            h2: 'Counter shop or sit-down?',
            body: (
              <p>
                Ramen shops range from tiny counters built for a fast, solo bowl to roomier spots made for
                lingering with friends. If you want the full experience, look for one with a bar or small plates;
                if you just need a great bowl quickly, a focused counter ramen-ya is perfect. The filters help you
                match the shop to the moment.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for picking a ramen shop"
        tips={[
          'Set your location so the list sorts by the closest shops first.',
          'Trust a strong rating backed by lots of reviews over a perfect score from a few.',
          'Favor shops with a focused menu and house-made broth.',
          'Add “Open Now” so you never show up to a closed kitchen.',
          'Skim recent reviews for repeat, loyal customers — the sign of a neighborhood staple.',
        ]}
        faqs={[
          { q: 'How do I find a ramen shop near me?', a: 'Use the map above — enter your ZIP or tap “Use my location,” and the closest, best-rated ramen shops sort to the top. Filter by broth or hours to narrow it down.' },
          { q: 'What makes a great ramen shop?', a: 'House-made broth and noodles, a focused menu, consistent quality every visit, and a loyal local following are the clearest signs of a great ramen shop.' },
          { q: 'What is a ramen-ya?', a: 'Ramen-ya is the Japanese term for a ramen shop — typically a focused spot, often with counter seating, that specializes in noodles and broth.' },
          { q: 'How do I pick between two ramen shops?', a: 'Compare ratings and review counts, skim recent reviews for praise of the broth and noodles, and check which is closer and open now.' },
          { q: 'Are counter ramen shops better than sit-down ones?', a: 'Neither is better — counters are great for a fast, focused solo bowl, while sit-down shops suit lingering with friends. Use the filters to match the shop to your plans.' },
        ]}
      />
    </main>
  )
}
