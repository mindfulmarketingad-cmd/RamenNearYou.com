import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extra Spicy Ramen Near Me | Find Spicy Ramen Restaurants',
  description: 'Find extra spicy ramen restaurants near you. Fiery bowls that bring the heat — spicy miso, tantanmen, and volcano ramen. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/extra-spicy-ramen' },
  openGraph: {
    title: 'Extra Spicy Ramen Near Me',
    description: 'Find extra spicy ramen near you — fiery bowls that bring real heat.',
    url: 'https://www.ramennearyou.com/find/extra-spicy-ramen',
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
      name: 'What is the spiciest ramen style?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spicy miso and tantanmen are typically the spiciest base styles. Many shops also have off-menu or challenge-level spice options. The richness of the broth amplifies the heat — these bowls build slowly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do ramen shops add spice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shops use house-made chili oils, gochugaru (Korean chili flake), togarashi, Sichuan peppercorns, or fresh chilis. The best versions layer heat into the broth itself rather than just adding chili paste on top.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I drink with spicy ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cold milk, a cold Japanese beer (Sapporo, Kirin), or cold barley tea all help with capsaicin heat. Avoid water — it spreads the oil and makes the burn worse. Sweet drinks work better than neutral ones.',
      },
    },
  ],
}

export default function ExtraSpicyRamenPage() {
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
            initialMoods={['extra-spicy']}
            pageTitle="Extra Spicy Ramen Near Me"
            pageDescription="Showing the spiciest ramen near you — for bowls that bring real heat. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Extra Spicy Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Extra spicy ramen is a growing category at serious ramen shops — not just a spice
              level on the menu, but a style built around heat. The best versions use house-made
              chili oils, gochugaru, togarashi, or Sichuan peppercorns layered into the broth
              rather than dumped on top.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Spicy miso is the classic base for extreme heat ramen, with the rich miso absorbing
              and amplifying the chili flavors. Tantanmen and volcanic tonkotsu variants are other
              popular formats. If the regular spicy option is not enough, ask the kitchen what they
              have for real heat seekers.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is the spiciest ramen style?',
                  a: 'Spicy miso and tantanmen are typically the spiciest base styles. Many shops also have off-menu or challenge-level spice options. The richness of the broth amplifies the heat — these bowls build slowly.',
                },
                {
                  q: 'How do ramen shops add spice?',
                  a: 'Shops use house-made chili oils, gochugaru (Korean chili flake), togarashi, Sichuan peppercorns, or fresh chilis. The best versions layer heat into the broth itself rather than just adding chili paste on top.',
                },
                {
                  q: 'What should I drink with spicy ramen?',
                  a: 'Cold milk, a cold Japanese beer (Sapporo, Kirin), or cold barley tea all help with capsaicin heat. Avoid water — it spreads the oil and makes the burn worse. Sweet drinks work better than neutral ones.',
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

          <FindCrossLinks currentHref="/find/extra-spicy-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
