import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, pickNationwideSample } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Open on Weekends Near Me | Saturday & Sunday Ramen | RamenNearYou',
  description: 'Find ramen open on weekends near you — spots serving both Saturday and Sunday. Plus how I dodge the weekend rush and still get a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-weekends' },
  openGraph: {
    title: 'Ramen Open on Weekends Near Me',
    description: 'Find ramen restaurants open Saturday and Sunday near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-weekends',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOpenWeekendsPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["open-weekends"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(pickNationwideSample(ranked), { verifiedSlugs })
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
        initialFlags={['open-weekends']}
        pageTitle="Ramen Open on Weekends Near Me"
        pageDescription="Showing ramen restaurants open both Saturday and Sunday. Enter your ZIP or use your location to find a weekend bowl near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Open on Weekends Near Me" }]}
        title={`Ramen Open on Weekends Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-open-weekends"
        heading="My Guide to Weekend Ramen Near Me"
        intro={[
          'There is nothing worse than building up a weekend ramen craving, driving over, and finding a “Closed Sunday” sign on the door. The map above is filtered to ramen restaurants near you that are open on both Saturday and Sunday, so you can plan weekend lunch, brunch, or dinner without the gamble. Enter your ZIP or use your location to find the closest weekend spots.',
          'Weekends are prime ramen time, which is great for availability but means crowds at the popular places. Here is how I plan a weekend bowl, when to go to beat the rush, and how to make a full afternoon of it.',
        ]}
        sections={[
          {
            h2: 'Why some ramen shops close on weekends',
            body: (
              <p>
                It surprises people, but Sunday (and sometimes Monday) is a common closing day for smaller,
                owner-run ramen shops — making the broth is brutal, multi-day work, and everyone needs a day
                off. That is exactly why this filter is useful: it only shows spots confirmed open both Saturday
                and Sunday, so you are not relying on luck.
              </p>
            ),
          },
          {
            h2: 'How to beat the weekend rush',
            body: (
              <p>
                Weekend lunch and dinner are the busiest windows at any good ramen shop, so timing is
                everything. I aim for right at opening or the mid-afternoon lull between lunch and dinner — both
                mean shorter waits and a calmer room. If I am set on a viral spot, I treat the wait as part of
                the plan; otherwise I use the “Hidden Gems” filter to find an equally great bowl with a fraction
                of the line.
              </p>
            ),
            points: [
              { h3: 'Go at opening', text: 'The first seating of the day is the easiest to walk into, and the broth is at its freshest.' },
              { h3: 'Hit the afternoon lull', text: 'Between about 2 and 5 PM, most shops quiet down — a sweet spot for a relaxed weekend bowl.' },
              { h3: 'Use Hidden Gems', text: 'Stack the “Hidden Gems” filter to find high-rated spots that have not drawn the weekend crowds yet.' },
            ],
          },
          {
            h2: 'Make a weekend of it',
            body: (
              <p>
                Weekends are when ramen can be a proper outing rather than a quick weekday refuel. Stack
                “Family-Friendly” for a Saturday lunch with the kids, “Full Bar” or “Date Night” for a relaxed
                Saturday evening, or “Outdoor Seating” when the weather is nice and you want to linger on a
                patio. The filters combine so you can build the exact weekend plan you want.
              </p>
            ),
          },
        ]}
        tipsHeading="My weekend ramen tips"
        tips={[
          'Filter to “Open Weekends,” then add “Open Now” to confirm a spot is serving right now.',
          'Go at opening or during the 2–5 PM lull to beat the weekend rush.',
          'Stack “Hidden Gems” to find a great bowl without the viral-spot line.',
          'Add “Family-Friendly,” “Full Bar,” or “Outdoor Seating” to shape the kind of weekend outing you want.',
          'Still confirm today’s hours on the listing — weekend schedules sometimes differ from weekdays.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants are open on weekends near me?', a: 'The map above is filtered to spots open both Saturday and Sunday. Enter your ZIP or tap “Use my location” to find weekend restaurants nearby.' },
          { q: 'Are ramen restaurants open on Sundays?', a: 'Many are, though Sunday or Monday is a common closing day for smaller, owner-run shops. This page surfaces places that serve on both weekend days.' },
          { q: 'Is ramen busier on weekends?', a: 'Yes — weekend lunch and dinner are peak times, so expect waits at popular spots. Go right at opening or during the mid-afternoon lull, or use “Hidden Gems” to dodge the crowds.' },
          { q: 'When is the best time to get weekend ramen?', a: 'Right at opening or in the 2–5 PM lull between lunch and dinner. Both mean shorter waits and a calmer room.' },
          { q: 'How do I plan a weekend ramen outing?', a: 'Stack filters to fit the plan — “Family-Friendly” for a kids’ lunch, “Full Bar” or “Date Night” for the evening, or “Outdoor Seating” for a patio when the weather is good.' },
        ]}
      />
    </main>
  )
}
