import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Late Near Me | Late Night Ramen Restaurants',
  description:
    'Find ramen restaurants open late near you. Browse spots open until 10 PM or later — filter by location, broth type, and price.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-late' },
  openGraph: {
    title: 'Ramen Open Late Near Me',
    description: 'Find ramen restaurants open late near you — open until 10 PM or later.',
    url: 'https://www.ramennearyou.com/find/ramen-open-late',
    siteName: 'RamenNearYou',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramen Open Late Near Me',
    description: 'Find ramen restaurants open late near you — open until 10 PM or later.',
  },
}

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Ramen Open Late Near Me',
  description: 'Find ramen restaurants open late near you. Browse spots open until 10 PM or later.',
  url: 'https://www.ramennearyou.com/find/ramen-open-late',
  isPartOf: { '@type': 'WebSite', url: 'https://www.ramennearyou.com', name: 'RamenNearYou' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What ramen restaurants are open late near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the map above to find ramen restaurants open until 10 PM or later near your location. Click "Use my location" or enter your ZIP code to see late-night ramen spots sorted by distance.',
      },
    },
    {
      '@type': 'Question',
      name: 'What time do most ramen restaurants close?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ramen restaurants close between 9 PM and 10 PM. Late-night ramen spots typically stay open until 11 PM, midnight, or even later — especially in larger cities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ramen a good late-night food?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A warm bowl of ramen is one of the most satisfying late-night meals — rich broth, chewy noodles, and toppings that hit differently after 10 PM. Tonkotsu and spicy miso are especially popular for late-night cravings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which cities have the most late-night ramen options?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New York, Los Angeles, Chicago, Houston, and Seattle tend to have the most ramen restaurants open late. Use the map to explore late-night ramen in your city.',
      },
    },
  ],
}

export default function RamenOpenLatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-[#ffffff]">
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
            initialFlags={['open-late']}
            pageTitle="Ramen Open Late Near Me"
            pageDescription="Showing ramen restaurants open until 10 PM or later. Enter your ZIP or use your location to find the closest ones."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          {/* SEO content block */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Ramen Open Late Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Late-night ramen cravings are real. The map above shows every ramen restaurant in our directory
              that stays open until 10 PM or later — pre-filtered so you don&apos;t have to dig. Enter your
              ZIP code or hit &quot;Use my location&quot; and the list will sort by distance.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              You can stack additional filters — broth type, price range, open past midnight — using the
              Filters button in the bar above the map. The &quot;Open Now&quot; chip will narrow it further
              to spots currently serving.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What ramen restaurants are open late near me?',
                  a: 'Use the map above. Click "Use my location" or type your ZIP code — the list will sort by distance and show only spots open until 10 PM or later.',
                },
                {
                  q: 'What time do most ramen restaurants close?',
                  a: 'Most close between 9 PM and 10 PM. True late-night spots stay open until 11 PM, midnight, or beyond — particularly in larger cities like New York, LA, and Chicago.',
                },
                {
                  q: 'Is ramen a good late-night food?',
                  a: 'One of the best. A rich tonkotsu or spicy miso broth is deeply satisfying after a long day. The warm, umami-heavy bowl hits differently at 11 PM.',
                },
                {
                  q: 'Which cities have the most late-night ramen?',
                  a: 'New York, Los Angeles, Chicago, Houston, and Seattle lead the pack. Pan the map to explore late-night ramen density in any city.',
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

          <Footer />
        </div>
      </main>
    </>
  )
}
