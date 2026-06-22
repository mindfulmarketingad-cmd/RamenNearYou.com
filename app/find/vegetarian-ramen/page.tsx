import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vegetarian Ramen Near Me | Find Meat-Free Ramen',
  description: 'Find vegetarian ramen restaurants near you. Meat-free broths and toppings — full flavor without the meat. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/vegetarian-ramen' },
  openGraph: {
    title: 'Vegetarian Ramen Near Me',
    description: 'Find vegetarian ramen near you — meat-free bowls packed with umami and flavor.',
    url: 'https://www.ramennearyou.com/find/vegetarian-ramen',
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
      name: 'What is vegetarian ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vegetarian ramen uses a broth made without meat — typically from kombu, shiitake mushrooms, or vegetable stock — and is topped with plant-based or egg-based toppings. It can range from light and clear to rich and deeply savory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is vegetarian ramen the same as vegan ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always. Vegetarian ramen may include eggs, dairy (like butter), or fish-based tare. Vegan ramen excludes all animal products. Always check with the restaurant if you need fully vegan options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes a good vegetarian ramen broth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Great vegetarian ramen broth builds umami from kombu (dried kelp), dried shiitake mushrooms, and roasted vegetables. Miso, soy tare, or sesame paste add depth. The best versions rival meat-based broths in richness and complexity.',
      },
    },
  ],
}

export default function VegetarianRamenPage() {
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
            initialFlags={['vegetarian']}
            pageTitle="Vegetarian Ramen Near Me"
            pageDescription="Find ramen restaurants with vegetarian options near you — meat-free broths and toppings packed with umami. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Vegetarian Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Vegetarian ramen has evolved from a niche request to a menu staple at serious ramen shops.
              The best versions build umami from kombu, dried shiitake mushrooms, and roasted vegetables —
              producing broths that rival their meat-based counterparts in depth and complexity. Miso and
              shoyu are the most common bases for vegetarian ramen.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Toppings vary widely — soft-boiled eggs, roasted corn, nori, bean sprouts, and seasonal
              vegetables are all common. Some spots offer rich, creamy vegetarian tonkotsu-style bowls
              using plant-based milks or blended vegetables. Use the map above to find vegetarian ramen
              near you and filter by distance and hours.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is vegetarian ramen?',
                  a: 'Vegetarian ramen uses a broth made without meat — typically from kombu, shiitake mushrooms, or vegetable stock — topped with plant-based or egg-based toppings. It ranges from light and clear to rich and deeply savory.',
                },
                {
                  q: 'Is vegetarian ramen the same as vegan ramen?',
                  a: 'Not always. Vegetarian ramen may include eggs, dairy, or fish-based tare. Vegan ramen excludes all animal products. Always check with the restaurant if you need fully vegan.',
                },
                {
                  q: 'What makes a good vegetarian ramen broth?',
                  a: 'Great vegetarian broth builds umami from kombu, dried shiitake, and roasted vegetables. Miso, soy tare, or sesame paste add depth. The best versions rival meat-based broths in richness.',
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

          <FindCrossLinks currentHref="/find/vegetarian-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
