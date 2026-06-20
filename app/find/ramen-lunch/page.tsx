import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen for Lunch Near Me | Find Lunch Ramen Restaurants',
  description: 'Find ramen restaurants open for lunch near you. Quick bowls that fit a lunch break — without sacrificing quality. Browse by location, hours, and rating.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-lunch' },
  openGraph: {
    title: 'Ramen for Lunch Near Me',
    description: 'Find ramen open for lunch near you — quick bowls without sacrificing quality.',
    url: 'https://www.ramennearyou.com/find/ramen-lunch',
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
      name: 'Are ramen restaurants open for lunch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many ramen restaurants open at 11am or noon and serve through the afternoon. Some close between lunch and dinner service (around 3–5pm). Check the hours on the restaurant page before heading over.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen shops have lunch specials?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many do — a smaller bowl bundled with gyoza, rice, or karaage at a lower price than the dinner menu. Ask the server or check the menu board for lunch set options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best ramen for lunch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shoyu and shio are popular at lunch — lighter broths that do not feel too heavy midday. Tonkotsu and miso are great if you want something more filling. Quick shops with counter seating are ideal for a lunch break.',
      },
    },
  ],
}

export default function RamenLunchPage() {
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
            initialMoods={['quick-lunch']}
            pageTitle="Ramen for Lunch Near Me"
            pageDescription="Showing ramen spots great for a quick lunch near you. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Ramen for Lunch
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ramen is one of the best lunch options in any city — a complete, satisfying meal that
              arrives fast, costs less than dinner, and keeps you going for hours. Many ramen
              restaurants offer lunch specials with a smaller bowl and a side (gyoza, rice, or
              karaage) at a reduced price.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The best lunch ramen spots are efficient without being rushed — you can be in and out
              in 30 minutes or take your time. Shoyu and shio are popular lunch choices because they
              feel lighter than miso or tonkotsu midday. Use the &ldquo;Open Now&rdquo; filter
              alongside this one to see what is serving right now.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Are ramen restaurants open for lunch?',
                  a: 'Many ramen restaurants open at 11am or noon and serve through the afternoon. Some close between lunch and dinner service (around 3–5pm). Check the hours on the restaurant page before heading over.',
                },
                {
                  q: 'Do ramen shops have lunch specials?',
                  a: 'Many do — a smaller bowl bundled with gyoza, rice, or karaage at a lower price than the dinner menu. Ask the server or check the menu board for lunch set options.',
                },
                {
                  q: 'What is the best ramen for lunch?',
                  a: 'Shoyu and shio are popular at lunch — lighter broths that do not feel too heavy midday. Tonkotsu and miso are great if you want something more filling. Quick shops with counter seating are ideal for a lunch break.',
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

          <FindCrossLinks currentHref="/find/ramen-lunch" />
          <Footer />
        </div>
      </main>
    </>
  )
}
