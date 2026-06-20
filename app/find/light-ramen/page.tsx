import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Light Ramen Near Me | Find Light & Clean Ramen Restaurants',
  description: 'Find light ramen restaurants near you. Clean, delicate broths that let the ingredients speak — shio, shoyu, and seafood-based styles. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/light-ramen' },
  openGraph: {
    title: 'Light Ramen Near Me',
    description: 'Find light, clean ramen near you — delicate broths without the heaviness.',
    url: 'https://www.ramennearyou.com/find/light-ramen',
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
      name: 'What is light ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Light ramen has a clear or lightly colored broth with a clean, delicate flavor. Shio and shoyu are the main light styles. The broth shows the quality of the ingredients rather than masking them with heavy fat or seasoning.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which ramen style is the lightest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shio (salt) ramen is the lightest ramen style — a pale, clear broth seasoned primarily with salt. Shoyu is slightly heavier. Both are significantly lighter than miso or tonkotsu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is light ramen still filling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — the noodles and toppings still make it a full meal. It is lighter than tonkotsu or miso in terms of fat content and richness, but a bowl of great shio ramen is deeply satisfying.',
      },
    },
  ],
}

export default function LightRamenPage() {
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
            initialMoods={['light-clean']}
            pageTitle="Light & Clean Ramen Near Me"
            pageDescription="Showing light, clean ramen near you — delicate shoyu, shio, and seafood-based styles. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Light &amp; Clean Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Light ramen is about restraint — clear broths, precise seasoning, and flavors that
              arrive in sequence rather than all at once. Shio and shoyu are the classic examples:
              pale, translucent broths where you can actually taste the chicken, dashi, or seafood
              base the bowl was built on. Nothing is masked.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Light ramen is the choice after a heavy meal, during warm weather, or when you want
              something that feels restorative rather than indulgent. Do not mistake lightness for
              simplicity — a great shio broth can take days to make and contains more technique than
              most heavy broths.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is light ramen?',
                  a: 'Light ramen has a clear or lightly colored broth with a clean, delicate flavor. Shio and shoyu are the main light styles. The broth shows the quality of the ingredients rather than masking them with heavy fat or seasoning.',
                },
                {
                  q: 'Which ramen style is the lightest?',
                  a: 'Shio (salt) ramen is the lightest ramen style — a pale, clear broth seasoned primarily with salt. Shoyu is slightly heavier. Both are significantly lighter than miso or tonkotsu.',
                },
                {
                  q: 'Is light ramen still filling?',
                  a: 'Yes — the noodles and toppings still make it a full meal. It is lighter than tonkotsu or miso in terms of fat content and richness, but a bowl of great shio ramen is deeply satisfying.',
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

          <FindCrossLinks currentHref="/find/light-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
