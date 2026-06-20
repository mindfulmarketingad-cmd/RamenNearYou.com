import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shoyu Ramen Near Me | Find Shoyu Ramen Restaurants',
  description: 'Find shoyu ramen restaurants near you. Classic soy sauce broth — savory, clean, and deeply satisfying. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shoyu-ramen' },
  openGraph: {
    title: 'Shoyu Ramen Near Me',
    description: 'Find shoyu ramen restaurants near you — classic soy sauce broth.',
    url: 'https://www.ramennearyou.com/find/shoyu-ramen',
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
      name: 'What is shoyu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shoyu (soy sauce) ramen has a clear brown broth seasoned with soy sauce. It is savory, slightly sweet, and deeply umami. Shoyu is the most traditional Tokyo-style ramen and one of the most popular styles in Japan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between shoyu and tonkotsu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shoyu broth is clear and lighter — seasoned with soy sauce over a chicken or pork base. Tonkotsu is rich, milky, and opaque from hours of boiling pork bones. Shoyu is more restrained; tonkotsu is more indulgent.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings come with shoyu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Classic shoyu ramen toppings include chashu pork, menma (bamboo shoots), narutomaki, nori, soft-boiled egg, and green onions. The clear broth shows off toppings beautifully.',
      },
    },
  ],
}

export default function ShoyuRamenPage() {
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
            initialBowls={['shoyu']}
            pageTitle="Shoyu Ramen Near Me"
            pageDescription="Showing restaurants with shoyu ramen — classic soy sauce broth. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Shoyu Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Shoyu — soy sauce — is the seasoning that defines Tokyo-style ramen. The broth is
              clear and amber-brown, built on a chicken or pork base and finished with soy sauce
              for deep, savory umami. It is the ramen most Japanese people grew up eating.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Shoyu ramen sits in the middle of the flavor spectrum — more depth than shio,
              lighter than miso, and far less rich than tonkotsu. It is the style that showcases
              the quality of the broth and the precision of the cook.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is shoyu ramen?',
                  a: 'Shoyu (soy sauce) ramen has a clear brown broth seasoned with soy sauce. Savory, slightly sweet, and deeply umami — the most traditional Tokyo-style ramen.',
                },
                {
                  q: 'What is the difference between shoyu and tonkotsu?',
                  a: 'Shoyu broth is clear and lighter, seasoned with soy sauce over a chicken or pork base. Tonkotsu is rich, milky, and opaque from boiled pork bones. Shoyu is more restrained; tonkotsu more indulgent.',
                },
                {
                  q: 'What toppings come with shoyu ramen?',
                  a: 'Classic toppings include chashu pork, menma, narutomaki, nori, soft-boiled egg, and green onions. The clear broth shows off toppings beautifully.',
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

          <FindCrossLinks currentHref="/find/shoyu-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
