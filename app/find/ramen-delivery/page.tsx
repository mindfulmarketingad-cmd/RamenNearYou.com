import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Delivery Near Me | Order Ramen Delivered | RamenNearYou',
  description: 'Find ramen restaurants that offer delivery near you. Order tonkotsu, miso, shoyu, and more from the best ramen spots in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-delivery' },
  openGraph: {
    title: 'Ramen Delivery Near Me',
    description: 'Find ramen restaurants that deliver near you — order tonkotsu, miso, shoyu, and more.',
    url: 'https://www.ramennearyou.com/find/ramen-delivery',
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
      name: 'Can you get ramen delivered?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — many ramen restaurants now offer delivery through their own apps or third-party platforms like DoorDash, Uber Eats, and Grubhub. Some shops pack the broth and noodles separately so the noodles don\'t over-soak during transit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does ramen travel well for delivery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ramen can travel well when packaged correctly. Look for restaurants that separate the broth, noodles, and toppings into individual containers. Brothless styles like mazemen and tsukemen typically hold up even better for delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find ramen delivery near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your ZIP code in the search bar above to see ramen restaurants near you. Many listings show whether delivery is available. You can also check DoorDash, Uber Eats, or Grubhub directly and search for "ramen" in your area.',
      },
    },
  ],
}

export default function RamenDeliveryPage() {
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
            initialFlags={['delivers']}
            pageTitle="Ramen Delivery Near Me"
            pageDescription="Find ramen restaurants that offer delivery near you. Enter your ZIP code to browse spots in your area — many offer pickup too."
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Getting Ramen Delivered
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Ramen delivery has improved dramatically as restaurants have figured out how to
              package broth, noodles, and toppings separately. The best delivery setups arrive
              with components you assemble at home — hot broth in one container, noodles in
              another, toppings in a third. That way the noodles don&apos;t over-soak and go
              mushy before you open the bag.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              For the best delivery experience, look for thicker noodle styles (thick wavy
              noodles hold up longer than thin straight ones) or consider brothless styles like
              mazemen or tsukemen, which aren&apos;t affected by transit time at all. Use the
              map above to find ramen near you and check each listing for delivery availability.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Can you get ramen delivered?',
                  a: 'Yes — many ramen restaurants offer delivery through their own apps or third-party platforms. The best pack broth and noodles separately to prevent over-soaking during transit.',
                },
                {
                  q: 'Does ramen travel well for delivery?',
                  a: 'Ramen can travel well when packaged correctly with separated components. Brothless styles like mazemen and tsukemen hold up best. Thick wavy noodles also tolerate delivery better than thin varieties.',
                },
                {
                  q: 'How do I find ramen delivery near me?',
                  a: 'Enter your ZIP code above to see ramen restaurants nearby. Check individual listings for delivery options, or search your preferred delivery app for ramen in your area.',
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

          <FindCrossLinks currentHref="/find/ramen-delivery" />
          <Footer />
        </div>
      </main>
    </>
  )
}
