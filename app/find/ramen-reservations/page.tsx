import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Reservations Near Me | Book a Table | RamenNearYou',
  description: 'Find ramen restaurants that take reservations near you. Skip the line and book a table — ideal for date night, groups, and special occasions.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-reservations' },
  openGraph: {
    title: 'Ramen With Reservations Near Me',
    description: 'Find ramen restaurants that accept reservations near you.',
    url: 'https://www.ramennearyou.com/find/ramen-reservations',
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
      name: 'Which ramen restaurants take reservations near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants that accept reservations. Enter your ZIP code or tap "Use my location" to find bookable spots near you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen shops usually take reservations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many casual ramen shops are walk-in only, but a growing number — especially upscale or izakaya-style spots — accept reservations. This page highlights the ones that do.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a table for ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Open a listing from the map to find the restaurant’s phone number and website, then call or book online. Reservation policies can change, so confirm directly with the restaurant.',
      },
    },
  ],
}

export default function RamenReservationsPage() {
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
            initialFlags={['reservations']}
            pageTitle="Ramen With Reservations Near Me"
            pageDescription="Showing ramen restaurants that take reservations. Enter your ZIP or use your location to book a table near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Reserve Your Bowl in Advance
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Some of the best ramen spots have long waits — but plenty take reservations so you
              can skip the line. The map above is filtered to restaurants that accept bookings,
              making it easy to plan date night, a group dinner, or a special occasion around a
              great bowl.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Open any listing to find the phone number and website, then book directly.
              Reservation policies vary, so it&apos;s always worth confirming with the restaurant.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants take reservations near me?',
                  a: 'The map above is filtered to spots that accept reservations. Enter your ZIP or tap "Use my location" to find bookable spots nearby.',
                },
                {
                  q: 'Do ramen shops usually take reservations?',
                  a: 'Many casual shops are walk-in only, but upscale and izakaya-style spots increasingly accept reservations. This page surfaces the ones that do.',
                },
                {
                  q: 'How do I book a table for ramen?',
                  a: 'Open a listing for the phone number and website, then call or book online. Confirm the policy directly, as it can change.',
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

          <FindCrossLinks currentHref="/find/ramen-reservations" />
          <Footer />
        </div>
      </main>
    </>
  )
}
