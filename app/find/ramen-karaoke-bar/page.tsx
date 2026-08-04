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
  title: 'Ramen Karaoke Bar Near Me | Ramen, Drinks & Karaoke | RamenNearYou',
  description: 'Find a ramen karaoke bar near you — spots that pair hot bowls of ramen with drinks and karaoke for a full night out. How to find one and what to expect.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-karaoke-bar' },
  openGraph: {
    title: 'Ramen Karaoke Bar Near Me',
    description: 'Find ramen, drinks, and karaoke near you.',
    url: 'https://www.ramennearyou.com/find/ramen-karaoke-bar',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenKaraokeBarPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["full-bar"] }
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
        initialFlags={['full-bar']}
        pageTitle="Ramen Karaoke Bar Near Me"
        pageDescription="Showing ramen spots with a bar near you — the best candidates for a ramen, drinks, and karaoke night. Enter your ZIP or use your location to find one nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Karaoke Bar Near Me" }]}
        title={`Ramen Karaoke Bar Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-karaoke-bar"
        heading="How I Find a Ramen Karaoke Bar Near Me"
        intro={[
          'A ramen karaoke bar is a perfect night out — hot noodles, cold drinks, and a mic. The map above is filtered to ramen spots with a bar near you, which are your best bet for an izakaya-style night that pairs bowls with karaoke. Enter your ZIP or tap “Use my location” to find one close by.',
          'True ramen-plus-karaoke spots are a niche, often found in izakaya and Japanese pubs, so here is how I track them down and make the most of the night.',
        ]}
        sections={[
          {
            h2: 'What is a ramen karaoke bar?',
            body: (
              <p>
                It is exactly what it sounds like — a spot where you can order ramen and small plates, drink sake,
                beer, or highballs, and sing. Many are izakaya (Japanese pubs) or Japanese bars that serve noodles
                late and have private karaoke rooms or a stage. The combination is hugely popular in Japan and
                growing in US cities with strong Japanese dining scenes.
              </p>
            ),
            points: [
              { h3: 'Food + drinks + a mic', text: 'Ramen and small plates alongside a real drink list and karaoke.' },
              { h3: 'Izakaya energy', text: 'Most are pub-style spots built for lingering, sharing, and late nights.' },
              { h3: 'Private rooms or a stage', text: 'Some offer private karaoke rooms; others have an open mic in the bar.' },
            ],
          },
          {
            h2: 'How to find one near you',
            body: (
              <p>
                This page starts with the “Full Bar” filter, since a real drink program is the common thread of
                karaoke spots. From there, open listings and check the photos and reviews for mentions of karaoke,
                private rooms, or izakaya vibes. Adding “Open Late” helps too — karaoke nights run long.
              </p>
            ),
          },
          {
            h2: 'Making a night of it',
            body: (
              <p>
                I treat a ramen karaoke bar like a one-stop night: start with drinks and small plates, sing a
                round, then close it out with a hot bowl of ramen before heading home. Bring a group, grab a
                private room if they have one, and pace yourself — the ramen at the end is the perfect finale.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen karaoke night tips"
        tips={[
          'Start with the “Full Bar” filter (already on), then check reviews for karaoke mentions.',
          'Add “Open Late” — karaoke nights tend to run long.',
          'Look for izakaya and Japanese pubs; they most often pair ramen with karaoke.',
          'Bring a group and ask about private rooms when you book.',
          'Save the ramen for the end of the night — it is the perfect finale.',
        ]}
        faqs={[
          { q: 'What is a ramen karaoke bar?', a: 'A ramen karaoke bar serves ramen and small plates alongside drinks and karaoke — often an izakaya or Japanese pub with private karaoke rooms or a stage.' },
          { q: 'How do I find a ramen karaoke bar near me?', a: 'The map above is filtered to ramen spots with a full bar, your best candidates for karaoke. Open listings and check reviews and photos for karaoke or izakaya mentions, and add “Open Late” for the full experience.' },
          { q: 'Are ramen karaoke bars common in the US?', a: 'They are a niche but growing, most often found in cities with strong Japanese dining scenes. Izakaya and Japanese pubs are the most likely places to find ramen and karaoke together.' },
          { q: 'What should I order at a ramen karaoke bar?', a: 'Start with drinks and small plates like gyoza or karaage while you sing, then finish the night with a hot bowl of ramen.' },
          { q: 'Are ramen karaoke bars good for groups?', a: 'Yes — they are built for groups. Look for spots with private karaoke rooms and bring friends to share plates and songs.' },
        ]}
      />
    </main>
  )
}
