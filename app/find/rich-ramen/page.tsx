import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rich & Creamy Ramen Near Me | Find Rich Ramen Restaurants',
  description: 'Find rich, creamy ramen restaurants near you. Heavy, indulgent broths that coat every noodle — tonkotsu, chicken paitan, and beyond. Browse by location, rating, and hours.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/rich-ramen' },
  openGraph: {
    title: 'Rich & Creamy Ramen Near Me',
    description: 'Find rich, creamy ramen near you — heavy, indulgent broths.',
    url: 'https://www.ramennearyou.com/find/rich-ramen',
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
      name: 'What makes ramen rich and creamy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rich, creamy ramen gets its texture from high-heat boiling of pork bones (tonkotsu) or chicken bones (chicken paitan). The fat and collagen emulsify into the water, creating a thick, white, silky broth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which ramen styles are the richest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu and chicken paitan are the richest styles — both are opaque and creamy from emulsified bone fat. Spicy miso can also be rich, especially versions made with a pork base and heavy sesame paste.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is rich ramen heavier than regular ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — rich ramen is significantly more filling than shoyu or shio. The high fat content and thick broth make it a full meal. Many shops offer a lighter version (assari) alongside the heavier version (kotteri).',
      },
    },
  ],
}

export default function RichRamenPage() {
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
            initialMoods={['rich-creamy']}
            pageTitle="Rich & Creamy Ramen Near Me"
            pageDescription="Showing the richest, creamiest ramen near you — tonkotsu, chicken paitan, and more. Enter your ZIP or use your location to sort by distance."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Finding Rich &amp; Creamy Ramen Near You
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Rich ramen is defined by its broth — opaque, silky, and heavily emulsified from hours
              of high-heat boiling. The fat and collagen from pork or chicken bones bind with water
              to create a creamy texture that coats every strand of noodle. It is the most indulgent
              tier of ramen eating.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              The defining styles are tonkotsu (pork bone) and chicken paitan. Both are white or
              off-white in color, thick in texture, and deeply satisfying. If you want the most
              filling, comforting bowl on the menu, filter for rich and creamy — then decide which
              broth to chase.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What makes ramen rich and creamy?',
                  a: 'Rich, creamy ramen gets its texture from high-heat boiling of pork bones (tonkotsu) or chicken bones (chicken paitan). The fat and collagen emulsify into the water, creating a thick, white, silky broth.',
                },
                {
                  q: 'Which ramen styles are the richest?',
                  a: 'Tonkotsu and chicken paitan are the richest styles — both are opaque and creamy from emulsified bone fat. Spicy miso can also be rich, especially versions made with a pork base and heavy sesame paste.',
                },
                {
                  q: 'Is rich ramen heavier than regular ramen?',
                  a: 'Yes — rich ramen is significantly more filling than shoyu or shio. The high fat content and thick broth make it a full meal. Many shops offer a lighter version (assari) alongside the heavier version (kotteri).',
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

          <FindCrossLinks currentHref="/find/rich-ramen" />
          <Footer />
        </div>
      </main>
    </>
  )
}
