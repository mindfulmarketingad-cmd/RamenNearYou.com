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
  title: 'Black Garlic Ramen Near Me | Mayu Ramen | RamenNearYou',
  description: 'Find black garlic ramen near you — bowls finished with mayu, the toasted black garlic oil that adds smoky, nutty depth. What it is and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/black-garlic-ramen' },
  openGraph: {
    title: 'Black Garlic Ramen Near Me',
    description: 'Find smoky, nutty black garlic (mayu) ramen near you.',
    url: 'https://www.ramennearyou.com/find/black-garlic-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function BlackGarlicRamenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["black-garlic"] }
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
        initialBowls={['black-garlic']}
        pageTitle="Black Garlic Ramen Near Me"
        pageDescription="Showing black garlic (mayu) ramen near you. Enter your ZIP or use your location to find a smoky, nutty bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Black Garlic Ramen Near Me" }]}
        title={`Black Garlic Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/black-garlic-ramen"
        heading="Where I Find Black Garlic Ramen Near Me"
        intro={[
          'Black garlic ramen was a revelation the first time I tried it — that dark swirl of toasted garlic oil on top of a rich bowl adds a smoky, nutty, almost bittersweet depth you cannot get any other way. The map above is filtered to black garlic ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'The magic ingredient is mayu, and once you know what it is, you will start craving it. Here is what black garlic ramen actually is and how I order it.',
        ]}
        sections={[
          {
            h2: 'What makes it black: mayu',
            body: (
              <p>
                The signature comes from mayu — black garlic oil made by slowly cooking garlic in oil until it
                turns deep black and develops a toasted, nutty, smoky flavor without the harsh bite of raw
                garlic. A spoonful is swirled over the broth (most often a rich tonkotsu), turning it dark and
                adding an intense aromatic depth. It is a Kyushu specialty and a hallmark of Kumamoto-style ramen.
              </p>
            ),
            points: [
              { h3: 'Mayu (black garlic oil)', text: 'Garlic slowly cooked until black, then blended into oil — smoky, nutty, and deeply aromatic without raw-garlic harshness.' },
              { h3: 'Usually over tonkotsu', text: 'Black garlic most often tops a creamy pork-bone broth, where its smoky depth plays against the richness.' },
              { h3: 'Kumamoto roots', text: 'This style is associated with Kumamoto on Kyushu, where mayu-topped tonkotsu is the regional signature.' },
            ],
          },
          {
            h2: 'What it tastes like',
            body: (
              <p>
                Black garlic ramen tastes like tonkotsu turned up a notch — the same creamy richness, but with a
                roasted, smoky, slightly bittersweet edge that lingers. The mayu cuts through the fat and adds
                complexity, so the bowl feels deeper and more savory. If you love garlic and bold flavors, this
                is the bowl for you.
              </p>
            ),
          },
          {
            h2: 'How I order black garlic ramen',
            body: (
              <p>
                I order it over tonkotsu when I can, add a soft egg, and resist the urge to stir the mayu in all
                at once — I like to mix it in gradually so the flavor builds. If the shop offers extra garlic or
                chili oil, a little more amplifies the bowl without overwhelming it. Stack “Top Rated” to find
                the shops doing it best.
              </p>
            ),
          },
        ]}
        tipsHeading="My black garlic ramen tips"
        tips={[
          'Filter to “Black Garlic,” then sort by distance for the nearest smoky bowl.',
          'Order it over a tonkotsu base where possible — the richness and mayu are a classic match.',
          'Mix the black garlic oil in gradually so the flavor builds rather than overwhelming the bowl.',
          'Add a soft egg, and a little extra chili oil if you want more depth.',
          'Stack “Top Rated” to find the shops doing mayu best.',
        ]}
        faqs={[
          { q: 'What is black garlic ramen?', a: 'It is ramen finished with mayu — black garlic oil made by slowly cooking garlic until it turns black and develops a smoky, nutty flavor. The dark oil is swirled over the broth, usually a rich tonkotsu.' },
          { q: 'What does black garlic ramen taste like?', a: 'Like tonkotsu with an extra dimension — creamy and rich, plus a roasted, smoky, slightly bittersweet depth from the black garlic oil that lingers and cuts the fat.' },
          { q: 'Is black garlic ramen very garlicky?', a: 'It is deeply aromatic but not harsh. Cooking the garlic until black mellows the sharp raw bite into a smoky, nutty flavor, so it reads as rich and toasty rather than pungent.' },
          { q: 'Where does black garlic ramen come from?', a: 'The mayu-topped style is associated with Kumamoto on the island of Kyushu, where black garlic oil over tonkotsu is a regional signature.' },
          { q: 'How do I find black garlic ramen near me?', a: 'The map above is filtered to black garlic. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
