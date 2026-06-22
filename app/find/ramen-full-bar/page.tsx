import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With a Full Bar Near Me | Ramen & Drinks | RamenNearYou',
  description: 'Find ramen restaurants with a full bar near you. Pair your bowl with sake, beer, highballs, or cocktails — great for date night and groups.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-full-bar' },
  openGraph: {
    title: 'Ramen With a Full Bar Near Me',
    description: 'Find ramen restaurants that serve alcohol near you — sake, beer, and cocktails.',
    url: 'https://www.ramennearyou.com/find/ramen-full-bar',
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
      name: 'Which ramen restaurants have a full bar near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants that serve alcohol. Enter your ZIP code or tap "Use my location" to find spots with sake, beer, and cocktails nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'What drinks pair well with ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Crisp Japanese lagers, sake, shochu, and highballs are classic ramen pairings. A dry sake or cold beer cuts through rich tonkotsu, while a citrusy highball refreshes between bites of spicy bowls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are ramen bars and izakayas the same thing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not exactly. An izakaya is a Japanese gastropub focused on drinks and small plates, while a ramen bar centers on noodles. Many spots blur the line, offering both a full bar and a serious ramen menu.',
      },
    },
  ],
}

export default function RamenFullBarPage() {
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
            initialFlags={['full-bar']}
            pageTitle="Ramen With a Full Bar Near Me"
            pageDescription="Showing ramen restaurants that serve alcohol. Enter your ZIP or use your location to find ramen and drinks near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Ramen and a Drink to Match
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              A cold beer or a pour of sake alongside a rich bowl of ramen is one of life&apos;s
              great pairings. The map above is filtered to ramen restaurants with a full bar or
              alcohol service — perfect for date night, after work, or a relaxed group dinner.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Looking for the full izakaya experience? Combine this with the Date Night or Open
              Late filters above the map to find the right vibe.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants have a full bar near me?',
                  a: 'The map above is filtered to spots that serve alcohol. Enter your ZIP or tap "Use my location" to find sake, beer, and cocktails nearby.',
                },
                {
                  q: 'What drinks pair well with ramen?',
                  a: 'Japanese lagers, sake, shochu, and highballs are classic. A dry sake or cold beer cuts through rich tonkotsu; a citrusy highball refreshes spicy bowls.',
                },
                {
                  q: 'Are ramen bars and izakayas the same thing?',
                  a: 'Not exactly — an izakaya centers on drinks and small plates, a ramen bar on noodles. Many spots offer both a full bar and a serious ramen menu.',
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

          <FindCrossLinks currentHref="/find/ramen-full-bar" />
          <Footer />
        </div>
      </main>
    </>
  )
}
