import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chicken Ramen Near Me | Find Chicken Paitan Ramen Restaurants',
  description: 'Find chicken ramen restaurants near you. Rich, creamy chicken paitan broth — the lighter alternative to tonkotsu. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/chicken-ramen' },
  openGraph: {
    title: 'Chicken Ramen Near Me',
    description: 'Find chicken ramen near you — rich, creamy chicken paitan broth.',
    url: 'https://www.ramennearyou.com/find/chicken-ramen',
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
      name: 'What is chicken paitan ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chicken paitan is a rich, creamy, opaque ramen broth made by boiling chicken bones at high heat until the collagen and fat emulsify. Similar richness to tonkotsu but made with chicken.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between chicken paitan and tonkotsu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both are rich, opaque, creamy broths made by high-heat boiling. Tonkotsu uses pork bones; chicken paitan uses chicken bones. Chicken paitan tends to be slightly lighter and has a cleaner, more delicate flavor.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings go with chicken ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Classic chicken paitan toppings include chicken chashu, ajitsuke tamago (soft-boiled egg), menma, nori, and green onions. Some shops add a drizzle of truffle oil or black garlic for extra depth.',
      },
    },
  ],
}

export default function ChickenRamenPage() {
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
            initialBowls={['chicken-paitan']}
            pageTitle="Chicken Ramen Near Me"
            pageDescription="Showing restaurants with chicken paitan ramen — rich, creamy chicken broth. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Chicken Paitan Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Chicken paitan is the chicken equivalent of tonkotsu — a rich, opaque, creamy broth
              made by boiling chicken bones at high heat for hours until the collagen and fat
              emulsify into a silky white soup. It has all the richness of tonkotsu without the
              pork, making it a popular choice for diners who prefer poultry.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Chicken paitan emerged as a serious ramen style in the early 2000s and has since
              spread globally. The best versions use high-quality free-range chicken and layer in
              aromatics like ginger, leeks, and garlic. It is richer and more complex than chicken
              broth in any other cuisine.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is chicken paitan ramen?',
                  a: 'Chicken paitan is a rich, creamy, opaque ramen broth made by boiling chicken bones at high heat until the collagen and fat emulsify. Similar richness to tonkotsu but made with chicken.',
                },
                {
                  q: 'What is the difference between chicken paitan and tonkotsu?',
                  a: 'Both are rich, opaque, creamy broths made by high-heat boiling. Tonkotsu uses pork bones; chicken paitan uses chicken bones. Chicken paitan tends to be slightly lighter and has a cleaner, more delicate flavor.',
                },
                {
                  q: 'What toppings go with chicken ramen?',
                  a: 'Classic chicken paitan toppings include chicken chashu, ajitsuke tamago (soft-boiled egg), menma, nori, and green onions. Some shops add a drizzle of truffle oil or black garlic for extra depth.',
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

          <FindCrossLinks currentHref="/find/chicken-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
