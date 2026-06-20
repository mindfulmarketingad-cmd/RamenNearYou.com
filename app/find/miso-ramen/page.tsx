import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Miso Ramen Near Me | Find Miso Ramen Restaurants',
  description: 'Find miso ramen restaurants near you. Rich, earthy fermented soybean broth — a hearty, warming bowl. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/miso-ramen' },
  openGraph: {
    title: 'Miso Ramen Near Me',
    description: 'Find miso ramen restaurants near you — rich, earthy fermented soybean broth.',
    url: 'https://www.ramennearyou.com/find/miso-ramen',
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
      name: 'What is miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Miso ramen uses fermented soybean paste (miso) as its primary seasoning, giving the broth a rich, earthy, slightly sweet flavor. It originated in Hokkaido, Japan and is the heartiest of the four classic ramen styles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between miso ramen and tonkotsu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Miso ramen gets its richness from fermented soybean paste mixed into the broth, giving it an earthy, complex flavor. Tonkotsu gets its richness from boiled pork bones — it is creamier and more fatty. Both are hearty; miso has more umami depth.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings go with miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Classic miso ramen toppings include corn, butter, chashu pork, bean sprouts, green onions, menma, and a soft-boiled egg. The rich broth can stand up to bold toppings.',
      },
    },
  ],
}

export default function MisoRamenPage() {
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
            initialBowls={['miso']}
            pageTitle="Miso Ramen Near Me"
            pageDescription="Showing restaurants with miso ramen — rich, earthy fermented soybean broth. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Miso Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Miso ramen originated in Sapporo, Hokkaido — Japan&apos;s northernmost major island —
              where harsh winters demanded a hearty, warming bowl. The broth is built on a pork or
              chicken base and finished with miso paste, giving it a rich, complex flavor with a
              slightly sweet earthiness that no other ramen style can match.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Miso ramen is the most forgiving style for bold toppings: corn, butter, bean sprouts,
              and ground pork are all at home in the robust broth. It is a cold-weather classic
              that delivers maximum satisfaction per bowl.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is miso ramen?',
                  a: 'Miso ramen uses fermented soybean paste as its primary seasoning, giving the broth a rich, earthy, slightly sweet flavor. Originated in Hokkaido — the heartiest of the four classic ramen styles.',
                },
                {
                  q: 'What is the difference between miso and tonkotsu ramen?',
                  a: 'Miso gets its richness from fermented soybean paste — earthy and complex. Tonkotsu gets its richness from boiled pork bones — creamier and fattier. Both are hearty; miso has more umami depth.',
                },
                {
                  q: 'What toppings go with miso ramen?',
                  a: 'Classic toppings include corn, butter, chashu pork, bean sprouts, green onions, menma, and soft-boiled egg. The robust broth can stand up to bold flavors.',
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

          <FindCrossLinks currentHref="/find/miso-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
