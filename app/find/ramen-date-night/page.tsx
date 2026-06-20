import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Date Night Ramen Near Me | Find Romantic Ramen Restaurants',
  description: 'Find date night ramen restaurants near you. Elevated ramen spots with great ambiance, sake lists, and bowls worth sharing. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-date-night' },
  openGraph: {
    title: 'Date Night Ramen Near Me',
    description: 'Find date night ramen near you — elevated spots with great ambiance and sake.',
    url: 'https://www.ramennearyou.com/find/ramen-date-night',
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
      name: 'Is ramen good for a date?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely — the right ramen spot has great atmosphere, sake, small plates, and bowls worth talking about. Ramen bars and elevated ramen restaurants can be excellent date night choices.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I order on a ramen date?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Start with small plates — gyoza, karaage, or edamame — and a sake or Japanese beer. Order different ramen styles to try each other's bowls. End with extra broth (soup wari) if the shop offers it.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen restaurants take reservations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many elevated ramen spots and ramen bars accept reservations, especially on weekends. Check the restaurant page for a reservation link or call ahead. Counter-style spots are usually first-come, first-served.',
      },
    },
  ],
}

export default function RamenDateNightPage() {
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
            initialMoods={['date-night']}
            pageTitle="Date Night Ramen Near Me"
            pageDescription="Showing elevated ramen spots great for a date — ambiance, sake lists, and special bowls. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Ramen for Date Night
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The best date night ramen spots combine a serious bowl with an environment that makes
              the experience feel special — warm lighting, a good sake and cocktail list, and a menu
              deep enough to explore together. These are not counter seats and a five-minute wait;
              they are places to linger.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Look for spots with izakaya-style small plates alongside the ramen — gyoza, karaage,
              edamame, and Japanese whisky cocktails all make the dinner feel like an event rather
              than just a meal. The best ramen date nights end with extra broth and a second round
              of drinks.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is ramen good for a date?',
                  a: 'Absolutely — the right ramen spot has great atmosphere, sake, small plates, and bowls worth talking about. Ramen bars and elevated ramen restaurants can be excellent date night choices.',
                },
                {
                  q: 'What should I order on a ramen date?',
                  a: "Start with small plates — gyoza, karaage, or edamame — and a sake or Japanese beer. Order different ramen styles to try each other's bowls. End with extra broth (soup wari) if the shop offers it.",
                },
                {
                  q: 'Do ramen restaurants take reservations?',
                  a: 'Many elevated ramen spots and ramen bars accept reservations, especially on weekends. Check the restaurant page for a reservation link or call ahead. Counter-style spots are usually first-come, first-served.',
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

          <FindCrossLinks currentHref="/find/ramen-date-night" />
          <Footer />
        </div>
      </main>
    </>
  )
}
