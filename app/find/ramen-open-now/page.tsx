import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Now Near Me | Ramen Restaurants Open Right Now',
  description: 'Find ramen restaurants open right now near you. See which spots are currently serving — filter by location, broth type, and price.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-now' },
  openGraph: {
    title: 'Ramen Open Now Near Me',
    description: 'Find ramen restaurants open right now near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-now',
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
      name: 'What ramen restaurants are open right now near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the map above — it is pre-filtered to show ramen restaurants currently open. Enter your ZIP code or click "Use my location" to sort by distance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I know if a ramen restaurant is open now?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every restaurant on this map is checked against its posted hours in real time. Green "Open" badges in the list confirm which spots are currently serving.',
      },
    },
    {
      '@type': 'Question',
      name: 'What time do ramen restaurants open?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ramen restaurants open for lunch around 11 AM or noon and serve through the afternoon and evening. Some open exclusively for dinner, starting at 5 PM.',
      },
    },
  ],
}

export default function RamenOpenNowPage() {
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
            initialFlags={['open-now']}
            pageTitle="Ramen Open Now Near Me"
            pageDescription="Showing ramen restaurants open right now. Enter your ZIP or use your location to find the closest ones."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Find Ramen Open Right Now
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The map above filters to ramen restaurants currently open based on their posted hours.
              Enter your ZIP code or hit &quot;Use my location&quot; and results will sort by distance
              so the nearest open bowl is always at the top.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Stack additional filters — broth type, price range, open late — using the Filters
              button in the bar above the map.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What ramen restaurants are open right now near me?',
                  a: 'Use the map above — it is pre-filtered to show ramen restaurants currently open. Enter your ZIP or tap "Use my location" to sort by distance.',
                },
                {
                  q: 'How do I know if a ramen restaurant is open now?',
                  a: 'Every restaurant is checked against its posted hours. Green "Open" badges in the list confirm which spots are currently serving.',
                },
                {
                  q: 'What time do ramen restaurants open?',
                  a: 'Most open for lunch around 11 AM or noon. Some open only for dinner starting at 5 PM. Hours vary — the map reflects each restaurant\'s current schedule.',
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

          <FindCrossLinks currentHref="/find/ramen-open-now" />
          <Footer />
        </div>
      </main>
    </>
  )
}
