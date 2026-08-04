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
  title: 'Date Night Ramen Near Me | Romantic Ramen Spots | RamenNearYou',
  description: 'Find date night ramen near you — cozy, atmospheric spots with sake, cocktails, and a great bowl. How I pick the perfect ramen restaurant for a date.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-date-night' },
  openGraph: {
    title: 'Date Night Ramen Near Me',
    description: 'Find cozy, romantic ramen spots for date night near you.',
    url: 'https://www.ramennearyou.com/find/ramen-date-night',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenDateNightPage() {
  const NATIONWIDE_FILTER = { initialMoods: ["date-night"] }
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
        initialMoods={['date-night']}
        pageTitle="Date Night Ramen Near Me"
        pageDescription="Showing cozy, date-worthy ramen spots. Enter your ZIP or use your location to find a romantic bowl near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Date Night Ramen Near Me" }]}
        title={`Date Night Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-date-night"
        heading="How I Plan the Perfect Ramen Date Night"
        intro={[
          'Ramen might not be the first thing people picture for a date, but a great bowl at the right spot is one of my favorite low-pressure, high-payoff dates. It is warm, it is interactive, and it is unpretentious in the best way possible. There is something genuinely charming about leaning over a steaming bowl together, trading bites of gyoza, and letting the conversation flow without the stiffness of a formal sit-down dinner. The map above leans toward cozy, date-worthy ramen spots near you — enter your ZIP or use your location to find a romantic bowl close by.',
          'Not every ramen shop is date material, though. A fluorescent-lit counter with a 40-minute line and communal seating is not the move when you want to actually talk to someone. The difference between a date-night ramen spot and a quick-lunch spot often comes down to lighting, seating, and whether there is a drink worth ordering. Here is how I separate the date spots from the everyday joints and build an evening that actually impresses.',
          'I have taken people on ramen dates more times than I can count, and it works every single time when I pick the right venue. The key is understanding what makes ramen uniquely well-suited to this kind of evening: it is filling enough to be a complete meal, casual enough to keep things relaxed, and interesting enough to spark a conversation about food, travel, and the bowl in front of you. Done right, ramen date night punches well above its price point.',
          'The map above is already filtered to flag date-night-worthy spots, but I always layer on a couple of extra filters before I commit. The combination of atmosphere, a real drink list, and the ability to make a reservation is what separates a good ramen date from a great one. Read on for exactly how I put that combination together.',
        ]}
        sections={[
          {
            h2: 'What makes a ramen spot date-worthy',
            body: (
              <p>
                For a date I want atmosphere as much as a great bowl. That means dimmer lighting, comfortable
                seating — ideally tables or a relaxed counter where you can actually face each other, not
                elbow-to-elbow stools with no leg room — and a drink list so you can linger over sake or a
                cocktail after the bowls arrive. The food itself should feel a little special too. This is a night
                for the chef's signature or a seasonal special, not the cheapest bowl on the menu. I also pay
                attention to noise levels: a ramen shop that is so loud you cannot hear each other across the table
                is hard to salvage no matter how good the broth is. A spot that controls its sound environment
                shows it actually cares about the dining experience.
              </p>
            ),
            points: [
              { h3: 'Cozy atmosphere', text: 'Warm lighting, considered decor, and comfortable seating are the difference between a quick meal and a lingering evening. I check photos of the interior before booking to make sure the vibe matches the plan.' },
              { h3: 'Drinks on offer', text: 'Stack the "Full Bar" filter to make sure there is sake, a highball, or a craft cocktail to share. Having something to sip while the bowls arrive slows the pace in exactly the right way.' },
              { h3: 'A table you can keep', text: 'Stack "Takes Reservations" to lock in seating so you are not waiting on the sidewalk on date night. Knowing exactly where you will sit, and that the table is yours for the evening, removes a lot of the pressure.' },
            ],
          },
          {
            h2: 'What to order on a ramen date',
            body: (
              <p>
                I like to make ramen date night feel like a proper event rather than just another dinner. Starting
                with something to share sets the tone: gyoza, karaage, or a small plate of edamame gives you
                something to pick at while the bowls are being prepared and keeps the energy relaxed and communal.
                Then each of us gets a bowl we are genuinely excited about — and I always encourage ordering
                different broths so we can taste each other's. Trading a few bites of tonkotsu versus a clean shoyu
                is a simple, low-key way to make the meal feel like a shared adventure. A couple of drinks, a soft
                egg on top of each bowl, and maybe a dessert mochi to finish, and you have a genuinely lovely night
                that does not cost a fortune. The beauty of ramen is that the flavor is so good that it
                stands on its own — you do not need a $100 wine list to make the evening feel special.
              </p>
            ),
            points: [
              { h3: 'Shared starters', text: 'Gyoza, karaage, or edamame to share before the bowls arrive keeps the energy communal and gives you something to talk about while you wait.' },
              { h3: 'Different broths', text: 'Order different bowls and trade bites — it turns dinner into a tasting experience and gives you something to discuss beyond just eating.' },
              { h3: 'The extras that matter', text: 'A soft egg, extra chashu, and a drink or two transform a standard bowl into something that feels deliberately chosen for the occasion.' },
            ],
          },
          {
            h2: 'Setting up the evening',
            body: (
              <p>
                A little planning removes the friction that can derail an otherwise great night. I always book a
                table if the spot takes reservations, because showing up to a 45-minute wait is a rough way to
                start a date. I also think carefully about timing: a slightly later, calmer seating — say 7:30 or
                8 PM rather than right at 6 — means the dinner rush has subsided, the room is a little quieter,
                and nobody is rushing you out the door. Picking somewhere central matters too, because the evening
                should not end the moment the check arrives. A good ramen spot near a walkable neighborhood means
                you can take a stroll after, find a second drink somewhere, and let the night extend naturally.
                Stack "Date Night" with "Full Bar" and "Open Late" and you have the makings of a relaxed,
                memorable evening that feels effortless even though you put real thought into it.
              </p>
            ),
            points: [
              { h3: 'Book ahead', text: 'If the spot takes reservations, use them. Arriving to a guaranteed table sets a confident, thoughtful tone for the whole night.' },
              { h3: 'Choose your timing carefully', text: 'The 7:30 to 8 PM window often hits after the rush: quieter room, slower service pace, and no pressure to turn the table quickly.' },
              { h3: 'Think past the bowl', text: 'Pick a spot in a walkable area so the date continues naturally after dinner. A short walk or a second drink somewhere nearby extends the evening without any awkward "so, what now?"' },
            ],
          },
          {
            h2: 'Navigating the menu together',
            body: (
              <p>
                One thing I love about ramen dates is that the menu becomes part of the experience. Most spots have
                enough variety that each person can find something genuinely exciting, which means you spend a few
                minutes actually discussing what you are each drawn to — that is real conversation, not small talk.
                I usually recommend going for contrasting bowls: if one person wants a rich tonkotsu, the other
                might try a clear shio or a spicy tantanmen. That way you get to see two different sides of the
                kitchen and end up with a broader, more interesting meal. Do not skip the housemade noodles section
                if there is one — shops that make their noodles in-house tend to be more passionate about the whole
                craft, and that passion usually shows in every element of the bowl.
              </p>
            ),
            points: [
              { h3: 'Order contrasting bowls', text: 'Rich versus clean, spicy versus mild — picking different bowls means you get a broader experience of the kitchen and twice as much to talk about.' },
              { h3: 'Ask about the specials', text: 'Seasonal or off-menu specials show a kitchen that cares about craft. Ordering something not everyone gets is a small way to make the evening feel more curated.' },
              { h3: 'Look for housemade noodles', text: 'Shops that make their own noodles tend to sweat the details everywhere. It is a reliable signal that the whole bowl will be exceptional.' },
            ],
          },
        ]}
        tipsHeading="My ramen date-night tips"
        tips={[
          'Stack "Date Night" with "Full Bar" for sake or cocktails to linger over — a drink in hand slows everything down in the best possible way.',
          'Add "Takes Reservations" so you are seated, not waiting outside; arriving to a reserved table sets a confident tone for the whole evening.',
          'Start with shared gyoza or karaage before the bowls, then order different broths and trade bites to make dinner feel like a tasting adventure.',
          'Aim for a slightly later, calmer seating — 7:30 or 8 PM — instead of the dinner-rush peak so the room is quieter and the pace is more relaxed.',
          'Pick a central spot in a walkable area so the date can continue naturally with a stroll or a second drink after the bowls.',
          'Check the interior photos before you go — lighting and seating arrangement matter as much as the menu when you are planning a date.',
          'Do not skip a seasonal special if there is one; ordering something off the beaten path shows intention and gives you something to discuss.',
          'Keep a backup spot in mind just in case your first choice is fully booked — nothing disrupts the mood like scrambling for a plan B at the last minute.',
        ]}
        faqs={[
          { q: 'Is ramen a good date night idea?', a: 'Absolutely. The right spot — cozy atmosphere, warm lighting, a solid drink list, and comfortable seating — makes ramen a warm, low-pressure, interactive date that feels special without being stuffy or expensive. The fact that it is casual actually works in your favor because it removes the performative pressure of a formal restaurant.' },
          { q: 'How do I find a romantic ramen spot near me?', a: 'The map above leans toward date-worthy spots. Enter your ZIP or tap "Use my location," then stack "Full Bar" and "Takes Reservations" for the combination of atmosphere and a guaranteed table. Checking the interior photos in the listing before you commit is also worth the extra minute.' },
          { q: 'What should we order on a ramen date?', a: 'Share a starter like gyoza or karaage first, then each get a different bowl so you can trade bites and compare. Add a couple of drinks and some thoughtful toppings — a soft egg, extra chashu — to make each bowl feel chosen for the occasion rather than grabbed off the menu at random.' },
          { q: 'Should I make a reservation for a ramen date?', a: 'If the spot takes them, yes without question. It saves you from waiting on the sidewalk, signals that you planned ahead, and removes one of the most common sources of early-date friction. Stack the "Takes Reservations" filter to find spots that offer booking.' },
          { q: 'When is the best time for a ramen date?', a: 'A slightly later seating, around 7:30 to 8 PM, tends to be calmer than the 6 PM dinner rush. Add "Open Late" so you can take your time without feeling rushed out the door, and so the evening can extend past just the meal.' },
          { q: 'What kind of ramen atmosphere should I look for on a date?', a: 'Warm lighting is the single most important element — it makes everyone look and feel better. Beyond that, look for table seating rather than tight counters, a manageable noise level, and decor that shows the owners put real thought into the space. All of those signals together usually mean the food is taken just as seriously.' },
          { q: 'Is ramen too casual for a date?', a: 'Not at all. Casual does not mean low-effort — it means low-pressure, which is genuinely valuable on a date. A great ramen spot with sake, good lighting, and a beautiful bowl is more memorable than an average formal restaurant. The food becomes a talking point, which a generic steakhouse usually cannot offer.' },
          { q: 'Can I do ramen as a first date?', a: 'I think it is one of the better first date options. It is affordable, fast enough that you are not trapped for three hours if things go awkwardly, and interesting enough to generate real conversation about food and flavor. Pick a spot with table seating and at least one drink option, and you have a genuinely solid first date framework.' },
        ]}
      />
    </main>
  )
}
