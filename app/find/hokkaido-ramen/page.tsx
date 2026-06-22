import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hokkaido Ramen Near Me | Find Hokkaido-Style Miso Ramen | RamenNearYou',
  description: 'Find Hokkaido-style ramen near you. The birthplace of miso ramen — rich, warming, and built for cold weather. Browse the map for Hokkaido ramen restaurants nearby.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hokkaido-ramen' },
  openGraph: {
    title: 'Hokkaido Ramen Near Me',
    description: 'Find Hokkaido-style miso ramen near you — rich, warming bowls from the birthplace of miso ramen.',
    url: 'https://www.ramennearyou.com/find/hokkaido-ramen',
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
      name: 'What is Hokkaido ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hokkaido ramen refers to ramen styles from Japan\'s northernmost island of Hokkaido. The most famous is Sapporo-style miso ramen — a rich, deeply savory broth made with fermented soybean paste (miso), often topped with corn, butter, bean sprouts, and ground pork. The style was designed to warm up in Hokkaido\'s notoriously cold winters.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Hokkaido ramen the same as miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hokkaido (Sapporo) is the birthplace of miso ramen, so the two are closely associated. Sapporo-style miso ramen is the most well-known Hokkaido style, but the region also has shio ramen from Hakodate (one of Japan\'s oldest ramen cities) and shoyu variations. Miso ramen, however, is the Hokkaido signature.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings does Hokkaido miso ramen have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Classic Hokkaido miso ramen toppings include corn, a pat of butter (which melts into the hot broth), bean sprouts, ground pork, green onions, and sometimes bamboo shoots. The corn and butter combination is iconic to the Sapporo style and reflects Hokkaido\'s agricultural character.',
      },
    },
  ],
}

export default function HokkaidoRamenPage() {
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
            initialQuery="hokkaido"
            pageTitle="Hokkaido Ramen Near Me"
            pageDescription="Find Hokkaido-style ramen near you — rich miso broth from Japan's northernmost island, topped with corn, butter, and ground pork. Enter your ZIP to browse nearby."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              The Ramen of Hokkaido
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Hokkaido, Japan&apos;s northernmost island, is home to one of the most beloved
              regional ramen styles in the world: Sapporo miso ramen. Developed in the 1950s
              in Sapporo&apos;s Susukino district, miso ramen was born out of necessity —
              a rich, warming broth capable of fortifying diners against Hokkaido&apos;s
              brutal winters. The broth starts with a meat or chicken base, then a generous
              ladle of miso tare is stirred in just before serving, creating a bold, savory,
              deeply layered bowl.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The classic toppings are corn, butter (a pat dropped directly into the hot broth),
              bean sprouts, and ground pork — reflecting Hokkaido&apos;s agricultural identity
              as Japan&apos;s dairy and corn country. Hakodate, another Hokkaido city, is
              famous for a completely different style: a crystal-clear shio (salt) broth, one
              of Japan&apos;s oldest ramen traditions. Use the map above to find Hokkaido-style
              ramen near you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Hokkaido ramen?',
                  a: 'Hokkaido ramen refers to styles from Japan\'s northernmost island. The most famous is Sapporo miso ramen — a rich, savory broth made with fermented soybean paste, topped with corn, butter, bean sprouts, and ground pork. Built for cold winters.',
                },
                {
                  q: 'Is Hokkaido ramen the same as miso ramen?',
                  a: 'They are closely linked — Hokkaido (Sapporo) is the birthplace of miso ramen. But Hokkaido also has Hakodate shio ramen, one of Japan\'s oldest styles. Miso ramen is the Hokkaido signature most people know.',
                },
                {
                  q: 'What toppings does Hokkaido miso ramen have?',
                  a: 'Classic toppings: corn, butter (melted into the hot broth), bean sprouts, ground pork, and green onions. The corn and butter combination is iconic to the Sapporo style and reflects Hokkaido\'s dairy and agricultural character.',
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

          <FindCrossLinks currentHref="/find/hokkaido-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
