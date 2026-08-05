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
  title: 'Family-Friendly Ramen Near Me | Ramen for Kids | RamenNearYou',
  description: 'Find family-friendly ramen restaurants near you — kid-welcoming spots with mild bowls and casual seating. Plus how I order ramen the whole family will eat.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-family-friendly' },
  openGraph: {
    title: 'Family-Friendly Ramen Near Me',
    description: 'Find kid-welcoming, family-friendly ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-family-friendly',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenFamilyFriendlyPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["family-friendly"] }
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
        initialFlags={['family-friendly']}
        pageTitle="Family-Friendly Ramen Near Me"
        pageDescription="Showing family-friendly ramen restaurants. Enter your ZIP or use your location to find kid-welcoming spots near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Family-Friendly Ramen Near Me" }]}
        title={`Family-Friendly Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-family-friendly"
        heading="How I Take the Whole Family Out for Ramen"
        intro={[
          'Ramen is honestly one of the easiest restaurant meals to take kids to, and it took me far too long to realize it. Noodles are a near-universal kid-pleaser, the bowls are endlessly customizable, and most ramen shops are casual enough that nobody worries about a little noise or a dropped spoon. There is no formal atmosphere to navigate, no complex menu to decode for a six-year-old, and the food arrives quickly enough that you are not white-knuckling through a 30-minute wait with restless children. The map above is filtered to family-friendly ramen restaurants near you — enter your ZIP or use your location to find the closest welcoming spots.',
          'After plenty of family ramen nights spanning everything from solo toddler outings to full multi-kid group dinners, I have figured out a reliable system for keeping everyone happy. That means knowing what to look for in a restaurant, how to navigate the menu for different ages, and how to handle the logistics so the outing is actually enjoyable for the adults too. Here is how I pick the right spot and order so the whole table leaves satisfied.',
          'The biggest mistake I see parents make with ramen is assuming kids will not eat it. In my experience the opposite is true: kids love noodles, broth is approachable, and most shops are happy to dial down spice or simplify toppings on request. The real challenge is not the food, it is the logistics — seating, timing, and noise levels. Get those right and ramen becomes one of the most reliably good family-dinner choices in your rotation.',
          'I also want to mention that taking kids to interesting restaurants when they are young genuinely shapes their relationship with food. A kid who grows up eating ramen, trying different broths, and learning that food can be an adventure is a kid who is easier to take out as they get older. I think of every family ramen outing as a small investment in building an adventurous eater.',
        ]}
        sections={[
          {
            h2: 'What makes a ramen spot good for families',
            body: (
              <p>
                I look for a handful of practical things when I am evaluating a ramen spot for family use. Casual
                seating with actual tables is the most important one — wrangling kids onto tall counter stools is a
                physical and emotional workout, and it is hard to set up a booster seat or help a small child with
                their bowl from a counter stool. A relaxed atmosphere where some noise is expected means you are not
                constantly shushing anyone, and a menu with mild options means even the pickiest eater has a path
                forward. The filter above surfaces spots flagged as family-friendly, which usually means the
                restaurant has a track record of welcoming kids warmly rather than just tolerating them. The
                difference between those two things is noticeable from the moment you walk in.
              </p>
            ),
            points: [
              { h3: 'Table seating', text: 'Tables and booths beat counters for families in every possible way. You can spread out, set up a booster, help a child with their bowl, and manage the chaos of a family meal without everything becoming a balancing act.' },
              { h3: 'Mild menu options', text: 'Shoyu and shio bowls are naturally gentle and approachable for young palates. Many shops will also reduce spice to zero on request, serve plain noodles in broth, or simplify toppings for smaller eaters.' },
              { h3: 'Quick service', text: 'Ramen comes out fast, which is a quiet superpower with hungry children. The shorter the window between sitting down and eating, the smoother the whole outing tends to be.' },
            ],
          },
          {
            h2: 'How to order ramen kids will actually eat',
            body: (
              <p>
                The beauty of ramen for families is how genuinely customizable it is once you know how to ask.
                For younger kids I start with a mild shoyu or chicken paitan bowl, request zero spice, and keep
                the toppings simple and recognizable: noodles, broth, maybe a soft egg or some corn. The corn is
                always a hit — it is sweet, familiar, and easy to eat. Many shops are happy to serve plain buttered
                noodles or broth-only noodles for the littlest eaters who have not quite made the leap to savory
                broth, and that option alone makes a ramen shop infinitely more parent-friendly than most people
                expect. Shared sides are also a reliable strategy: gyoza, edamame, and a bowl of rice are familiar,
                approachable orders that keep everyone occupied and fill in around the noodles without any drama.
                Older kids and teenagers can usually be nudged toward something with a little more flavor — a light
                miso or a tonkotsu with toppings they choose themselves tends to feel exciting to an eight- or
                ten-year-old.
              </p>
            ),
            points: [
              { h3: 'Start mild', text: 'A no-spice shoyu, shio, or chicken paitan bowl is the safest entry point for new ramen eaters of any age. These broths are savory and warm without any heat that might put a child off the whole concept.' },
              { h3: 'Share sides', text: 'Gyoza, edamame, steamed rice, and corn are familiar, low-risk orders that fill the table and keep even the pickiest eater engaged while everyone waits for their bowl.' },
              { h3: 'Customize freely', text: 'Ask for noodles cut shorter for younger kids, toppings served on the side, or broth-only noodles for the tiniest eaters. Most ramen shops are genuinely happy to adjust, and asking is always worth it.' },
            ],
          },
          {
            h2: 'Making the outing smooth',
            body: (
              <p>
                Timing is the variable I manage most carefully for family ramen outings. Going a little before the
                dinner rush — around 5 to 5:30 PM rather than 6:30 — means a quieter room, faster food, easier
                seating, and staff who have more bandwidth to help with the small things that make a family meal
                run smoothly. If you need a high chair, a booster, or a table large enough for a group, call
                ahead rather than hoping for the best at the door. Most spots are happy to accommodate, but they
                need a heads-up. For bigger groups or special occasions, stack the "Takes Reservations" filter with
                "Family-Friendly" to guarantee seating without the wait. I also keep a backup spot in mind just in
                case, because showing up to a 40-minute wait with a hungry five-year-old is a situation I try
                never to repeat.
              </p>
            ),
            points: [
              { h3: 'Go early', text: 'Arriving at 5 or 5:30 PM rather than the 6:30 rush means a calmer room, faster service, and a table that does not require a long sidewalk wait with restless kids.' },
              { h3: 'Call ahead for high chairs', text: 'High chairs and large tables are not guaranteed — a quick call confirms availability and means you walk in to a setup that already works, not a scramble.' },
              { h3: 'Use reservations for groups', text: 'Stack "Takes Reservations" with "Family-Friendly" for larger gatherings. A confirmed table for five or six people removes all the uncertainty from the plan.' },
            ],
          },
          {
            h2: 'Building an adventurous eater, one bowl at a time',
            body: (
              <p>
                One of my favorite side benefits of regular family ramen outings is what it does for a child's
                relationship with food over time. A kid who is introduced to ramen young, who gets to choose their
                toppings and watch their bowl being assembled, who learns that broth is warming and noodles are
                endlessly interesting — that kid grows up with a broader, more curious palate. I let my kids point
                at things they are curious about, even if it means an unfamiliar topping ends up in the bowl. The
                worst case is they push it to the side. The best case is they discover they love bamboo shoots or a
                marinated soft egg. Ramen is one of the best early food adventures you can give a child precisely
                because it is so approachable on the surface while offering so much depth once they are ready for it.
              </p>
            ),
          },
        ]}
        tipsHeading="My family ramen tips"
        tips={[
          'Filter to "Family-Friendly," then sort by distance for the nearest welcoming spot — not all ramen shops tolerate kids equally, and this filter makes a real difference.',
          'Go a little before the dinner rush, around 5 to 5:30 PM, for quieter rooms, faster food, and staff who have more time to help.',
          'Order mild shoyu, shio, or chicken bowls with no spice for younger kids — corn and a soft egg are reliable crowd-pleasers as toppings.',
          'Lean on gyoza, edamame, and steamed rice as familiar shared sides that keep everyone occupied and the table feeling full.',
          'Call ahead to confirm high chairs or a large table before you go, and stack "Takes Reservations" for groups of five or more.',
          'Let kids pick at least one topping themselves — the sense of ownership over their bowl makes them dramatically more likely to eat it enthusiastically.',
          'Ask for noodles cut shorter for very young children so they are easier to manage without a mess.',
          'Keep a backup spot in mind just in case your first choice has a long wait — walking in without a plan B with hungry kids is a gamble I try not to take.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants are family-friendly near me?', a: 'The map above is filtered to family-friendly spots. Enter your ZIP or tap "Use my location" to find kid-welcoming restaurants nearby. The filter surfaces places with a track record of welcoming children warmly, not just tolerating them.' },
          { q: 'Is ramen good for kids?', a: 'Yes — noodles are a near-universal kid favorite, and most ramen shops offer mild shoyu, shio, or chicken bowls that can be ordered with zero spice. Many will also do plain noodles in broth or simplified toppings for younger eaters. Gyoza and edamame round out an easy, familiar meal that rarely disappoints.' },
          { q: 'Do ramen restaurants have high chairs?', a: 'Many casual ramen spots do, but availability varies by location and can depend on the day. The safest approach is to call ahead and confirm, and to do so before you leave rather than hoping for the best when you arrive. Listing the details you need upfront makes the staff more prepared to help.' },
          { q: 'What ramen should I order for a picky eater?', a: 'Start with a mild, no-spice shoyu or chicken paitan bowl and keep toppings limited to things the child recognizes: noodles, broth, corn, maybe a soft egg. Many shops will also serve plain buttered or broth-only noodles for the youngest or most selective eaters — it is always worth asking.' },
          { q: 'When is the best time to bring kids for ramen?', a: 'A bit before the dinner rush, around 5 to 5:30 PM, is my consistent recommendation. You get quieter rooms, faster service, easier access to high chairs and large tables, and staff who have more bandwidth to help with the small things that make a family meal run smoothly.' },
          { q: 'Can toddlers eat ramen?', a: 'Many toddlers can eat mild ramen with some adjustments. Ask for noodles cut shorter, a plain broth with no spice, and simple toppings they can eat easily. Some shops will do a basic noodle-in-broth bowl that works perfectly for the youngest eaters. The key is asking — most staff are happy to accommodate.' },
          { q: 'How do I handle the noodle mess with young children?', a: 'It is genuinely messy, and that is fine at a casual ramen spot. I ask for a bib if the shop has one, request that noodles be cut shorter for easier management, and accept that some broth will land on the table. Casual restaurants expect this and it is rarely a problem. Bringing a small portable bib of your own is also a solid backup.' },
          { q: 'Is ramen too unfamiliar for kids who have never had it?', a: 'In my experience, no. Kids who like noodles and soup — which is most of them — tend to take to ramen quickly, especially when the broth is mild and the toppings are kept simple. Framing it as special noodle soup rather than making a big deal of the name helps with hesitant eaters. The first bite usually does the rest of the convincing.' },
        ]}
      />
    </main>
  )
}
