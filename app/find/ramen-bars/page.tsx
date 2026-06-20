import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Bars Near Me | Find Ramen Bars & Late Night Spots',
  description: 'Find ramen bars near you — spots that serve ramen alongside sake, beer, and cocktails. Browse by location, hours, and rating.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-bars' },
  openGraph: {
    title: 'Ramen Bars Near Me',
    description: 'Find ramen bars near you — ramen, sake, beer, and cocktails under one roof.',
    url: 'https://www.ramennearyou.com/find/ramen-bars',
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
      name: 'What is a ramen bar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A ramen bar is a casual spot that serves ramen as its main dish alongside drinks — typically sake, Japanese beer, or cocktails. Many ramen bars are open late and have a lively, social atmosphere compared to traditional ramen restaurants.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen bars serve alcohol?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ramen bars serve alcohol — sake, Japanese whisky, beer, and sometimes craft cocktails. Pairing a cold Sapporo or a sake with a hot bowl of tonkotsu is a beloved combination.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are ramen bars open late?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many ramen bars stay open until midnight or later, making them a popular late-night dining option. Use the "Open Late" filter on the map to find ramen bars currently open near you.',
      },
    },
  ],
}

export default function RamenBarsPage() {
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
            initialFlags={['open-late']}
            pageTitle="Ramen Bars Near Me"
            pageDescription="Find ramen bars near you — spots serving ramen alongside sake, beer, and cocktails. Showing late-night ramen spots by default."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Ramen Bars Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ramen bars blend the comfort of a great bowl with the atmosphere of a neighborhood
              bar. You can expect sake on tap, Japanese whisky, cold beer, and a menu built around
              ramen — often with izakaya-style small plates. The vibe is casual, loud, and fun.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Many ramen bars are open late — past midnight on weekends — making them a go-to for
              after-work bowls or a late-night finish to a big night out. The map is pre-filtered
              to show late-night spots. Remove the filter to see all ramen restaurants near you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is a ramen bar?',
                  a: 'A ramen bar serves ramen alongside drinks — sake, Japanese beer, or cocktails. More casual and social than traditional ramen restaurants, often open late.',
                },
                {
                  q: 'Do ramen bars serve alcohol?',
                  a: 'Most do — sake, Japanese whisky, beer, and sometimes cocktails. Pairing a cold Sapporo or a sake with a hot tonkotsu is a beloved combination.',
                },
                {
                  q: 'Are ramen bars open late?',
                  a: 'Many stay open until midnight or later. Use the Open Late filter on the map to find ramen bars currently open near you.',
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

          <FindCrossLinks currentHref="/find/ramen-bars" />
          <Footer />
        </div>
      </main>
    </>
  )
}
