import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Under $15 Near Me | Cheap Ramen Restaurants',
  description: 'Find cheap ramen restaurants near you under $15. Great bowls without the premium price tag — browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/cheap-ramen' },
  openGraph: {
    title: 'Ramen Under $15 Near Me',
    description: 'Find cheap ramen restaurants near you — great bowls under $15.',
    url: 'https://www.ramennearyou.com/find/cheap-ramen',
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
      name: 'Can you get good ramen for under $15?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many excellent ramen restaurants offer bowls in the $10–$14 range. Budget ramen does not mean low quality — some of the most popular spots in the US serve outstanding bowls at affordable prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is some ramen more expensive than others?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Premium ramen often uses higher-quality ingredients, longer-simmered broths, and premium toppings like wagyu chashu or truffle. Budget ramen still delivers great flavor — just with more straightforward ingredients.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest type of ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shio (salt) and shoyu (soy sauce) ramen tend to be less expensive than tonkotsu, since the broth requires less time and fewer ingredients. Many great shio and shoyu bowls come in well under $15.',
      },
    },
  ],
}

export default function CheapRamenPage() {
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
            initialPrices={['budget']}
            pageTitle="Ramen Under $15 Near Me"
            pageDescription="Showing budget-friendly ramen restaurants under ~$15. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Affordable Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              A great bowl of ramen does not have to break the bank. The map above is pre-filtered
              to show budget-friendly ramen spots — restaurants where you can expect to pay around
              $15 or less for a solid bowl. Enter your ZIP or tap &quot;Use my location&quot; to
              sort by distance.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Price alone does not tell the whole story. Many of the most beloved ramen spots in
              the country — with lines out the door and glowing reviews — keep their prices
              refreshingly low.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Can you get good ramen for under $15?',
                  a: 'Yes. Many excellent ramen restaurants serve outstanding bowls in the $10–$14 range. Budget ramen does not mean low quality.',
                },
                {
                  q: 'Why is some ramen more expensive than others?',
                  a: 'Premium spots use higher-quality ingredients, longer-simmered broths, and premium toppings. Budget ramen still delivers great flavor with straightforward, well-executed ingredients.',
                },
                {
                  q: 'What is the cheapest type of ramen?',
                  a: 'Shio and shoyu ramen tend to be less expensive than tonkotsu since the broth requires fewer hours and ingredients. Many great shio and shoyu bowls come in well under $15.',
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

          <FindCrossLinks currentHref="/find/cheap-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
