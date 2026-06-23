import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentic Ramen Near Me | Traditional Ramen Shops | RamenNearYou',
  description: 'Find authentic ramen near you — traditional shops that simmer real broth and pull fresh noodles. How I tell authentic ramen from imitations and what to look for.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/authentic-ramen' },
  openGraph: {
    title: 'Authentic Ramen Near Me',
    description: 'Find authentic, traditional ramen shops near you.',
    url: 'https://www.ramennearyou.com/find/authentic-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function AuthenticRamenPage() {
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
          pageTitle="Authentic Ramen Near Me"
          pageDescription="Find authentic, traditional ramen near you. Enter your ZIP or use your location, then filter by broth, price, and hours."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/authentic-ramen"
        heading="How I Tell Authentic Ramen From the Rest"
        intro={[
          'Once you have had truly authentic ramen, you can taste the difference instantly — broth with depth that only comes from hours of simmering, noodles with real spring, toppings made with care. The map above helps you find authentic ramen near you; enter your ZIP or use your location to see the closest traditional shops.',
          'Authenticity is not about a label, it is about craft. Here are the signals I look for, the toppings and techniques that separate the real thing, and how to use the map to find it.',
        ]}
        sections={[
          {
            h2: 'The signs of an authentic ramen shop',
            body: (
              <p>
                The strongest tell is focus. Shops that specialize in one or two broths and do them obsessively
                well almost always make more authentic ramen than places with a sprawling pan-Asian menu. I also
                look for house-made or fresh noodles, broth with genuine body, and a kitchen that takes its
                chashu and tare seriously. A line of regulars is a good sign too.
              </p>
            ),
            points: [
              { h3: 'A focused menu', text: 'A short list built around a couple of broths signals a kitchen committed to its craft, not cutting corners.' },
              { h3: 'Real broth and noodles', text: 'Long-simmered broth with body and fresh, springy noodles are the foundation of an authentic bowl.' },
              { h3: 'Classic execution', text: 'Proper chashu, a well-marinated egg, menma, and a balanced tare show the shop respects tradition.' },
            ],
          },
          {
            h2: 'Authentic does not mean only one style',
            body: (
              <p>
                Authentic ramen spans many regional traditions — Hakata tonkotsu, Sapporo miso, Tokyo shoyu,
                and more — so an authentic shop is one that executes its chosen style faithfully, not one that
                serves a single “correct” bowl. Knowing which tradition a shop is drawing from helps you judge
                it on its own terms and order what they do best.
              </p>
            ),
          },
          {
            h2: 'Using the map to find the real thing',
            body: (
              <p>
                I start by reading listings: recent reviews that praise the broth and noodles specifically,
                photos that show carefully built bowls, and a menu centered on ramen rather than everything
                under the sun. Stack the “Top Rated” filter to surface the shops people consistently rave about,
                then narrow by the broth you want for a bowl that is both authentic and exactly your style.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding authentic ramen"
        tips={[
          'Favor shops with a focused, ramen-centered menu over sprawling pan-Asian ones.',
          'Look for fresh noodles and broth with real body — the foundations of authenticity.',
          'Read recent reviews for specific praise of the broth, noodles, and chashu.',
          'Judge a shop on how faithfully it executes its chosen regional style.',
          'Stack “Top Rated,” then filter by broth for a bowl that is authentic and your style.',
        ]}
        faqs={[
          { q: 'What makes ramen authentic?', a: 'Craft: long-simmered broth with real depth, fresh noodles with spring, and carefully made toppings like proper chashu and a marinated egg. Shops focused on a few broths tend to be the most authentic.' },
          { q: 'How can I tell if a ramen shop is authentic?', a: 'Look for a focused, ramen-centered menu, house-made or fresh noodles, broth with genuine body, and reviews that praise those specifics. A steady line of regulars is another good sign.' },
          { q: 'Is there only one authentic style of ramen?', a: 'No — authentic ramen spans many regional traditions like Hakata tonkotsu, Sapporo miso, and Tokyo shoyu. An authentic shop executes its chosen style faithfully.' },
          { q: 'Does authentic ramen have to be Japanese-owned?', a: 'Not necessarily. Authenticity comes from technique and respect for the craft — long-simmered broth, fresh noodles, and proper toppings — which cooks of any background can master.' },
          { q: 'How do I find authentic ramen near me?', a: 'Use the map above, read listings for specific praise of broth and noodles, stack “Top Rated,” and filter by the broth you want to find a faithful, high-quality bowl.' },
        ]}
      />
    </main>
  )
}
