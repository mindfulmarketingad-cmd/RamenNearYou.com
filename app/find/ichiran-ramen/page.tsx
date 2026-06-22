import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ichiran Ramen Near Me | Find Ichiran Locations | RamenNearYou',
  description: 'Find Ichiran ramen locations near you. Browse the map to discover the nearest Ichiran and explore other top ramen spots in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ichiran-ramen' },
  openGraph: {
    title: 'Ichiran Ramen Near Me',
    description: 'Find Ichiran ramen locations near you and explore other top ramen restaurants nearby.',
    url: 'https://www.ramennearyou.com/find/ichiran-ramen',
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
      name: 'What is Ichiran?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ichiran is a famous Japanese ramen chain founded in Fukuoka in 1960, specializing in Hakata-style tonkotsu ramen. It is best known for its unique "flavor concentration booths" — individual private dining stalls that let customers focus entirely on their bowl. Ichiran has locations across Japan and a growing presence in the United States.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Ichiran known for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ichiran is famous for its solo dining booths, its single-item tonkotsu ramen menu, and its customizable order sheet, where diners specify broth richness, noodle firmness, garlic, spice level, and more. Its signature red secret sauce is a closely guarded recipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find an Ichiran near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above. The map is pre-filtered to show Ichiran locations near you. You can also find other highly-rated ramen restaurants nearby in case the closest Ichiran is far away.',
      },
    },
  ],
}

export default function IchiranRamenPage() {
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
            initialQuery="ichiran"
            pageTitle="Ichiran Ramen Near Me"
            pageDescription="Find Ichiran ramen locations near you. Enter your ZIP code to see the nearest Ichiran and other top ramen spots in your area."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Ichiran
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ichiran was founded in Fukuoka in 1960 and has become one of the most distinctive
              ramen experiences in the world. The chain serves a single dish — Hakata-style
              tonkotsu ramen — and has perfected it down to a science. What truly sets Ichiran
              apart is its famous &quot;flavor concentration booths&quot;: individual private
              stalls with dividers that let you focus entirely on the bowl in front of you, with
              minimal interaction with staff or other diners.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Every order begins with a paper sheet where you customize your bowl: broth richness,
              noodle firmness, amount of garlic, green onion type, chashu, and spice level via
              Ichiran&apos;s signature red secret sauce. This obsessive focus on personalization
              and the meditative solo-dining format have made Ichiran a destination for ramen
              lovers and a viral favorite among travelers. Use the map above to find your nearest
              Ichiran.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Ichiran?',
                  a: 'Ichiran is a famous Japanese ramen chain founded in Fukuoka in 1960, specializing in Hakata-style tonkotsu ramen. It is best known for its private "flavor concentration booths" that let diners focus entirely on the bowl.',
                },
                {
                  q: 'What is Ichiran known for?',
                  a: 'Ichiran is famous for its solo dining booths, its single-item tonkotsu menu, its customizable paper order sheet (broth richness, noodle firmness, garlic, spice), and its signature red secret sauce.',
                },
                {
                  q: 'How do I find an Ichiran near me?',
                  a: 'Enter your ZIP code in the search bar above — the map is pre-filtered to show Ichiran locations near you. Other highly-rated ramen restaurants are also shown if there\'s no Ichiran nearby.',
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

          <FindCrossLinks currentHref="/find/ichiran-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
