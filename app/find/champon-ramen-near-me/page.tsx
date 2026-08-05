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
  title: 'Champon Ramen Near Me | Nagasaki Noodle Soup | RamenNearYou',
  description: 'Find champon ramen near you — the Nagasaki specialty loaded with pork, seafood, and vegetables, simmered together with thick noodles in a milky one-pot broth.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/champon-ramen-near-me' },
  openGraph: {
    title: 'Champon Ramen Near Me',
    description: 'Find Nagasaki-style champon near you.',
    url: 'https://www.ramennearyou.com/find/champon-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ChamponRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["champon"] }
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
        initialFlags={['champon']}
        pageTitle="Champon Ramen Near Me"
        pageDescription="Showing champon near you. Enter your ZIP or use your location to find a bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Champon Ramen Near Me" }]}
        title={`Champon Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/champon-ramen-near-me"
        heading="My Guide to Finding Real Champon Ramen Near Me"
        intro={[
          'Champon is a Nagasaki specialty and one of the heartiest noodle-soup bowls in the Japanese repertoire — thick noodles, pork, seafood, and a pile of vegetables, all stir-fried together and then simmered directly in a milky chicken-and-pork broth in the very same pot. The map above is filtered to champon near you; enter your ZIP or tap "Use my location" to find the closest bowl.',
          'What makes champon distinct from classic ramen is the one-pot method: instead of cooking noodles separately and ladling broth over them, everything goes into the same pan — the meat and vegetables are stir-fried first, then the broth is added and the noodles finish cooking directly in it, soaking up flavor the whole time. The result is a thicker, more substantial bowl loaded with far more seafood and vegetables than a typical ramen.',
          'Here is what makes champon its own dish, how it differs from ramen more broadly, and how to order it well.',
        ]}
        sections={[
          {
            h2: 'What champon actually is',
            body: (
              <p>
                Champon originated in Nagasaki, developed for the city&apos;s Chinese immigrant community as
                an affordable, filling one-pot meal. Pork, squid, shrimp, fish cake, cabbage, bean sprouts,
                and other vegetables are stir-fried in a wok or large pan, then a chicken-and-pork bone stock
                is added along with thick, chewy noodles that finish cooking directly in the broth. Because
                everything cooks together in one pot, the broth ends up cloudier and more flavorful than a
                typical ramen stock, having absorbed the flavor of every ingredient simmered into it.
              </p>
            ),
            points: [
              { h3: 'One-pot cooking', text: 'Meat, seafood, and vegetables are stir-fried first, then broth and noodles are added to finish cooking together in the same pot — unlike ramen, where broth and noodles are typically prepared separately.' },
              { h3: 'Loaded with seafood and vegetables', text: 'A proper champon carries far more seafood (squid, shrimp, fish cake) and vegetables (cabbage, bean sprouts, carrot) than a standard ramen bowl.' },
              { h3: 'Thick, chewy noodles', text: 'Champon noodles are thicker than typical ramen noodles and are specifically made to hold up to finishing directly in the simmering broth.' },
            ],
          },
          {
            h2: 'How to order champon',
            body: (
              <p>
                Champon is meant to be a full, hearty meal on its own, so I do not usually add extra sides —
                the bowl is already loaded. If a shop offers a spicy version (pirikara champon), it is worth
                trying once you know the classic version, since the added chili plays well against the rich,
                seafood-forward broth. Eat it while it is hot; because the noodles finish cooking in the
                broth itself, champon holds its temperature differently than a standard ramen and is best
                enjoyed promptly.
              </p>
            ),
            points: [
              { h3: 'Order it as a full meal', text: 'Champon is already loaded with protein and vegetables — treat it as the whole meal rather than adding extra sides.' },
              { h3: 'Try the spicy version', text: 'Some shops offer a spicy (pirikara) champon — worth trying once you know the classic bowl, since the chili plays well against the rich seafood broth.' },
              { h3: 'Eat it hot', text: 'Because the noodles finish cooking directly in the broth, champon is best enjoyed right away rather than left to sit.' },
            ],
          },
        ]}
        tipsHeading="My champon tips"
        tips={[
          'Filter to champon, then sort by distance for the nearest bowl — it is the fastest starting point.',
          'Come hungry — champon is a full, hearty meal loaded with meat, seafood, and vegetables, not a light bowl.',
          'Ask about a spicy (pirikara) version if you want extra heat against the rich, seafood-forward broth.',
          'Read recent reviews for the word "champon" specifically, since it is a distinct Nagasaki dish and not every Japanese restaurant serves it.',
        ]}
        faqs={[
          { q: 'What is champon ramen?', a: 'Champon is a Nagasaki specialty where thick noodles, pork, seafood, and vegetables are stir-fried and then simmered together in the same pot as a milky chicken-and-pork broth, so the noodles cook directly in the soup.' },
          { q: 'Is champon the same as ramen?', a: 'They are closely related noodle-soup dishes, but champon is typically loaded with more seafood and vegetables, uses thicker noodles cooked directly in the broth, and has its own one-pot origin in Nagasaki, distinct from how most ramen is prepared.' },
          { q: 'Where does champon come from?', a: 'Champon originated in Nagasaki, developed for the city\'s Chinese immigrant community as an affordable, filling one-pot meal built from stir-fried meat, seafood, and vegetables finished in a chicken-and-pork broth.' },
          { q: 'Is champon spicy?', a: 'Classic champon is savory rather than spicy, but many shops offer a spicy version (pirikara champon) with added chili for heat.' },
          { q: 'How do I find champon near me?', a: 'The map above is filtered to champon. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then check menus and reviews to confirm the restaurant serves the Nagasaki-style dish.' },
        ]}
      />
    </main>
  )
}
