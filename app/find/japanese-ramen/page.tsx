import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Japanese Ramen Near Me | Find Authentic Japanese Ramen',
  description: 'Find authentic Japanese ramen restaurants near you. Tonkotsu, shoyu, miso, shio — the four classic regional styles. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/japanese-ramen' },
  openGraph: {
    title: 'Japanese Ramen Near Me',
    description: 'Find authentic Japanese ramen near you — all four classic regional styles and beyond.',
    url: 'https://www.ramennearyou.com/find/japanese-ramen',
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
      name: 'What are the main types of Japanese ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The four classic Japanese ramen styles are tonkotsu (rich pork-bone broth from Kyushu), shoyu (clear soy-seasoned broth from Tokyo), miso (fermented soybean paste broth from Hokkaido), and shio (light, salt-seasoned broth). Each region of Japan developed its own distinct style.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Japanese ramen different from other ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Authentic Japanese ramen emphasizes the broth above all — hours or days of simmering produce complex, layered flavor. The noodles are made fresh or sourced from specialist noodle makers, and toppings like chashu pork, ajitsuke tamago, nori, and menma are carefully prepared. It is a serious culinary tradition.',
      },
    },
    {
      '@type': 'Question',
      name: 'What region of Japan is ramen from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ramen originated in Japan in the early 20th century with Chinese noodle influences, but each region developed its own style: tonkotsu from Fukuoka (Kyushu), shoyu from Tokyo, miso from Sapporo (Hokkaido), and shio associated with Hakodate. Today ramen is a national obsession across all of Japan.',
      },
    },
  ],
}

export default function JapaneseRamenPage() {
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
            pageTitle="Japanese Ramen Near Me"
            pageDescription="Find authentic Japanese ramen restaurants near you — tonkotsu, shoyu, miso, shio, and all the regional styles. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Japanese Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Japanese ramen is a culinary tradition built on one obsession: the broth. From the
              rich, creamy tonkotsu of Fukuoka — simmered for 12 to 18 hours until the collagen
              melts into a milky, unctuous stock — to the delicate, clear shio of Hakodate,
              each regional style reflects a distinct philosophy of flavor. Tokyo&apos;s shoyu
              broth is clean and complex; Sapporo&apos;s miso is bold and warming.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Beyond the broth, Japanese ramen elevates every component: hand-pulled or machine-cut
              noodles calibrated to the broth viscosity, chashu braised for hours, and marinated
              soft-boiled eggs (ajitsuke tamago) with jammy, seasoned yolks. Use the map above to
              find Japanese ramen restaurants near you — filter by distance, broth type, and hours.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What are the main types of Japanese ramen?',
                  a: 'The four classic styles: tonkotsu (rich pork-bone broth, Kyushu), shoyu (clear soy broth, Tokyo), miso (fermented soybean broth, Hokkaido), and shio (light salt broth). Each region developed its own distinct character.',
                },
                {
                  q: 'What makes Japanese ramen different?',
                  a: 'Authentic Japanese ramen emphasizes the broth above all — hours or days of simmering produce complex, layered flavor. Noodles are made fresh or sourced from specialist makers, and every topping is carefully prepared.',
                },
                {
                  q: 'What region of Japan is ramen from?',
                  a: 'Ramen developed across Japan with each region claiming its own style: tonkotsu from Fukuoka, shoyu from Tokyo, miso from Sapporo, shio from Hakodate. Today it is a national obsession with thousands of regional variations.',
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

          <FindCrossLinks currentHref="/find/japanese-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
