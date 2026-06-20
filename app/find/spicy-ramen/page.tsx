import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spicy Ramen Near Me | Find Spicy Ramen Restaurants',
  description: 'Find spicy ramen restaurants near you. Spicy miso, tantanmen, and fiery tonkotsu — browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/spicy-ramen' },
  openGraph: {
    title: 'Spicy Ramen Near Me',
    description: 'Find spicy ramen restaurants near you — spicy miso, tantanmen, and fiery tonkotsu.',
    url: 'https://www.ramennearyou.com/find/spicy-ramen',
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
      name: 'What is spicy miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spicy miso ramen combines a fermented soybean paste (miso) broth with chili paste or oil for heat. It is rich, bold, and warming — one of the most popular spicy ramen styles in the US.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is tantanmen ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tantanmen (Japanese-style dan dan noodles) is a sesame and chili-oil based ramen inspired by Sichuan cuisine. It is spicy, nutty, and savory — typically topped with ground pork and bok choy.',
      },
    },
    {
      '@type': 'Question',
      name: 'How spicy is spicy ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spice levels vary widely by restaurant. Most offer a spice scale (mild, medium, hot, extra hot). If you are heat-sensitive, start at mild — even that can have a noticeable kick compared to non-spicy ramen.',
      },
    },
  ],
}

export default function SpicyRamenPage() {
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
            initialBowls={['spicy-miso']}
            pageTitle="Spicy Ramen Near Me"
            pageDescription="Showing restaurants with spicy ramen — spicy miso, tantanmen, and fiery tonkotsu. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Spicy Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Spicy ramen comes in many forms — spicy miso with toban djan chili paste, tantanmen
              with sesame and Sichuan chili oil, or straight-up fiery tonkotsu with a generous
              pour of la-yu. The common thread is heat that builds into a deeply satisfying bowl.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The map above is pre-filtered to show restaurants with spicy ramen options. Most
              spots offer adjustable heat levels — don&apos;t hesitate to ask for extra spice or
              a milder version.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is spicy miso ramen?',
                  a: 'Spicy miso combines a fermented soybean paste broth with chili paste or oil. Rich, bold, and warming — one of the most popular spicy ramen styles in the US.',
                },
                {
                  q: 'What is tantanmen ramen?',
                  a: 'Tantanmen is a sesame and chili-oil based ramen inspired by Sichuan dan dan noodles. Spicy, nutty, and savory — typically topped with ground pork and bok choy.',
                },
                {
                  q: 'How spicy is spicy ramen?',
                  a: 'Spice levels vary by restaurant. Most offer a scale from mild to extra hot. If you are heat-sensitive, start at mild — even that can have a noticeable kick.',
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

          <FindCrossLinks currentHref="/find/spicy-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
