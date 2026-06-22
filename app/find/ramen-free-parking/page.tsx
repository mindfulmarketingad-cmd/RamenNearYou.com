import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Free Parking Near Me | Easy-Park Ramen | RamenNearYou',
  description: 'Find ramen restaurants with free parking near you. Skip the parking hassle and drive straight to a great bowl — browse spots by location and rating.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-free-parking' },
  openGraph: {
    title: 'Ramen With Free Parking Near Me',
    description: 'Find ramen restaurants with free parking near you.',
    url: 'https://www.ramennearyou.com/find/ramen-free-parking',
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
      name: 'Which ramen restaurants have free parking near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants with parking available. Enter your ZIP code or tap "Use my location" to find easy-to-park spots nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen restaurants usually have parking?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on location. Suburban and strip-mall ramen shops often have free lots, while downtown spots may rely on street or paid parking. This page highlights places with parking listed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I confirm parking before I go?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Parking info comes from each restaurant’s listed amenities and can change. Open a listing to find the phone number and website, then call ahead to confirm free parking is available.',
      },
    },
  ],
}

export default function RamenFreeParkingPage() {
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
            initialFlags={['free-parking']}
            pageTitle="Ramen With Free Parking Near Me"
            pageDescription="Showing ramen restaurants with parking available. Enter your ZIP or use your location to find easy-to-park spots near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Drive Straight to Your Bowl
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Parking shouldn&apos;t stand between you and a great bowl of ramen. The map above is
              filtered to ramen restaurants with parking available — handy when you&apos;re driving
              in, bringing the family, or just don&apos;t want to circle the block.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Parking details come from listed amenities and can change. Open a listing to call
              ahead and confirm before you head out.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants have free parking near me?',
                  a: 'The map above is filtered to spots with parking available. Enter your ZIP or tap "Use my location" to find easy-to-park restaurants nearby.',
                },
                {
                  q: 'Do ramen restaurants usually have parking?',
                  a: 'It varies — suburban shops often have free lots, while downtown spots may rely on street or paid parking. This page highlights places with parking listed.',
                },
                {
                  q: 'How do I confirm parking before I go?',
                  a: 'Parking comes from listed amenities and can change. Open a listing to call ahead and confirm free parking is available.',
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

          <FindCrossLinks currentHref="/find/ramen-free-parking" />
          <Footer />
        </div>
      </main>
    </>
  )
}
