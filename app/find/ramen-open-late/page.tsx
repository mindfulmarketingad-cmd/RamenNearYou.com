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
  title: 'Ramen Open Late Near Me | Late-Night Ramen After 10PM | RamenNearYou',
  description: 'Find ramen open late near you — spots serving past 10 PM and into the early hours. My guide to the best late-night bowls and how to catch them before last call.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-late' },
  openGraph: {
    title: 'Ramen Open Late Near Me',
    description: 'Find late-night ramen restaurants open past 10 PM near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-late',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenOpenLatePage() {
  const NATIONWIDE_FILTER = { initialFlags: ["open-late"] }
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
        initialFlags={['open-late']}
        pageTitle="Ramen Open Late Near Me"
        pageDescription="Showing ramen restaurants open late (10 PM and later). Enter your ZIP or use your location to find a late-night bowl near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Open Late Near Me" }]}
        title={`Ramen Open Late Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-open-late"
        heading="My Go-To Guide for Late-Night Ramen Near Me"
        intro={[
          'Ramen and late nights belong together in a way that very few food and time-of-day combinations actually do. After a long shift, after a show, after a few rounds at the bar, or simply after the day finally winds down at 11 PM, a hot bowl is exactly what the moment calls for. The map above is filtered to ramen restaurants near you that stay open late — serving until 10 PM or later — so you can find a bowl when most other kitchens have already shut down and turned off the lights. Enter your ZIP or use your location to sort the closest late spots by distance.',
          'Late-night ramen has its own culture and its own particular logic, and once you understand it you eat much better in those hours. This is not just about finding something open — it is about finding the right bowl for the hour, the right spot for the energy of the evening, and making sure you get through the door before the kitchen stops taking orders. Here is my full guide to the late-night ramen experience.',
          'I have eaten ramen past midnight more times than I can easily count, and I have learned which patterns reliably lead to a great experience and which ones lead to standing in front of a darkened window with a sad realization. The difference is almost always a function of how you use the available information — knowing which spots run late, what to order, and how to confirm you are still within the service window before you commit to the trip.',
          'There is also something worth saying about the particular quality of a late-night ramen shop. The energy in these places after 10 PM is different from lunch rush energy. The kitchen is focused, the regulars who come specifically for the late hours know what they want, and the broth has been going all day. A well-made bowl at midnight is one of the most satisfying meals I know.',
        ]}
        sections={[
          {
            h2: 'Why ramen is the perfect late-night food',
            body: (
              <p>
                In Japan, ramen has been the food you eat after the bars for generations — warm, restorative,
                deeply satisfying when nothing else is open and your body needs something real. The logic is
                perfect: a hot broth is warming when the night has turned cold, the sodium replaces what a long
                evening out depletes, the fat is comforting in a way that nothing light can match, and the
                noodles are filling enough that you are actually taken care of. That tradition came to the US
                through Japanese-American restaurant culture and the late-night dining scene of coastal cities,
                and it has never left. Late-night ramen shops have a particular energy that is hard to replicate
                at any other hour: a little rowdier, a lot of warmth, the kind of communal experience that forms
                around a shared bowl and a shared recognition that the night has been good. It is fast, it is
                filling, and it is the best possible ending to almost any kind of evening.
              </p>
            ),
            points: [
              { h3: 'Warm and restorative', text: 'Hot broth and rich fat are exactly what the body wants after a long evening. Ramen hits every note that late-night comfort food needs to hit, and it does it faster than almost anything else that is cooked to order.' },
              { h3: 'Fast enough to matter', text: 'A well-run ramen shop can have a bowl in front of you within ten minutes of your order, which matters a lot when it is late and you are ready to sit down and eat.' },
              { h3: 'A complete meal', text: 'Broth, noodles, protein, and vegetables in a single bowl means late-night ramen is actual nourishment, not just a snack. After a long day or a big night out, that completeness is exactly what you need.' },
            ],
          },
          {
            h2: 'What I order when it is late',
            body: (
              <p>
                Late at night I want comfort and richness above everything else, not something delicate or
                intellectually interesting. My late-night order is almost always a heavy tonkotsu or a spicy
                miso: the fat and the salt and the heat are precisely what a long night calls for, and the
                richness of a full pork tonkotsu at midnight feels like a genuine act of care toward yourself.
                If I have had a few drinks over the course of the evening, I lean into the "restorative" logic
                completely: rich broth, a soft egg for protein, extra chashu, and I drink the broth last. There
                is real reason behind the idea that a good bowl of ramen is a hangover cure preemptively
                applied — the salt, the fat, the warmth, and the water content of a broth-heavy bowl do
                genuinely address most of what a night out takes out of you.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'Rich, fatty pork bone broth is peak late-night comfort food. It holds heat longer than lighter broths, the fat is warming, and the flavor is deep enough to be fully satisfying without anything else.' },
              { h3: 'Spicy miso', text: 'Hearty, warming, and with a kick that actually perks you back up after a long night when your energy is flagging. The combination of richness and heat makes spicy miso one of the best late-night bowl choices.' },
              { h3: 'Load it up', text: 'A soft egg for protein, extra chashu for substance, and an order of gyoza alongside the bowl makes a late-night ramen into a genuinely restorative meal rather than just a snack.' },
            ],
          },
          {
            h2: 'Catch the kitchen before last call',
            body: (
              <p>
                Late-night hours are the most variable and unpredictable of any restaurant hours, and ramen is
                no exception. The "Open Late" filter flags spots serving until 10 PM or later, but there are
                several layers of uncertainty beyond just the posted close time. Kitchens frequently stop taking
                new orders 30 to 45 minutes before the listed closing time, especially on slower nights when the
                kitchen wants to wind down. Popular broths can also sell out late in the service — a tonkotsu
                that has been running all day since 11 AM may be gone by 10 PM if the day was busy. For any spot
                I am considering after about 10 PM, I stack "Open Now" to confirm they are still going right
                now rather than trusting the posted hours alone, and I call ahead after 11 PM to make sure they
                are still taking orders before I make the trip. The truly late spots — ones that go past midnight
                — can be found by using the "Past Midnight" filter, which narrows the results to the night-owl
                specialists in your area.
              </p>
            ),
            points: [
              { h3: 'Call ahead after 11 PM', text: 'Posted closing times and actual last-order times are two different things. A quick call before you leave confirms whether the kitchen is still taking orders, which saves a wasted trip and a frustrating moment at the door.' },
              { h3: 'Stack "Open Now"', text: 'Adding the "Open Now" filter to "Open Late" confirms the spot is currently serving rather than relying purely on posted hours that may not reflect a slow night or an early close.' },
              { h3: 'Use "Past Midnight" for the latest spots', text: 'The "Past Midnight" filter surfaces the true night-owl ramen shops — the ones that are still serving at 1 or 2 AM. If you need the absolute latest option, that is the filter to add.' },
            ],
          },
          {
            h2: 'Late-night ramen etiquette',
            body: (
              <p>
                A late-night ramen shop is a particular kind of environment that deserves a little thought. These
                kitchens are often smaller and staffed with fewer people than the daytime crew, which means they
                are working hard to keep the quality up with less support. I try to arrive early enough in the
                service window that the kitchen is not stressed about getting me out before close, I eat at a
                reasonable pace rather than lingering for two hours after the bowl is done, and I tip well because
                late-night food service work is genuinely demanding. I also try to keep the energy appropriate
                to the room — late-night ramen shops are lively, not nightclubs, and the goal is a warm, communal
                meal, not a continuation of whatever came before it.
              </p>
            ),
          },
        ]}
        tipsHeading="My late-night ramen tips"
        tips={[
          'Filter to "Open Late," then add "Open Now" to confirm a spot is still serving right now rather than trusting the posted hours alone on a slow night.',
          'Order rich, fatty bowls — tonkotsu or spicy miso — for the best late-night comfort; these broths are built for exactly the kind of nourishment a long evening demands.',
          'Call ahead after 11 PM without exception; kitchens frequently stop taking new orders 30 to 45 minutes before the listed close, and a quick call saves a wasted trip.',
          'Need the absolute latest spots? Use the "Past Midnight" filter to find the true night-owl ramen shops that serve into the early hours.',
          'A soft egg, extra chashu, and a side of gyoza turn a late bowl into the restorative, complete meal that a long day or night out calls for.',
          'Arrive early in the service window on late nights so the kitchen is not stressed about timing, and eat at a reasonable pace without overstaying.',
          'Rich broths can sell out late in a long service day — if there is a specific bowl you came for, mentioning it when you call ahead confirms it will still be available.',
          'Tip generously at late-night spots; the kitchen and front-of-house staff keeping those hours running are doing demanding work with fewer people than the daytime crew.',
        ]}
        faqs={[
          { q: 'What ramen is open late near me?', a: 'The map above is filtered to ramen restaurants open until 10 PM or later. Enter your ZIP or tap "Use my location" to find the closest late-night bowls sorted by distance. Stack "Open Now" as well to confirm a specific spot is currently serving.' },
          { q: 'How late do ramen restaurants stay open?', a: 'It varies considerably. Many serve until 10 or 11 PM, which covers most late-night needs. Some late-night specialists go past midnight, and in a handful of large cities there are spots that run very late or even around the clock. Use the "Open Late" and "Past Midnight" filters to match the search to exactly how late you need.' },
          { q: 'Why is ramen such a popular late-night food?', a: 'It is warm, fast, filling, and genuinely restorative in ways that matter after a long evening. The combination of hot broth, fat, sodium, and noodles addresses almost everything a long night out takes out of you. In Japan it has been the classic after-bars meal for generations, and that tradition carried over here fully intact.' },
          { q: 'What ramen should I order late at night?', a: 'Rich, comforting bowls are the move: tonkotsu for pure warmth and fat, or spicy miso for richness with a kick that perks you back up. Add a soft egg, extra chashu, and a side of gyoza to make it a proper restorative meal rather than just a late snack.' },
          { q: 'Will a late-night spot still be serving when I arrive?', a: 'Not always. Posted closing hours and actual last-order times differ, and kitchens often stop taking new orders 30 to 45 minutes early on slow nights. Stack "Open Now" and call ahead after 11 PM to confirm before you make the trip. This step is non-negotiable for a reliable late-night ramen experience.' },
          { q: 'How do I find ramen open past midnight near me?', a: 'Use the "Past Midnight" filter, which specifically surfaces spots that serve into the early hours. These are the true late-night specialists. Combine with "Open Now" and your location to get the closest currently-serving option sorted to the top of the list.' },
          { q: 'Do late-night ramen spots have the same menu as at dinner?', a: 'Usually yes, though some spots narrow the menu late at night to what the smaller late crew can execute well. Popular or broth-intensive options may also sell out after a long service day. Calling ahead after 10 PM lets you confirm your specific bowl will be available.' },
          { q: 'Is late-night ramen good after drinking?', a: 'There is a long tradition behind the idea, and it is backed by real logic: the hot broth is warming, the sodium replaces what you have depleted, the fat is filling in a way that actually registers, and the water content of a broth-heavy bowl provides hydration. A rich tonkotsu or spicy miso after a night out is one of the genuinely sensible choices you can make.' },
        ]}
      />
    </main>
  )
}
