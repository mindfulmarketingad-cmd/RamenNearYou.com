import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ippudo Ramen Near Me | Find Ippudo Locations | RamenNearYou',
  description: 'Find Ippudo ramen locations near you. Browse the map to discover the nearest Ippudo and explore other top ramen spots in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ippudo-ramen' },
  openGraph: {
    title: 'Ippudo Ramen Near Me',
    description: 'Find Ippudo ramen locations near you and explore other top ramen restaurants nearby.',
    url: 'https://www.ramennearyou.com/find/ippudo-ramen',
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
      name: 'What is Ippudo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ippudo is a globally renowned Japanese ramen chain founded by Shigemi Kawahara in Fukuoka in 1985. It specializes in Hakata-style tonkotsu ramen — a rich, creamy pork-bone broth with thin, firm noodles. Ippudo has hundreds of locations worldwide and helped popularize authentic Japanese ramen in the United States after opening in New York in 2008.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Ippudo known for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ippudo is known for its signature Hakata tonkotsu ramen, particularly the Shiromaru Classic (original tonkotsu) and Akamaru Modern (tonkotsu enriched with garlic oil and special miso paste). The brand is also famous for its pork buns and modern, upscale dining atmosphere.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find an Ippudo near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above. The map is pre-filtered to show Ippudo locations near you. You can also find other highly-rated ramen restaurants nearby in case the closest Ippudo is far away.',
      },
    },
  ],
}

export default function IppudoRamenPage() {
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
            initialQuery="ippudo"
            pageTitle="Ippudo Ramen Near Me"
            pageDescription="Find Ippudo ramen locations near you. Enter your ZIP code to see the nearest Ippudo and other top ramen spots in your area."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Ippudo
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ippudo was founded in 1985 by Shigemi Kawahara in Fukuoka, the spiritual home of
              tonkotsu ramen. Specializing in Hakata-style ramen — a rich, milky pork-bone broth
              paired with thin, firm noodles — Ippudo grew from a single shop into one of the
              most recognized ramen brands in the world. Its 2008 opening in New York&apos;s East
              Village is widely credited with kicking off America&apos;s modern ramen boom.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Ippudo&apos;s two signature bowls are the Shiromaru Classic, the original tonkotsu,
              and the Akamaru Modern, enriched with fragrant garlic oil and a special blended miso
              paste. The restaurants are also known for their pork buns and a sleek, contemporary
              atmosphere that feels a step above the typical noodle shop. Use the map above to find
              your nearest Ippudo.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Ippudo?',
                  a: 'Ippudo is a globally renowned Japanese ramen chain founded in Fukuoka in 1985. It specializes in Hakata-style tonkotsu ramen — rich, creamy pork-bone broth with thin firm noodles — and helped launch the US ramen boom after opening in New York in 2008.',
                },
                {
                  q: 'What is Ippudo known for?',
                  a: 'Ippudo is known for its Hakata tonkotsu, especially the Shiromaru Classic (original) and Akamaru Modern (with garlic oil and special miso paste). It is also famous for its pork buns and upscale modern atmosphere.',
                },
                {
                  q: 'How do I find an Ippudo near me?',
                  a: 'Enter your ZIP code in the search bar above — the map is pre-filtered to show Ippudo locations near you. Other highly-rated ramen restaurants are also shown if there\'s no Ippudo nearby.',
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

          <FindCrossLinks currentHref="/find/ippudo-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
