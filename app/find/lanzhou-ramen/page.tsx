import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lanzhou Ramen Near Me | Find Lanzhou Hand-Pulled Noodles | RamenNearYou',
  description: 'Find Lanzhou ramen near you — hand-pulled Chinese beef noodle soup with clear broth. Browse the map to discover Lanzhou lamian spots in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/lanzhou-ramen' },
  openGraph: {
    title: 'Lanzhou Ramen Near Me',
    description: 'Find Lanzhou hand-pulled beef noodle soup near you and explore other top ramen spots nearby.',
    url: 'https://www.ramennearyou.com/find/lanzhou-ramen',
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
      name: 'What is Lanzhou ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lanzhou ramen (Lanzhou lamian or Lanzhou beef noodle soup) is a famous Chinese dish from the city of Lanzhou in Gansu province. It features hand-pulled wheat noodles in a clear, aromatic beef broth, topped with thin slices of beef, white radish, chili oil, and fresh cilantro and green onion. The noodles are pulled to order in varying thicknesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Lanzhou ramen different from Japanese ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lanzhou ramen is Chinese, not Japanese. Its broth is a clear, light beef broth seasoned with spices, while Japanese ramen broths are typically richer (tonkotsu, miso). Lanzhou noodles are hand-pulled (lamian) to order, and the dish is defined by the "one clear, two white, three red, four green, five yellow" rule — clear broth, white radish, red chili oil, green cilantro, and yellow noodles.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find Lanzhou ramen near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above. The map is pre-filtered to show Lanzhou and hand-pulled noodle spots near you. You can also browse other top-rated ramen and noodle restaurants in your area.',
      },
    },
  ],
}

export default function LanzhouRamenPage() {
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
            initialQuery="lanzhou"
            pageTitle="Lanzhou Ramen Near Me"
            pageDescription="Find Lanzhou hand-pulled beef noodle soup near you. Enter your ZIP code to see the nearest Lanzhou lamian spots and other top noodle shops in your area."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Lanzhou Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Lanzhou ramen — properly Lanzhou lamian, or Lanzhou beef noodle soup — hails from
              the city of Lanzhou in China&apos;s Gansu province, where it has been served for
              over a century. Unlike the rich, opaque broths of Japanese ramen, Lanzhou&apos;s
              hallmark is a crystal-clear beef broth, simmered with a blend of warming spices and
              served with hand-pulled noodles that are stretched to order right before your eyes.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The dish follows a famous five-part rule: yi qing (one clear broth), er bai (two
              white radish), san hong (three red chili oil), si lü (four green cilantro and
              scallion), and wu huang (five yellow, bright noodles). Diners can request their
              noodles in different widths — from delicate angel-hair to thick, flat belt noodles —
              all pulled by hand from a single piece of dough. Use the map above to find
              hand-pulled Lanzhou noodles near you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Lanzhou ramen?',
                  a: 'Lanzhou ramen (Lanzhou lamian) is a Chinese dish from Lanzhou, Gansu province. It features hand-pulled wheat noodles in a clear, aromatic beef broth, topped with sliced beef, white radish, chili oil, cilantro, and green onion.',
                },
                {
                  q: 'How is Lanzhou ramen different from Japanese ramen?',
                  a: 'Lanzhou ramen is Chinese, with a light, clear beef broth and hand-pulled noodles made to order. Japanese ramen broths are usually richer (tonkotsu, miso). Lanzhou follows the "clear, white, red, green, yellow" rule for its components.',
                },
                {
                  q: 'How do I find Lanzhou ramen near me?',
                  a: 'Enter your ZIP code in the search bar above — the map is pre-filtered to show Lanzhou and hand-pulled noodle spots near you. Other top-rated noodle restaurants are also shown nearby.',
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

          <FindCrossLinks currentHref="/find/lanzhou-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
