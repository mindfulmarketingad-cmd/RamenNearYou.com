import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open on Weekends Near Me | Saturday & Sunday Ramen | RamenNearYou',
  description: 'Find ramen restaurants open on weekends near you. Browse spots serving both Saturday and Sunday — perfect for weekend lunch, brunch, or dinner.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-weekends' },
  openGraph: {
    title: 'Ramen Open on Weekends Near Me',
    description: 'Find ramen restaurants open Saturday and Sunday near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-weekends',
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
      name: 'Which ramen restaurants are open on weekends near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants open on both Saturday and Sunday. Enter your ZIP code or tap "Use my location" to find weekend spots nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are ramen restaurants open on Sundays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many are, though Sunday or Monday is a common closing day for smaller shops. This page surfaces restaurants that serve on both weekend days so you can avoid a closed door.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ramen busier on weekends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Weekend lunch and dinner are peak times for popular spots, so expect waits. To beat the rush, try going right at opening, or use the Hidden Gems filter to find lesser-known places.',
      },
    },
  ],
}

export default function RamenOpenWeekendsPage() {
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
            initialFlags={['open-weekends']}
            pageTitle="Ramen Open on Weekends Near Me"
            pageDescription="Showing ramen restaurants open both Saturday and Sunday. Enter your ZIP or use your location to find a weekend bowl near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Weekend Ramen, Sorted
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Nothing&apos;s worse than craving ramen and finding the door locked. The map above is
              filtered to restaurants open on both Saturday and Sunday, so you can plan weekend
              lunch, brunch, or dinner without the guesswork.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Weekends are peak time at popular shops — add the Open Now filter to see who&apos;s
              serving this minute, or try Hidden Gems to dodge the crowds.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants are open on weekends near me?',
                  a: 'The map above is filtered to spots open both Saturday and Sunday. Enter your ZIP or tap "Use my location" to find weekend restaurants nearby.',
                },
                {
                  q: 'Are ramen restaurants open on Sundays?',
                  a: 'Many are, though Sunday or Monday is a common closing day for smaller shops. This page surfaces places serving both weekend days.',
                },
                {
                  q: 'Is ramen busier on weekends?',
                  a: 'Weekend lunch and dinner are peak times, so expect waits. Go right at opening, or use Hidden Gems to find lesser-known spots.',
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

          <FindCrossLinks currentHref="/find/ramen-open-weekends" />
          <Footer />
        </div>
      </main>
    </>
  )
}
