import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fresh Ramen Noodles Near Me | House-Made Noodle Shops | RamenNearYou',
  description: 'Find fresh ramen noodles near you — shops that make noodles in house for real bite and flavor. Why fresh noodles matter and how to find them.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/fresh-ramen' },
  openGraph: {
    title: 'Fresh Ramen Noodles Near Me',
    description: 'Find shops with fresh, house-made ramen noodles near you.',
    url: 'https://www.ramennearyou.com/find/fresh-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function FreshRamenPage() {
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
          pageTitle="Fresh Ramen Noodles Near Me"
          pageDescription="Find ramen shops with fresh, house-made noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/fresh-ramen"
        heading="Why I Chase Fresh Ramen Noodles Near Me"
        intro={[
          'People obsess over broth — and rightly so — but the noodle is what carries it, and fresh noodles are a different animal entirely. That springy, chewy, just-made bite is the mark of a shop that cares. The map above helps you find ramen near you; enter your ZIP or use your location and look for the spots making noodles fresh.',
          'Once you notice the difference fresh noodles make, you cannot un-notice it. Here is why they matter, what sets them apart, and how to find shops that take their noodles as seriously as their broth.',
        ]}
        sections={[
          {
            h2: 'Why fresh noodles matter so much',
            body: (
              <p>
                Fresh ramen noodles have a springy, elastic “koshi” — that satisfying resistance and chew — that
                dried or old noodles simply lose. They cook evenly, hold their texture in the broth, and have a
                wheaty flavor of their own. A great broth poured over mediocre noodles is a letdown; fresh
                noodles elevate the entire bowl from the first slurp.
              </p>
            ),
            points: [
              { h3: 'Koshi (the bite)', text: 'Fresh noodles have a springy elasticity and chew that dried noodles can’t match — the heart of a great bowl.' },
              { h3: 'Even cooking', text: 'They cook uniformly and hold their texture longer, so the bowl stays right while you eat.' },
              { h3: 'Real flavor', text: 'House-made noodles bring their own wheaty taste and aroma instead of being a neutral vehicle.' },
            ],
          },
          {
            h2: 'House-made and hand-pulled noodles',
            body: (
              <p>
                Some shops make their noodles in house daily, sometimes with a visible noodle machine or
                custom flour blends matched to their broth. Others, especially Chinese-style spots, hand-pull
                noodles to order — la mian and Lanzhou beef noodle shops are worth seeking out for that
                theatrical, ultra-fresh experience. Either approach signals a kitchen that treats noodles as
                central, not an afterthought.
              </p>
            ),
          },
          {
            h2: 'How to find fresh-noodle shops',
            body: (
              <p>
                Fresh noodles are not always advertised, so I look at listings and reviews for mentions of
                house-made or hand-pulled noodles, and I favor shops that match their noodle to their broth
                style (thin and firm for tonkotsu, thick and chewy for tsukemen). When in doubt, ask — shops
                that make their own noodles are almost always proud to tell you.
              </p>
            ),
          },
        ]}
        tipsHeading="My fresh-noodle tips"
        tips={[
          'Scan listings and reviews for “house-made” or “hand-pulled” noodle mentions.',
          'Hand-pulled (la mian) and Lanzhou beef noodle shops are great for ultra-fresh noodles.',
          'Look for shops that match noodle gauge to broth — a sign they take noodles seriously.',
          'Order noodles firm to best appreciate fresh-noodle koshi (bite).',
          'Just ask — shops that make their own noodles love to talk about them.',
        ]}
        faqs={[
          { q: 'Why are fresh ramen noodles better?', a: 'Fresh noodles have koshi — a springy, elastic chew — plus even cooking and their own wheaty flavor. They hold texture in broth far better than dried noodles and elevate the whole bowl.' },
          { q: 'What does “koshi” mean?', a: 'Koshi is the Japanese term for the springy, elastic bite of well-made noodles. It is the satisfying resistance you feel when fresh ramen noodles are done right.' },
          { q: 'What is the difference between fresh and hand-pulled noodles?', a: 'Fresh noodles are made (often by machine) in house, frequently with custom flour blends. Hand-pulled noodles are stretched by hand to order, common at Chinese la mian and Lanzhou beef noodle shops.' },
          { q: 'How can I tell if a shop makes fresh noodles?', a: 'Check listings and reviews for “house-made” or “hand-pulled” mentions, look for shops matching noodle style to broth, or simply ask — they are usually proud to share.' },
          { q: 'How do I find fresh ramen noodles near me?', a: 'Use the map above to find ramen nearby, then read listings and reviews for house-made or hand-pulled noodle mentions and favor shops known for their noodles.' },
        ]}
      />
    </main>
  )
}
