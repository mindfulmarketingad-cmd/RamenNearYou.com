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
  title: 'Cheap Ramen Near Me | Ramen Under $15 | RamenNearYou',
  description: 'Find cheap ramen near you — great bowls under about $15. How to eat well on a budget, where the value is, and the order tweaks that keep the check down.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/cheap-ramen' },
  openGraph: {
    title: 'Cheap Ramen Near Me',
    description: 'Find great, budget-friendly ramen under about $15 near you.',
    url: 'https://www.ramennearyou.com/find/cheap-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function CheapRamenPage() {
  const NATIONWIDE_FILTER = { initialPrices: ["budget"] }
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
        initialPrices={['budget']}
        pageTitle="Cheap Ramen Near Me"
        pageDescription="Showing budget-friendly ramen spots. Enter your ZIP or use your location to find a great bowl under about $15 near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Cheap Ramen Near Me" }]}
        title={`Cheap Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/cheap-ramen"
        heading="How I Eat Great Ramen on a Budget"
        intro={[
          'Ramen started as humble, affordable food, and the good news is plenty of shops still keep it that way. The map above is filtered to budget-friendly ramen near you — solid bowls in the under-about-$15 range. Enter your ZIP or use your location to find cheap eats close by.',
          'Cheap does not have to mean worse. Some of the most satisfying bowls I have had cost less than a fast-food combo. Here is where the value tends to hide, and the small ordering tweaks that keep your check down without killing the experience.',
        ]}
        sections={[
          {
            h2: 'Where the cheap, great bowls hide',
            body: (
              <p>
                Value ramen tends to cluster in a few places: no-frills counter shops focused on a single broth,
                spots near colleges feeding hungry students, and strip-mall restaurants with low overhead. These
                kitchens put the money in the bowl, not the décor — which is exactly what you want when you are
                eating on a budget.
              </p>
            ),
            points: [
              { h3: 'Counter-style shops', text: 'Low overhead and fast turnover keep prices down while the noodles stay serious.' },
              { h3: 'College-area spots', text: 'Places that feed students compete hard on price, so portions and value are usually strong.' },
              { h3: 'Lunch specials', text: 'Weekday lunch sets are often the cheapest way to eat at an otherwise pricier shop.' },
            ],
          },
          {
            h2: 'Ordering tweaks that keep the check down',
            body: (
              <p>
                The base bowl is almost always the best value — the price climbs fast once you stack premium
                toppings and extra chashu. I order the standard bowl, skip the add-ons I do not need, and lean
                on free or cheap extras like the bean sprouts, garlic, or pickled ginger many shops leave on the
                counter. Water instead of a soda saves a few dollars too, and a single hearty bowl is genuinely
                filling on its own.
              </p>
            ),
          },
          {
            h2: 'Cheap ramen that still tastes great',
            body: (
              <p>
                Budget bowls actually shine in certain styles. A simple shoyu or a classic tonkotsu does not need
                expensive toppings to be delicious — the broth does the work. To make sure cheap also means good,
                I stack the “Top Rated” filter with this one, which surfaces the spots that deliver real quality
                at a low price rather than just being inexpensive.
              </p>
            ),
          },
        ]}
        tipsHeading="My budget ramen tips"
        tips={[
          'Filter to budget pricing, then stack “Top Rated” to find cheap bowls that are actually great.',
          'Order the base bowl — premium toppings and extra chashu are where the price climbs.',
          'Look for weekday lunch specials, often the cheapest way into a pricier shop.',
          'Use the free counter extras (sprouts, garlic, pickled ginger) and drink water to save a few dollars.',
          'College-area and counter-style spots tend to offer the best value.',
        ]}
        faqs={[
          { q: 'Where can I find cheap ramen near me?', a: 'The map above is filtered to budget-friendly spots, generally under about $15 a bowl. Enter your ZIP or tap “Use my location” to find cheap ramen close by.' },
          { q: 'Is cheap ramen any good?', a: 'It can be excellent. Ramen began as affordable food, and many counter shops still serve serious bowls at low prices. Stack “Top Rated” to find cheap spots that are genuinely great.' },
          { q: 'How do I keep a ramen bill low?', a: 'Order the base bowl, skip premium add-ons, use free counter extras like sprouts and garlic, and drink water. A single hearty bowl is filling on its own.' },
          { q: 'What is the cheapest way to eat at a nicer ramen shop?', a: 'Look for weekday lunch sets — they are often the most affordable way into an otherwise pricier restaurant.' },
          { q: 'Which ramen styles are best on a budget?', a: 'Simple shoyu and classic tonkotsu deliver big flavor without expensive toppings, since the broth does the heavy lifting.' },
        ]}
      />
    </main>
  )
}
