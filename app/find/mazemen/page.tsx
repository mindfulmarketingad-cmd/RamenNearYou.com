import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mazemen Near Me | Find Mazemen Ramen Restaurants',
  description: 'Find mazemen restaurants near you. Brothless ramen — rich sauced noodles tossed to order. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/mazemen' },
  openGraph: {
    title: 'Mazemen Near Me',
    description: 'Find mazemen near you — rich brothless sauced ramen noodles.',
    url: 'https://www.ramennearyou.com/find/mazemen',
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
      name: 'What is mazemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mazemen is brothless ramen — noodles tossed in a rich sauce rather than served in soup. Also called abura soba. Intensely flavored and mixed before eating.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is mazemen the same as tsukemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Tsukemen has broth for dipping; mazemen has no broth at all. Mazemen noodles are coated in sauce and mixed with toppings. Tsukemen noodles are dipped into a separate broth bowl.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings come with mazemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common mazemen toppings include a raw or soft-boiled egg yolk, chashu pork, menma, green onions, nori, and a drizzle of chili oil. The egg yolk is mixed in to enrich the sauce.',
      },
    },
  ],
}

export default function MazemenPage() {
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
            initialBowls={['mazemen']}
            pageTitle="Mazemen Near Me"
            pageDescription="Showing restaurants with mazemen — brothless ramen with rich sauced noodles. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              About Mazemen
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Mazemen — also called abura soba or maze soba — is ramen without broth. Instead of a
              soup base, the noodles are tossed in a rich sauce made from soy, sesame, pork fat,
              and other aromatics. It is intensely flavored, with every strand coated in
              concentrated umami.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Mazemen is the format for ramen chefs who want maximum flavor without dilution. The
              dish is mixed vigorously before eating — the egg yolk, sauce, and toppings bind
              together into something between pasta and ramen. If you have never tried brothless
              ramen, it is a revelation.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is mazemen?',
                  a: 'Mazemen is brothless ramen — noodles tossed in a rich sauce rather than served in soup. Also called abura soba. Intensely flavored and mixed before eating.',
                },
                {
                  q: 'Is mazemen the same as tsukemen?',
                  a: 'No. Tsukemen has broth for dipping; mazemen has no broth at all. Mazemen noodles are coated in sauce and mixed with toppings. Tsukemen noodles are dipped into a separate broth bowl.',
                },
                {
                  q: 'What toppings come with mazemen?',
                  a: 'Common mazemen toppings include a raw or soft-boiled egg yolk, chashu pork, menma, green onions, nori, and a drizzle of chili oil. The egg yolk is mixed in to enrich the sauce.',
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

          <FindCrossLinks currentHref="/find/mazemen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
