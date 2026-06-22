import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fresh Ramen Noodles Near Me | House-Made Noodle Ramen | RamenNearYou',
  description: 'Find ramen restaurants that make fresh noodles in-house near you. House-made noodles are the mark of a serious ramen shop — discover them near you.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/fresh-ramen-noodles' },
  openGraph: {
    title: 'Fresh Ramen Noodles Near Me',
    description: 'Find ramen shops with house-made fresh noodles near you — the mark of a serious ramen kitchen.',
    url: 'https://www.ramennearyou.com/find/fresh-ramen-noodles',
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
      name: 'What makes fresh ramen noodles different?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fresh ramen noodles are made daily from wheat flour, water, and kansui (alkaline water), which gives them their characteristic springy texture and yellow tint. Unlike dried noodles, fresh noodles absorb broth differently and have a chewier, more complex bite.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do all ramen restaurants use fresh noodles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — many use high-quality fresh noodles sourced from specialist noodle makers, which is common and respected in Japan. Truly house-made noodles (made on-site daily) are rarer and generally signal an exceptionally dedicated kitchen.',
      },
    },
    {
      '@type': 'Question',
      name: 'What noodle thickness is best for each broth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In traditional Japanese ramen, thinner straight noodles pair with lighter broths like shoyu and shio, while thicker wavy noodles complement rich miso and tonkotsu. This is because thicker broth coats and clings to thicker noodles more effectively.',
      },
    },
  ],
}

export default function FreshRamenNoodlesPage() {
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
            pageTitle="Fresh Ramen Noodles Near Me"
            pageDescription="Find ramen restaurants near you that take noodles seriously — fresh, springy, and calibrated to the broth. Enter your ZIP to browse spots in your area."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Why Fresh Noodles Matter
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The noodle is ramen&apos;s most underrated component. Made from wheat flour,
              water, and kansui — an alkaline solution that gives ramen noodles their spring,
              chew, and signature yellow hue — a well-made noodle is calibrated to the broth
              it will be served in. Thin, straight noodles for delicate shoyu and shio. Thick,
              wavy noodles for rich tonkotsu and miso, so the broth clings with each bite.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              In Japan, ramen shops often partner with specialist noodle makers who supply
              fresh noodles daily. The best shops in the US either do the same or make noodles
              in-house. Either way, fresh noodles cook quickly, absorb the broth more naturally,
              and have a texture that dried noodles simply can&apos;t match. Use the map above
              to find serious ramen near you.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What makes fresh ramen noodles different?',
                  a: 'Fresh ramen noodles are made from wheat flour, water, and kansui (alkaline water), which gives them their springy texture and yellow tint. They absorb broth differently and have a chewier, more complex bite than dried noodles.',
                },
                {
                  q: 'Do all ramen restaurants use fresh noodles?',
                  a: 'No — many source fresh noodles from specialist makers, which is respected and common in Japan. Truly house-made noodles (produced on-site daily) are rarer and signal an exceptionally dedicated kitchen.',
                },
                {
                  q: 'What noodle thickness is best for each broth?',
                  a: 'Thinner straight noodles pair with lighter shoyu and shio broths. Thicker wavy noodles suit rich miso and tonkotsu because the viscous broth coats and clings to them better.',
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

          <FindCrossLinks currentHref="/find/fresh-ramen-noodles" />
          <Footer />
        </div>
      </main>
    </>
  )
}
