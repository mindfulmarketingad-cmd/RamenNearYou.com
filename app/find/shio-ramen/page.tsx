import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shio Ramen Near Me | Find Shio Ramen Restaurants',
  description: 'Find shio ramen restaurants near you. Light, clean salt-based broth — the most delicate style of ramen. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shio-ramen' },
  openGraph: {
    title: 'Shio Ramen Near Me',
    description: 'Find shio ramen restaurants near you — light, clean salt-based broth.',
    url: 'https://www.ramennearyou.com/find/shio-ramen',
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
      name: 'What is shio ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shio (salt) ramen has a clear, pale golden broth seasoned primarily with salt. It is the lightest and most delicate of the four main ramen styles — letting the quality of the broth base shine through without heavy seasoning.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between shio and shoyu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shio uses salt as its primary seasoning, producing a clean, clear broth. Shoyu uses soy sauce, which gives the broth a darker color and a slightly deeper, more savory flavor. Both are lighter than miso or tonkotsu.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings go with shio ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Classic shio ramen toppings include chicken chashu, menma (bamboo shoots), narutomaki (fish cake), nori, and green onions. The delicate broth pairs well with light, clean toppings rather than heavy proteins.',
      },
    },
  ],
}

export default function ShioRamenPage() {
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
            initialBowls={['shio']}
            pageTitle="Shio Ramen Near Me"
            pageDescription="Showing restaurants with shio ramen — light, clean salt-based broth. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Shio Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Shio — meaning &quot;salt&quot; in Japanese — is considered the oldest and most
              refined ramen style. The broth is clear and pale, seasoned with carefully balanced
              salt rather than soy or miso. Because there is nowhere to hide, a great shio broth
              requires exceptional stock and precise seasoning.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Shio ramen is the choice for ramen purists who want to taste the broth itself —
              chicken, seafood, or pork — without heavy seasoning masking the subtleties. If you
              have only had tonkotsu, shio is a revelation.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is shio ramen?',
                  a: 'Shio (salt) ramen has a clear, pale broth seasoned primarily with salt. The lightest and most delicate of the four main ramen styles — letting the quality of the broth base shine.',
                },
                {
                  q: 'What is the difference between shio and shoyu ramen?',
                  a: 'Shio uses salt, producing a clean, clear broth. Shoyu uses soy sauce, giving a darker color and deeper flavor. Both are lighter than miso or tonkotsu.',
                },
                {
                  q: 'What toppings go with shio ramen?',
                  a: 'Classic toppings include chicken chashu, menma, narutomaki, nori, and green onions. The delicate broth pairs best with light, clean toppings.',
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

          <FindCrossLinks currentHref="/find/shio-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
