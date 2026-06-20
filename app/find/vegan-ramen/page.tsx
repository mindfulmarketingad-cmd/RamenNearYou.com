import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vegan Ramen Near Me | Find Vegan Ramen Restaurants',
  description: 'Find vegan ramen restaurants near you. Plant-based broths, rich umami flavor — browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/vegan-ramen' },
  openGraph: {
    title: 'Vegan Ramen Near Me',
    description: 'Find vegan ramen restaurants near you — plant-based broths with rich umami flavor.',
    url: 'https://www.ramennearyou.com/find/vegan-ramen',
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
      name: 'What is vegan ramen made of?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vegan ramen uses a plant-based broth — often made from kombu (kelp), shiitake mushrooms, miso, or vegetables — instead of pork or chicken. Toppings typically include roasted tofu, bamboo shoots, corn, nori, and green onions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is vegan ramen as flavorful as traditional ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The best vegan ramen spots build deep umami flavor through mushrooms, kombu, soy, and miso. Many people find vegan ramen just as satisfying as pork-based broths.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the noodles in ramen vegan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional ramen noodles are made from wheat flour, water, and kansui (alkaline salts) — typically vegan. However, some restaurants add egg to their noodles, so always confirm with your server.',
      },
    },
  ],
}

export default function VeganRamenPage() {
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
            initialBowls={['vegan']}
            pageTitle="Vegan Ramen Near Me"
            pageDescription="Showing restaurants with vegan ramen options. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Vegan Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Great vegan ramen is easier to find than ever. The best plant-based bowls build
              deep umami from kombu, dried shiitake mushrooms, miso paste, and roasted vegetables.
              The result is a broth that is every bit as satisfying as a traditional pork-based tonkotsu.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The map above is pre-filtered to show restaurants that offer vegan ramen options.
              Always confirm with the restaurant that toppings — and the noodles themselves — meet
              your dietary requirements.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is vegan ramen made of?',
                  a: 'Vegan ramen uses plant-based broth — often kombu, shiitake mushrooms, miso, or vegetables. Toppings typically include roasted tofu, bamboo shoots, corn, nori, and green onions.',
                },
                {
                  q: 'Is vegan ramen as flavorful as traditional ramen?',
                  a: 'Yes. The best vegan spots build deep umami through mushrooms, kombu, soy, and miso. Many people find it just as satisfying as pork-based broths.',
                },
                {
                  q: 'Are ramen noodles vegan?',
                  a: 'Traditional noodles are made from wheat, water, and kansui — typically vegan. Some restaurants add egg to their noodles, so always confirm with your server.',
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

          <FindCrossLinks currentHref="/find/vegan-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
