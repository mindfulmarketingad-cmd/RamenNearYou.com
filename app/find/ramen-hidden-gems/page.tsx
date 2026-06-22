import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hidden Gem Ramen Near Me | Underrated Ramen Spots | RamenNearYou',
  description: 'Discover hidden gem ramen restaurants near you — highly rated spots that locals love but the crowds haven’t found yet. Browse by location and rating.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-hidden-gems' },
  openGraph: {
    title: 'Hidden Gem Ramen Near Me',
    description: 'Discover underrated, highly rated ramen spots near you.',
    url: 'https://www.ramennearyou.com/find/ramen-hidden-gems',
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
      name: 'What counts as a hidden gem ramen spot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On this page, hidden gems are highly rated ramen restaurants (4.5 stars and up) that still have a relatively small number of reviews — the kind of under-the-radar spots locals love before the crowds arrive.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find hidden gem ramen near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is pre-filtered to hidden gems. Enter your ZIP code or tap "Use my location" to sort these underrated spots by distance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are highly rated spots with few reviews worth trying?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Often, yes — a consistently high rating from a smaller crowd can signal a newer or neighborhood favorite that hasn’t gone viral yet. Fewer reviews also tends to mean shorter waits.',
      },
    },
  ],
}

export default function RamenHiddenGemsPage() {
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
            initialFlags={['hidden-gems']}
            pageTitle="Hidden Gem Ramen Near Me"
            pageDescription="Showing highly rated ramen spots that haven’t hit the mainstream yet. Enter your ZIP or use your location to find an underrated bowl near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              The Ramen Spots Locals Keep Quiet
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Some of the best bowls come from spots that haven&apos;t gone viral yet. The map above
              is filtered to hidden gems — ramen restaurants rated 4.5 stars and higher that still
              have a smaller review count, the kind of under-the-radar places worth seeking out.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Fewer reviews often means shorter waits, too. Enter your ZIP or use your location to
              sort these spots by distance and find your next favorite bowl.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What counts as a hidden gem ramen spot?',
                  a: 'Highly rated restaurants (4.5+ stars) that still have a relatively small number of reviews — under-the-radar spots locals love before the crowds arrive.',
                },
                {
                  q: 'How do I find hidden gem ramen near me?',
                  a: 'The map above is pre-filtered to hidden gems. Enter your ZIP or tap "Use my location" to sort them by distance.',
                },
                {
                  q: 'Are highly rated spots with few reviews worth trying?',
                  a: 'Often yes — a strong rating from a smaller crowd can signal a newer or neighborhood favorite, and fewer reviews usually means shorter waits.',
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

          <FindCrossLinks currentHref="/find/ramen-hidden-gems" />
          <Footer />
        </div>
      </main>
    </>
  )
}
