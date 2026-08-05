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
  title: 'Ramen Spots Near Me | Find the Best Ramen Places Nearby | RamenNearYou',
  description: 'Find ramen spots near you — browse the best ramen places and noodle shops nearby, sorted by rating and distance. Enter your ZIP or use your location to get started.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-spots-near-me' },
  openGraph: {
    title: 'Ramen Spots Near Me',
    description: 'Find the best ramen places and spots nearby, sorted by rating and distance.',
    url: 'https://www.ramennearyou.com/find/ramen-spots-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenSpotsPage() {
  const NATIONWIDE_FILTER = {  }
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
        pageTitle="Ramen Spots Near Me"
        pageDescription="Showing ramen spots near you — every ramen place I can find nearby, sorted by rating and distance. Enter your ZIP or tap &quot;Use my location&quot; to find one close by."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Spots Near Me" }]}
        title={`Ramen Spots Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-spots-near-me"
        heading="How I Find the Best Ramen Spots Near Me"
        intro={[
          'When I just want a good bowl close by, I do not overthink it — I pull up the map above, drop in my ZIP or tap "Use my location," and let the closest, best-rated ramen spots sort to the top. It is the fastest way to find a ramen place near you without scrolling through a dozen review sites or relying on a recommendation that might be six months out of date. Every ramen spot on the map is sortable by distance, rating, and what is open right now.',
          'Below is how I separate a great ramen spot from a forgettable one, plus the filters I lean on when I am craving something specific. Over time I have developed a quick set of checks I run on any new ramen spot before I commit to the drive, and those checks have saved me from a lot of disappointing bowls and led me to a lot of genuinely great ones.',
          'The beauty of a good ramen spot is that it does not need to be a destination restaurant to be worth your time. Some of the best ramen spots I have found are tucked into strip malls, wedged between dry cleaners and nail salons, with a hand-lettered menu and a broth that took the owner twenty years to perfect. The map finds those too.',
          'I think of finding ramen spots the same way I think about finding any great neighborhood food: you need the right tool, a few smart filters, and the willingness to trust the crowd. A ramen spot with four hundred reviews and a 4.4 rating has already been vetted by hundreds of people who had no reason to lie. That is a reliable foundation for a great meal.',
        ]}
        sections={[
          {
            h2: 'What makes a great ramen spot?',
            body: (
              <p>
                The best ramen spots tend to do a few things obsessively well rather than offering an enormous menu
                that spreads the kitchen too thin. Look for a house-simmered broth, noodles with real bite, and
                consistency across a lot of reviews — a steady 4.4 over hundreds of reviews beats a perfect score
                from a handful every single time. A focused menu and a loyal local following are two of the clearest
                signs you have found a real ramen place worth your time. When I read a listing and see that the
                same bowl gets named in review after review — "the tonkotsu is incredible," "get the shoyu, it is
                unlike anything else" — I know the kitchen has found something it does better than almost anyone
                else, and that is exactly the kind of spot I want to eat at.
              </p>
            ),
            points: [
              { h3: 'House-made broth', text: 'A broth simmered in-house for hours is the heart of any serious ramen spot. It takes time, skill, and a commitment to quality that simply cannot be shortcut, and you can taste the difference in every sip.' },
              { h3: 'Fresh noodles with bite', text: 'Springy, properly cooked noodles that hold up in the broth instead of going soft are a hallmark of a kitchen that respects the craft. The right noodle for the right broth is a pairing that the best spots take seriously.' },
              { h3: 'Consistent ratings', text: 'A strong rating that holds across many reviews signals a kitchen that delivers every visit, not just on a lucky night. Volume and recency together are the most reliable signal of a spot worth your time.' },
            ],
          },
          {
            h2: 'How to find a ramen spot nearby',
            body: (
              <p>
                The map is the quickest tool — set your location and it ranks every nearby ramen place by distance
                so you can see what is genuinely close and what requires a drive. From there I narrow by what I am
                in the mood for: a rich tonkotsu when it is cold outside, a light shio for lunch, or whatever is
                open right now. Tapping into a listing gives me the full picture in seconds — rating, review count,
                photos, hours, and a quick menu preview. I skim the most recent reviews and photos before I
                commit. Fresh, specific praise of the broth and noodles is the signal I am looking for; generic
                five-star comments are less useful than a reviewer who writes two sentences about why the chashu
                melted perfectly.
              </p>
            ),
          },
          {
            h2: 'Ramen spots vs. ramen shops vs. ramen restaurants',
            body: (
              <p>
                People search for the same thing a dozen ways — ramen spots, ramen places, ramen shops, ramen
                restaurants. They all point to the same goal: a hot, well-made bowl near you. A dedicated ramen
                shop (ramen-ya) usually specializes in noodles and broth alone, often with counter seating and a
                focused menu, while a broader ramen restaurant may serve rice bowls, appetizers, sushi, and other
                Japanese dishes alongside it. An izakaya is somewhere in between — a Japanese pub where ramen
                might share the menu with grilled skewers, sashimi, and sake. The map covers all of them, so you
                can use the filters to find whichever format fits the moment.
              </p>
            ),
          },
          {
            h2: 'Using filters to find the exact spot you want',
            body: (
              <p>
                The filter bar above the map turns a general search into a precise one. When I want a specific
                experience, I stack filters: broth type plus price range plus "Open Now" gets me from dozens of
                options to a short list I can act on immediately. If I am craving miso on a cold night and need to
                leave in ten minutes, that combination surfaces exactly the right spots. I also use the "Top Rated"
                filter when I am in an unfamiliar area and want the crowd-vetted best rather than sorting through
                everything myself. The goal is to spend thirty seconds on the map and sixty seconds on the listing,
                then walk out the door confident I am heading somewhere worth the trip.
              </p>
            ),
            points: [
              { h3: 'Broth filter', text: 'Narrow to your craving — tonkotsu, shoyu, shio, miso — so every result is actually relevant to what you want right now.' },
              { h3: '"Open Now" filter', text: 'The most practical filter I use. Many ramen spots have split hours, so this confirms the kitchen is actually serving before you head out.' },
              { h3: '"Top Rated" filter', text: 'In a new neighborhood or city, this is my default starting point. Let the crowd do the vetting and surface the proven favorites first.' },
            ],
          },
        ]}
        tipsHeading="My tips for picking a ramen spot"
        tips={[
          'Set your location first — distance sorting instantly surfaces the closest bowls and saves you from driving past something great.',
          'Favor spots that focus on one or two broths and do them well; a kitchen that commits to its specialty almost always executes better than one that tries to cover everything.',
          'Trust a strong rating across many reviews over a perfect score from a few; the volume proves the kitchen is consistently good, not occasionally lucky.',
          'Skim recent photos before you go — a bowl that looks carefully made with a glossy broth and deliberate toppings usually is exactly that.',
          'Add "Open Now" when you want to head out the door immediately; many ramen spots close between lunch and dinner and you do not want to find out the hard way.',
          'Stack broth and price filters together to narrow a broad list down to a short one you can actually choose from quickly.',
          'Read the two or three most recent reviews for specific praise of the broth or noodles; specific and recent is the combination that tells you the most about what you will actually eat.',
          'On your first visit to any new ramen spot, order the dish that reviewers keep naming — it is the kitchen\'s proven highlight and the best place to start your relationship with that bowl.',
        ]}
        faqs={[
          { q: 'How do I find ramen spots near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." It shows every ramen spot nearby, sorted by rating and distance, so the closest, best-reviewed bowls rise to the top. Add filters for broth, price, or hours to narrow it down further.' },
          { q: 'What is the best ramen spot near me?', a: 'Set your location on the map and sort by rating to see the top-reviewed ramen places nearby. I also open a couple of listings to check recent reviews and photos before deciding — a high rating with recent, specific praise of the broth is the combination I trust most.' },
          { q: 'What is the difference between a ramen spot and a ramen restaurant?', a: 'They overlap. A dedicated ramen spot or shop specializes in noodles and broth, often with counter seating and a focused menu. A ramen restaurant may also serve rice bowls, appetizers, or sushi alongside ramen. The map includes both, so you can filter to whichever format fits your plans.' },
          { q: 'Are there ramen spots open now near me?', a: 'Yes — add the "Open Now" filter above the map to show only ramen spots currently serving, then sort by distance to find the closest one. Many ramen spots have split hours and close between lunch and dinner, so this filter is more useful than it might seem.' },
          { q: 'How do I know if a ramen spot is good before I go?', a: 'Look at three things in the listing: photos of the bowl (a well-built bowl signals a careful kitchen), the rating and review count together (high rating across many reviews means consistency), and the most recent two or three reviews for specific praise of the broth or noodles.' },
          { q: 'What ramen broth should I try if I am new to ramen?', a: 'Tonkotsu (rich, creamy pork broth) and shoyu (clear, soy-seasoned chicken or pork broth) are the most widely available styles and excellent entry points. Tonkotsu is bolder and more filling; shoyu is lighter and more delicate. Try both and see which direction you want to explore further.' },
          { q: 'Is it worth going to a ramen spot that just opened?', a: 'Often yes — new spots bring fresh ideas, shorter waits, and the chance to get in early on a place that might become the neighborhood favorite. Give the kitchen a little grace in the first few weeks as it settles into its rhythm, and call ahead to confirm hours since new listings are not always accurate.' },
          { q: 'What time should I visit a ramen spot to avoid a wait?', a: 'At opening, when the broth is fresh and the kitchen is at full energy, or during the mid-afternoon lull between roughly 2pm and 5pm when most ramen spots are quieter. Weekday lunches are almost always easier than weekend evenings at popular spots.' },
        ]}
      />
    </main>
  )
}
