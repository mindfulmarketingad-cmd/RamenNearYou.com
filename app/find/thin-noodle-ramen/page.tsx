import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Thin Noodle Ramen Near Me | Find Thin Noodle Ramen Restaurants',
  description: 'Find thin noodle ramen restaurants near you. Delicate straight noodles that carry light, elegant broths — shoyu, shio, and hakata-style tonkotsu. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/thin-noodle-ramen' },
  openGraph: {
    title: 'Thin Noodle Ramen Near Me',
    description: 'Find thin noodle ramen near you — delicate straight noodles for light and shoyu broths.',
    url: 'https://www.ramennearyou.com/find/thin-noodle-ramen',
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
      name: 'What ramen uses thin noodles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shoyu and shio ramen almost always use thin, straight noodles. Hakata-style tonkotsu also uses thin noodles despite its rich broth. Thin noodles cook faster and pair best with lighter, more delicate broths.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is kaedama?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kaedama is a second serving of fresh noodles dropped into your remaining broth — a Hakata tonkotsu tradition. You call for kaedama when you finish your noodles but have broth left. It requires thin noodles that cook quickly in hot broth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are thin ramen noodles healthier than thick ones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Thin noodles typically have fewer calories per serving simply because they are lighter, not because of a nutritional difference. The broth accounts for most of the sodium and calories in a ramen bowl regardless of noodle type.',
      },
    },
  ],
}

export default function ThinNoodleRamenPage() {
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
            pageTitle="Thin Noodle Ramen Near Me"
            pageDescription="Find ramen restaurants serving thin, delicate noodles near you. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Thin Noodle Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Thin ramen noodles — straight, delicate, and slightly springy — are the classic
              pairing for lighter, more elegant broths. Shoyu and shio ramen almost always use thin
              noodles, since the delicate broth is designed to be tasted without the interference of
              a heavy noodle. Hakata-style tonkotsu, despite its rich broth, also uses thin straight
              noodles — the result is an interesting contrast of delicate noodle and heavy broth.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Thin noodles cook faster, arrive al dente, and create a lighter overall bowl. If you
              want to eat fast and clean — or if you are ordering kaedama (a second round of noodles
              dropped into your remaining broth) — thin noodles are the format designed for it. They
              are the noodle of efficiency and elegance.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What ramen uses thin noodles?',
                  a: 'Shoyu and shio ramen almost always use thin, straight noodles. Hakata-style tonkotsu also uses thin noodles despite its rich broth. Thin noodles cook faster and pair best with lighter, more delicate broths.',
                },
                {
                  q: 'What is kaedama?',
                  a: 'Kaedama is a second serving of fresh noodles dropped into your remaining broth — a Hakata tonkotsu tradition. You call for kaedama when you finish your noodles but have broth left. It requires thin noodles that cook quickly in hot broth.',
                },
                {
                  q: 'Are thin ramen noodles healthier than thick ones?',
                  a: 'Thin noodles typically have fewer calories per serving simply because they are lighter, not because of a nutritional difference. The broth accounts for most of the sodium and calories in a ramen bowl regardless of noodle type.',
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

          <FindCrossLinks currentHref="/find/thin-noodle-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
