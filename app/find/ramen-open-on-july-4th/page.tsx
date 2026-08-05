import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Open on July 4th Near Me | Independence Day Ramen Restaurants',
  description: 'Find ramen restaurants open on July 4th near you. Search the map, filter by Open Now, and discover which spots are serving on Independence Day.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-on-july-4th' },
  openGraph: {
    title: 'Ramen Open on July 4th Near Me',
    description: 'Find ramen open on Independence Day near you — search by location, filter by Open Now, and grab a bowl on the Fourth.',
    url: 'https://www.ramennearyou.com/find/ramen-open-on-july-4th',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOpenOnJuly4thPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, NATIONWIDE_LISTICLE_CAP), { verifiedSlugs })
  const count = matched.length

  const mapSlot = (
    <ErrorBoundary
      fallback={
        <section className="pt-16 bg-[#F5F4F0]">
          <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
          </div>
        </section>
      }
    >
      <HomeMapHero
        pageTitle="Ramen Open on July 4th Near Me"
        pageDescription="Craving a bowl on Independence Day? Search the map, use your location or ZIP, and hit the Open Now filter to see exactly which ramen spots are serving on July 4th."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Open on July 4th Near Me" }]}
        title={`Ramen Open on July 4th Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track that matches this, ranked by rating and review volume. Search by name or city, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <FindPageContent
        currentHref="/find/ramen-open-on-july-4th"
        heading="Finding Ramen Open on July 4th Near You"
        intro={[
          "July 4th is one of the trickiest days to find a good meal — half your usual spots are closed, and the ones that are open might be running shortened hours. The map above pulls every ramen restaurant in your area. Use your ZIP code or your location, then hit the Open Now filter on the day to cut straight to the spots actually serving.",
          "Independence Day ramen runs are a tradition for anyone who'd rather skip the backyard cookout. Whether you want a pre-fireworks lunch, a quick dinner before the show, or a late-night bowl after the crowds clear out, here's how to pull it off.",
        ]}
        sections={[
          {
            h2: 'How to find ramen open on July 4th',
            body: (
              <p>
                The map is your best tool. On July 4th itself, tap the{' '}
                <strong>Open Now</strong> filter in the toolbar — it cross-checks each
                restaurant against its posted hours in real time and surfaces only the spots
                currently serving. Because holiday hours often differ from the regular
                schedule, back it up with a quick call from the listing card before you
                drive over. A 30-second call beats a wasted trip every time.
              </p>
            ),
            points: [
              { h3: 'Open Now filter on the day', text: 'Use it on July 4th and the map will only show restaurants that are currently open according to their posted hours.' },
              { h3: 'Call to confirm holiday hours', text: 'Many places adjust hours on the Fourth and don\'t always update their listing. Calling takes 30 seconds and saves the trip.' },
              { h3: 'Search by ZIP for exact results', text: 'Type your ZIP into the location bar to center the map on your neighborhood and see only spots within a reasonable drive.' },
            ],
          },
          {
            h2: 'Best times to go for ramen on Independence Day',
            body: (
              <p>
                Timing matters on July 4th. Lunch from 11 AM–2 PM is usually the safest
                window — most restaurants that plan to open at all will be running then, and
                you beat the pre-fireworks dinner rush. If you want an evening bowl, use the{' '}
                <strong>Open Late</strong> filter to find spots that stay open past 10 PM.
                Post-fireworks crowds tend to peak around 10:30–11 PM, so showing up right
                when the show ends means a wait — go a bit earlier or later.
              </p>
            ),
          },
          {
            h2: 'What types of ramen spots stay open on July 4th',
            body: (
              <p>
                Larger chains and ramen bars in busy downtown areas, near hotels, or in
                shopping centers are the most likely to stay open — foot traffic justifies it.
                Small owner-operated shops are more likely to close or run reduced hours so
                the team can enjoy the holiday. If you want the safest bet, focus on locations
                with high review counts and a history of staying open — they tend to have the
                staffing to run on holidays. You can also add the{' '}
                <strong>Delivers</strong> filter and skip going out entirely — delivery on
                the Fourth is completely underrated.
              </p>
            ),
          },
        ]}
        tipsHeading="July 4th ramen tips"
        tips={[
          'Use the Open Now filter on July 4th to see only restaurants currently serving.',
          'Call ahead — holiday hours often differ from the posted schedule.',
          'Lunch (11 AM–2 PM) is the most reliable window; many spots that open will close by early evening.',
          'Add the Open Late filter if you want a post-fireworks bowl.',
          'Use the Delivers filter to skip the crowds and order ramen directly to your door.',
          'Downtown, hotel-area, and chain locations are the best bets for staying open on the holiday.',
        ]}
        faqs={[
          { q: 'Is ramen open on July 4th?', a: 'Many ramen restaurants stay open on July 4th, especially in high-traffic downtown and shopping center locations. Smaller owner-run shops are more likely to close or run shortened hours. Use the Open Now filter on the map the day of, and call ahead to confirm.' },
          { q: 'How do I find ramen open on July 4th near me?', a: 'Enter your ZIP or tap "Use my location" on the map above. On Independence Day, add the Open Now filter — it checks live hours and shows only spots currently serving with a green Open badge.' },
          { q: 'What time should I go for ramen on July 4th?', a: 'Lunch between 11 AM and 2 PM is the safest window. Some spots that open will still close early in the afternoon. If you want a post-fireworks bowl, use the Open Late filter to find restaurants serving past 10 PM.' },
          { q: 'Can I get ramen delivered on Independence Day?', a: 'Yes — use the Delivers filter on the map to find ramen spots offering delivery on July 4th. It is a great option if you want to skip the holiday crowds and parking.' },
          { q: 'Do ramen restaurants change hours on July 4th?', a: 'Frequently. July 4th hours often differ from the regular schedule and are not always updated online. Always call the restaurant directly to confirm before heading over.' },
        ]}
      />
    </main>
  )
}
