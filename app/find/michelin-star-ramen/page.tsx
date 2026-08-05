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
  title: 'Michelin Star Ramen Restaurants Near Me | RamenNearYou',
  description: 'Find Michelin-caliber ramen near you — the highest-rated, most acclaimed ramen restaurants, ranked by rating and review depth. Browse the standout bowls near you.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/michelin-star-ramen' },
  openGraph: {
    title: 'Michelin Star Ramen Restaurants Near Me',
    description: 'Find the highest-rated, most acclaimed ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/michelin-star-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function MichelinStarRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["top-rated"] }
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
        initialFlags={['top-rated']}
        pageTitle="Michelin Star Ramen Restaurants Near Me"
        pageDescription="Showing the highest-rated, most acclaimed ramen restaurants near you. Enter your ZIP or use your location to find the standout bowls nearby, ranked by rating."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Michelin Star Ramen Restaurants Near Me" }]}
        title={`Michelin Star Ramen Restaurants Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/michelin-star-ramen"
        heading="How I Find Michelin-Caliber Ramen Near Me"
        intro={[
          'A handful of ramen shops around the world have genuinely earned Michelin recognition — Tsuta in Tokyo famously became the first ramen restaurant to win a Michelin star. Outside of a few major cities, though, formal Michelin coverage is thin, so the map above surfaces the next best thing: the highest-rated, most-reviewed ramen restaurants near you, the ones with the kind of consistent acclaim that Michelin-level bowls are built on. Enter your ZIP or tap "Use my location" to find them.',
          'Here is how I read that acclaim, what actually separates a truly exceptional bowl from a merely good one, and how to tell whether a spot near you is operating at that level.',
        ]}
        sections={[
          {
            h2: 'How this map ranks "the best"',
            body: (
              <p>
                Very few restaurants hold an actual Michelin star, and Michelin only reviews a small number of
                cities, so this page uses the strongest widely-available proxy: rating combined with review depth.
                The map starts filtered to top-rated spots and sorts by rating, with a minimum review count so a
                perfect score from only a handful of reviews does not outrank a proven favorite with hundreds or
                thousands behind it.
              </p>
            ),
            points: [
              { h3: 'Rating first', text: 'The highest-rated ramen restaurants near you rank at the top of the list.' },
              { h3: 'Review depth as the tiebreaker', text: 'A 4.8 across 1,200 reviews is a stronger signal than a 5.0 across a dozen — consistency at volume is what acclaim really measures.' },
              { h3: 'Recency matters', text: 'I skim the most recent reviews too, since a kitchen can slip or improve over time.' },
            ],
          },
          {
            h2: 'What actually makes ramen Michelin-caliber',
            body: (
              <p>
                The bowls that earn real acclaim tend to share a few traits: a broth simmered in-house for hours
                (not from a base or concentrate), noodles with genuine bite made or sourced with care, and a
                kitchen obsessive about balance — salt, fat, and umami dialed in so precisely that nothing feels
                like an afterthought. When a shop nails all three consistently, it shows up in the ratings.
              </p>
            ),
            points: [
              { h3: 'In-house broth', text: 'Tonkotsu simmered 12+ hours, or a clear shoyu/shio built from a real dashi — depth you cannot fake.' },
              { h3: 'Noodle quality', text: 'Fresh noodles with the right chew and alkalinity for the broth style, cooked to order.' },
              { h3: 'Precision and restraint', text: 'A great bowl is balanced, not just rich — every element earns its place.' },
            ],
          },
          {
            h2: 'How to tell if a spot near you is operating at that level',
            body: (
              <p>
                I read the reviews for specifics rather than star counts alone — mentions of broth depth, noodle
                texture, and consistency across visits are the tells. A shop that names a real ramen style and has
                built a strong rating across a large number of reviews is usually the closest thing to a
                Michelin-caliber bowl in a given city, whether or not an inspector has ever walked in.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding exceptional ramen"
        tips={[
          'The map is sorted by rating with review depth as the tiebreaker — the standout spots near you rank first.',
          'Read recent reviews for specific praise of the broth and noodles, not just the star count.',
          'Trust a strong rating that holds up across hundreds of reviews over a perfect score from only a few.',
          'Layer on a broth filter (tonkotsu, shoyu, shio) to find the best spot within the exact style you want.',
          'Formal Michelin coverage is limited to a few cities — outside them, consistent top ratings are the best available signal.',
        ]}
        faqs={[
          { q: 'Are there really Michelin star ramen restaurants?', a: 'Yes — Tsuta in Tokyo became the first ramen restaurant to earn a Michelin star in 2015, and a few others have followed. Michelin only reviews a limited set of cities, though, so most areas have no formally starred ramen shop.' },
          { q: 'How does this page find them near me?', a: 'Since formal Michelin coverage is limited, the map surfaces the strongest available proxy: the highest-rated, most-reviewed ramen restaurants near you, sorted by rating with a minimum review threshold.' },
          { q: 'What makes ramen worthy of that level?', a: 'A broth simmered in-house for hours, noodles with real bite, and a kitchen precise about balancing salt, fat, and umami — consistently, across every bowl. That consistency is what shows up in ratings.' },
          { q: 'How do I confirm a spot is truly exceptional?', a: 'Read the most recent reviews for specific mentions of broth depth, noodle texture, and consistency across visits — a strong rating backed by a large, detailed review base is the best sign.' },
        ]}
      />
    </main>
  )
}
