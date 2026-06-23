import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'JINYA Ramen Bar Near Me | Find a JINYA Location | RamenNearYou',
  description: 'Find JINYA Ramen Bar near you — the chain known for slow-simmered tonkotsu and customizable bowls. What JINYA is known for, what to order, and nearby alternatives.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/jinya-ramen' },
  openGraph: {
    title: 'JINYA Ramen Bar Near Me',
    description: 'Find a JINYA Ramen Bar location near you.',
    url: 'https://www.ramennearyou.com/find/jinya-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function JinyaRamenPage() {
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
          initialQuery="jinya"
          pageTitle="JINYA Ramen Bar Near Me"
          pageDescription="Find a JINYA Ramen Bar near you. Enter your ZIP or use your location to sort locations by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/jinya-ramen"
        heading="How to Find JINYA Ramen Bar Near Me"
        intro={[
          'JINYA Ramen Bar is one of the most popular ramen chains around, and for good reason — slow-simmered tonkotsu, a deep menu, and a polished, sit-down bar atmosphere. The map above is set to find JINYA locations near you; enter your ZIP or use your location to see the closest one, and I have included tips on what to order and nearby alternatives.',
          'Whether you are a JINYA regular or trying it for the first time, here is what the chain is known for and how to make the most of a visit.',
        ]}
        sections={[
          {
            h2: 'What JINYA is known for',
            body: (
              <p>
                JINYA built its reputation on tonkotsu broth simmered for many hours, paired with thin or thick
                noodles you can often choose, and a wide range of bowls from rich and porky to spicy and even
                vegan-friendly options. The vibe leans toward a modern ramen bar — table service, a full drink
                list, and shareable starters — which makes it a reliable, comfortable choice for groups and
                first-timers.
              </p>
            ),
            points: [
              { h3: 'Slow-simmered tonkotsu', text: 'Their signature pork broth is the headliner — rich and creamy after a long simmer.' },
              { h3: 'Customizable bowls', text: 'Choose noodle thickness, spice level, and toppings to dial in your bowl.' },
              { h3: 'Full bar experience', text: 'Sake, cocktails, and small plates make it a comfortable sit-down spot, not just a quick counter.' },
            ],
          },
          {
            h2: 'What to order at JINYA',
            body: (
              <p>
                The tonkotsu bowls are the move — the JINYA Tonkotsu Black (with garlic and garlic oil) is a fan
                favorite, and the spicy options are well balanced. Add a seasoned egg, and start with crispy
                chicken or the brussels sprouts if you want a shareable. If you want it richer, ask for firmer
                noodles so they hold up in the broth.
              </p>
            ),
          },
          {
            h2: 'No JINYA nearby? Great alternatives',
            body: (
              <p>
                If the closest JINYA is a hike, the map can help you find an independent tonkotsu specialist
                instead — often an even more memorable bowl. Clear the search and stack the “Tonkotsu” filter,
                or add “Top Rated” to surface the best-reviewed ramen near you. Some of my favorite bowls have
                come from small local shops I found exactly this way.
              </p>
            ),
          },
        ]}
        tipsHeading="My JINYA tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest JINYA, sorted by distance.',
          'Order a tonkotsu bowl — the Tonkotsu Black is a fan favorite — and add a seasoned egg.',
          'Ask for firmer noodles so they hold up in the rich broth.',
          'No JINYA nearby? Clear the search and stack “Tonkotsu” to find a local specialist.',
          'Add “Top Rated” to compare JINYA with the best-reviewed ramen around you.',
        ]}
        faqs={[
          { q: 'What is JINYA Ramen Bar known for?', a: 'JINYA is known for slow-simmered tonkotsu (pork-bone) broth, customizable bowls with choice of noodle and spice, and a modern ramen-bar atmosphere with table service, a full bar, and shareable starters.' },
          { q: 'What should I order at JINYA?', a: 'The tonkotsu bowls are the highlight — the Tonkotsu Black with garlic oil is a favorite. Add a seasoned egg, try a spicy option, and start with crispy chicken or brussels sprouts to share.' },
          { q: 'Does JINYA have vegan or vegetarian ramen?', a: 'JINYA typically offers vegan and vegetarian-friendly bowls in addition to its pork tonkotsu, though options vary by location — check the menu at your nearest spot.' },
          { q: 'How do I find a JINYA near me?', a: 'The map above is set to find JINYA locations. Enter your ZIP or tap “Use my location” to see the closest ones sorted by distance.' },
          { q: 'What if there is no JINYA near me?', a: 'Clear the search and stack the “Tonkotsu” filter to find an independent tonkotsu specialist nearby, or add “Top Rated” to discover the best-reviewed ramen in your area.' },
        ]}
      />
    </main>
  )
}
