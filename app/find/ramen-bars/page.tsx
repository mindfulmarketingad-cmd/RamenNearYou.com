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
  title: 'Ramen Bars Near Me | Ramen & Sake Bars | RamenNearYou',
  description: 'Find ramen bars near you — counter-seat shops and izakaya-style spots with noodles, sake, and small plates. What a ramen bar is and how to enjoy one.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-bars' },
  openGraph: {
    title: 'Ramen Bars Near Me',
    description: 'Find ramen bars and izakaya-style spots near you.',
    url: 'https://www.ramennearyou.com/find/ramen-bars',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenBarsPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["open-late"] }
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
        initialFlags={['open-late']}
        pageTitle="Ramen Bars Near Me"
        pageDescription="Showing ramen bars and late-serving spots. Enter your ZIP or use your location to find a ramen bar near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Bars Near Me" }]}
        title={`Ramen Bars Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-bars"
        heading="What I Look for in a Great Ramen Bar Near Me"
        intro={[
          'A ramen bar is more than a place that sells noodles — it is an experience. Counter seating where you watch the cooks work, a sake or beer list, small plates between bowls, and a buzz that turns dinner into a night out. The map above is filtered toward ramen bars and later-serving spots near you. Enter your ZIP or use your location to find one close by.',
          'I love a great ramen bar because it captures the spirit of how ramen is actually eaten in Japan. There, stopping at a noodle counter after work with a beer in hand is completely normal, and the counter itself is a social space — not just a place to eat and leave. The best ramen bars I have visited here in the US bring that same atmosphere, mixing serious bowl-craft with a real drink program and the kind of energy that makes you want to stay for a second round.',
          'What sets a ramen bar apart from a quick noodle counter is intentionality around the full experience. The menu goes beyond the bowl: gyoza, karaage, edamame, skewers, maybe a small salad. The drink list is curated to pair with broth. The lighting is lower, the music is a little louder, and the staff expects you to linger. That combination is exactly what I look for when I want ramen to be the centerpiece of a real evening out.',
          'This page will walk you through what makes a ramen bar different from a standard ramen-ya, how to order at one, and how to use the filters above the map to find exactly the kind of spot you are after tonight.',
        ]}
        sections={[
          {
            h2: 'What exactly is a ramen bar?',
            body: (
              <p>
                The term covers a spectrum. At one end is the classic ramen-ya — a tight counter focused purely
                on bowls, where you order from a ticket machine and eat alone in focused silence. At the other
                end is the izakaya-leaning ramen bar with a full drink program, gyoza, karaage, and small plates
                designed for grazing while you drink. Most great ramen bars sit somewhere in the middle: serious
                noodles plus a real bar you can settle into for the better part of an evening. The key markers
                I look for are counter seating that faces the kitchen, a drinks menu that goes beyond a single
                beer brand, and small plates that stand on their own — not just afterthoughts to the bowl.
              </p>
            ),
            points: [
              { h3: 'Counter seating', text: 'The heart of a ramen bar — a front-row seat to the cooks assembling bowls, torching chashu, and layering toppings with precision. Sitting at the counter is my first choice every time I visit a new ramen bar because it teaches me more about the kitchen in twenty minutes than any review ever could.' },
              { h3: 'Drinks and small plates', text: 'Sake, beer, highballs, shochu, and shareable starters like gyoza, edamame, and karaage turn a quick bowl into a lingering meal. The best ramen bars treat the small-plates program as seriously as the broth, and the pairings make both better.' },
              { h3: 'Late-night energy', text: 'Many ramen bars serve late, which is exactly when their atmosphere peaks. The kitchen is humming, the bar is full, and the combination of steaming bowls and cold drinks takes on its own after-hours magic that you simply do not get at a lunch counter.' },
            ],
          },
          {
            h2: 'How to order at a ramen bar',
            body: (
              <p>
                Treat it like a bar crawl condensed into one seat: start with a drink and a small plate —
                gyoza or edamame — then move to your bowl. If you are with friends, order a few different broths
                and share, splitting tonkotsu, miso, and shio so everyone gets a taste of the range. A ramen bar
                rewards taking your time. I rarely rush; the second drink and a side of karaage are part of the
                fun. If the bar has a sake list, ask the staff for a recommendation matched to your bowl — most
                places with a serious sake program employ people who love talking about it, and a good pairing
                suggestion can completely change how you experience the broth.
              </p>
            ),
            points: [
              { h3: 'Start with a small plate and a drink', text: 'Jumping straight to the bowl skips the best part of the ramen bar format. A round of gyoza and a cold beer or pour of sake sets the pace and gives you something to share while everyone gets settled.' },
              { h3: 'Order different broths and share', text: 'When I go with two or three people, we each order a different style and pass them around so everyone gets a taste of tonkotsu, shoyu, and miso side by side. It turns dinner into a tasting and makes the conversation around the table much more interesting.' },
              { h3: 'Ask about sake and broth pairings', text: 'A good ramen bar staff member knows which sake cuts through a fatty tonkotsu and which junmai suits a light shio. Do not be shy about asking — it is one of the genuine pleasures of eating at a place that takes both noodles and drinks seriously.' },
            ],
          },
          {
            h2: 'Finding the right ramen bar for the night',
            body: (
              <p>
                Stack filters to match your plan. Add "Full Bar" to guarantee a real drink list, "Open Late"
                for after-hours energy (already applied here), "Date Night" for a cozier room, or
                "Takes Reservations" when you are bringing a group. That combination gets you from "a ramen bar"
                to "the right ramen bar for tonight." I also find it worth checking recent reviews for mentions
                of atmosphere and service pace — a ramen bar that rushes you out defeats the purpose.
              </p>
            ),
            points: [
              { h3: 'Date night', text: 'Stack "Full Bar" and "Date Night" together and you get spots built for lingering: lower lighting, a considered sake menu, and an atmosphere that does not feel like a cafeteria. Counter seating for two is actually one of my favorite date-night setups.' },
              { h3: 'Group outings', text: 'Add "Takes Reservations" so you are not gambling on whether the bar can squeeze six people in at 7 pm on a Friday. Mention the group size and any dietary needs when you book, and ask about family-style ordering options.' },
              { h3: 'After-work unwinding', text: 'The "Open Late" filter (already active on this page) surfaces spots that are still firing on all cylinders after 9 pm. A ramen bar mid-evening has a completely different energy than the lunch rush, and that is usually the energy worth seeking out.' },
            ],
          },
          {
            h2: 'What makes a great ramen bar broth',
            body: (
              <p>
                The broth is always where the craft shows, and a ramen bar that takes itself seriously invests
                real time in it. Tonkotsu — the rich, milky pork-bone broth — can take 12 to 18 hours of
                rolling boil to develop its characteristic body. Miso-based broths require a separately built
                tare, the seasoning paste, that changes the character of the bowl entirely depending on whether
                it is white, red, or blended. Shoyu and shio broths are leaner and cleaner, demanding excellent
                chicken or seafood dashi as their base. When I sit at a ramen bar counter and watch the
                preparation, I look for how the kitchen handles the tare: if they are measuring carefully and
                adjusting for each bowl, that tells me the broth is made with attention.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'Rich, collagen-heavy, and intensely porky. A properly made tonkotsu should coat the back of a spoon and leave a clean, lingering warmth. It pairs best with firm, thin noodles and stands up to a dry, crisp sake or an ice-cold lager.' },
              { h3: 'Miso', text: 'A deeply savory and slightly sweet broth built on fermented soybean paste. Red miso gives more depth and umami punch; white miso is gentler and a bit sweeter. Both are forgiving for delivery and incredible at a bar counter with a highball.' },
              { h3: 'Shoyu and shio', text: 'Lighter, cleaner broths that show off the quality of the base dashi underneath. These are the ones to order if you want to taste what the kitchen is really doing — there is nowhere for a weak stock to hide in a clear, golden shio.' },
            ],
          },
        ]}
        tipsHeading="My ramen bar tips"
        tips={[
          'Grab counter seating when you can — watching the cooks assemble bowls and torch the chashu is half the experience and teaches you what to order next time.',
          'Start with a drink and gyoza, then move to your bowl; ramen bars are built for lingering, and rushing straight to the noodles skips the best part of the format.',
          'Stack the "Full Bar" filter to ensure a real sake, beer, and cocktail list rather than a single beer brand on the menu.',
          'Order different broths with friends and pass them around to taste the range — tonkotsu, miso, and shoyu side by side tells you more about a kitchen than any single bowl.',
          'Ask the staff for a sake or drink pairing matched to your broth — a good ramen bar team loves this question and the answer almost always improves the meal.',
          'Add "Takes Reservations" for groups so you are not gambling on walk-in space for six people on a Friday night.',
          'Check recent reviews for comments on atmosphere and pacing — a ramen bar that rushes you out defeats its own purpose.',
          'Visit on a weeknight for a calmer version of the counter experience; weekends bring a louder, more electric energy that is its own kind of fun.',
        ]}
        faqs={[
          { q: 'What is a ramen bar?', a: 'A ramen bar centers on counter seating and noodles, usually with a drink program and small plates. It ranges from a focused ramen-ya counter to an izakaya-style spot with a full sake and cocktail list, gyoza, karaage, and shareable plates. The defining feature is that the experience is built to linger over, not just eat and leave.' },
          { q: 'How are ramen bars different from regular ramen restaurants?', a: 'Ramen bars emphasize the bar experience — counter seating, sake and cocktails, shareable small plates, and often late hours — turning a quick bowl into a proper night out. A standard ramen restaurant may focus purely on the bowl and expect you to eat quickly; a ramen bar is designed for multiple courses and rounds of drinks.' },
          { q: 'How do I find a ramen bar near me?', a: 'The map above is filtered toward ramen bars and later-serving spots. Enter your ZIP or tap "Use my location" to sort by distance. Add "Full Bar" to the filters to guarantee a real drink list, and "Open Late" is already active so you see the spots that match the ramen bar energy after dark.' },
          { q: 'What should I order at a ramen bar?', a: 'Start with a drink and a small plate like gyoza, edamame, or karaage. Then move to your bowl. If you are with a group, order two or three different broth styles and share them around the table. Finish with a second drink and any remaining small plates — the ramen bar format rewards taking your time.' },
          { q: 'Are ramen bars good for groups?', a: 'Yes, especially ones that take reservations. Stack "Takes Reservations" with this filter to find spots that can hold a table for your party. Mention the group size when booking and ask about family-style ordering. Counter seating for groups of two or three is usually fine on a walk-in basis; larger groups need a reservation.' },
          { q: 'What drinks pair best with ramen at a bar?', a: 'The classic pairing is a crisp Japanese lager or a dry junmai sake alongside a rich tonkotsu or miso bowl. Lighter shoyu and shio broths pair well with a clean, floral sake or a lemon highball. For spicy ramen, a slightly sweet beer or fruity highball tames the heat better than something bone dry.' },
          { q: 'What is the difference between a ramen bar and an izakaya?', a: 'An izakaya is a Japanese pub built primarily around drinks and shared small plates, where ramen might be one item on a long menu. A ramen bar centers the noodles and builds the bar experience around them. In practice, many great spots blur the line and are worth visiting regardless of which label fits best.' },
          { q: 'What time is best to visit a ramen bar?', a: 'Mid-evening, roughly 7 to 9 pm, is when most ramen bars hit their stride: the kitchen is running at full speed, the bar is active, and the atmosphere is at its most energetic. If you want a calmer, more focused experience, going right at opening or on a weeknight lets you enjoy the counter without the crowd.' },
        ]}
      />
    </main>
  )
}
