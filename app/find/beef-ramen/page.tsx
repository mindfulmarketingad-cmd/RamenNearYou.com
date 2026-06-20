import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Beef Ramen Near Me | Find Beef Ramen Restaurants',
  description: 'Find beef ramen restaurants near you. Rich beef bone broth and wagyu toppings — a hearty, umami-packed bowl. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/beef-ramen' },
  openGraph: {
    title: 'Beef Ramen Near Me',
    description: 'Find beef ramen near you — rich beef broth bowls and wagyu toppings.',
    url: 'https://www.ramennearyou.com/find/beef-ramen',
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
      name: 'What is beef ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Beef ramen uses a beef-based broth — made from beef bones, oxtail, or marrow — seasoned with soy or salt. Richer and darker than chicken-based ramen, with deep umami flavor similar to a high-end pho.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is beef ramen the same as pho?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — pho uses rice noodles and Vietnamese spices; beef ramen uses wheat noodles and Japanese seasoning. Both use long-simmered beef broth. Beef ramen tends to have a richer, more fatty broth than most pho.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings come with beef ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common beef ramen toppings include thinly sliced beef, wagyu, braised short rib, sukiyaki beef, soft-boiled egg, menma, and nori. Some shops add a drizzle of black garlic oil for depth.',
      },
    },
  ],
}

export default function BeefRamenPage() {
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
            pageTitle="Beef Ramen Near Me"
            pageDescription="Find ramen restaurants serving beef broth and beef toppings near you. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Beef Ramen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Beef ramen is less common than pork or chicken-based styles but delivers some of the
              deepest, most complex broth flavors available. The richest versions use beef bones —
              knuckles, marrow bones, or oxtail — simmered for 12 hours or more to extract their
              full collagen and fat content. The result is a dark, unctuous broth with a beefy depth
              that rivals the best pho broths.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Toppings vary widely: thinly sliced chashu-style beef, wagyu, braised short rib, or
              sukiyaki-style beef are all common. Some shops blend beef into a tonkotsu base for
              richness without the full beefy flavor. If you love pho but want ramen noodles, beef
              ramen is the crossover bowl you have been looking for.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is beef ramen?',
                  a: 'Beef ramen uses a beef-based broth — made from beef bones, oxtail, or marrow — seasoned with soy or salt. Richer and darker than chicken-based ramen, with deep umami flavor similar to a high-end pho.',
                },
                {
                  q: 'Is beef ramen the same as pho?',
                  a: 'No — pho uses rice noodles and Vietnamese spices; beef ramen uses wheat noodles and Japanese seasoning. Both use long-simmered beef broth. Beef ramen tends to have a richer, more fatty broth than most pho.',
                },
                {
                  q: 'What toppings come with beef ramen?',
                  a: 'Common beef ramen toppings include thinly sliced beef, wagyu, braised short rib, sukiyaki beef, soft-boiled egg, menma, and nori. Some shops add a drizzle of black garlic oil for depth.',
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

          <FindCrossLinks currentHref="/find/beef-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
