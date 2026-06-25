import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gluten-Free Ramen Near Me | Find GF Ramen Restaurants | RamenNearYou',
  description: 'Find gluten-free ramen near you — restaurants offering rice or buckwheat noodles and tamari-based broths. Browse nearby ramen spots and learn how to order gluten-free.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/gluten-free-ramen' },
  openGraph: {
    title: 'Gluten-Free Ramen Near Me',
    description: 'Find ramen restaurants near you that can do a gluten-free bowl, and how to order one.',
    url: 'https://www.ramennearyou.com/find/gluten-free-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function GlutenFreeRamenPage() {
  return (
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
          pageTitle="Gluten-Free Ramen Near Me"
          pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap “Use my location,” then check menus and reviews for gluten-free noodle and broth options."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/gluten-free-ramen"
        heading="How I Find Gluten-Free Ramen Near Me"
        intro={[
          'Traditional ramen is not gluten-free — the noodles are wheat-based and most broths are seasoned with soy sauce that contains wheat. But gluten-free ramen does exist, and more shops offer it every year. The map above shows ramen restaurants near you; from there I read menus and reviews to find the ones that can do a true gluten-free bowl.',
          'Here is exactly what to look for and how to order ramen safely when you avoid gluten.',
        ]}
        sections={[
          {
            h2: 'What makes ramen gluten-free?',
            body: (
              <p>
                Two things have to change for ramen to be gluten-free: the noodles and the seasoning. Standard ramen
                noodles are made from wheat, so a gluten-free bowl swaps in rice, buckwheat (look for 100% soba),
                or other gluten-free noodles. The broth and tare also matter — regular soy sauce contains wheat, so
                the kitchen needs to use tamari or a certified gluten-free soy sauce, and avoid cross-contamination
                in shared pots.
              </p>
            ),
            points: [
              { h3: 'Gluten-free noodles', text: 'Rice, 100% buckwheat, or other GF noodles in place of standard wheat ramen noodles.' },
              { h3: 'Tamari-based broth', text: 'Broth seasoned with tamari or certified gluten-free soy sauce instead of regular shoyu.' },
              { h3: 'No cross-contamination', text: 'Separate water and utensils so GF noodles are not cooked in the same pot as wheat ones.' },
            ],
          },
          {
            h2: 'How to find gluten-free ramen nearby',
            body: (
              <p>
                Use the map to see ramen spots near you, then check each menu for a gluten-free or GF label and scan
                recent reviews for mentions of gluten-free options. Modern, health-forward shops and places that
                already cater to vegan or vegetarian diners are your best bets. When in doubt, call ahead and ask
                directly about noodles, soy sauce, and shared cooking water.
              </p>
            ),
          },
          {
            h2: 'How to order gluten-free ramen safely',
            body: (
              <p>
                If you have celiac disease, be specific: ask whether the noodles are 100% gluten-free, whether the
                broth and tare use tamari, and whether GF noodles are cooked in separate water. A shop that answers
                confidently is one you can trust. If they hesitate, a clear shio or a clean seafood broth with rice
                noodles is often the safest bet.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for gluten-free ramen"
        tips={[
          'Scan the menu for a “gluten-free” or “GF” label before you go.',
          'Ask if the broth uses tamari instead of regular wheat-based soy sauce.',
          'Confirm GF noodles are boiled in separate water to avoid cross-contamination.',
          'Vegan and health-forward ramen shops are the most likely to offer a GF bowl.',
          'Call ahead if you have celiac disease — a confident answer is a good sign.',
        ]}
        faqs={[
          { q: 'Is ramen gluten-free?', a: 'Traditional ramen is not — the noodles are wheat-based and most broths use soy sauce that contains wheat. Gluten-free ramen swaps in rice or buckwheat noodles and uses tamari or certified gluten-free soy sauce.' },
          { q: 'How do I find gluten-free ramen near me?', a: 'Use the map above to see ramen restaurants nearby, then check menus and recent reviews for gluten-free options. Calling ahead to ask about noodles, broth, and cross-contamination is the surest way to confirm.' },
          { q: 'What noodles are used in gluten-free ramen?', a: 'Gluten-free ramen typically uses rice noodles, 100% buckwheat (soba) noodles, or other gluten-free alternatives in place of standard wheat ramen noodles.' },
          { q: 'Can celiacs eat ramen?', a: 'Only if the bowl is prepared gluten-free with certified GF noodles, a tamari-based broth, and no cross-contamination. Always confirm with the restaurant directly before ordering.' },
        ]}
      />
    </main>
  )
}
