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
  description: 'Find a ramen shop near you — browse local ramen-ya by rating, broth, hours, and distance. What makes a great ramen shop and how to pick the right one nearby.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-shop' },
  openGraph: {
    title: 'Ramen Shop Near Me',
    description: 'Find a local ramen shop near you.',
    url: 'https://www.ramennearyou.com/find/ramen-shop',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenShopPage() {
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
        pageDescription="Showing ramen shops near you. Enter your ZIP or use your location to find a local ramen shop, then filter by broth, hours, and rating."
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
        currentHref="/find/ramen-shop"
        heading="How I Find the Best Ramen Shop Near Me"
        intro={[
          'A great ramen shop is a neighborhood treasure — a place you come back to again and again, where the staff knows your order and the broth tastes exactly the way you remembered. The map above shows ramen shops near you; enter your ZIP or tap "Use my location," and the closest, best-rated spots rise to the top. I use this whenever I move to a new neighborhood or find myself somewhere unfamiliar and need to answer the most important question: where is the best ramen shop around here?',
          'Whether you want a quick counter bowl eaten in fifteen focused minutes or a sit-down meal with friends over a shared plate of gyoza, the right filters get you there fast. A good ramen shop does not have to be fancy, expensive, or large. Some of the most reliable bowls I have found came from tiny spots with six counter seats and a menu that fits on a single laminated card.',
          'Here is how I pick a ramen shop worth becoming a regular at, what signals I look for in a listing before I make the trip, and what to expect once I walk through the door. Understanding what separates a great ramen-ya from a mediocre one will save you from a lot of disappointing bowls.',
          'The search for a neighborhood ramen shop is different from a special-occasion restaurant hunt. You are not looking for a once-a-year experience; you are looking for a place that becomes part of your routine. That changes what matters: consistency rises to the top, value starts to matter more, and being close enough to visit on a weeknight becomes a real asset.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen shop?',
            body: (
              <p>
                The best ramen shops do a few things obsessively well: a broth simmered in-house from scratch,
                noodles with real bite that hold up in the bowl, and consistency you can count on every single
                visit. A focused menu is almost always a good sign — it means the kitchen has decided what it
                does best and committed to it fully, rather than spreading its effort thin across a dozen dishes.
                Friendly service and a steady local crowd seal the deal. When a ramen shop has been in the same
                neighborhood for years and still fills up at lunch, that loyalty is the most honest review you
                can read. The regulars have already done the work of separating the great from the forgettable,
                and they keep coming back because the answer is consistently great.
              </p>
            ),
            points: [
              { h3: 'Consistent quality', text: 'A reliable bowl every visit matters more than a single perfect night. The best shops have the same broth, the same noodle texture, and the same toppings every time you walk in — and that consistency is incredibly hard to achieve.' },
              { h3: 'House-made broth and noodles', text: 'The mark of a shop that takes its craft seriously. Broth made in-house from bones and aromatics has a depth and body that packaged bases simply cannot replicate. Fresh noodles cut to match the broth style make every bite better.' },
              { h3: 'A loyal local following', text: 'Lots of recent, repeat reviews signal a shop people return to by choice, not habit. When locals keep coming back to the same bowl, it is the clearest sign the quality holds up over time.' },
            ],
          },
          {
            h2: 'How to choose the right shop nearby',
            body: (
              <p>
                Set your location so the list sorts by distance, then scan the ratings and review counts side by side.
                I trust a strong rating that holds up across many reviews over a perfect score from only a few — a
                4.5 from four hundred diners proves the kitchen is consistent in a way a 5.0 from fifteen simply
                cannot. From there, filter by the broth you are craving today: tonkotsu when you want something
                rich and warming, shio when you are after something clean and light, miso when the temperature
                drops. Add "Open Now" so you never show up to a dark kitchen, and skim the two or three most
                recent reviews to make sure the quality is still what it was six months ago. Kitchens change,
                and recent reviews are the best way to catch a shop that has slipped.
              </p>
            ),
          },
          {
            h2: 'Counter shop or sit-down?',
            body: (
              <p>
                Ramen shops range from tiny counters built for a fast, focused solo bowl to roomier spots made for
                lingering with friends over multiple rounds. If you want the full experience — a sake to start,
                gyoza, maybe a rice bowl on the side — look for a shop with a bar seating area or a small plates
                section on the menu. If you just need a great bowl quickly on a lunch break, a focused counter
                ramen-ya where the kitchen can see you eat and knows when your bowl needs attention is the perfect
                format. The filters help you match the shop to the moment: group dinner looks different from a
                solo weeknight bowl, and both deserve the right setting.
              </p>
            ),
          },
          {
            h2: 'What to look for in the listing before you go',
            body: (
              <p>
                Before I commit to the trip, I spend about sixty seconds with the listing. I check the photos
                first — a bowl with a glossy, rich-looking broth, properly portioned noodles, and toppings placed
                with care tells me the kitchen takes pride in presentation. Then I skim the most recent three or
                four reviews and look for two things: specific praise of the broth and noodles (not just "great
                food"), and recent dates. A shop with glowing reviews from three years ago and nothing recent
                deserves more caution than one with steady praise right through last month. Finally, I confirm
                the hours — ramen shops often close between lunch and dinner, and some sell out of broth on
                busy nights. Calling ahead on a Friday saves the frustration of an empty pot.
              </p>
            ),
            points: [
              { h3: 'Photos of the bowl', text: 'A glossy, well-built bowl in the photos signals a kitchen that cares about every detail of the final product, from the broth to the placement of the chashu.' },
              { h3: 'Recent specific reviews', text: 'Look for reviews dated within the last few months that mention the broth or noodles by name. Recent and specific is the combination that tells you the most.' },
              { h3: 'Hours and sell-out risk', text: 'Many ramen shops close between service periods and some sell out of broth early on busy nights. Confirming hours before you go is always worth the extra step.' },
            ],
          },
        ]}
        tipsHeading="My tips for picking a ramen shop"
        tips={[
          'Set your location so the list sorts by the closest shops first — proximity matters when a bowl is calling your name on a weeknight.',
          'Trust a strong rating backed by lots of reviews over a perfect score from a few; volume proves the kitchen is consistently good, not occasionally lucky.',
          'Favor shops with a focused menu and house-made broth; when the kitchen commits to a few bowls, those bowls are almost always better.',
          'Add "Open Now" so you never show up to a closed kitchen — many ramen shops have split hours and close between lunch and dinner service.',
          'Skim recent reviews for repeat, loyal customers — the sign of a neighborhood staple that has earned its regulars through consistent quality.',
          'Check the photos in the listing; a well-built bowl in the photos is one of the clearest pre-visit signals you will get a quality meal.',
          'On your first visit, order the house signature bowl before experimenting with variations or add-ons — taste the kitchen at its most confident.',
          'If the shop offers a lunch special on weekdays, take it. The same kitchen, the same broth, often at a meaningfully lower price.',
        ]}
        faqs={[
          { q: 'How do I find a ramen shop near me?', a: 'Use the map above — enter your ZIP or tap "Use my location," and the closest, best-rated ramen shops sort to the top. Filter by broth or hours to narrow it down to exactly what you are looking for.' },
          { q: 'What makes a great ramen shop?', a: 'House-made broth and noodles, a focused menu, consistent quality every visit, and a loyal local following are the clearest signs of a great ramen shop. The best ones have been in the same neighborhood for years and still fill up at lunch.' },
          { q: 'What is a ramen-ya?', a: 'Ramen-ya is the Japanese term for a ramen shop — typically a focused spot, often with counter seating, that specializes in noodles and broth. The "ya" suffix means shop or place, so ramen-ya literally means "ramen place." It is the format most serious ramen enthusiasts seek out.' },
          { q: 'How do I pick between two ramen shops?', a: 'Compare ratings and review counts side by side, skim recent reviews for specific praise of the broth and noodles, and check which is closer and open right now. Photos of the bowl are a surprisingly reliable tiebreaker — a carefully built bowl in the listing photos usually means a kitchen that takes its work seriously.' },
          { q: 'Are counter ramen shops better than sit-down ones?', a: 'Neither is inherently better — counters are great for a fast, focused solo bowl where the kitchen can see every diner, while sit-down shops suit lingering with friends over multiple courses. Use the filters to match the shop format to your plans and your company.' },
          { q: 'Do ramen shops take reservations?', a: 'Most dedicated ramen shops do not take reservations and run first-come, first-served. Larger Japanese restaurants that include ramen on the menu often do take reservations. The "Takes Reservations" filter on the map helps you find the shops where you can book ahead.' },
          { q: 'What broth should I order at a ramen shop?', a: 'On a first visit, order whatever the shop is known for — their signature or most-reviewed bowl. If you are unsure, tonkotsu and shoyu are the two most widely available styles and a reliable starting point at almost any ramen shop.' },
          { q: 'Why do some ramen shops sell out of broth?', a: 'Many ramen shops make their broth in small batches from scratch each day, and when it runs out it runs out — they do not top it up with a shortcut. This is actually a sign of quality. Calling ahead on a busy Friday or Saturday evening is worth the extra step.' },
        ]}
      />
    </main>
  )
}
