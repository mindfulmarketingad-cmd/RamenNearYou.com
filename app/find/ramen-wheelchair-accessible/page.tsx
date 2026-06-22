import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wheelchair Accessible Ramen Near Me | Accessible Ramen | RamenNearYou',
  description: 'Find wheelchair accessible ramen restaurants near you. Browse spots with accessible entrances and seating so everyone can enjoy a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible' },
  openGraph: {
    title: 'Wheelchair Accessible Ramen Near Me',
    description: 'Find wheelchair accessible ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible',
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
      name: 'Which ramen restaurants are wheelchair accessible near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The map above is filtered to ramen restaurants listed as wheelchair accessible. Enter your ZIP code or tap "Use my location" to find accessible spots nearby.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does wheelchair accessible mean for a ramen restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It typically means the restaurant has an accessible entrance and seating. Specific features like accessible restrooms or parking vary, so it’s best to confirm details directly with the restaurant.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I confirm accessibility before visiting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Open any listing from the map to find the restaurant’s phone number and website. Accessibility data comes from listed amenities, so calling ahead is the most reliable way to confirm your specific needs are met.',
      },
    },
  ],
}

export default function RamenWheelchairAccessiblePage() {
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
            initialFlags={['wheelchair']}
            pageTitle="Wheelchair Accessible Ramen Near Me"
            pageDescription="Showing ramen restaurants listed as wheelchair accessible. Enter your ZIP or use your location to find accessible spots near you."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Accessible Ramen for Everyone
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Everyone deserves a great bowl of ramen. The map above is filtered to restaurants
              listed as wheelchair accessible, with accessible entrances and seating, so you can
              find a comfortable spot near you.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Accessibility details such as restrooms and parking can vary between locations.
              Open any listing to call ahead and confirm the specific features you need.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Which ramen restaurants are wheelchair accessible near me?',
                  a: 'The map above is filtered to spots listed as wheelchair accessible. Enter your ZIP or tap "Use my location" to find them nearby.',
                },
                {
                  q: 'What does wheelchair accessible mean here?',
                  a: 'It generally means an accessible entrance and seating. Features like accessible restrooms or parking vary, so confirm directly with the restaurant.',
                },
                {
                  q: 'How can I confirm accessibility before visiting?',
                  a: 'Open a listing for the phone number and website. Accessibility comes from listed amenities, so calling ahead is the most reliable confirmation.',
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

          <FindCrossLinks currentHref="/find/ramen-wheelchair-accessible" />
          <Footer />
        </div>
      </main>
    </>
  )
}
