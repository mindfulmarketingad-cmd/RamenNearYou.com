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
  title: 'Ramen With Outdoor Seating Near Me | Patio Ramen | RamenNearYou',
  description: 'Find ramen restaurants with outdoor seating near you — patios and sidewalk tables. Plus my take on which ramen styles actually shine when you eat outside.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-outdoor-seating' },
  openGraph: {
    title: 'Ramen With Outdoor Seating Near Me',
    description: 'Find ramen restaurants with patios and outdoor tables near you.',
    url: 'https://www.ramennearyou.com/find/ramen-outdoor-seating',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOutdoorSeatingPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["outdoor-seating"] }
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
        initialFlags={['outdoor-seating']}
        pageTitle="Ramen With Outdoor Seating Near Me"
        pageDescription="Showing ramen restaurants with outdoor seating. Enter your ZIP or use your location to find a patio near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen With Outdoor Seating Near Me" }]}
        title={`Ramen With Outdoor Seating Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-outdoor-seating"
        heading="Where I Go for Ramen With a Patio Near Me"
        intro={[
          'Slurping a bowl of ramen outside on a cool evening is one of my favorite ways to eat it. The steam, the fresh air, the people-watching — it just hits differently than a cramped counter inside. The map above is filtered to ramen spots near you that have outdoor seating, so you can grab a patio table instead of a waitlist buzzer. Enter your ZIP or use your location to sort the closest ones first.',
          'Outdoor seating is a little different from most filters because it is seasonal and weather-dependent, so I want to walk through how to use it well. Not every patio is open every day, and not every bowl is equally good when you are eating al fresco. The right combination of seat, bowl, and weather can make a ramen meal genuinely memorable — and the wrong combination can leave you staring into a lukewarm bowl in the sun while you sweat.',
          'My favorite outdoor ramen moments have almost all happened in the shoulder seasons — a crisp October evening under a heat lamp with a steaming bowl of tonkotsu, or a mild spring afternoon with a chilled ramen and a cold beer on a sidewalk patio. The key is thinking ahead about what season you are eating in and matching the bowl style to the conditions rather than defaulting to the same thing you would order indoors.',
          'Below I break down when outdoor ramen is at its best, which bowl styles to order in which weather, how to confirm a patio is actually open before you drive over, and how to combine filters to find the ideal outdoor ramen spot for any occasion.',
        ]}
        sections={[
          {
            h2: 'Why ramen and patios go together better than you think',
            body: (
              <p>
                People assume a steaming bowl is a cold-weather, indoors-only thing. I disagree completely. A
                hot bowl of ramen on a crisp fall or spring evening, outside under a heat lamp with a cold beer,
                is genuinely one of the best seats in the city. The warmth of the bowl and the cool air create
                a contrast that makes the broth taste richer and the noodles more satisfying. In summer, the
                right styles turn ramen into a perfect warm-weather meal. And for people who want to eat with a
                dog, a child who needs room to run, or just more personal space than a tight counter allows,
                the patio is often the best and most relaxed seat in the house.
              </p>
            ),
            points: [
              { h3: 'Cool evenings', text: 'This is peak ramen-patio weather in my experience. A rich tonkotsu or miso bowl plus a cold beer outside is hard to beat — the warmth of the bowl and the cool air balance each other perfectly, and the steam rising off the broth looks almost cinematic in the autumn light.' },
              { h3: 'Hot summer days', text: 'Reach for hiyashi (chilled) ramen or tsukemen with cold dipping noodles when the weather is warm. Brothless mazemen also works brilliantly when you do not want a face full of soup steam in the heat. These styles were designed to be refreshing, and eating them outside makes perfect sense.' },
              { h3: 'Bringing a group or a dog', text: 'Patios are usually the most flexible seating a shop has in terms of configuration and noise tolerance, and many are dog-friendly. Outdoor ramen is great for casual group hangs where people want room to spread out, pass plates around, and not feel like they are disturbing a quiet dining room.' },
            ],
          },
          {
            h2: 'How to make sure the patio is actually open',
            body: (
              <p>
                Outdoor seating data comes from each restaurant's listed amenities, and patios open and close
                with the seasons and the weather. The listing may say "outdoor seating" year-round, but a
                sudden rainstorm or an early frost can mean the umbrellas are folded and the furniture is
                stacked by the time you arrive. Before I drive over on a borderline weather day, I open the
                listing, grab the phone number, and call to confirm the patio is set up and open. It takes
                about 30 seconds and has saved me more than a few wasted trips. I also find it useful to check
                recent reviews for photos — if someone posted a patio shot in the last week, I know it is
                currently operating.
              </p>
            ),
            points: [
              { h3: 'Call ahead on borderline days', text: 'Weather apps are not always right and restaurants make patio decisions on the morning of service. A quick call confirms whether the outdoor space is set up before you commit to the drive.' },
              { h3: 'Check recent review photos', text: 'If someone posted a patio photo within the last few days, the space is clearly in operation. This is faster than calling for popular spots that tend to have active review pages with fresh photos.' },
              { h3: 'Ask about heat lamps and covered areas', text: 'Some patios are covered or have heat lamps that extend their usable season significantly. A covered patio with heat lamps is comfortable well into late fall in most climates, so it is worth asking even when the weather looks marginal.' },
            ],
          },
          {
            h2: 'Stacking outdoor seating with other filters',
            body: (
              <p>
                Outdoor seating pairs naturally with the other filters above the map. If I want a relaxed
                evening with a drink in hand, I add "Open Late" or "Full Bar." If I am out with family and
                want a patio where the kids have room to breathe, I add "Family-Friendly." And if I just want
                the best possible bowl on a patio without any other constraints, I add "Top Rated" and let the
                highest-reviewed outdoor spots rise to the top. The combination of a great bowl, a real drink,
                and a patio seat is the formula for my favorite kind of casual summer evening.
              </p>
            ),
            points: [
              { h3: 'Outdoor seating plus Full Bar', text: 'A patio with a real sake list or a beer program is one of the most pleasant ways to spend a warm evening. The combination of fresh air, cold drinks, and hot noodles is genuinely hard to top for a casual night out.' },
              { h3: 'Outdoor seating plus Family-Friendly', text: 'Patios give families the space and noise buffer that a tight indoor counter never can. Finding a spot that is both family-friendly and has outdoor seating makes the whole outing more relaxed for parents and kids alike.' },
              { h3: 'Outdoor seating plus Top Rated', text: 'When I want the best patio ramen experience rather than just the closest, I add "Top Rated" and browse the results by review score. The combination usually surfaces a handful of genuinely excellent spots worth the extra distance.' },
            ],
          },
          {
            h2: 'Which ramen styles to order for outdoor eating',
            body: (
              <p>
                Matching your bowl to the season and setting is the most underrated part of ordering ramen
                outside. In cool weather, anything goes — I lean toward rich tonkotsu or a hearty red miso
                because the broth stays hot longer and warms you from the inside while the air cools you from
                the outside. In warm or hot weather, I pivot entirely: hiyashi chuka (chilled ramen with cold
                noodles and toppings), cold tsukemen with an ice-cold dipping sauce, or a brothless mazemen
                that delivers all the flavor of ramen without any steam. Many ramen shops bring these cold
                and brothless styles onto the menu for summer specifically because they know people want to
                eat outside, and they are worth seeking out.
              </p>
            ),
          },
        ]}
        tipsHeading="My patio-ramen tips"
        tips={[
          'Filter to "Outdoor Seating," then sort by distance to find the nearest patio ramen spot — many are hidden gems you might not notice from the road.',
          'Call ahead on iffy-weather days before making the drive — patios open and close seasonally and with the morning forecast, and the listing may not reflect real-time status.',
          'Match the bowl to the temperature: rich and hot when it is cool outside, chilled or brothless when it is warm — the contrast between bowl and weather is what makes outdoor ramen special.',
          'Add the "Full Bar" filter when you want a beer or sake to go with the fresh air — a cold drink plus a hot bowl on a patio is one of the most satisfying combinations I know.',
          'Going earlier in the evening usually means easier patio seating before the dinner rush fills the outdoor tables — patios tend to be the first seats gone on a nice night.',
          'Check recent review photos for patio shots before you go — if someone posted one in the last week, the outdoor space is clearly in operation.',
          'Ask the host about heat lamps and covered areas, especially in fall — a covered patio with heat is comfortable much later in the year than you might expect.',
          'If you are bringing a dog, call to confirm the specific patio allows it — policies vary even among spots that generally welcome dogs outside.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants have outdoor seating near me?', a: 'The map above is filtered to spots with outdoor seating. Enter your ZIP or tap "Use my location" to sort patios and sidewalk tables by distance from you. The filter surfaces restaurants that have listed outdoor seating as an amenity.' },
          { q: 'Is ramen good to eat outside?', a: 'Absolutely. A hot bowl is fantastic on a cool patio, and the contrast between steaming broth and cool evening air makes the meal genuinely special. In warm weather, chilled hiyashi ramen, tsukemen, or brothless mazemen make ideal outdoor options that keep you comfortable while still delivering great flavor.' },
          { q: 'How do I know if a ramen spot\'s patio is open?', a: 'Outdoor seating data comes from listed amenities and does not always reflect real-time status. Patios are seasonal and weather-dependent. Open the listing, call the restaurant, and confirm before heading over — especially on borderline weather days or in shoulder-season months when patios may only be partially open.' },
          { q: 'What should I order for ramen on a patio in summer?', a: 'Go for chilled ramen (hiyashi chuka), cold tsukemen dipping noodles, or mazemen — a brothless style that delivers all the ramen flavor without a bowl of hot soup steaming in your face. These styles were designed for warm-weather eating and are genuinely excellent on a patio with a cold drink.' },
          { q: 'Are ramen patios usually dog-friendly?', a: 'Many are — outdoor seating is typically where restaurants allow well-behaved dogs on leash, but policies vary by city, neighborhood, and individual restaurant. Always call ahead if you are bringing a dog so you know before you arrive and do not end up turned away at the door.' },
          { q: 'What is the best season for patio ramen?', a: 'My personal favorite is fall: a crisp evening under a heat lamp with a rich tonkotsu and a cold beer is genuinely one of the best meals I have had. Spring is a close second. Summer works well if you order chilled styles; winter patios depend entirely on whether the restaurant has heaters and cover.' },
          { q: 'Can I bring kids to a ramen patio?', a: 'Patios are often the most family-friendly seating in a ramen restaurant — there is more space, more noise tolerance, and less pressure than a tight indoor counter. Stack "Family-Friendly" with "Outdoor Seating" to find spots that actively welcome kids and have the outdoor space to accommodate them.' },
          { q: 'How do I combine outdoor seating with other filters?', a: 'The filters above the map stack. Add "Full Bar" for a patio with drinks, "Top Rated" for the best-reviewed outdoor spots, "Family-Friendly" for a family outing, or "Open Late" for an evening patio session. Combining two or three filters quickly narrows the map to exactly the kind of spot you are looking for.' },
        ]}
      />
    </main>
  )
}
