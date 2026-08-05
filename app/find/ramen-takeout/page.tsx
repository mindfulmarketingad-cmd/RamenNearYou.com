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
  title: 'Ramen Takeout Near Me | Order Ramen To Go | RamenNearYou',
  description: 'Find ramen restaurants offering takeout near you. See which shops pack broth and noodles separately, how to assemble a to-go bowl at home, and what travels best.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-takeout' },
  openGraph: {
    title: 'Ramen Takeout Near Me',
    description: 'Find ramen restaurants offering takeout near you — order tonkotsu, miso, shoyu, and more to go.',
    url: 'https://www.ramennearyou.com/find/ramen-takeout',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenTakeoutPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["takeout"] }
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
        initialFlags={['takeout']}
        pageTitle="Ramen Takeout Near Me"
        pageDescription="Find ramen restaurants offering takeout near you. Enter your ZIP code to browse spots you can order to go."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Takeout Near Me" }]}
        title={`Ramen Takeout Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-takeout"
        heading="How I Order Ramen Takeout That Still Tastes Like the Shop Made It"
        guideLink={{
          href: '/blog/how-to-eat-ramen-noodles-the-right-way',
          title: 'How To Eat Ramen Noodles The Right Way',
          blurb: 'The order of operations that makes any bowl — including a to-go one — taste better.',
        }}
        intro={[
          'Takeout is how I eat most of my ramen, and it took me an embarrassing number of soggy bowls to work out that the restaurant matters more than the recipe. The map above is filtered to shops near you that offer takeout — enter your ZIP or tap “Use my location” and the closest ones sort to the top.',
          'The thing nobody tells you is that ramen is actively cooking the entire ride home. Noodles sitting in hot broth keep absorbing it, so a bowl that was perfect at the counter can be mush ten minutes later. Everything below is about beating that clock.',
        ]}
        sections={[
          {
            h2: 'Takeout vs. delivery: pick up if you can',
            body: (
              <p>
                If a shop is close, picking up beats delivery almost every time. You cut out the courier
                wait, the bag sitting on a warmer, and the multi-stop route — often 15 to 25 minutes of
                extra noodle-soaking. When I have the choice between a delivery order arriving in 40
                minutes and a 10-minute drive, I drive. The bowl is measurably better.
              </p>
            ),
            points: [
              { h3: 'You control the clock', text: 'Order ahead, arrive as it is bagged, and eat within minutes. That is as close to counter-fresh as a to-go bowl gets.' },
              { h3: 'Nothing sits under a heat lamp', text: 'Pickup orders are handed over the moment they are made. Delivery orders often wait for a driver, and the noodles pay for it.' },
              { h3: 'No platform markup', text: 'Ordering direct usually costs less than a third-party app and sends more of the money to the shop.' },
            ],
          },
          {
            h2: 'What separates a good takeout shop from a bad one',
            body: (
              <p>
                One detail predicts quality better than anything else: whether the kitchen packs the bowl as
                components or as a finished bowl. A shop that seals the broth in its own container, bags the
                noodles dry, and boxes the toppings separately is telling you it cares what the bowl tastes
                like when you open it. A shop that ladles everything into one container is not.
              </p>
            ),
            points: [
              { h3: 'Separated components', text: 'Broth apart from noodles is the whole ballgame. Ask when you order — most shops will do it if you request it, even when it is not the default.' },
              { h3: 'Noodle thickness', text: 'Thick, wavy noodles survive a trip far better than ultra-thin Hakata strands, which go soft in minutes. If the shop only does thin noodles, eat in or order it firm.' },
              { h3: 'Order it firm', text: 'Many shops let you specify noodle firmness. Ordering katamen (firm) buys you several minutes of margin on the ride home.' },
            ],
          },
          {
            h2: 'What to order when it is going in a bag',
            body: (
              <p>
                Some styles are simply built for travel. Brothless bowls are the obvious pick — there is no
                soup for the noodles to drown in — but a few soup styles hold up well when packed properly.
              </p>
            ),
            points: [
              { h3: 'Mazemen and abura soba', text: 'Brothless by design. You mix them at home anyway, so takeout changes nothing about how they are meant to be eaten.' },
              { h3: 'Tsukemen', text: 'Dipping ramen already arrives with the noodles and broth separate — the format is functionally takeout-native.' },
              { h3: 'Tonkotsu and miso', text: 'Rich, fatty broths hold heat longer than clear ones, so they are the most forgiving soup styles for a to-go order.' },
              { h3: 'Skip delicate shio', text: 'Light, clear broths cool fastest and their thin noodles soak quickest. Those are worth sitting down for.' },
            ],
          },
          {
            h2: 'Assembling a to-go bowl at home',
            body: (
              <p>
                Reheat the broth on the stove until it is just about to simmer — not the microwave, and not
                the whole bowl. Loosen the noodles, put them in your own bowl, pour the hot broth over them,
                and add the toppings last so they stay fresh instead of steamed. The whole thing takes about
                two minutes and it is the difference between a good bowl and a disappointing one.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen takeout cheat sheet"
        tips={[
          'Filter the map to “Takeout,” then sort by distance — a shorter trip is the single biggest quality lever.',
          'Ask for the broth and noodles packed separately. Most shops will, and it changes everything.',
          'Order noodles firm (katamen) when the shop offers it, to buy margin on the ride home.',
          'Reheat the broth to steaming on the stove, then pour it over the noodles in your own bowl.',
          'Add the egg, nori, and scallions yourself at the end so the toppings taste fresh.',
          'Default to mazemen or tsukemen if the shop makes them — they are effectively travel-proof.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants near me offer takeout?', a: 'The map above is filtered to restaurants that offer takeout. Enter your ZIP code or tap “Use my location” to sort the closest ones to the top, then open any listing to see hours, menu, and how to order.' },
          { q: 'Does ramen hold up as takeout?', a: 'Yes, if the shop packs it as components. Noodles keep absorbing hot broth in transit, so the bowls that survive are the ones where the broth, noodles, and toppings ride in separate containers and you combine them at home.' },
          { q: 'Is takeout better than delivery for ramen?', a: 'Usually. Pickup removes the courier wait and any multi-stop route, which is often 15 to 25 minutes of extra soaking time. If the shop is close, driving there almost always produces a better bowl.' },
          { q: 'What is the best ramen to order for takeout?', a: 'Brothless styles like mazemen and abura soba, or tsukemen, which already comes with noodles and dipping broth separated. Among soup styles, rich tonkotsu and miso hold heat best; delicate shio is worth eating in.' },
          { q: 'How do I reheat takeout ramen?', a: 'Heat the broth alone on the stove until it is nearly simmering, then pour it over the loosened noodles in your own bowl and add toppings last. Avoid microwaving a fully assembled bowl — it makes soft noodles softer.' },
          { q: 'Can I order takeout ramen for a group?', a: 'Yes, and it works well when components are packed separately so everyone assembles and tops their own bowl. Call ahead for larger orders so the kitchen can time the noodles rather than cooking them all early.' },
        ]}
      />
    </main>
  )
}
