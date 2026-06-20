import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Thick Noodle Ramen Near Me | Find Thick Noodle Ramen Restaurants',
  description: 'Find thick noodle ramen restaurants near you. Wavy, chewy noodles built to hold rich broth — tonkotsu, miso, and tsukemen styles. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/thick-noodle-ramen' },
  openGraph: {
    title: 'Thick Noodle Ramen Near Me',
    description: 'Find thick noodle ramen near you — chewy, wavy noodles built for rich broth.',
    url: 'https://www.ramennearyou.com/find/thick-noodle-ramen',
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
      name: 'What ramen uses thick noodles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu, miso, and tsukemen are the styles most commonly paired with thick, wavy noodles. The rich broths can stand up to the extra body. Tsukemen almost always uses thick noodles to hold up during dipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between thick and thin ramen noodles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Thick noodles are chewier and more filling, pairing best with heavy broths like tonkotsu and miso. Thin noodles are more delicate, pairing better with lighter broths like shoyu or shio. Noodle thickness dramatically changes the bowl's texture.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I choose my noodle thickness at a ramen restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some ramen restaurants — particularly in Japan and at high-end US spots — let you choose noodle firmness (soft, medium, firm, extra firm) but not always the thickness itself. Ask the server what options are available.',
      },
    },
  ],
}

export default function ThickNoodleRamenPage() {
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
            pageTitle="Thick Noodle Ramen Near Me"
            pageDescription="Find ramen restaurants serving thick, chewy noodles near you. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Thick Noodle Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Thick ramen noodles — typically wavy and chewier than straight noodles — are designed
              to stand up to rich, heavy broths. They hold more broth per strand and create a more
              substantial, filling bite. Tonkotsu, miso, and tsukemen are the styles most likely to
              pair with thick noodles, since the robust broth can support the extra body.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Noodle thickness in Japan is standardized by number — lower numbers mean thicker
              noodles. Thick noodles (often #16 or below) have a distinct chew that ramen lovers
              seek out specifically. Tsukemen (dipping ramen) almost always uses thick noodles,
              since they need to hold up during the dipping process without becoming soggy.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What ramen uses thick noodles?',
                  a: 'Tonkotsu, miso, and tsukemen are the styles most commonly paired with thick, wavy noodles. The rich broths can stand up to the extra body. Tsukemen almost always uses thick noodles to hold up during dipping.',
                },
                {
                  q: 'What is the difference between thick and thin ramen noodles?',
                  a: "Thick noodles are chewier and more filling, pairing best with heavy broths like tonkotsu and miso. Thin noodles are more delicate, pairing better with lighter broths like shoyu or shio. Noodle thickness dramatically changes the bowl's texture.",
                },
                {
                  q: 'Can I choose my noodle thickness at a ramen restaurant?',
                  a: 'Some ramen restaurants — particularly in Japan and at high-end US spots — let you choose noodle firmness (soft, medium, firm, extra firm) but not always the thickness itself. Ask the server what options are available.',
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

          <FindCrossLinks currentHref="/find/thick-noodle-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
