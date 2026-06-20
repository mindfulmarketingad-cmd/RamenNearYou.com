import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Black Garlic Ramen Near Me | Find Black Garlic Ramen Restaurants',
  description: 'Find black garlic ramen restaurants near you. Smoky, deep tonkotsu with mayu (black garlic oil) — one of the most intense ramen flavors. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/black-garlic-ramen' },
  openGraph: {
    title: 'Black Garlic Ramen Near Me',
    description: 'Find black garlic ramen near you — smoky tonkotsu with mayu black garlic oil.',
    url: 'https://www.ramennearyou.com/find/black-garlic-ramen',
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
      name: 'What is black garlic ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Black garlic ramen is tonkotsu ramen finished with mayu — charred garlic oil that adds a smoky, bitter, deeply savory layer. It is associated with Kumamoto-style tonkotsu from southern Japan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does mayu taste like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mayu (black garlic oil) tastes smoky, slightly bitter, intensely savory, and umami-rich. A small swirl transforms a bowl of tonkotsu, adding complexity without being overwhelmingly garlicky.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is black garlic ramen spicy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — black garlic ramen is not typically spicy. It is smoky and deeply savory. If you want heat, ask about a spicy tonkotsu option or add chili oil on the side.',
      },
    },
  ],
}

export default function BlackGarlicRamenPage() {
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
            initialBowls={['black-garlic']}
            pageTitle="Black Garlic Ramen Near Me"
            pageDescription="Showing restaurants with black garlic ramen — smoky, deep tonkotsu with mayu oil. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Black Garlic Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Black garlic ramen — also known as mayu ramen — is a tonkotsu variant finished with a
              spoonful of mayu, a paste made from garlic cloves slowly charred in oil until they
              turn deep black. A swirl of mayu added to tonkotsu broth transforms the bowl with a
              smoky, bitter, intensely savory depth.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The combination is associated with Kumamoto-style tonkotsu, a regional variation from
              southern Japan. Black garlic ramen has some of the most dedicated fans in the ramen
              world — the flavor is unlike anything else, and once you have had it, plain tonkotsu
              feels incomplete.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is black garlic ramen?',
                  a: 'Black garlic ramen is tonkotsu ramen finished with mayu — charred garlic oil that adds a smoky, bitter, deeply savory layer. It is associated with Kumamoto-style tonkotsu from southern Japan.',
                },
                {
                  q: 'What does mayu taste like?',
                  a: 'Mayu (black garlic oil) tastes smoky, slightly bitter, intensely savory, and umami-rich. A small swirl transforms a bowl of tonkotsu, adding complexity without being overwhelmingly garlicky.',
                },
                {
                  q: 'Is black garlic ramen spicy?',
                  a: 'No — black garlic ramen is not typically spicy. It is smoky and deeply savory. If you want heat, ask about a spicy tonkotsu option or add chili oil on the side.',
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

          <FindCrossLinks currentHref="/find/black-garlic-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
