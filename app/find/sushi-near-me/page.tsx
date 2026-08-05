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
  title: 'Sushi Near Me | Find the Best Sushi Restaurants | RamenNearYou',
  description: 'Find sushi near you — sushi bars and Japanese restaurants serving fresh nigiri, rolls, and sashimi. Browse the best spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/sushi-near-me' },
  openGraph: {
    title: 'Sushi Near Me',
    description: 'Find sushi restaurants near you, sorted by rating and distance.',
    url: 'https://www.ramennearyou.com/find/sushi-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function SushiNearMePage() {
  const NATIONWIDE_FILTER = { initialFlags: ["sushi"] }
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
        initialFlags={['sushi']}
        pageTitle="Sushi Near Me"
        pageDescription="Showing sushi restaurants near you. Enter your ZIP or use your location to find one nearby, sorted by rating and distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Sushi Near Me" }]}
        title={`Sushi Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/sushi-near-me"
        heading="How I Find Great Sushi Near Me"
        intro={[
          'When I want sushi, I want it fresh, well cut, and served by someone who actually knows fish — the map above is filtered to sushi bars and Japanese restaurants near you, closest first once you enter your ZIP or tap "Use my location."',
          'Sushi quality varies a lot more than people expect between a grocery-store platter and a real sushi bar. Here is what I look for to tell the two apart before I ever sit down.',
        ]}
        sections={[
          {
            h2: 'What separates a great sushi spot from an average one',
            body: (
              <p>
                Rice is the real tell. Great sushi rice is seasoned, body-temperature, and holds together without
                being mushy or falling apart — if the rice is cold or bland, the fish quality almost never makes up
                for it. Beyond that, I look at how a place sources and handles fish: a real sushi bar can tell you
                what is fresh that day, and the case will look organized rather than picked-over.
              </p>
            ),
            points: [
              { h3: 'Omakase counters', text: 'Chef\'s-choice tasting menus are the best way to judge a sushi chef\'s actual skill and access to good fish.' },
              { h3: 'À la carte sushi bars', text: 'Order nigiri piece by piece to see how a kitchen handles rice temperature and knife work.' },
              { h3: 'Japanese restaurants with a sushi bar', text: 'Larger spots that run a dedicated sushi bar alongside the rest of the menu are usually serious about both.' },
            ],
          },
          {
            h2: 'How to order like a regular',
            body: (
              <p>
                I start with something simple and clean — like tamago or a piece of tai (sea bream) — to get a read
                on the rice and the cut before ordering anything more delicate. If the basics are handled well, I
                move into fattier cuts like toro or uni. Skip the soy-sauce drowning; a good piece of nigiri is
                already seasoned and shouldn&apos;t need much help.
              </p>
            ),
          },
          {
            h2: 'Reading reviews the right way',
            body: (
              <p>
                I look for reviews that specifically mention rice temperature, fish freshness, and how busy the
                sushi bar is (higher turnover usually means fresher fish). A wall of generic five-star reviews with
                no detail tells me a lot less than a handful of specific ones about the omakase or a particular cut.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding sushi near me"
        tips={[
          'Order nigiri à la carte on your first visit to judge rice temperature and knife work before committing to omakase.',
          'Look for restaurants with a dedicated sushi bar and a sushi chef visibly working the counter.',
          'Skip drowning nigiri in soy sauce — it is already seasoned; a light dip is plenty.',
          'Check recent reviews for specific mentions of fish freshness and rice quality, not just a star rating.',
          'Busy sushi bars usually mean higher fish turnover, which usually means fresher cuts.',
        ]}
        faqs={[
          { q: 'Where can I find sushi near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." It is filtered to sushi bars and Japanese restaurants near you serving nigiri, rolls, and sashimi.' },
          { q: 'What is omakase?', a: 'Omakase means "I leave it up to you" — a chef\'s-choice tasting menu where the sushi chef selects each piece based on what is freshest that day. It is the best way to judge a sushi chef\'s skill.' },
          { q: 'How do I know if sushi is fresh?', a: 'Look at the case — organized, well-stocked fish with clear labeling is a good sign. Reviews mentioning fish freshness and a busy sushi bar (higher turnover) are both strong signals.' },
          { q: 'Should I order rolls or nigiri?', a: 'Nigiri is the better test of a kitchen\'s skill since there is nowhere for the rice or fish quality to hide. Rolls are great too, but start with a few pieces of nigiri to judge the basics first.' },
          { q: 'Is it rude to dip nigiri in soy sauce?', a: 'A light dip (fish-side down) is fine, but nigiri is already seasoned by the chef, so drowning it in soy sauce covers up the flavor the kitchen intended.' },
        ]}
      />
    </main>
  )
}
