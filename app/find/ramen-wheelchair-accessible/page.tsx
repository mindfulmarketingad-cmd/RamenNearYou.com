import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wheelchair Accessible Ramen Near Me | Accessible Ramen | RamenNearYou',
  description: 'Find wheelchair accessible ramen restaurants near you — accessible entrances and seating. Plus exactly what to confirm before you go so the visit is smooth.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible' },
  openGraph: {
    title: 'Wheelchair Accessible Ramen Near Me',
    description: 'Find wheelchair accessible ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenWheelchairAccessiblePage() {
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
          initialFlags={['wheelchair']}
          pageTitle="Wheelchair Accessible Ramen Near Me"
          pageDescription="Showing ramen restaurants listed as wheelchair accessible. Enter your ZIP or use your location to find accessible spots near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-wheelchair-accessible"
        heading="Finding Wheelchair Accessible Ramen Near Me"
        intro={[
          'Everyone deserves a great bowl of ramen without an obstacle course to get to the table. The map above is filtered to ramen restaurants near you that are listed as wheelchair accessible — typically meaning an accessible entrance and seating. Enter your ZIP or use your location to find the closest accessible spots.',
          'Accessibility is one filter where I always recommend confirming the details directly, because “accessible” can mean different things at different restaurants. Below is what the flag generally covers, what to double-check, and how to make the visit as smooth as possible.',
        ]}
        sections={[
          {
            h2: 'What “wheelchair accessible” usually means here',
            body: (
              <p>
                The accessibility flag is sourced from each restaurant’s listed amenities and most often
                indicates a step-free or ramped entrance and seating that can accommodate a wheelchair. What it
                does not always specify is the finer detail — restroom accessibility, table heights, aisle
                width, or accessible parking — which can vary a lot from one shop to the next.
              </p>
            ),
            points: [
              { h3: 'Entrance', text: 'Usually a step-free or ramped way in. Older or basement-level spots are the ones most likely to have a step, so this filter helps rule those out.' },
              { h3: 'Seating', text: 'Table seating is generally easier to accommodate than a high counter. If you need a standard-height table, it is worth confirming.' },
              { h3: 'Restrooms and parking', text: 'These are not always captured by the flag. If they matter for your visit, call ahead — it is the only reliable way to know.' },
            ],
          },
          {
            h2: 'How I confirm before going',
            body: (
              <p>
                I open the restaurant’s listing, grab the phone number, and call ahead with my specific
                questions: Is the entrance step-free? Is there table seating? Is the restroom accessible? Is
                there accessible parking nearby? A 60-second call removes the guesswork and means you arrive
                knowing the place works for you, rather than discovering a problem at the door.
              </p>
            ),
          },
          {
            h2: 'Making the visit smooth',
            body: (
              <p>
                Going a little outside peak hours usually means more space to move and a calmer room, which
                makes navigating easier. If you want a guaranteed, well-placed table, stack the “Takes
                Reservations” filter with this one and mention any seating needs when you book. And if parking
                is a factor, the “Free Parking” filter can help narrow to spots with their own lot.
              </p>
            ),
          },
        ]}
        tipsHeading="My accessibility tips"
        tips={[
          'Filter to “Wheelchair Accessible,” then sort by distance for the nearest options.',
          'Call ahead to confirm the entrance, restroom, and parking — the flag does not always cover all three.',
          'Visit slightly off-peak for more room to navigate and a calmer space.',
          'Stack “Takes Reservations” to lock in a well-placed table and note your needs when booking.',
          'Add “Free Parking” if getting from the car to the door matters for your visit.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants are wheelchair accessible near me?', a: 'The map above is filtered to spots listed as wheelchair accessible. Enter your ZIP or tap “Use my location” to find them nearby.' },
          { q: 'What does wheelchair accessible mean for these listings?', a: 'It generally means an accessible (step-free or ramped) entrance and accommodating seating. Details like restrooms, table heights, and parking vary, so confirm directly with the restaurant.' },
          { q: 'How can I confirm accessibility before visiting?', a: 'Open the listing for the phone number and website, then call ahead with your specific questions. Since the data comes from listed amenities, a quick call is the most reliable confirmation.' },
          { q: 'Are ramen counters or tables better for accessibility?', a: 'Table seating is usually easier to accommodate than a high counter. If you need a standard-height table, mention it when you call or book.' },
          { q: 'Can I reserve an accessible table for ramen?', a: 'At spots that take reservations, yes — book ahead and note your seating needs. Stack the “Takes Reservations” filter with this one to find those restaurants.' },
        ]}
      />
    </main>
  )
}
