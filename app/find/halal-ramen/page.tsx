import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Halal Ramen Near Me | Find Halal Ramen Restaurants | RamenNearYou',
  description: 'Find halal ramen near you — ramen restaurants serving chicken, beef, or vegetarian bowls with no pork or alcohol. Browse nearby spots and learn how to order halal ramen.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/halal-ramen' },
  openGraph: {
    title: 'Halal Ramen Near Me',
    description: 'Find ramen restaurants near you that serve halal-friendly bowls, and how to order one.',
    url: 'https://www.ramennearyou.com/find/halal-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function HalalRamenPage() {
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
          pageTitle="Halal Ramen Near Me"
          pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap “Use my location,” then check menus and reviews for halal chicken, beef, or vegetarian bowls."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/halal-ramen"
        heading="How I Find Halal Ramen Near Me"
        intro={[
          'Most classic ramen is built on pork — tonkotsu broth, chashu, and sometimes a splash of cooking sake — which puts it off the table if you eat halal. The good news is that halal ramen is growing fast, with shops serving rich chicken, beef, and vegetarian bowls that skip pork and alcohol entirely. The map above shows ramen restaurants near you, and below I explain how to find the halal-friendly ones.',
          'Here is what to look for on a menu and how to order ramen that fits a halal diet.',
        ]}
        sections={[
          {
            h2: 'What makes ramen halal?',
            body: (
              <p>
                Halal ramen avoids pork in every form — no tonkotsu broth, no chashu pork, no lard — and skips
                alcohol like sake and mirin in the broth and tare. Instead it leans on chicken paitan, beef, or
                vegetable broths, with halal-certified meat toppings where offered. A bowl is only truly halal if
                the meat is sourced halal and the kitchen keeps it separate from pork, so certification or a clear
                statement from the shop matters.
              </p>
            ),
            points: [
              { h3: 'No pork', text: 'Chicken, beef, or vegetable broth in place of pork-bone tonkotsu, and no chashu pork.' },
              { h3: 'No alcohol', text: 'Broth and tare made without sake, mirin, or other alcohol.' },
              { h3: 'Halal-sourced meat', text: 'Certified halal chicken or beef, prepared separately from non-halal ingredients.' },
            ],
          },
          {
            h2: 'How to find halal ramen nearby',
            body: (
              <p>
                Use the map to see ramen spots near you, then check menus and recent reviews for halal mentions.
                Chicken and beef ramen specialists, vegetarian-friendly shops, and restaurants in areas with a
                large Muslim community are the most likely to offer halal bowls. When a menu is not explicit, a
                quick call to ask about pork, alcohol, and halal certification clears it up.
              </p>
            ),
          },
          {
            h2: 'What to order at a halal ramen spot',
            body: (
              <p>
                I start with the house chicken paitan or a beef bowl — both deliver the rich, savory depth people
                love about tonkotsu without the pork. A miso or shoyu base made with halal-friendly seasoning is
                another great option, and vegetable broths are naturally a safe bet. Add a seasoned egg and extra
                vegetables to round it out.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for halal ramen"
        tips={[
          'Look for chicken or beef ramen specialists — they are the most likely to be halal.',
          'Confirm the broth has no pork and no sake or mirin before ordering.',
          'Ask whether the meat is halal-certified and kept separate from pork.',
          'Vegetarian and vegan ramen bowls are a naturally safe fallback.',
          'Shops in areas with a large Muslim community often advertise halal options.',
        ]}
        faqs={[
          { q: 'Is ramen halal?', a: 'Traditional ramen usually is not — it is often built on pork broth and chashu pork, sometimes with sake in the seasoning. Halal ramen replaces these with chicken, beef, or vegetable broths and avoids alcohol.' },
          { q: 'How do I find halal ramen near me?', a: 'Use the map above to see ramen restaurants nearby, then check menus and reviews for halal options. Chicken and beef ramen specialists and vegetarian-friendly shops are the best bets; call ahead to confirm.' },
          { q: 'What ramen broth is halal?', a: 'Chicken paitan, beef, and vegetable broths can all be halal when made without pork or alcohol. Pork-based tonkotsu is not halal.' },
          { q: 'Is tonkotsu ramen halal?', a: 'No — tonkotsu broth is made from pork bones, so it is not halal. Look for chicken, beef, or vegetable-based bowls instead.' },
        ]}
      />
    </main>
  )
}
