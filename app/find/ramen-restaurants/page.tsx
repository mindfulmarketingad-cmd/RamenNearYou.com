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
  title: 'Ramen Restaurants Near Me | Find the Best Ramen | RamenNearYou',
  description: 'Find ramen restaurants near you on an interactive map. Filter by broth, price, hours, and amenities to find the best bowl — plus how I judge a great ramen shop.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-restaurants' },
  openGraph: {
    title: 'Ramen Restaurants Near Me',
    description: 'Find the best ramen restaurants near you on an interactive map.',
    url: 'https://www.ramennearyou.com/find/ramen-restaurants',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenRestaurantsPage() {
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
        pageTitle="Ramen Restaurants Near Me"
        pageDescription="Browse ramen restaurants near you on the map. Enter your ZIP or use your location, then filter by broth, price, and hours."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Restaurants Near Me" }]}
        title={`Ramen Restaurants Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-restaurants"
        heading="How I Find the Best Ramen Restaurants Near Me"
        intro={[
          'Whether you are new to ramen or chasing your next favorite bowl, the map above is the fastest way to see every ramen restaurant near you at once. Enter your ZIP or tap "Use my location," and the closest spots sort to the top with ratings, hours, and photos so you can decide in seconds. I use this exact tool every time I am in an unfamiliar neighborhood and need a reliable bowl fast.',
          'Over years of eating ramen everywhere I can, I have developed a quick mental checklist for separating a truly great shop from a forgettable one. The difference between a ramen restaurant that earns a regular and one you visit once is almost always in the broth and the noodles — and those signals show up clearly in the ratings, photos, and reviews attached to each listing on the map.',
          'Here is how I read the map, what I look for in a restaurant, and how to use the filters to find exactly the bowl you are in the mood for. Whether you want a rich tonkotsu on a cold night, a light shio at lunch, or the highest-rated spot within two miles, a few taps get you there.',
          'I have eaten at counter ramen-ya with six seats and sprawling Japanese restaurants with full sushi bars, and the best bowl does not always come from the fanciest address. Some of the most memorable ramen I have had came from a strip-mall shop with a focused two-item menu and a line out the door at noon. The map helps you find both kinds.',
        ]}
        sections={[
          {
            h2: 'What separates a great ramen restaurant',
            body: (
              <p>
                A great ramen shop usually does a few things obsessively well rather than offering everything.
                I look for a focused menu — a kitchen that specializes in one or two broth styles tends to nail
                them consistently — fresh noodles with real bite, and broth with genuine depth rather than a flat,
                salt-forward shortcut. Ratings and recent reviews on each listing are a quick proxy, but the
                tell is consistency: lots of reviews and still a high score means the kitchen delivers night after
                night, not just on a lucky Tuesday. A ramen restaurant that has earned 4.5 stars across five hundred
                reviews is almost always a safer bet than a 5.0 from twelve. The volume proves the kitchen can
                repeat the performance.
              </p>
            ),
            points: [
              { h3: 'A focused menu', text: 'Shops that specialize in one or two broths usually execute them far better than do-everything kitchens. When the menu is short, the kitchen has committed to mastering what is on it.' },
              { h3: 'Noodle quality', text: 'Fresh, springy noodles with bite are a hallmark of a shop that cares — they make or break the bowl. A noodle that goes limp the moment it hits the broth tells you everything you need to know about how seriously the kitchen takes its craft.' },
              { h3: 'Broth depth', text: 'Real, layered broth beats a thin, oversalted one every time. A good broth has been simmered for hours from quality bones or dashi, and that time investment is impossible to fake. High ratings across many reviews signal the consistency that comes from doing that work daily.' },
            ],
          },
          {
            h2: 'Using the filters to find your bowl',
            body: (
              <p>
                The filter bar above the map is where this gets powerful. Crave something specific? Add a broth
                like tonkotsu, miso, shoyu, or shio. Watching the budget? Add a price range. On a schedule? Add
                "Open Now." Out with the family or want a patio? Those filters are there too. Everything
                combines, so you can dial in from "all ramen near me" to "the exact bowl I want right now." I
                rarely leave more than two or three filters on at once — broth plus price is usually enough to
                surface a short list I can scan quickly. Adding "Open Now" is the one I never skip when I am
                already heading out the door, because there is nothing worse than pulling into a parking lot and
                finding the kitchen closed.
              </p>
            ),
          },
          {
            h2: 'Reading a listing before you go',
            body: (
              <p>
                Tap any spot to see its rating, hours, photos, and amenities, then open the full listing for
                the menu, directions, and the option to order. I skim the most recent reviews and the photos first.
                Fresh, glowing reviews and bowls that look carefully built — a glossy broth with visible depth, noodles
                properly portioned, toppings placed with care — are reliable signs you are about to have a good one.
                I also check whether reviewers specifically praise the broth and noodles, not just the vibe or the
                service. A place people love for the atmosphere but never mention the bowl is worth a second look
                before committing. From there it is one tap to directions or to order.
              </p>
            ),
          },
          {
            h2: 'Ramen restaurant vs. ramen shop',
            body: (
              <p>
                People search for ramen restaurants and ramen shops interchangeably, but there is a loose distinction
                worth knowing. A ramen shop — or ramen-ya — tends to be a focused, often counter-style spot built
                around one or two signature broths. A ramen restaurant is typically larger, may have table service,
                and often serves a broader menu with rice bowls, gyoza, sushi, or other Japanese dishes alongside
                the noodles. Neither is inherently better. I go to a focused ramen-ya when I want the purest bowl
                and a more complete Japanese restaurant when I am eating with a group that wants variety. The map
                covers both, so filter by your mood and your company.
              </p>
            ),
            points: [
              { h3: 'Ramen-ya (focused shop)', text: 'Counter seating, a short menu, and a kitchen fully committed to the noodles and broth. The purist choice.' },
              { h3: 'Japanese restaurant', text: 'Broader menu, table service, and more variety. Great for groups with different tastes or when you want ramen and sushi in one stop.' },
              { h3: 'Izakaya', text: 'A Japanese pub with small plates, drinks, and often a ramen section. Ideal for a relaxed meal that goes beyond just the bowl.' },
            ],
          },
          {
            h2: 'When to go and how to beat the wait',
            body: (
              <p>
                Popular ramen restaurants fill up fast, especially on weekend evenings and during the lunch rush.
                My two favorite strategies: arrive right at opening, when the broth is fresh and the kitchen is
                at full energy, or come during the mid-afternoon lull between 2pm and 5pm when most ramen spots
                are quieter. If a restaurant takes reservations — filter for that above the map — book ahead on
                busy nights. Some shops sell out of broth early on popular days, so calling ahead on a Friday or
                Saturday night is worth thirty seconds of your time.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for picking a ramen restaurant"
        tips={[
          'Set your location so the nearest spots sort to the top with live distances — starting from what is close saves time and gas.',
          'Favor shops with a focused menu over sprawling kitchens; specialists usually make better broth and noodles because they have committed to mastering a few bowls.',
          'Check that a high rating holds up across many reviews; a 4.5 from five hundred diners proves consistency far better than a 5.0 from ten.',
          'Stack broth, price, and hours filters to narrow to exactly what you are craving without scrolling through irrelevant spots.',
          'Skim recent reviews and photos on the listing before committing to the trip; look for specific praise of the broth and noodles, not just the atmosphere.',
          'Add "Open Now" before you walk out the door so you never arrive at a closed kitchen — many ramen shops have split hours and close between lunch and dinner.',
          'Arrive at opening or during the mid-afternoon lull to avoid the longest waits at popular spots; the broth is also freshest right after a kitchen opens.',
          'If a shop offers a lunch special, it is often the single best value on the menu — the same quality bowl at a lower price with a smaller side included.',
        ]}
        faqs={[
          { q: 'How do I find ramen restaurants near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" and the closest ramen restaurants sort to the top with ratings, hours, and photos. From there you can filter by broth type, price range, and hours to narrow down to exactly what you want.' },
          { q: 'What makes a ramen restaurant good?', a: 'A focused menu, fresh noodles with real bite, and broth with genuine depth are the three things I look for first. A high rating that holds up across many reviews is the best quick signal of consistency — it means the kitchen delivers night after night, not just on a lucky evening.' },
          { q: 'Can I filter ramen restaurants by broth or price?', a: 'Yes. The filter bar above the map lets you combine broth type, price range, hours, and amenities to narrow from all nearby spots to the exact bowl you want. I usually stack two or three filters at most — broth plus price gets you most of the way there.' },
          { q: 'How do I choose between two ramen spots?', a: 'Open each listing and compare recent reviews, photos, hours, and amenities. Fresh, glowing reviews and carefully built bowls in the photos are reliable tiebreakers. I also check whether reviewers specifically mention the broth and noodles, not just the vibe.' },
          { q: 'Are the ramen restaurants on the map open now?', a: 'Not all by default — add the "Open Now" filter to show only spots currently serving, checked against their posted hours. Many ramen shops have split hours and close between lunch and dinner service, so this filter is genuinely useful before you head out.' },
          { q: 'What is the difference between a ramen restaurant and a ramen shop?', a: 'A ramen shop (ramen-ya) is typically a focused, counter-style spot built around one or two signature broths. A ramen restaurant is usually larger, may have table service, and often serves a broader menu. Both are on the map — use the filters to find the experience that fits your plans.' },
          { q: 'Do ramen restaurants take reservations?', a: 'Many dedicated ramen shops do not take reservations and run on a first-come, first-served basis. Larger Japanese restaurants that serve ramen often do. Use the "Takes Reservations" filter to surface spots where you can book ahead on busy nights.' },
          { q: 'What should I order on my first visit to a ramen restaurant?', a: 'Start with the house signature bowl — it is what the kitchen is most proud of and the best way to judge whether you will come back. Add a soft-boiled egg if it is not already included, and a side of gyoza if the kitchen makes them in-house.' },
        ]}
      />
    </main>
  )
}
