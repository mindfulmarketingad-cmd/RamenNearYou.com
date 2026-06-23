import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Late Near Me | Late-Night Ramen After 10PM | RamenNearYou',
  description: 'Find ramen open late near you — spots serving past 10 PM and into the early hours. My guide to the best late-night bowls and how to catch them before last call.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-late' },
  openGraph: {
    title: 'Ramen Open Late Near Me',
    description: 'Find late-night ramen restaurants open past 10 PM near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-late',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenOpenLatePage() {
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
          initialFlags={['open-late']}
          pageTitle="Ramen Open Late Near Me"
          pageDescription="Showing ramen restaurants open late (10 PM and later). Enter your ZIP or use your location to find a late-night bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-open-late"
        heading="My Go-To Guide for Late-Night Ramen Near Me"
        intro={[
          'Ramen and late nights belong together. After a shift, a show, or one drink too many, a hot bowl at 11 PM is exactly what the moment calls for. The map above is filtered to ramen restaurants near you that stay open late — serving until 10 PM or later — so you can find a bowl when most kitchens have already shut down. Enter your ZIP or use your location to sort the closest late spots.',
          'Late-night ramen has its own culture and its own rules. Here is why it became the ultimate after-hours food, what I order when it is late, and how to make sure you slide in before the last bowl.',
        ]}
        sections={[
          {
            h2: 'Why ramen is the perfect late-night food',
            body: (
              <p>
                In Japan, ramen has long been the food you eat after the bars — warm, restorative, and deeply
                satisfying when nothing else is open. That tradition carried over here, and late-night ramen
                shops have a particular energy: a little rowdier, a lot of comfort, and broth that hits
                differently at midnight. It is fast, it is filling, and it is the best possible end to a night out.
              </p>
            ),
          },
          {
            h2: 'What I order when it is late',
            body: (
              <p>
                Late at night I want comfort and richness, not something delicate. A heavy tonkotsu or a spicy
                miso is my move — the fat and salt are exactly what a long night calls for, and a little heat
                wakes you back up. If I have had a few drinks, the “hangover cure” logic kicks in: rich broth,
                a soft egg, extra noodles, done.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'Rich, fatty pork broth is peak late-night comfort and holds heat the longest.' },
              { h3: 'Spicy miso', text: 'Hearty and warming with a kick that perks you back up after a long night.' },
              { h3: 'Load it up', text: 'A soft egg, extra chashu, and an order of gyoza turn a late bowl into a proper restorative meal.' },
            ],
          },
          {
            h2: 'Catch the kitchen before last call',
            body: (
              <p>
                Late-night hours are the most likely to shift, and kitchens frequently stop taking orders before
                the posted close. The “Open Late” filter flags spots serving until 10 PM or later, but for the
                truly late stuff I stack “Open Now” to confirm they are still going right now, and I call ahead
                after about 11 PM. Some legendary spots go past midnight — use “Past Midnight” in the filters
                when you need the latest of the late.
              </p>
            ),
          },
        ]}
        tipsHeading="My late-night ramen tips"
        tips={[
          'Filter to “Open Late,” then add “Open Now” to confirm a spot is still serving right now.',
          'Order rich, fatty bowls — tonkotsu or spicy miso — for the best late-night comfort.',
          'Call ahead after 11 PM; kitchens often stop orders before the posted close.',
          'Need the latest spots? Use the “Past Midnight” filter for kitchens that go even later.',
          'A soft egg, extra chashu, and gyoza make the ultimate post-night-out meal.',
        ]}
        faqs={[
          { q: 'What ramen is open late near me?', a: 'The map above is filtered to ramen restaurants open until 10 PM or later. Enter your ZIP or tap “Use my location” to find the closest late-night bowls.' },
          { q: 'How late do ramen restaurants stay open?', a: 'It varies — many serve until 10 or 11 PM, and some late-night specialists go past midnight. Use the “Open Late” and “Past Midnight” filters to match how late you need.' },
          { q: 'Why is ramen such a popular late-night food?', a: 'It is warm, fast, filling, and restorative — the classic after-bars meal in Japan, and the same logic holds here. Rich broth at midnight just hits differently.' },
          { q: 'What ramen should I order late at night?', a: 'Rich, comforting bowls like tonkotsu or spicy miso. Add a soft egg and gyoza for a restorative end to the night, especially after a few drinks.' },
          { q: 'Will a late-night spot still be serving when I arrive?', a: 'Late hours shift often, and kitchens may stop orders before closing. Stack the “Open Now” filter, and call ahead after about 11 PM to be sure.' },
        ]}
      />
    </main>
  )
}
