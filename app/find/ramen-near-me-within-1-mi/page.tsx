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
  title: 'Ramen Near Me Within 1 Mi | RamenNearYou',
  description: 'Find ramen restaurants within 1 mile of your current location, sorted by distance. Enter your ZIP or share your location to see what is actually close.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-near-me-within-1-mi' },
  openGraph: {
    title: 'Ramen Near Me Within 1 Mi',
    description: 'Find ramen restaurants within 1 mile of your location.',
    url: 'https://www.ramennearyou.com/find/ramen-near-me-within-1-mi',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenWithin1MiPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked, { verifiedSlugs })
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
        maxDistanceMiles={1}
        pageTitle="Ramen Near Me Within 1 Mi"
        pageDescription="Showing ramen restaurants within 1 mile of you. Enter your ZIP or use your location — the map filters out anything farther than 1 mile."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Near Me Within 1 Mi" }]}
        title={`Ramen Near Me Within 1 Mi — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track, ranked by rating. Tap \"Show distance from me\" to filter to spots within 1 mile of you, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
        maxDistanceMiles={1}
      />

      <FindPageContent
        currentHref="/find/ramen-near-me-within-1-mi"
        heading="How This 1-Mile Ramen Search Works"
        intro={[
          'Sometimes "near me" needs a real number attached to it. This map is hard-filtered to ramen restaurants within 1 mile of your current location or ZIP code — nothing farther, no matter how highly rated it is. Enter your ZIP or tap "Use my location" and the list only shows what is genuinely within reach.',
          'A tight radius like this is the fastest way to settle a "where should we eat" debate when you do not want to drive across town for a bowl of ramen. Here is how I use it.',
        ]}
        sections={[
          {
            h2: 'Why set a hard mile limit',
            body: (
              <p>
                A 4.9-star ramen shop does not help you if it is 25 minutes away and you are eating on a lunch
                break. Setting a real distance cutoff — 1 mile here — keeps the results honest: everything
                you see is realistically walkable or a short drive, not just "closest of what is highly rated
                citywide."
              </p>
            ),
          },
          {
            h2: 'Getting an accurate result',
            body: (
              <p>
                The radius is measured from your device&apos;s location or the ZIP code you enter, straight-line
                distance rather than driving time — so a spot just across a river or highway might show up even if
                the actual drive is longer than 1 mile. If the list looks sparse, that usually means there
                genuinely are not many ramen spots that close — try widening to a bigger radius from the /find hub.
              </p>
            ),
          },
          {
            h2: 'What to do if nothing shows up',
            body: (
              <p>
                A tight 1-mile radius will come up empty in some suburban or rural areas. If that happens, back out
                to a wider radius page or use the full searchmap with no distance limit, then sort by distance
                instead of a hard cutoff.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for a tight-radius search"
        tips={[
          'Share your precise location instead of just a ZIP for the most accurate 1-mile radius.',
          'Remember this measures straight-line distance, not driving time — a river or highway can make the actual drive longer.',
          'If results look thin, it is a real signal of low ramen density nearby, not a bug — try a wider radius.',
          'Sort by rating within the results to find the best of what is actually close, rather than settling for the first pin.',
          'Combine with the Open Now filter if you want something within 1 mile that is serving right this minute.',
        ]}
        faqs={[
          { q: 'How accurate is the 1-mile radius?', a: 'It is measured as straight-line ("as the crow flies") distance from your shared location or ZIP code, not driving distance — actual drive time can be longer if a river, highway, or one-way streets are in the way.' },
          { q: 'Why is the list empty near me?', a: 'A 1-mile radius is a hard cutoff, so a genuinely low density of ramen restaurants nearby will show few or no results. Try a wider radius page or the full searchmap with no distance limit.' },
          { q: 'Does this use my exact location or my ZIP code?', a: 'Either — tap "Use my location" for the most precise 1-mile radius, or enter a ZIP code if you would rather not share your exact location.' },
          { q: 'Can I combine this with other filters?', a: 'Yes — Open Now, broth type, price, and the other filters in the Filters panel all still apply on top of the 1-mile radius.' },
        ]}
      />
    </main>
  )
}
