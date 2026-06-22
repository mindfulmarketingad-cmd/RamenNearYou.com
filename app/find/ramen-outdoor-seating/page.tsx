import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Outdoor Seating Near Me | Patio Ramen | RamenNearYou',
  description: 'Find ramen restaurants with outdoor seating near you. Browse spots with patios and sidewalk tables — perfect for a bowl in the fresh air.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-outdoor-seating' },
  openGraph: {
    title: 'Ramen With Outdoor Seating Near Me',
    description: 'Find ramen restaurants with patios and outdoor tables near you.',
    url: 'https://www.ramennearyou.com/find/ramen-outdoor-seating',
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
      name: 'Which ramen restaurants have outdoor seating near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants with outdoor seating. Enter your ZIP code or tap "Use my location" to sort patios and sidewalk tables by distance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ramen good to eat outside?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely — a hot bowl of ramen is especially enjoyable on a cool evening on a patio. In warmer months, brothless styles like mazemen or chilled tsukemen are great outdoor options.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I know if a ramen spot has a patio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Outdoor seating is sourced from each restaurant’s listed amenities. Availability can change seasonally, so it’s worth calling ahead to confirm the patio is open.',
      },
    },
  ],
}

export default function RamenOutdoorSeatingPage() {
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
            initialFlags={['outdoor-seating']}
            pageTitle="Ramen With Outdoor Seating Near Me"
            pageDescription="Showing ramen restaurants with outdoor seating. Enter your ZIP or use your location to find a patio near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Slurp Ramen in the Fresh Air
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              There&apos;s something special about a steaming bowl of ramen at an outdoor table —
              whether it&apos;s a crisp autumn evening or a warm summer night. The map above is
              filtered to ramen restaurants with patios, sidewalk seating, or other outdoor
              options so you can enjoy your bowl al fresco.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Stack additional filters — open now, broth type, or price — using the Filters
              button above the map. Patio availability can be seasonal, so call ahead if the
              weather is borderline.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants have outdoor seating near me?',
                  a: 'The map above is filtered to spots with outdoor seating. Enter your ZIP or tap "Use my location" to sort patios by distance.',
                },
                {
                  q: 'Is ramen good to eat outside?',
                  a: 'Yes — a hot bowl is great on a cool patio, and in summer, brothless mazemen or chilled tsukemen work well outdoors.',
                },
                {
                  q: 'How do I know if a ramen spot has a patio?',
                  a: 'Outdoor seating comes from each restaurant’s listed amenities. Availability can change seasonally, so call ahead to confirm.',
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

          <FindCrossLinks currentHref="/find/ramen-outdoor-seating" />
          <Footer />
        </div>
      </main>
    </>
  )
}
