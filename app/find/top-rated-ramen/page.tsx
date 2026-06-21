import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Top Rated Ramen Restaurants Near Me | Best Ramen Near You',
  description: 'Discover the highest-rated ramen restaurants near you. Browse top-rated spots with 4.3+ stars, sorted by rating and location.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/top-rated-ramen' },
  openGraph: {
    title: 'Top Rated Ramen Restaurants Near Me',
    description: 'Find the best ramen spots near you — 4.3+ stars, hundreds of reviews.',
    url: 'https://www.ramennearyou.com/find/top-rated-ramen',
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
      name: 'How do you determine top-rated ramen restaurants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We filter for ramen restaurants with a rating of 4.3 stars or higher and at least 20 customer reviews, ensuring the rating reflects a meaningful sample of real experiences.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes a ramen restaurant the best?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Top ramen restaurants typically excel in broth quality (long simmering times, house-made tare), noodle freshness (often house-made), topping quality, and consistent execution. High ratings usually reflect all of these combined with great service.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find the best ramen near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above to sort top-rated ramen restaurants by distance from your location. You can also use the "Use my location" button on the map for automatic proximity sorting.',
      },
    },
  ],
}

export default function TopRatedRamenPage() {
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
            initialFlags={['top-rated']}
            pageTitle="Top Rated Ramen Restaurants Near Me"
            pageDescription="Showing ramen spots rated 4.3 stars or higher with verified reviews. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              What Makes a Top-Rated Ramen Restaurant?
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The best ramen restaurants stand out for more than just good broth. They start with
              bones simmered for 12–24 hours, house-made tare, and noodles crafted daily to match
              the broth. Every component — chashu, ajitama, toppings — is made in-house and
              executed consistently.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Our top-rated filter shows restaurants with 4.3+ stars and at least 20 verified
              reviews. Enter your ZIP code to find the highest-rated ramen closest to you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How do you determine top-rated ramen restaurants?',
                  a: 'We filter for restaurants with a rating of 4.3 stars or higher and at least 20 customer reviews, so the rating reflects a meaningful sample of real experiences — not just a handful of votes.',
                },
                {
                  q: 'What makes a ramen restaurant the best?',
                  a: 'Top ramen spots excel in broth quality (long simmering times, house-made tare), fresh noodles (often made in-house), quality toppings, and consistent execution. High ratings usually reflect all of these combined with great service.',
                },
                {
                  q: 'How do I find the best ramen near me?',
                  a: 'Enter your ZIP code in the search bar to sort top-rated spots by distance. You can also tap "Use my location" on the map for automatic proximity sorting.',
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

          <FindCrossLinks currentHref="/find/top-rated-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
