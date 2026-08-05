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
  title: 'Tsukemen Near Me | Dipping Ramen Noodles | RamenNearYou',
  description: 'Find tsukemen near you — ramen dipping noodles served alongside a thick, intense broth. What tsukemen is, how to eat it the right way, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tsukemen' },
  openGraph: {
    title: 'Tsukemen Near Me',
    description: 'Find tsukemen (dipping ramen) near you.',
    url: 'https://www.ramennearyou.com/find/tsukemen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function TsukemenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["tsukemen"] }
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
        initialBowls={['tsukemen']}
        pageTitle="Tsukemen Near Me"
        pageDescription="Showing tsukemen (dipping ramen) near you. Enter your ZIP or use your location to find a bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Tsukemen Near Me" }]}
        title={`Tsukemen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/tsukemen"
        heading="How I Find Great Tsukemen Near Me"
        intro={[
          'Tsukemen is the bowl I send people to when they think they have tried everything ramen has to offer. The noodles come completely separate from a thick, ultra-concentrated dipping broth, and you dunk each small bundle before each bite — it is interactive, intensely flavored, and genuinely addictive in a way that eating a standard bowl of ramen never quite is. The map above is filtered to tsukemen near you; enter your ZIP or use your location to find the closest spot.',
          'Tsukemen has its own logic and its own etiquette, and getting them right makes the whole experience click. The format was designed to keep the noodles at their maximum chewiness, deliver flavor in concentrated bursts with each dip, and end with a ritual that turns your remaining dipping broth into a light, restorative soup. Understanding all of that before you sit down makes the meal significantly better.',
          'I fell in love with tsukemen the first time I ordered it by accident at a shop where I could not read the menu. The bowl of noodles arrived first, then a smaller cup of what looked like a very dark, very thick soup, and I figured it out just quickly enough to avoid pouring the broth over the noodles. The noodles were thick and chewy in a way standard ramen noodles rarely are, and the concentrated broth clung to each bundle with an intensity I had never tasted in a standard bowl.',
          'This guide covers everything: what tsukemen actually is, how to eat it properly, how to order it well, and what makes one shop\'s version better than another. Whether it is your first time or you are looking for your next great bowl, the map above and this guide will get you there.',
        ]}
        sections={[
          {
            h2: 'What tsukemen actually is',
            body: (
              <p>
                Tsukemen means "dipping noodles." Instead of sitting submerged in soup, the noodles are served
                separately on their own plate or in a separate bowl — often chilled or at room temperature —
                next to a smaller vessel of broth that is much thicker, richer, and far more concentrated than
                regular ramen soup. You dip a small bundle of noodles at a time into the broth, coating them
                before each bite rather than eating them from a pool of soup. Because the noodles are not soaking
                in hot liquid, they stay firm and chewy from first bite to last — and tsukemen noodles are
                typically made thicker than standard ramen noodles to take advantage of this, delivering a
                satisfying, toothsome texture that is one of the real pleasures of the format.
              </p>
            ),
            points: [
              { h3: 'Separate noodles', text: 'Served apart from the broth on their own plate or bowl, usually cold or at room temperature. Kept separate, they retain their firmness and chew from the first bite to the last — a key advantage over soup ramen where noodles soften progressively.' },
              { h3: 'Concentrated dipping broth', text: 'Far thicker and more intense than soup ramen because it only needs to cling to a few noodles at a time rather than surround them. The concentration means each dip delivers an enormous hit of flavor. A great tsukemen broth is so rich it barely qualifies as a liquid.' },
              { h3: 'Thick, chewy noodles', text: 'Because they are not soaking in hot soup, tsukemen noodles are typically made thicker — sometimes substantially so — and contain more flour for a dense, satisfying chew. The texture is one of the main reasons people love the format.' },
            ],
          },
          {
            h2: 'How to eat tsukemen the right way',
            body: (
              <p>
                The correct technique is to dip a small bundle of noodles — four or five strands — into the
                broth, swirl them briefly to coat each strand, then lift them out and eat. Do not pour the broth
                over the noodles; the concentration of the broth is calibrated for clinging to each bite, not
                for sitting in. When the broth is used as a pour-over, it becomes overwhelmingly salty and the
                balance the chef designed falls apart. When you finish the noodles, most shops offer "soup wari"
                — they will add hot dashi to your remaining dipping broth, diluting it to a drinkable soup so
                you can finish the meal with something clean and warming. Ask for it if it is not offered
                automatically; it is always available at a serious tsukemen shop and it is the perfect finish.
              </p>
            ),
            points: [
              { h3: 'Dip a small bundle at a time', text: 'Resist the urge to load up on noodles per dip. A small bundle coats evenly and delivers maximum flavor. A large clump of noodles does not dip cleanly and the interior noodles miss the broth entirely.' },
              { h3: 'Never pour the broth over the noodles', text: 'The dipping broth is calibrated to coat, not to fill a bowl. Pouring it over the noodles makes the dish unbearably intense and salty, and it ruins the separation of textures that is the whole point of the format.' },
              { h3: 'Always take the soup wari', text: 'Soup wari — hot dashi added to the remaining dipping broth — transforms it into a light, warming soup that is a perfect finish to the meal. It is part of the tsukemen tradition and should never be skipped.' },
            ],
          },
          {
            h2: 'Common tsukemen broth styles and what I prefer',
            body: (
              <p>
                Tsukemen dipping broths come in several distinct styles, and knowing them helps you choose well.
                The most common is a rich pork broth similar to tonkotsu — thick, heavy, and deeply savory.
                Equally popular is gyokai (seafood) or gyokai-tonkotsu, a blend of dried fish stock and pork
                bone that has a characteristic umami punch and a slightly briny, oceanic depth that plays
                beautifully against the thick noodles. Shoyu-based tsukemen dipping broths are more common
                at traditional-style shops and tend to be more acidic and lighter, with a soy-forward tang.
                My personal preference is gyokai-tonkotsu — the combination of pork richness and seafood
                umami creates a complexity that straight pork or straight fish cannot achieve alone, and it
                makes the soup wari finish especially satisfying.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu tsukemen', text: 'The richest and heaviest dipping broth: thick pork bone stock concentrated into something almost viscous. Deeply porky and very filling. The soup wari at the end is essential to balance the meal.' },
              { h3: 'Gyokai-tonkotsu tsukemen', text: 'The most popular style: a blend of dried fish umami and pork bone richness that creates a layered, complex broth. The seafood notes add brightness that keeps the pork richness from feeling monotonous. My favorite.' },
              { h3: 'Shoyu tsukemen', text: 'A more traditional, lighter approach — the dipping broth has a soy-forward tang and a clean, sharp acidity that cuts through the richness. Less heavy than tonkotsu but still very flavorful. Good for those who find pork-forward broths too much.' },
            ],
          },
          {
            h2: 'How I order tsukemen and what to add',
            body: (
              <p>
                I default to a rich pork or gyokai-tonkotsu dipping broth whenever it is available, and I
                always ask for the noodles cold — cold noodles stay firmer longer and have a more satisfying
                chew than room-temperature ones. A soft egg is a great addition that I order every time, and
                extra chashu on the noodle side rounds out the meal. If it is my first time at a shop, I
                tell the staff — they are usually happy to walk me through the format, explain the dipping
                broth, and remind me to ask for soup wari when I am done with the noodles. Tsukemen shops
                tend to be proud of their format and glad to share it with newcomers.
              </p>
            ),
            points: [
              { h3: 'Ask for cold noodles', text: 'Cold noodles stay firmer for longer and have a more pleasant, springy texture than warm noodles. The contrast between cold, chewy noodles and hot, concentrated broth is one of the distinctive pleasures of the tsukemen format.' },
              { h3: 'Extra chashu on the noodle side', text: 'Adding extra chashu gives you a protein with each bite that can be dipped along with the noodles. Thin, fatty chashu picks up the broth beautifully and adds another dimension to each mouthful.' },
              { h3: 'Tell the shop if it is your first time', text: 'Tsukemen shops are genuinely happy to guide first-timers through the format. They will explain the dipping technique, remind you about soup wari, and make sure you get the most out of the meal.' },
            ],
          },
        ]}
        tipsHeading="My tsukemen tips"
        tips={[
          'Filter to "Tsukemen," then sort by distance for the nearest dipping bowl. The map is already set so just confirm your location.',
          'Dip a small bundle of noodles — four or five strands — into the broth at a time. A small bundle coats evenly; a large clump does not dip cleanly and wastes broth on the exterior noodles.',
          'Never pour the dipping broth over the noodles. It is calibrated to cling to each bite, not to fill a bowl, and pouring it makes the dish unbearably intense.',
          'Ask for cold noodles for the best texture — cold noodles stay firm and springy much longer than warm ones, and the contrast with the hot broth is part of the experience.',
          'Always take the soup wari (broth dilution with hot dashi) when you finish the noodles. It transforms the remaining concentrated broth into a light, warming soup and is the traditional and satisfying way to end the meal.',
          'Order extra chashu on the noodle side — thin slices of fatty pork dipped alongside the noodles absorb the broth beautifully and add richness to each bite.',
          'If it is your first time, tell the shop. Tsukemen restaurants are used to first-timers and are usually delighted to walk you through the format properly.',
          'Stack "Top Rated" on the map and look in the reviews specifically for mentions of broth intensity and noodle chew — those are the two variables that separate a great tsukemen from a merely good one.',
        ]}
        faqs={[
          { q: 'What is tsukemen?', a: 'Tsukemen is dipping ramen: the noodles are served separately from a thick, highly concentrated dipping broth. Rather than eating noodles submerged in soup, you dip a small bundle of noodles into the broth before each bite. The format keeps the noodles firm and chewy throughout the meal and delivers a concentrated hit of flavor with every dip.' },
          { q: 'How do you eat tsukemen?', a: 'Dip a small bundle of noodles — about four or five strands — into the broth, swirl briefly to coat them, then lift out and eat. Do not pour the broth over the noodles. When you finish the noodles, ask for soup wari: the shop adds hot dashi to your remaining broth to dilute it into a drinkable soup for a clean, warming finish.' },
          { q: 'Why is tsukemen broth so strong?', a: 'Because it only needs to cling to a few noodles at a time rather than fill a bowl and surround all the noodles, the broth is made significantly more concentrated than regular ramen soup. Diluted to normal soup-level intensity, it would taste bland and flat. At dipping concentration, it is powerful enough to season each noodle beautifully.' },
          { q: 'What is soup wari?', a: 'Soup wari is the traditional way to finish a tsukemen meal. When you have eaten all the noodles, the shop adds hot dashi to your remaining dipping broth, diluting it to a drinkable consistency. The result is a light, deeply flavored soup that serves as a clean, warming close to the meal. It should never be skipped — it is one of the best parts of the tsukemen experience.' },
          { q: 'How do I find tsukemen near me?', a: 'The map above is filtered to tsukemen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open any listing for hours, photos, and directions. I recommend reading reviews specifically for mentions of broth intensity and noodle texture, which are the key variables in a great tsukemen.' },
          { q: 'What is the difference between tonkotsu tsukemen and gyokai tsukemen?', a: 'Tonkotsu tsukemen uses a concentrated pork bone broth — thick, rich, deeply porky, and very filling. Gyokai tsukemen uses a dried seafood stock (gyokai means seafood) with a characteristic umami punch and briny depth. Gyokai-tonkotsu blends both for a complex, layered broth that combines pork richness with seafood brightness. All three are worth trying.' },
          { q: 'Should I order the noodles hot or cold in tsukemen?', a: 'I always order them cold. Cold noodles stay firm and springy much longer than warm noodles and have a more satisfying, springy chew. The contrast between the cold, dense noodles and the hot, concentrated broth is also one of the distinctive sensory pleasures of the format. Most shops offer both, and either is valid, but cold is the classic choice.' },
          { q: 'Is tsukemen good for takeout?', a: 'It is better than most ramen styles for takeout because the noodles are already served separately from the broth — the separation that takeout usually ruins is built into the format. The noodles will not get soggy in transit, and the broth travels well in its own container. Just make sure to keep them separate until you eat, and reheat the broth gently before dipping.' },
        ]}
      />
    </main>
  )
}
