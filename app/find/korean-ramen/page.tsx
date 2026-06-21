import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Korean Ramen Near Me | Find Ramyeon & Korean Noodle Spots',
  description: 'Find Korean ramen restaurants near you. Spicy ramyeon, kimchi broths, and Korean-Japanese fusion bowls. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/korean-ramen' },
  openGraph: {
    title: 'Korean Ramen Near Me',
    description: 'Find Korean ramen near you — ramyeon, kimchi broths, and bold Korean-style noodle bowls.',
    url: 'https://www.ramennearyou.com/find/korean-ramen',
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
      name: 'What is Korean ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Korean ramen (ramyeon) is inspired by Japanese ramen but developed its own distinct identity — typically featuring spicier, bolder broths with gochujang or gochugaru, kimchi, and Korean ingredients. Many Korean ramen shops blend Japanese ramen techniques with Korean flavors.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between ramen and ramyeon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Japanese ramen uses fresh or dried noodles in a carefully crafted broth. Korean ramyeon traditionally uses wavy instant-style noodles in a spicy, MSG-forward broth. Modern Korean ramen restaurants often elevate ramyeon with fresh noodles, premium toppings, and house-made broths.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings are common in Korean ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Korean ramen often features kimchi, gochujang (red chili paste), rice cakes (tteok), spam, eggs, green onions, and melted cheese. Some restaurants add Korean BBQ-style proteins like bulgogi or spicy pork.',
      },
    },
  ],
}

export default function KoreanRamenPage() {
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
            pageTitle="Korean Ramen Near Me"
            pageDescription="Find Korean ramen and ramyeon restaurants near you — spicy kimchi broths, gochujang noodles, and Korean-Japanese fusion bowls. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Korean Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Korean ramen — ramyeon — developed as Japan&apos;s ramen culture crossed the strait and
              collided with Korea&apos;s bold flavor tradition. The result is a distinct style built
              on spicy gochujang and gochugaru, fermented kimchi, and punchier, more intense broths
              than their Japanese counterparts. Modern Korean ramen shops in the US often blend both
              traditions, using Japanese fresh-noodle techniques with Korean seasoning and toppings.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Expect kimchi, rice cakes (tteok), soft-boiled eggs, Korean chili oil, and sometimes
              melted cheese or Korean BBQ proteins. Whether you&apos;re hunting for a fire-hot kimchi
              broth or a refined Korean-Japanese fusion bowl, use the map above to find Korean ramen
              restaurants near you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Korean ramen?',
                  a: 'Korean ramen (ramyeon) features spicier, bolder broths with gochujang or gochugaru, kimchi, and Korean ingredients. Many restaurants blend Japanese ramen techniques with Korean flavors.',
                },
                {
                  q: 'What is the difference between ramen and ramyeon?',
                  a: 'Japanese ramen uses fresh noodles in a crafted broth. Korean ramyeon traditionally uses wavy instant-style noodles in a spicy broth. Modern Korean ramen restaurants often elevate ramyeon with fresh noodles and premium toppings.',
                },
                {
                  q: 'What toppings are common in Korean ramen?',
                  a: 'Korean ramen often features kimchi, gochujang, rice cakes (tteok), spam, eggs, green onions, and melted cheese. Some spots add Korean BBQ proteins like bulgogi or spicy pork.',
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

          <FindCrossLinks currentHref="/find/korean-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
