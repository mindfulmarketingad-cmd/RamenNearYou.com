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
  title: '5 Star Ramen Restaurants Near Me | Highest-Rated Ramen | RamenNearYou',
  description: 'Find 5 star ramen restaurants near you — the highest-rated bowls by real reviews. How to read 5-star ratings, why review count matters, and how to pick the best.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/5-star-ramen' },
  openGraph: {
    title: '5 Star Ramen Restaurants Near Me',
    description: 'Find the highest-rated, 5-star ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/5-star-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function FiveStarRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["top-rated"] }
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
        initialFlags={['top-rated']}
        pageTitle="5 Star Ramen Restaurants Near Me"
        pageDescription="Showing the highest-rated ramen restaurants near you. Enter your ZIP or use your location to find a top-rated bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "5 Star Ramen Restaurants Near Me" }]}
        title={`5 Star Ramen Restaurants Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/5-star-ramen"
        heading="How I Find 5 Star Ramen Restaurants Near Me"
        intro={[
          'When I am only after the best, this is the search I run. The map above is filtered to the highest-rated ramen near you — the spots earning top marks from real diners. Enter your ZIP or tap “Use my location,” and the best-reviewed bowls closest to you rise straight to the top.',
          'A “5 star” rating sounds simple, but it is worth understanding what it really means before you trust it. Here is how I read ratings to find a bowl that is genuinely exceptional, not just statistically lucky.',
        ]}
        sections={[
          {
            h2: 'What “5 star ramen” really means',
            body: (
              <p>
                A perfect 5.0 looks great, but context is everything. A 5.0 from eight reviews is far less
                trustworthy than a 4.7 from two thousand — the second proves the kitchen delivers consistently,
                night after night, to a real crowd. So when I hunt for 5-star ramen, I am really looking for the
                highest-rated spots that also have enough reviews to back the score up. This page leans toward
                exactly that: top-rated bowls you can actually count on.
              </p>
            ),
            points: [
              { h3: 'Rating and review count together', text: 'A near-perfect score across hundreds or thousands of reviews beats a flawless score from a handful. Volume proves consistency.' },
              { h3: 'Recent reviews', text: 'Skim the latest few. A spot can coast on an old reputation; fresh five-star reviews confirm it is still excellent right now.' },
              { h3: 'What reviewers rave about', text: 'When the five-star reviews keep naming the same bowl, that is the dish to order — the kitchen’s proven highlight.' },
            ],
          },
          {
            h2: 'How to verify a 5-star spot before you go',
            body: (
              <p>
                Once the map surfaces the top-rated options, I open a couple of listings and do a quick gut
                check: are the recent reviews still glowing, do the photos show carefully built bowls, and is
                the rating holding steady as reviews pile up? If all three line up, I go. It takes thirty
                seconds and it is the difference between a great bowl and a hyped letdown.
              </p>
            ),
          },
          {
            h2: '5-star ratings vs. hidden gems',
            body: (
              <p>
                The highest-rated, most-reviewed spots are the proven, everyone-agrees-they’re-great choices —
                the tradeoff is they are often busy. If you love a 5-star bowl but not the wait, try the
                “Hidden Gems” filter for spots rated 4.5 and up that have not been discovered at scale yet. I
                bounce between the two depending on whether I want a sure thing or a discovery.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding 5-star ramen"
        tips={[
          'Trust a near-perfect rating that holds up across many reviews over a flawless score from only a few.',
          'Skim the most recent reviews to confirm a spot is still excellent, not coasting.',
          'Order the dish the five-star reviews keep naming — it is the kitchen’s proven best.',
          'Beat the crowds at popular top-rated spots by going at opening or the mid-afternoon lull.',
          'Stack “Takes Reservations” and “Open Now” so you actually get a seat at the best spots.',
        ]}
        faqs={[
          { q: 'What are the best 5 star ramen restaurants near me?', a: 'The map above is filtered to the highest-rated ramen near you, weighted toward strong ratings backed by enough reviews to be reliable. Enter your ZIP or tap “Use my location” to see the top spots closest to you.' },
          { q: 'Does a 5.0 rating mean it is the best ramen?', a: 'Not always. A 5.0 from a handful of reviews is less reliable than a 4.7 from thousands. Volume proves consistency, so a near-perfect score across many reviews is usually a safer bet than a flawless one from a few.' },
          { q: 'How should I read ramen star ratings?', a: 'Look at the rating and the review count together, then skim the most recent reviews to confirm the spot is still great. Consistency over time matters more than a single perfect average.' },
          { q: 'How do I get into a popular 5-star ramen spot?', a: 'Top-rated places draw crowds. Go right at opening or during the mid-afternoon lull, stack “Takes Reservations” where available, and add “Open Now” so you never arrive to a closed kitchen.' },
          { q: 'What if I want a great bowl without the wait?', a: 'Try the “Hidden Gems” filter — it surfaces spots rated 4.5 and up that have not gone viral yet, so you get excellent ramen with shorter lines than the most popular 5-star spots.' },
        ]}
      />
    </main>
  )
}
