import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jinya Ramen Near Me | Find Jinya Ramen Bar Locations | RamenNearYou',
  description: 'Find Jinya Ramen Bar locations near you. Browse the map to discover the nearest Jinya restaurant and explore other top ramen spots in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/jinya-ramen' },
  openGraph: {
    title: 'Jinya Ramen Near Me',
    description: 'Find Jinya Ramen Bar locations near you and explore other top ramen restaurants nearby.',
    url: 'https://www.ramennearyou.com/find/jinya-ramen',
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
      name: 'What is Jinya Ramen Bar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jinya Ramen Bar is a Japanese ramen restaurant chain founded in Los Angeles in 2010 by Tomo Takahashi. They are known for their tonkotsu and chicken paitan broths, slow-cooked for 12–20 hours, and customizable bowls. Jinya has expanded to dozens of locations across the United States and Canada.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Jinya Ramen Bar known for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jinya is known for their rich, slow-simmered tonkotsu and chicken paitan broths, customizable toppings, and a modern upscale atmosphere. Popular menu items include the Jinya Tonkotsu Black (with black garlic oil) and Spicy Creamy Chicken.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find a Jinya Ramen Bar near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above. The map is pre-filtered to show Jinya Ramen Bar locations near you. You can also find other highly-rated ramen restaurants nearby in case your closest Jinya is far away.',
      },
    },
  ],
}

export default function JinyaRamenPage() {
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
            initialQuery="jinya"
            pageTitle="Jinya Ramen Near Me"
            pageDescription="Find Jinya Ramen Bar locations near you. Enter your ZIP code to see the nearest Jinya and other top ramen spots in your area."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Jinya Ramen Bar
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Jinya Ramen Bar was founded in 2010 by Japanese chef Tomo Takahashi in
              Los Angeles, bringing a refined take on Japanese ramen to the American market.
              The brand is built around slow-simmered broths — their tonkotsu cooks for up to
              20 hours — and a fully customizable bowl format that lets diners choose noodle
              firmness, broth richness, and topping combinations.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Jinya has grown into one of the largest Japanese ramen chains in North America,
              with locations across major cities and suburbs from coast to coast. Their most
              popular bowls include the Jinya Tonkotsu Black (with signature black garlic oil)
              and the Spicy Creamy Chicken, a chicken paitan with a spicy kick. Use the map
              above to find your nearest Jinya Ramen Bar.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is Jinya Ramen Bar?',
                  a: 'Jinya Ramen Bar is a Japanese ramen chain founded in Los Angeles in 2010. They are known for tonkotsu and chicken paitan broths slow-cooked for 12–20 hours, customizable bowls, and a modern upscale atmosphere.',
                },
                {
                  q: 'What is Jinya Ramen Bar known for?',
                  a: 'Jinya is known for their rich slow-simmered broths and signature bowls like the Tonkotsu Black (with black garlic oil) and Spicy Creamy Chicken. They offer full customization of noodle firmness and toppings.',
                },
                {
                  q: 'How do I find a Jinya Ramen Bar near me?',
                  a: 'Enter your ZIP code in the search bar above — the map is pre-filtered to show Jinya locations near you. Other highly-rated ramen restaurants are also shown if there\'s no Jinya nearby.',
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

          <FindCrossLinks currentHref="/find/jinya-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
