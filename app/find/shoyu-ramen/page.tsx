import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shoyu Ramen Near Me | Classic Tokyo Soy-Sauce Ramen | RamenNearYou',
  description: 'Find shoyu ramen near you — the original Tokyo-style soy-sauce broth, light yet deeply savory. What shoyu ramen is, how to order it, and how to judge a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shoyu-ramen' },
  openGraph: {
    title: 'Shoyu Ramen Near Me',
    description: 'Find classic, soy-seasoned shoyu ramen near you.',
    url: 'https://www.ramennearyou.com/find/shoyu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ShoyuRamenPage() {
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
          initialBowls={['shoyu']}
          pageTitle="Shoyu Ramen Near Me"
          pageDescription="Showing shoyu (soy sauce) ramen near you. Enter your ZIP or use your location to find a classic, savory bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/shoyu-ramen"
        heading="Finding Classic Shoyu Ramen Near Me"
        intro={[
          'Shoyu is where ramen started, and it is still the bowl I recommend to anyone who thinks they do not like ramen. That clear, soy-seasoned broth is light on its feet but deeply savory — proof that ramen does not have to be heavy to be unforgettable. The map above is filtered to shoyu ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'Because shoyu is so clean and balanced, there is nowhere for a kitchen to hide — which makes it a great test of a shop’s skill. Here is what defines the style and how I judge a great version.',
        ]}
        sections={[
          {
            h2: 'What shoyu ramen is',
            body: (
              <p>
                Shoyu ramen is the original Tokyo style: a clear, brown broth seasoned with soy sauce (shoyu).
                The base is usually chicken, pork, or a chicken-and-dashi blend, and the soy tare brings a deep,
                savory umami without heaviness. It is typically served with curly noodles, chashu, menma
                (bamboo shoots), nori, and scallion — clean, balanced, and endlessly drinkable.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Clear and brown, light-bodied but full of savory depth from the soy tare and a clean stock.' },
              { h3: 'The noodles', text: 'Often wavy, medium noodles that suit the lighter broth without overwhelming it.' },
              { h3: 'Classic toppings', text: 'Chashu, menma (bamboo shoots), nori, scallion, and frequently a soft marinated egg.' },
            ],
          },
          {
            h2: 'How to judge a great shoyu',
            body: (
              <p>
                With nothing to hide behind, balance is everything. A great shoyu broth is savory and aromatic
                without being salty, and it should taste clean even as it is deeply flavored. I look for clarity
                in the broth and a stock that tastes like real bones and aromatics, not just soy and water. When
                a shop nails shoyu, it tells me the whole kitchen knows what it is doing.
              </p>
            ),
          },
          {
            h2: 'Who shoyu ramen is perfect for',
            body: (
              <p>
                Shoyu is my pick for ramen newcomers, for lighter appetites, and for anyone who finds tonkotsu
                too rich. It is also a fantastic lunch bowl because it satisfies without weighing you down. If
                you want something clean and classic, this is the one — stack “Top Rated” to find the shops that
                truly master it.
              </p>
            ),
          },
        ]}
        tipsHeading="My shoyu ramen tips"
        tips={[
          'Filter to “Shoyu,” then sort by distance for the nearest classic bowl.',
          'Judge it on balance — savory and aromatic without being salty is the mark of a great shoyu.',
          'It is a perfect lighter lunch; stack “Ramen for Lunch” if you are eating midday.',
          'Great for newcomers and anyone who finds tonkotsu too rich.',
          'Stack “Top Rated” to find the shops that truly master the style.',
        ]}
        faqs={[
          { q: 'What is shoyu ramen?', a: 'Shoyu ramen is the original Tokyo style — a clear, soy-sauce-seasoned broth that is light yet deeply savory. It usually has a chicken or pork-and-dashi base and is served with curly noodles, chashu, menma, and nori.' },
          { q: 'How is shoyu different from other ramen?', a: 'Shoyu is seasoned with soy sauce and stays clear and light-bodied, unlike creamy tonkotsu or thick miso. It is one of the cleanest, most balanced styles.' },
          { q: 'Is shoyu ramen good for beginners?', a: 'Yes — its clean, balanced, drinkable broth makes it the easiest classic style to love, and a great gateway for anyone new to ramen.' },
          { q: 'How can I tell if shoyu ramen is good?', a: 'Look for balance: savory and aromatic without being salty, with a clear broth that tastes of real stock and aromatics rather than just soy. Shoyu exposes a kitchen’s skill.' },
          { q: 'How do I find shoyu ramen near me?', a: 'The map above is filtered to shoyu. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
