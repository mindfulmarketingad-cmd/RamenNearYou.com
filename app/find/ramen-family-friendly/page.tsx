import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Family-Friendly Ramen Near Me | Ramen for Kids | RamenNearYou',
  description: 'Find family-friendly ramen restaurants near you. Kid-welcoming spots with casual seating and approachable bowls the whole family will enjoy.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-family-friendly' },
  openGraph: {
    title: 'Family-Friendly Ramen Near Me',
    description: 'Find kid-welcoming, family-friendly ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-family-friendly',
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
      name: 'Which ramen restaurants are family-friendly near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to family-friendly ramen restaurants. Enter your ZIP code or tap "Use my location" to find kid-welcoming spots nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ramen good for kids?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ramen is a great kid-friendly meal — noodles are easy to love, and many shops offer milder shoyu or shio bowls, plain noodles, or kids portions. Ask about spice levels and toppings to customize.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ramen restaurants have high chairs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many casual ramen restaurants accommodate families with high chairs and roomy seating, but it varies by location. Open a listing to call ahead and confirm before you visit.',
      },
    },
  ],
}

export default function RamenFamilyFriendlyPage() {
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
            initialFlags={['family-friendly']}
            pageTitle="Family-Friendly Ramen Near Me"
            pageDescription="Showing family-friendly ramen restaurants. Enter your ZIP or use your location to find kid-welcoming spots near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Ramen the Whole Family Will Love
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ramen is a kid-favorite for a reason — slurpable noodles, customizable toppings, and
              mild broth options everyone can enjoy. The map above is filtered to family-friendly
              ramen restaurants with casual, welcoming atmospheres.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              For pickier eaters, look for shops offering shoyu or shio bowls, plain noodles, or
              kids portions, and ask about adjusting spice levels. Open a listing to confirm
              amenities before you go.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants are family-friendly near me?',
                  a: 'The map above is filtered to family-friendly spots. Enter your ZIP or tap "Use my location" to find kid-welcoming restaurants nearby.',
                },
                {
                  q: 'Is ramen good for kids?',
                  a: 'Yes — noodles are easy to love, and many shops offer milder shoyu or shio bowls, plain noodles, or kids portions. Ask about spice and toppings.',
                },
                {
                  q: 'Do ramen restaurants have high chairs?',
                  a: 'Many casual ramen spots accommodate families, but it varies. Open a listing to call ahead and confirm before visiting.',
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

          <FindCrossLinks currentHref="/find/ramen-family-friendly" />
          <Footer />
        </div>
      </main>
    </>
  )
}
