import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tonkotsu Ramen Near Me | Find Tonkotsu Ramen Restaurants',
  description: 'Find tonkotsu ramen restaurants near you. Rich, creamy pork bone broth — browse spots by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tonkotsu-ramen' },
  openGraph: {
    title: 'Tonkotsu Ramen Near Me',
    description: 'Find tonkotsu ramen restaurants near you — rich, creamy pork bone broth.',
    url: 'https://www.ramennearyou.com/find/tonkotsu-ramen',
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
      name: 'What is tonkotsu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu ramen has a thick, milky broth made from pork bones simmered for 12 hours or more. It is rich, creamy, and deeply savory — typically topped with chashu pork, soft-boiled egg, nori, and bamboo shoots.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between tonkotsu and other ramen broths?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu is pork-bone based and very rich. Shoyu is soy-sauce based and lighter. Miso uses fermented soybean paste for an earthy, slightly sweet flavor. Shio (salt) is the lightest and most delicate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is tonkotsu ramen spicy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional tonkotsu is not spicy — it is rich and savory. Many restaurants offer a spicy tonkotsu option with chili paste or oil added. Ask your server about heat level options.',
      },
    },
  ],
}

export default function TonkotsuRamenPage() {
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
            initialBowls={['tonkotsu']}
            pageTitle="Tonkotsu Ramen Near Me"
            pageDescription="Showing restaurants with tonkotsu ramen — rich, creamy pork bone broth. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Tonkotsu Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Tonkotsu is the king of ramen broths. Made from pork bones simmered for 12 or more
              hours, the broth turns thick, milky, and intensely savory. Originating in Fukuoka,
              Japan, tonkotsu has become the most popular ramen style in the United States.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Classic toppings include chashu pork belly, a soft-boiled marinated egg (ajitama),
              nori seaweed, green onions, bamboo shoots, and black garlic oil. The noodles are
              typically thin and straight to hold up against the rich broth.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is tonkotsu ramen?',
                  a: 'Tonkotsu has a thick, milky broth made from pork bones simmered for 12+ hours. Rich, creamy, and deeply savory — typically topped with chashu pork, soft-boiled egg, nori, and bamboo shoots.',
                },
                {
                  q: 'What is the difference between tonkotsu and other ramen broths?',
                  a: 'Tonkotsu is pork-bone based and very rich. Shoyu is soy-sauce based and lighter. Miso uses fermented soybean paste. Shio (salt) is the lightest and most delicate.',
                },
                {
                  q: 'Is tonkotsu ramen spicy?',
                  a: 'Traditional tonkotsu is not spicy — it is rich and savory. Many restaurants offer a spicy tonkotsu variation with chili paste or oil. Ask your server.',
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

          <FindCrossLinks currentHref="/find/tonkotsu-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
