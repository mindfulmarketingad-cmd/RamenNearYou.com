import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tantanmen Near Me | Find Tantanmen Ramen Restaurants',
  description: 'Find tantanmen restaurants near you. Spicy sesame ramen inspired by Sichuan dan dan noodles — rich, nutty, and fiery. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tantanmen' },
  openGraph: {
    title: 'Tantanmen Near Me',
    description: 'Find tantanmen near you — spicy sesame ramen inspired by Sichuan dan dan noodles.',
    url: 'https://www.ramennearyou.com/find/tantanmen',
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
      name: 'What is tantanmen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Tantanmen is Japan's ramen take on Sichuan dan dan noodles. The broth is built on sesame paste and chili oil — rich, nutty, and spicy. Usually topped with seasoned ground pork.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is tantanmen the same as spicy miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Tantanmen gets its richness from sesame paste and its heat from chili oil. Spicy miso uses fermented soybean paste as the base. Both are spicy, but tantanmen is nuttier and sesame-forward.',
      },
    },
    {
      '@type': 'Question',
      name: 'How spicy is tantanmen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tantanmen ranges from mild to very hot depending on the shop. Most offer a spice level selector. The sesame rounds out the heat, so it feels more complex than just hot — nutty and rich with a warming spice.',
      },
    },
  ],
}

export default function TantanmenPage() {
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
            initialBowls={['tantanmen']}
            pageTitle="Tantanmen Near Me"
            pageDescription="Showing restaurants with tantanmen — spicy sesame ramen with ground pork. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Tantanmen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Tantanmen is Japan&apos;s adaptation of the Sichuan Chinese classic dan dan noodles.
              The broth is built on sesame paste and chili oil over a pork or chicken base,
              producing a rich, nutty, spicy bowl that sits somewhere between ramen and a Chinese
              noodle dish. It is one of the most addictive bowls in the ramen world.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Unlike spicy miso, tantanmen gets its heat and richness from sesame rather than miso.
              The flavor is round and nutty with a slow-building spice. Most versions are topped
              with seasoned ground pork, bok choy, and a drizzle of chili oil. It is a rich bowl —
              one that rewards slow, deliberate eating.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is tantanmen?',
                  a: "Tantanmen is Japan's ramen take on Sichuan dan dan noodles. The broth is built on sesame paste and chili oil — rich, nutty, and spicy. Usually topped with seasoned ground pork.",
                },
                {
                  q: 'Is tantanmen the same as spicy miso ramen?',
                  a: 'No. Tantanmen gets its richness from sesame paste and its heat from chili oil. Spicy miso uses fermented soybean paste as the base. Both are spicy, but tantanmen is nuttier and sesame-forward.',
                },
                {
                  q: 'How spicy is tantanmen?',
                  a: 'Tantanmen ranges from mild to very hot depending on the shop. Most offer a spice level selector. The sesame rounds out the heat, so it feels more complex than just hot — nutty and rich with a warming spice.',
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

          <FindCrossLinks currentHref="/find/tantanmen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
