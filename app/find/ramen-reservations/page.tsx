import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Reservations Near Me | Book a Table | RamenNearYou',
  description: 'Find ramen restaurants that take reservations near you. Skip the line and book ahead for date night or a group — plus how to lock down a table at popular spots.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-reservations' },
  openGraph: {
    title: 'Ramen With Reservations Near Me',
    description: 'Find ramen restaurants that accept reservations near you.',
    url: 'https://www.ramennearyou.com/find/ramen-reservations',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenReservationsPage() {
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
          initialFlags={['reservations']}
          pageTitle="Ramen With Reservations Near Me"
          pageDescription="Showing ramen restaurants that take reservations. Enter your ZIP or use your location to book a table near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-reservations"
        heading="How I Book Ramen Reservations and Skip the Line"
        intro={[
          'Some of the best ramen shops have a line out the door, and standing on the sidewalk for 45 minutes is not always the vibe — especially on date night or with a group. The map above is filtered to ramen restaurants near you that accept reservations, so you can lock in a table instead of gambling on the wait. Enter your ZIP or use your location to find bookable spots nearby.',
          'Reservations are a little less common in ramen than in other dining, because so many shops are built around fast, walk-in counter seating. So when a place does take bookings, it is worth knowing how to use that to your advantage. Here is how I plan ahead.',
        ]}
        sections={[
          {
            h2: 'Which ramen restaurants actually take reservations',
            body: (
              <p>
                Classic counter-style ramen-yas are usually walk-in only — the whole model is turn tables
                fast. The shops that take reservations tend to be a step up in setting: izakaya-style spots,
                modern ramen bars, and upscale or chef-driven restaurants where ramen is part of a bigger
                menu. Those are exactly the places where booking ahead pays off.
              </p>
            ),
            points: [
              { h3: 'Izakaya and ramen bars', text: 'These often take reservations because you are likely to order drinks and small plates, not just slurp and leave. Great for lingering with a group.' },
              { h3: 'Upscale and chef-driven spots', text: 'When ramen is part of a full dinner menu, reservations are common and worth grabbing, especially on weekends.' },
              { h3: 'Walk-in-only counters', text: 'If your favorite spot does not take bookings, go right at opening or in the mid-afternoon lull to dodge the worst of the wait.' },
            ],
          },
          {
            h2: 'How to actually get the table',
            body: (
              <p>
                Once you find a spot on the map, open its listing for the phone number and website. Some
                restaurants use online booking platforms; others just want a phone call. For popular places on
                a Friday or Saturday, I book a few days out and aim for an early or late slot, which is easier
                to get and usually means a calmer room.
              </p>
            ),
          },
          {
            h2: 'Reservations for date night and groups',
            body: (
              <p>
                A booked table changes ramen from a quick solo meal into a real night out. For date night I
                stack the “Full Bar” or “Date Night” filters with this one so there is sake or a cocktail in
                the mix. For groups, calling ahead is almost essential — ramen counters rarely seat six people
                together on a whim, so a reservation is the difference between sitting together and splitting up.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen reservation tips"
        tips={[
          'Filter to “Takes Reservations,” then open a listing for the phone number or booking link.',
          'Book a few days ahead for weekend dinners at popular spots.',
          'Early and late time slots are the easiest to grab and the most relaxed.',
          'Always confirm the policy directly — some places only hold tables for larger parties.',
          'No reservations at your favorite shop? Go at opening or mid-afternoon to minimize the wait.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants take reservations near me?', a: 'The map above is filtered to spots that accept reservations. Enter your ZIP or tap “Use my location,” then open a listing for the phone number or booking link.' },
          { q: 'Do ramen shops usually take reservations?', a: 'Many classic counter shops are walk-in only, but izakaya-style spots, modern ramen bars, and upscale restaurants increasingly accept reservations. This page surfaces the ones that do.' },
          { q: 'How do I book a table for ramen?', a: 'Open the restaurant’s listing for its phone number and website, then call or book online. Confirm the policy directly, since some places only hold tables for larger parties.' },
          { q: 'Can I get a ramen reservation for a big group?', a: 'Often yes, and calling ahead is the best move — ramen counters rarely seat large parties together without notice. Reservations are the reliable way to keep a group at one table.' },
          { q: 'What if my favorite ramen spot does not take reservations?', a: 'Go right when they open or during the mid-afternoon lull. Those are the lowest-wait windows at walk-in-only counters.' },
        ]}
      />
    </main>
  )
}
