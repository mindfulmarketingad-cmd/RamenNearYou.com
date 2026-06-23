import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Date Night Ramen Near Me | Romantic Ramen Spots | RamenNearYou',
  description: 'Find date night ramen near you — cozy, atmospheric spots with sake, cocktails, and a great bowl. How I pick the perfect ramen restaurant for a date.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-date-night' },
  openGraph: {
    title: 'Date Night Ramen Near Me',
    description: 'Find cozy, romantic ramen spots for date night near you.',
    url: 'https://www.ramennearyou.com/find/ramen-date-night',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenDateNightPage() {
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
          initialMoods={['date-night']}
          pageTitle="Date Night Ramen Near Me"
          pageDescription="Showing cozy, date-worthy ramen spots. Enter your ZIP or use your location to find a romantic bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-date-night"
        heading="How I Plan the Perfect Ramen Date Night"
        intro={[
          'Ramen might not be the first thing people picture for a date, but a great bowl at the right spot is one of my favorite low-pressure, high-payoff dates. It is warm, it is interactive, and it is unpretentious in the best way. The map above leans toward cozy, date-worthy ramen spots near you — enter your ZIP or use your location to find a romantic bowl close by.',
          'Not every ramen shop is date material, though. A fluorescent-lit counter with a 40-minute line is not the move. Here is how I separate the date spots from the quick-lunch joints and build a night that actually impresses.',
        ]}
        sections={[
          {
            h2: 'What makes a ramen spot date-worthy',
            body: (
              <p>
                For a date I want atmosphere as much as a great bowl: dimmer lighting, comfortable seating
                (ideally tables or a relaxed counter, not elbow-to-elbow stools), and a drink list so you can
                linger over sake or a cocktail. The bowls themselves should feel a little special too — this is
                a night for the chef’s signature, not the cheapest option.
              </p>
            ),
            points: [
              { h3: 'Cozy atmosphere', text: 'Warm lighting and comfortable seating turn a quick meal into a lingering evening.' },
              { h3: 'Drinks on offer', text: 'Stack the “Full Bar” filter so there is sake, a highball, or a cocktail to share and slow the night down.' },
              { h3: 'A table you can keep', text: 'Stack “Takes Reservations” to lock in seating so you are not waiting on the sidewalk on date night.' },
            ],
          },
          {
            h2: 'What to order on a ramen date',
            body: (
              <p>
                I like to make it a little event. Start with something to share — gyoza, karaage, or edamame —
                then each get a bowl you are excited about. Ordering different broths and trading a few bites is
                a fun, low-key way to make the meal feel shared. A couple of drinks and a soft egg on top, and
                it is a genuinely lovely night that does not cost a fortune.
              </p>
            ),
          },
          {
            h2: 'Setting up the evening',
            body: (
              <p>
                A little planning removes the friction. Book a table if the spot takes reservations, aim for a
                slightly later, calmer seating rather than the dinner-rush peak, and pick somewhere central so
                you can take a walk after. Stack “Date Night” with “Full Bar” and “Open Late” and you have the
                makings of a relaxed, memorable evening.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen date-night tips"
        tips={[
          'Stack “Date Night” with “Full Bar” for sake or cocktails to linger over.',
          'Add “Takes Reservations” so you are seated, not waiting outside.',
          'Start with shared gyoza or karaage, then order different bowls and trade bites.',
          'Aim for a slightly later, calmer seating instead of the dinner-rush peak.',
          'Pick a central spot so you can take a walk together afterward.',
        ]}
        faqs={[
          { q: 'Is ramen a good date night idea?', a: 'Absolutely. The right spot — cozy, with drinks and comfortable seating — makes ramen a warm, low-pressure, interactive date that feels special without being stuffy.' },
          { q: 'How do I find a romantic ramen spot near me?', a: 'The map above leans toward date-worthy spots. Enter your ZIP or tap “Use my location,” and stack “Full Bar” and “Takes Reservations” for atmosphere and a guaranteed table.' },
          { q: 'What should we order on a ramen date?', a: 'Share a starter like gyoza or karaage, then each get a different bowl and trade bites. Add a couple of drinks and a soft egg to make it feel like an event.' },
          { q: 'Should I make a reservation for a ramen date?', a: 'If the spot takes them, yes — it saves you from waiting on the sidewalk. Stack the “Takes Reservations” filter to find those restaurants.' },
          { q: 'When is the best time for a ramen date?', a: 'A slightly later, calmer seating beats the dinner-rush peak. Add “Open Late” so you can take your time without feeling rushed out.' },
        ]}
      />
    </main>
  )
}
