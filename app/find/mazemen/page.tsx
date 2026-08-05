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
  title: 'Mazemen Near Me | Brothless Ramen (Mazesoba) | RamenNearYou',
  description: 'Find mazemen near you — brothless ramen (mazesoba) you toss with a rich tare and toppings. What mazemen is, how to eat it, and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/mazemen' },
  openGraph: {
    title: 'Mazemen Near Me',
    description: 'Find brothless ramen (mazemen / mazesoba) near you.',
    url: 'https://www.ramennearyou.com/find/mazemen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function MazemenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["mazemen"] }
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
        initialBowls={['mazemen']}
        pageTitle="Mazemen Near Me"
        pageDescription="Showing mazemen (brothless ramen) near you. Enter your ZIP or use your location to find a bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Mazemen Near Me" }]}
        title={`Mazemen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/mazemen"
        heading="My Guide to Mazemen (Brothless Ramen) Near Me"
        intro={[
          'Mazemen flips ramen on its head: there is no soup. Instead, thick noodles are tossed with a concentrated tare, a glossy bit of oil, and a pile of bold toppings, so every strand is coated in intense flavor. The map above is filtered to mazemen near you; enter your ZIP or use your location to find the closest bowl.',
          'If you love the noodles and toppings more than the soup, mazemen might become your favorite. Here is what it is, how to eat it, and what to look for.',
        ]}
        sections={[
          {
            h2: 'What mazemen is',
            body: (
              <p>
                Mazemen (also called mazesoba, made famous in Nagoya as Taiwan mazesoba) means “mixed noodles.”
                Thick, chewy noodles are served with a small amount of intensely flavored tare and oil at the
                bottom of the bowl, topped with things like spicy ground pork, a raw or soft egg yolk, garlic,
                chives, nori, and scallion. You mix everything together vigorously so the noodles get fully
                coated — no broth required.
              </p>
            ),
            points: [
              { h3: 'No broth', text: 'A concentrated tare and oil coat the noodles instead of soup — bold, direct flavor in every bite.' },
              { h3: 'Thick, chewy noodles', text: 'Without soup to soak in, the noodles stay firm and toothsome, which is the whole point.' },
              { h3: 'Loaded toppings', text: 'Spicy minced pork, egg yolk, garlic, chives, and nori are classic; the toppings are the dish as much as the noodles.' },
            ],
          },
          {
            h2: 'How to eat mazemen',
            body: (
              <p>
                Mix it hard before you eat — really get in there and toss the noodles, tare, egg, and toppings
                until everything is coated and glossy. The flavor lives at the bottom of the bowl, so a gentle
                stir leaves you with bland noodles on top and a salty puddle below. Many shops also offer
                “oimeshi,” a scoop of rice you add to the leftover tare at the end to soak up every last bit.
              </p>
            ),
          },
          {
            h2: 'Why mazemen is great (and travels well)',
            body: (
              <p>
                Because there is no broth, mazemen is bold, fast, and surprisingly great for takeout and
                delivery — there is no soup to make the noodles soggy in transit. It is also a fun
                change-of-pace when you want maximum flavor and texture. I order it spicy with extra egg yolk,
                mix thoroughly, and finish with the rice add-on whenever it is offered.
              </p>
            ),
          },
        ]}
        tipsHeading="My mazemen tips"
        tips={[
          'Filter to “Mazemen,” then sort by distance for the nearest brothless bowl.',
          'Mix it vigorously — the concentrated flavor sits at the bottom and needs tossing through.',
          'Add the egg yolk and let it coat the noodles for richness.',
          'Finish with the rice add-on (oimeshi) to soak up the leftover tare.',
          'Great for takeout — no broth means the noodles stay perfect in transit.',
        ]}
        faqs={[
          { q: 'What is mazemen?', a: 'Mazemen (or mazesoba) is brothless ramen — thick noodles tossed with a concentrated tare, oil, and bold toppings like spicy pork, egg yolk, garlic, and chives. You mix everything so each strand is coated, no soup required.' },
          { q: 'How do you eat mazemen?', a: 'Mix it thoroughly before eating so the tare and toppings coat the noodles evenly. At the end, many shops offer a scoop of rice (oimeshi) to mix into the leftover tare.' },
          { q: 'Is mazemen the same as mazesoba?', a: 'They refer to the same brothless style. Mazesoba — especially Taiwan mazesoba from Nagoya — is a popular, spicy, garlicky version of mazemen.' },
          { q: 'Is mazemen good for takeout?', a: 'Yes — with no broth, the noodles will not get soggy in transit, making mazemen one of the best ramen styles to order for takeout or delivery.' },
          { q: 'How do I find mazemen near me?', a: 'The map above is filtered to mazemen. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
