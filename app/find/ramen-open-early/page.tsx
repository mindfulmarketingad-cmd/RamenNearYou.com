import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Early Near Me | Morning & Early Lunch Ramen | RamenNearYou',
  description: 'Find ramen restaurants that open early near you. Get an early lunch or a morning bowl — browse spots that start serving before 10:30 AM.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-early' },
  openGraph: {
    title: 'Ramen Open Early Near Me',
    description: 'Find ramen restaurants that open early near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-early',
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
      name: 'Which ramen restaurants open early near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants that open early — by 10:30 AM on at least one day. Enter your ZIP code or tap "Use my location" to find an early bowl nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you eat ramen for breakfast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Definitely. Ramen for breakfast (asa-ra, or "morning ramen") is a beloved tradition in parts of Japan. A lighter shoyu or shio bowl makes a satisfying, warming start to the day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What time do ramen restaurants usually open?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ramen shops open for lunch around 11 AM or 11:30 AM. The early openers on this page start serving sooner — great for an early lunch or a morning bowl before a busy day.',
      },
    },
  ],
}

export default function RamenOpenEarlyPage() {
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
            initialFlags={['open-early']}
            pageTitle="Ramen Open Early Near Me"
            pageDescription="Showing ramen restaurants that open early. Enter your ZIP or use your location to find a morning or early-lunch bowl near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              An Early Bowl to Start the Day
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Most ramen shops don&apos;t open until lunch, but some start serving early. The map
              above is filtered to ramen restaurants that open by 10:30 AM — perfect for an early
              lunch, a pre-work bowl, or the Japanese tradition of morning ramen.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Want to be sure they&apos;re serving right now? Add the Open Now filter above the map.
              Hours vary by day, so it&apos;s worth confirming on the listing before you go.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants open early near me?',
                  a: 'The map above is filtered to spots that open by 10:30 AM on at least one day. Enter your ZIP or tap "Use my location" to find an early bowl nearby.',
                },
                {
                  q: 'Can you eat ramen for breakfast?',
                  a: 'Yes — morning ramen ("asa-ra") is a tradition in parts of Japan. A lighter shoyu or shio bowl makes a warming start to the day.',
                },
                {
                  q: 'What time do ramen restaurants usually open?',
                  a: 'Most open around 11 AM or 11:30 AM. The early openers here start sooner — great for an early lunch or morning bowl.',
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

          <FindCrossLinks currentHref="/find/ramen-open-early" />
          <Footer />
        </div>
      </main>
    </>
  )
}
