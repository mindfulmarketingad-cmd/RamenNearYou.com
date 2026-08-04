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
  title: 'Ramen Shop Near Me | Find Local Ramen Shops | RamenNearYou',
  description: 'Find a ramen shop near you — browse local ramen-ya by rating, broth, hours, and distance. Discover the best ramen shops in your neighborhood.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-shop' },
  openGraph: {
    title: 'Ramen Shop Near Me',
    description: 'Find a ramen shop near you.',
    url: 'https://www.ramennearyou.com/find/ramen-shop',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenShopNearMePage() {
  const NATIONWIDE_FILTER = {  }
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
        pageTitle="Ramen Shop Near Me"
        pageDescription="Showing ramen shops near you sorted by rating and distance. Enter your ZIP or use your location to find the closest one."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Shop Near Me" }]}
        title={`Ramen Shop Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-shop-near-me"
        heading="How I Find a Great Ramen Shop Near Me"
        intro={[
          'A great ramen shop — a ramen-ya — does a few things obsessively well: a house-simmered broth, noodles with real bite, and consistency every time. The map above shows ramen shops near you sorted by rating and distance. Enter your ZIP or tap "Use my location" and the closest, best-rated options sort to the top so you can pick and go in under a minute.',
          'I have been hunting for great ramen shops for years, in every city I visit and every neighborhood I move through. What I have learned is that the best ramen shop near you is rarely the most famous one or the most expensive one — it is the one that has quietly earned a loyal local crowd by putting real care into the broth and the noodles day after day. The map is how I find those places.',
          'Here is how I pick a ramen shop, what to look for once I find one, and what to order on a first visit. These are the habits that have led me to the best bowls I have ever had, often in places I never would have discovered without looking at a map.',
          'The difference between a great ramen shop and a mediocre one almost always comes down to two things: the broth and the noodles. Everything else — the toppings, the decor, the ambiance — is secondary. A kitchen that simmers its broth in-house and sources or makes fresh noodles is doing the hard, slow work that cannot be faked, and that work shows up in every bowl they serve.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen shop?',
            body: (
              <p>
                The best ramen shops (ramen-ya) have a focused menu, house-made broth, and consistent quality
                across hundreds of reviews. Look for a spot where the kitchen is proud of one or two signature
                bowls — not a place trying to do everything from pad thai to pizza. A focused kitchen puts all of
                its energy into the thing it does best, and that focus is almost always reflected in the quality
                of the bowl. Counter seating, a steaming pot visible behind the pass, and a line forming before
                the kitchen even opens are all good signs that you are in the right place. A ramen shop that has
                earned its regulars through years of consistent, honest cooking is exactly the kind of place worth
                seeking out and returning to whenever you can.
              </p>
            ),
            points: [
              { h3: 'House-simmered broth', text: 'Made in-house from pork bones, chicken, dashi, or seafood — not poured from a bag. The hours of slow simmering are what build the body and depth that make a great broth impossible to fake.' },
              { h3: 'Focused menu', text: 'A few bowls done well beats a long menu done halfway. When a kitchen commits to mastering two or three broths, those broths become extraordinary over time.' },
              { h3: 'Consistent reviews', text: 'Many reviews praising the broth and noodles specifically signal a reliable kitchen. A 4.5 from three hundred diners over two years means the quality has held up through staff changes, busy weekends, and slow Tuesdays.' },
            ],
          },
          {
            h2: 'How to pick a ramen shop near you',
            body: (
              <p>
                I filter by rating first, then read the most recent reviews for mentions of broth, noodles, and
                consistency. A shop with a 4.5-star rating and 200 or more reviews is almost always a safe and
                satisfying bet. Check the hours in the listing before you go — many ramen shops close between
                lunch and dinner service for prep, and some sell out of broth on busy evenings. Those shops that
                sell out are doing it right: they make a fixed amount of broth each day from scratch, and when it
                is gone it is gone. That is a quality signal, not a flaw. Just call ahead if you are planning a
                Friday or Saturday night visit to make sure they will still be serving when you arrive.
              </p>
            ),
          },
          {
            h2: 'What to order on your first visit',
            body: (
              <p>
                Always start with the house signature bowl on your first visit — it is what the kitchen is most
                confident in and the dish that best represents what they are trying to do. Add the soft-boiled
                marinated egg (ajitama) if it is not already included; a well-made ajitama with a jammy yolk and a
                properly seasoned outer layer is one of the great pleasures of a ramen meal. If the shop offers
                gyoza made in-house, order a plate. If the menu offers noodle firmness choices, go firm (kata) on
                your first visit so the noodles hold up while you eat and explore the bowl. And eat it hot and fast
                — ramen waits for no one, and letting the noodles sit in the broth is the fastest way to turn a
                great bowl into a soggy one.
              </p>
            ),
          },
          {
            h2: 'Reading the listing before you commit',
            body: (
              <p>
                Sixty seconds with the listing can save you a disappointing trip. I look at three things in order:
                the photos, the recent reviews, and the hours. Photos of a glossy, well-built bowl tell me the
                kitchen cares about the final product. Recent reviews that specifically praise the broth or noodles
                (not just "great place" or "good service") tell me the kitchen is still executing at a high level
                right now. And confirmed hours — ideally cross-checked with a quick call on a busy night — mean I
                will not show up to a dark kitchen. These three checks take under a minute and make every ramen
                trip more reliable.
              </p>
            ),
            points: [
              { h3: 'Bowl photos', text: 'A carefully built, photogenic bowl in the listing photos usually means a kitchen that cares about every detail of the dish they are sending out.' },
              { h3: 'Specific recent praise', text: 'Reviews that name the broth, the noodles, or a specific topping are worth ten times more than a generic five-star comment. Specific praise means the reviewer actually paid attention to the food.' },
              { h3: 'Confirmed hours', text: 'Many ramen shops have split service and close between lunch and dinner. Confirming hours before you make the trip is the single easiest way to avoid frustration.' },
            ],
          },
        ]}
        tipsHeading="My tips for finding a ramen shop"
        tips={[
          'Sort by rating and look for 4.5 stars with 100 or more reviews — a reliable signal of a consistent kitchen that delivers night after night.',
          'Read recent reviews for specific praise of the broth and noodles, not just generic "great food" comments; specificity means the reviewer actually noticed the craft.',
          'Check hours before going — many ramen shops close between lunch and dinner and some sell out of broth on busy evenings; calling ahead on weekends is worth it.',
          'Order the house signature bowl on your first visit so you taste the kitchen at its most confident and intentional.',
          'Eat it hot; ramen loses its texture and flavor as it cools, and noodles sitting in hot broth quickly go from perfectly firm to soft and waterlogged.',
          'Ask for your noodles firm (kata) if the shop offers a firmness option — they will hold up longer in the broth while you eat.',
          'Use the "Open Now" filter before heading out the door to confirm the kitchen is actually serving at this moment, not between service periods.',
          'If the shop makes gyoza in-house, order them — a kitchen that takes its dumplings as seriously as its noodles is one worth remembering.',
        ]}
        faqs={[
          { q: 'How do I find a ramen shop near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." Ramen shops near you are sorted by rating and distance. Filter by broth, hours, or price to narrow it down to exactly what you are in the mood for.' },
          { q: 'What is a ramen shop called in Japanese?', a: 'A ramen shop is called a ramen-ya in Japanese. The "ya" suffix means shop or place, so ramen-ya literally means "ramen place." It is the format most serious ramen enthusiasts seek out — focused, often counter-style, and built around the noodles and broth.' },
          { q: 'What makes a ramen shop different from a ramen restaurant?', a: 'A ramen shop (ramen-ya) typically has a focused menu, counter seating, and a fast, casual atmosphere built entirely around the bowl. A ramen restaurant may have a broader menu, table service, and a more relaxed pace. Neither is better — the right choice depends on what you are looking for.' },
          { q: 'What broth should I order at a ramen shop?', a: 'On a first visit, order whatever the shop is known for — their signature bowl. If you are genuinely unsure, tonkotsu and shoyu are the two most widely available and universally popular styles and a reliable starting point at almost any ramen shop.' },
          { q: 'Do ramen shops take reservations?', a: 'Most dedicated ramen shops do not take reservations and run on a first-come, first-served basis. Arriving at opening or during off-peak hours is the best way to avoid a wait. The "Takes Reservations" filter on the map helps you find spots where booking ahead is an option.' },
          { q: 'Why do some ramen shops sell out of broth?', a: 'Shops that sell out are making their broth in small, fresh batches from scratch each day. When the batch runs out, service ends. This is actually a quality signal — it means the kitchen is not supplementing with a premade base to stretch production.' },
          { q: 'What is ajitama and should I order it?', a: 'Ajitama is a soft-boiled egg that has been marinated in a soy-based tare, giving it a savory, slightly sweet flavor and a jammy, custardy yolk. It is one of the great pleasures of a ramen meal and worth adding if it is not already included in your bowl.' },
          { q: 'What does "kata" mean when ordering ramen noodles?', a: 'Kata means firm in Japanese. When a ramen shop offers noodle firmness options, ordering kata gives you noodles with more bite that hold up longer in the hot broth. It is my default on a first visit, especially if I plan to take my time with the bowl.' },
        ]}
      />
    </main>
  )
}
