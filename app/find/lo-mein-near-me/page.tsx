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
  title: 'Lo Mein Near Me | Find the Best Lo Mein Restaurants | RamenNearYou',
  description: 'Find lo mein near you — Chinese restaurants and noodle houses serving soft, wok-tossed lo mein noodles. Browse the best spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/lo-mein-near-me' },
  openGraph: {
    title: 'Lo Mein Near Me',
    description: 'Find lo mein restaurants near you, sorted by rating and distance.',
    url: 'https://www.ramennearyou.com/find/lo-mein-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function LoMeinNearMePage() {
  const NATIONWIDE_FILTER = { initialFlags: ["lo-mein"] }
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
        initialFlags={['lo-mein']}
        pageTitle="Lo Mein Near Me"
        pageDescription="Showing Chinese restaurants near you likely to serve lo mein. Enter your ZIP or use your location to find one nearby, sorted by rating and distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Lo Mein Near Me" }]}
        title={`Lo Mein Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/lo-mein-near-me"
        heading="How I Find Great Lo Mein Near Me"
        intro={[
          'Lo mein is one of those dishes that is easy to get right and even easier to get mediocre — soft, wok-tossed egg noodles coated in a glossy soy-based sauce, with whatever protein and vegetables the kitchen does best. The map above is filtered to Chinese restaurants and noodle houses near you, closest first once you enter your ZIP or tap "Use my location."',
          'The difference between forgettable lo mein and a genuinely great plate almost always comes down to wok technique and noodle texture. Here is what I look for.',
        ]}
        sections={[
          {
            h2: 'What makes lo mein great',
            body: (
              <p>
                Good lo mein noodles are soft but never mushy, with just enough sauce to coat them without pooling
                at the bottom of the container — that pooling is usually a sign the noodles sat too long after
                being tossed. A hot wok and a fast hand matter more than a fancy ingredient list; a kitchen that
                gets the noodle texture right is usually getting everything else right too.
              </p>
            ),
            points: [
              { h3: 'Wok hei', text: 'That faint charred, smoky aroma from a properly hot wok is the single best sign of real wok technique.' },
              { h3: 'Noodle texture', text: 'Soft, springy, and lightly coated — not clumped, not swimming in sauce, not dry.' },
              { h3: 'Protein and vegetable balance', text: 'A great plate balances protein, cabbage, carrot, and scallion rather than burying everything in sauce.' },
            ],
          },
          {
            h2: 'Lo mein vs. other Chinese noodle dishes',
            body: (
              <p>
                Lo mein noodles are boiled first, then tossed with sauce off the boil — different from chow mein,
                where the noodles are pan-fried until some strands turn crisp. If you want soft, silky noodles, order
                lo mein; if you want a mix of soft and crispy texture, order chow mein instead.
              </p>
            ),
          },
          {
            h2: 'How I order it',
            body: (
              <p>
                I usually go for a protein I trust the kitchen to handle well — shrimp or beef, typically — and ask
                for it without too much sauce if I can, since the best versions are lightly coated rather than
                drenched. A side of chili oil or vinegar on the table is a good sign the kitchen expects you to
                season to taste rather than relying on a one-size-fits-all sauce.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for finding lo mein near me"
        tips={[
          'Look for a faint charred aroma (wok hei) on the noodles — it is the clearest sign of real wok technique.',
          'Avoid orders where sauce is pooling at the bottom of the container — the noodles likely sat too long.',
          'Order shrimp or beef lo mein first to judge how the kitchen balances protein and noodle texture.',
          'If you want some crispy texture instead of fully soft noodles, order chow mein instead.',
          'Check recent reviews for mentions of noodle texture specifically, not just overall taste.',
        ]}
        faqs={[
          { q: 'Where can I find lo mein near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." It is filtered to Chinese restaurants and noodle houses near you likely to serve lo mein.' },
          { q: 'What is the difference between lo mein and chow mein?', a: 'Lo mein noodles are boiled then tossed with sauce, giving a soft, silky texture. Chow mein noodles are pan-fried, so some strands turn crisp. Order lo mein for softness, chow mein for texture contrast.' },
          { q: 'What protein goes best with lo mein?', a: 'Shrimp, beef, and chicken are the most common and reliable choices — they hold up well to the wok-tossed noodles and soy-based sauce without overpowering it.' },
          { q: 'Is lo mein always vegetarian-friendly?', a: 'Not by default — most versions include meat or shrimp — but vegetable lo mein is a standard menu item at nearly every Chinese restaurant, so it is easy to order it meat-free.' },
          { q: 'What does "wok hei" mean?', a: 'Wok hei, literally "wok breath," is the faint smoky, charred aroma and flavor that comes from cooking over very high heat in a well-seasoned wok. It is considered the mark of a skilled wok cook.' },
        ]}
      />
    </main>
  )
}
