import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentic Ramen Near Me | Real Japanese Ramen Restaurants | RamenNearYou',
  description: 'Find authentic ramen restaurants near you. Real Japanese ramen made with long-simmered broth, house-made tare, and fresh noodles — not instant. Browse by location.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/authentic-ramen' },
  openGraph: {
    title: 'Authentic Ramen Near Me',
    description: 'Find authentic Japanese ramen near you — long-simmered broth, fresh noodles, and real craftsmanship.',
    url: 'https://www.ramennearyou.com/find/authentic-ramen',
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
      name: 'What makes ramen authentic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Authentic ramen starts with a broth simmered for 8–24 hours (or longer), a carefully made tare (seasoning concentrate), fresh or specialist-sourced noodles calibrated to the broth, and toppings prepared in-house — chashu pork, ajitsuke tamago, nori, and menma. The opposite of instant noodles.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you tell if a ramen restaurant is authentic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Signs of an authentic ramen shop: a focused menu (not dozens of items), visible noodle-making equipment, house-made chashu and eggs, a broth that tastes like it was built over many hours, and staff who take the bowl seriously. High ratings with many reviews are also a strong signal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find authentic ramen near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above to find ramen restaurants near you, sorted by distance. Filter by broth type to find the regional Japanese style you are looking for — tonkotsu, shoyu, miso, shio, and more.',
      },
    },
  ],
}

export default function AuthenticRamenPage() {
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
            pageTitle="Authentic Ramen Near Me"
            pageDescription="Find real Japanese ramen restaurants near you — long-simmered broth, house-made tare, and fresh noodles. Not instant. Enter your ZIP to browse spots nearby."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              What Authentic Ramen Looks Like
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Authentic ramen is defined by its broth. A serious shop starts with bones —
              pork, chicken, dashi from kombu and katsuobushi — and simmers them for anywhere
              from 8 to 24 hours, or longer. The result is a broth of genuine depth: layered,
              complex, and impossible to fake. This is paired with a house-made tare (seasoning
              concentrate) that finishes each bowl individually, so every serving is precisely
              calibrated.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The noodles are fresh — either made in-house or sourced from specialist makers —
              and chosen to match the broth&apos;s viscosity. Toppings like chashu, ajitsuke
              tamago, menma, and nori are prepared in-house with the same care. A focused menu,
              usually just a handful of bowls, is another hallmark: authenticity is about depth,
              not breadth. Use the map above to find ramen that takes the craft seriously.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What makes ramen authentic?',
                  a: 'Authentic ramen starts with broth simmered 8–24 hours, a house-made tare, fresh noodles calibrated to the broth, and toppings prepared in-house — chashu pork, marinated soft-boiled eggs, nori, and bamboo shoots.',
                },
                {
                  q: 'How do you tell if a ramen restaurant is authentic?',
                  a: 'Signs include a focused short menu, visible care in preparation, house-made chashu and eggs, broth that tastes like it took hours to build, and high ratings with many reviews from regular customers.',
                },
                {
                  q: 'Where can I find authentic ramen near me?',
                  a: 'Enter your ZIP code in the search bar above to see ramen restaurants sorted by distance. Filter by broth type — tonkotsu, shoyu, miso, shio — to find the regional style you want.',
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

          <FindCrossLinks currentHref="/find/authentic-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
