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
  title: 'Best Ramen Near Me',
  description: 'Find the best ramen near you, sorted highest-rated first. Real ratings, real review counts, and a map that puts the top bowl closest to you right at the top.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/best-ramen-near-me' },
  openGraph: {
    title: 'Best Ramen Near Me',
    description: 'Find the best ramen near you, sorted highest-rated first.',
    url: 'https://www.ramennearyou.com/find/best-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function BestRamenNearMePage() {
  const NATIONWIDE_FILTER = { initialFlags: ["top-rated"] }
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
        initialFlags={['top-rated']}
        pageTitle="Best Ramen Near Me"
        pageDescription="Showing the best ramen near you, sorted highest-rated first. Enter your ZIP or use your location to find the top bowl closest to you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Best Ramen Near Me" }]}
        title={`Best Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/best-ramen-near-me"
        heading="How I Find the Best Ramen Near Me"
        intro={[
          'When someone asks me where the best ramen near them is, I point them at this exact page. The map above is sorted so the best ramen restaurants near you rise to the top automatically — highest rating first, then review count as the tiebreaker — so you are not scrolling past mediocre bowls to find the good ones. Enter your ZIP or tap "Use my location" and the best-reviewed spots closest to you land at the top of the list.',
          '"Best" is doing a lot of work in that sentence, though, so here is exactly what the ranking means and how I read it before I actually drive somewhere.',
        ]}
        sections={[
          {
            h2: 'How this page ranks "best"',
            body: (
              <p>
                The list is sorted by rating first, with review count breaking any ties, and it is filtered to
                restaurants with a real track record — a strong star rating backed by a meaningful number of
                reviews, not a handful of five-stars from opening week. That combination is what actually
                separates a genuinely great bowl from a lucky one.
              </p>
            ),
            points: [
              { h3: 'Rating leads the sort', text: 'The highest-rated restaurants near you are ordered first, so the best bowl in range is always the first thing you see.' },
              { h3: 'Review count breaks ties', text: 'When two spots share a rating, the one with more reviews ranks higher — more data backing the same score is a stronger signal.' },
              { h3: 'A minimum review threshold', text: 'Places with only a few reviews are filtered out of this specific list, since a perfect score from a tiny sample is not reliable yet. Check "New Ramen Places" if you want those instead.' },
            ],
          },
          {
            h2: 'Best rated vs. best for you',
            body: (
              <p>
                The single highest-rated spot in your area is a great default, but "best" can mean different
                things depending on what you are craving. I usually scan the top handful of results here, then
                layer on a broth filter — tonkotsu, miso, shoyu, or shio — so I am comparing the best options
                within the style I actually want that day, not just the single highest number on the page.
              </p>
            ),
          },
          {
            h2: 'Before you go',
            body: (
              <p>
                A high rank on this page is a strong starting point, not a guarantee. I always open the top two
                or three listings and skim the most recent reviews and photos before committing, and I stack
                "Open Now" so I am not driving to a spot that is closed. It takes thirty seconds and saves a
                wasted trip.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding the best ramen"
        tips={[
          'Trust the sort — it already orders the highest-rated, most-reviewed spots near you first.',
          'Skim the top two or three listings before you commit; recent reviews confirm the rating still holds up.',
          'Layer on a broth filter to find the best spot within the style you are actually craving.',
          'Stack "Open Now" before you leave so you never drive to a closed door.',
          'If the very top spot has a line, the next couple down are almost always excellent too.',
        ]}
        faqs={[
          { q: 'What is the best ramen near me?', a: 'The map above is sorted so the highest-rated ramen restaurants near you appear first, with review count as the tiebreaker. Enter your ZIP or tap "Use my location" to see the best bowl closest to you.' },
          { q: 'How do you decide what counts as "best"?', a: 'Rating first, review count as the tiebreaker, and a minimum review threshold so a perfect score from only a few reviews does not outrank a proven favorite with a strong track record across thousands.' },
          { q: 'Is the highest-rated spot always the right choice?', a: 'It is a strong default, but not the only answer — layer on a broth filter (tonkotsu, miso, shoyu, shio) to find the best option within the specific style you are craving, since "best overall" and "best for tonight" are not always the same restaurant.' },
          { q: 'What is the difference between "Best Ramen" and "Top Rated Ramen"?', a: 'They use the same underlying ranking — highest rating with a real review count behind it — just framed for how people search. Both surface the same proven, best-reviewed spots near you.' },
          { q: 'How do I make sure the best-rated spot is actually open?', a: 'Stack the "Open Now" filter on top of the ranking before you head out. Ratings do not expire, but hours change, so confirming open status takes a few seconds and saves a wasted trip.' },
        ]}
      />
    </main>
  )
}
