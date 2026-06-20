import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Restaurants Near Me | Find Ramen Near You',
  description: 'Find the best ramen restaurants near you. Browse every ramen spot in your area — filter by broth type, price, hours, and rating.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-restaurants' },
  openGraph: {
    title: 'Ramen Restaurants Near Me',
    description: 'Find the best ramen restaurants near you — browse by broth type, price, and hours.',
    url: 'https://www.ramennearyou.com/find/ramen-restaurants',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I find ramen restaurants near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the map above — enter your ZIP code or click "Use my location" to sort every ramen restaurant in our directory by distance from you. You can then filter by broth type, price, and hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I look for in a good ramen restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Look for restaurants that make their own broth in-house, use fresh noodles, and offer customization options for noodle firmness (kae-dama) and richness (kotteri vs assari). High review counts with strong ratings are a reliable signal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the most popular type of ramen in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu is the most popular ramen style in the US, followed by spicy miso and shoyu. The rich, creamy pork-bone broth resonates strongly with American palates.',
      },
    },
  ],
}

export default function RamenRestaurantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
            pageDescription="Browse every ramen restaurant in our directory. Enter your ZIP or use your location to sort by distance, then filter by broth type, price, and hours."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Find Ramen Restaurants Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              RamenNearYou is the largest ramen restaurant directory in the United States — with
              thousands of listings across every major city. Every restaurant on the map includes
              hours, ratings, price range, and broth type so you can find exactly what you are
              craving.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Use the filter bar above the map to narrow by broth type (tonkotsu, miso, shoyu,
              shio), dietary preference (vegan), price (under $15), or hours (open now, open late).
              Enter your ZIP code or tap &quot;Use my location&quot; to sort by distance.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I find ramen restaurants near me?',
                  a: 'Enter your ZIP code or click "Use my location" to sort every ramen restaurant in our directory by distance. Filter by broth type, price, and hours.',
                },
                {
                  q: 'What should I look for in a good ramen restaurant?',
                  a: 'In-house broth, fresh noodles, and customization options (noodle firmness, richness level) are good signs. High review counts with strong ratings are a reliable signal.',
                },
                {
                  q: 'What is the most popular type of ramen in the US?',
                  a: 'Tonkotsu is the most popular US ramen style, followed by spicy miso and shoyu. The rich, creamy pork-bone broth resonates strongly with American palates.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#B57F50] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <FindCrossLinks currentHref="/find/ramen-restaurants" />
          <Footer />
        </div>
      </main>
    </>
  )
}
