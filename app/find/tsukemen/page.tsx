import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tsukemen Near Me | Find Tsukemen Ramen Restaurants',
  description: 'Find tsukemen restaurants near you. Dipping ramen with rich concentrated broth — noodles served separately for dipping. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tsukemen' },
  openGraph: {
    title: 'Tsukemen Near Me',
    description: 'Find tsukemen near you — dipping ramen with rich concentrated broth.',
    url: 'https://www.ramennearyou.com/find/tsukemen',
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
      name: 'What is tsukemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tsukemen is dipping ramen — thick noodles served separately from a small bowl of concentrated broth. You dip the noodles into the broth rather than eating them together. Invented in Tokyo in the 1960s.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is tsukemen different from regular ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In tsukemen, the noodles and broth are served separately. The broth is much more concentrated and the noodles are thicker and chewier. You dip rather than slurp from a bowl.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings come with tsukemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common tsukemen toppings include chashu pork, menma, nori, a soft-boiled egg, and green onions. Many shops also offer a "soup wari" — hot dashi added to the remaining broth so you can drink it at the end.',
      },
    },
  ],
}

export default function TsukemenPage() {
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
            initialBowls={['tsukemen']}
            pageTitle="Tsukemen Near Me"
            pageDescription="Showing restaurants with tsukemen — dipping ramen where noodles are served separately. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Tsukemen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Tsukemen is dipping ramen — noodles served cold or at room temperature alongside a
              small bowl of intensely concentrated hot broth. You dip the noodles in the broth
              rather than mixing them together. The format was invented in Tokyo in the 1960s and
              has grown into one of the most beloved ramen styles in Japan.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The broth in tsukemen is far more concentrated than regular ramen — thick, rich, and
              often fish-forward or pork-forward, designed to coat each dip of noodles. The noodles
              are typically thicker and chewier than regular ramen noodles, built to hold up to
              repeated dipping.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is tsukemen?',
                  a: 'Tsukemen is dipping ramen — thick noodles served separately from a small bowl of concentrated broth. You dip the noodles into the broth rather than eating them together. Invented in Tokyo in the 1960s.',
                },
                {
                  q: 'How is tsukemen different from regular ramen?',
                  a: 'In tsukemen, the noodles and broth are served separately. The broth is much more concentrated and the noodles are thicker and chewier. You dip rather than slurp from a bowl.',
                },
                {
                  q: 'What toppings come with tsukemen?',
                  a: 'Common tsukemen toppings include chashu pork, menma, nori, a soft-boiled egg, and green onions. Many shops also offer a "soup wari" — hot dashi added to the remaining broth so you can drink it at the end.',
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

          <FindCrossLinks currentHref="/find/tsukemen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
