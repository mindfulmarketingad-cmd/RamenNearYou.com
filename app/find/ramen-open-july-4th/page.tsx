import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Restaurants Open on Independence Day | July 4th Ramen Near Me | RamenNearYou',
  description: 'Find ramen restaurants open on Independence Day (July 4th) near you. How to check holiday hours, confirm a spot is serving, and grab a bowl on the Fourth.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-july-4th' },
  openGraph: {
    title: 'Ramen Restaurants Open on Independence Day (July 4th)',
    description: 'Find ramen open on the Fourth of July near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-july-4th',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOpenJuly4thPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, 48), { verifiedSlugs })
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
        pageTitle="Ramen Restaurants Open on Independence Day"
        pageDescription="Find ramen open on July 4th near you. Enter your ZIP or use your location, then check each spot's holiday hours."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Restaurants Open on Independence Day (July 4th)" }]}
        title={`Ramen Restaurants Open on Independence Day (July 4th) — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-open-july-4th"
        heading="How I Find Ramen Restaurants Open on Independence Day"
        intro={[
          'Holidays are exactly when a hot bowl of ramen hits the spot — and exactly when half the places you want are closed. The map above shows ramen restaurants near you; enter your ZIP or tap “Use my location,” and I’ll walk you through how to make sure a spot is actually open on the Fourth of July before you head over.',
          'July 4th is unpredictable for restaurant hours: some shops close for the holiday, some run shortened hours, and some are happy to feed everyone who skipped the barbecue. Here’s exactly how I lock down an open bowl on Independence Day.',
        ]}
        sections={[
          {
            h2: 'How to confirm a ramen spot is open on July 4th',
            body: (
              <p>
                The single most reliable move is to check on the day itself. On July 4th, tap the
                &quot;Open Now&quot; filter in the bar above the map — it checks each restaurant against its
                posted hours in real time and shows a green &quot;Open&quot; badge on spots currently serving.
                Because holiday hours often differ from a normal schedule, I always back that up with a quick
                phone call from the listing before driving over.
              </p>
            ),
            points: [
              { h3: 'Use “Open Now” on the day', text: 'On the Fourth, the Open Now filter reflects each spot’s live hours so you only see who is actually serving.' },
              { h3: 'Call ahead to confirm', text: 'Holiday hours are frequently shortened or changed and may not match the posted schedule — a 30-second call saves a wasted trip.' },
              { h3: 'Have a backup', text: 'Keep the second and third closest options in mind in case your first pick closed for the holiday.' },
            ],
          },
          {
            h2: 'Which ramen shops tend to stay open on holidays',
            body: (
              <p>
                In my experience, a few types of spots are the safest bets on Independence Day. Shops in busy
                downtowns, near hotels, or in areas with lots of foot traffic often stay open because demand is
                still there. Chains and larger ramen bars are more likely to keep regular hours than tiny,
                owner-run counters, which more commonly close to give the team the day off. Late-night
                specialists are also a good call for an evening bowl after the fireworks.
              </p>
            ),
          },
          {
            h2: 'Plan your Fourth of July ramen run',
            body: (
              <p>
                A little timing goes a long way on a holiday. Lunch and early afternoon are usually safer than
                late evening, since some places that open will still close early. If you want a post-fireworks
                bowl, stack the &quot;Open Late&quot; filter to find spots serving into the night. And if going
                out is a hassle, check the &quot;Delivers&quot; filter — ordering in is a great way to enjoy
                ramen on the Fourth without fighting holiday crowds and parking.
              </p>
            ),
          },
        ]}
        tipsHeading="My July 4th ramen tips"
        tips={[
          'On July 4th, use the “Open Now” filter to see only spots currently serving.',
          'Always call ahead — holiday hours are often shortened and may not match the posted schedule.',
          'Downtown, hotel-area, and chain locations are the most likely to stay open on the holiday.',
          'Want an evening bowl after fireworks? Stack the “Open Late” filter.',
          'Skip the crowds entirely with the “Delivers” filter and order ramen in.',
        ]}
        faqs={[
          { q: 'Are ramen restaurants open on Independence Day?', a: 'Many are, but it varies. Some shops close for July 4th, others run shortened hours, and busy or downtown locations often stay open. Use the “Open Now” filter on the day and call ahead to confirm.' },
          { q: 'How do I find ramen open on July 4th near me?', a: 'Use the map above — enter your ZIP or tap “Use my location,” then on the day add the “Open Now” filter to see which spots are currently serving, and call to confirm holiday hours.' },
          { q: 'Why might a ramen shop’s posted hours be wrong on July 4th?', a: 'Holiday hours frequently differ from the regular schedule and are not always updated, so a place listed as open may close early or stay shut. A quick phone call from the listing is the most reliable check.' },
          { q: 'Can I get ramen delivered on Independence Day?', a: 'Often, yes. Add the “Delivers” filter to find spots offering delivery on the Fourth — a great way to enjoy a bowl without holiday crowds, parking, or a closed dining room.' },
          { q: 'Is it better to go for ramen at lunch or dinner on July 4th?', a: 'Lunch and early afternoon are usually safer bets, since some open shops close early for the holiday. For an after-fireworks bowl, use the “Open Late” filter to find spots serving into the night.' },
        ]}
      />
    </main>
  )
}
