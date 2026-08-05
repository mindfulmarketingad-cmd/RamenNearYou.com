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
  title: 'Ramen Shoyu Near Me | Classic Tokyo Soy-Sauce Ramen | RamenNearYou',
  description: 'Find shoyu ramen near you — the original Tokyo-style soy-sauce broth, light yet deeply savory. What shoyu ramen is, how to order it, and how to judge a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shoyu-ramen' },
  openGraph: {
    title: 'Ramen Shoyu Near Me',
    description: 'Find classic, soy-seasoned shoyu ramen near you.',
    url: 'https://www.ramennearyou.com/find/shoyu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ShoyuRamenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["shoyu"] }
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
        initialBowls={['shoyu']}
        pageTitle="Ramen Shoyu Near Me"
        pageDescription="Showing shoyu (soy sauce) ramen near you. Enter your ZIP or use your location to find a classic, savory bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Shoyu Near Me" }]}
        title={`Ramen Shoyu Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/shoyu-ramen"
        guideLink={{
          href: '/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen',
          title: 'Tonkotsu vs. Shoyu vs. Shio vs. Miso: The 4 Types of Ramen Explained',
          blurb: 'How shoyu compares to the other three classic broth styles — history, technique, flavor, and what to order.',
        }}
        heading="Finding Classic Shoyu Ramen Near Me"
        intro={[
          'Shoyu is where ramen started, and it is still the bowl I recommend to anyone who thinks they do not like ramen. That clear, soy-seasoned broth is light on its feet but deeply savory — proof that ramen does not have to be rich and heavy to be completely unforgettable. The map above is filtered to shoyu ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'Because shoyu is so clean and balanced, there is almost nowhere for a kitchen to hide. A mediocre tonkotsu can mask a lot of sins behind its richness, but shoyu is transparent in the truest sense — the quality of the stock and the precision of the seasoning are right there in front of you. That makes it my favorite litmus test for a new ramen shop: if the shoyu is excellent, I trust the whole menu.',
          'I have eaten shoyu ramen all over, from tiny counter seats in Tokyo to ramen shops in unexpected corners of the United States, and the versions that move me are the ones where the broth tastes like it was built from real bones and aromatics over real time. The soy tare brings depth, but the stock underneath is where the soul lives. This guide is about knowing what to look for and how to find it near you right now.',
          'Whether you are a seasoned ramen eater or ordering for the very first time, shoyu is the style I would start with. It is elegant, versatile, and endlessly drinkable — and when it is made well, it makes a strong argument for being the best bowl in ramen\'s entire catalog.',
        ]}
        sections={[
          {
            h2: 'What shoyu ramen is',
            body: (
              <p>
                Shoyu ramen is the original Tokyo style: a clear, brown broth seasoned with soy sauce (shoyu)
                tare. The base is typically chicken, pork, or a refined chicken-and-dashi blend, and the soy tare
                brings a deep, savory umami character without any heaviness in the body. It is typically served
                with wavy, medium-weight noodles; sliced chashu pork; menma (fermented bamboo shoots); nori;
                scallion; and a soft marinated egg. Everything is clean, balanced, and what I would call
                endlessly drinkable — a broth you do not want to stop sipping even after the noodles are gone.
                The color is a rich amber brown that looks almost like a clear consomme, and the aroma is
                unmistakably savory and warm from the moment the bowl arrives.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Clear and brown, light-bodied but full of savory depth from the soy tare layered over a clean stock. It should taste complex without being heavy — aromatic, slightly sweet, and deeply umami all at once.' },
              { h3: 'The noodles', text: 'Often wavy, medium-weight noodles that suit the lighter broth without overwhelming it. The waves trap broth in each bite so you get flavor in every mouthful even though the soup is clear.' },
              { h3: 'Classic toppings', text: 'Chashu pork, menma (bamboo shoots with a distinctive crunch and mild fermented tang), nori, scallion, and a soft marinated egg. The toppings are restrained by design — in shoyu, the broth is the star.' },
            ],
          },
          {
            h2: 'How to judge a great shoyu ramen',
            body: (
              <p>
                With nothing to hide behind, balance is everything in shoyu. A great shoyu broth is savory and
                aromatic without crossing into saltiness, and it should taste clean even as it is deeply flavored
                — those two things are harder to achieve simultaneously than they sound. I look for clarity
                in the broth (it should be translucent and amber, not murky) and a stock that tastes like real
                bones and aromatics, not just soy sauce dissolved in water. The aroma is also a tell: a good
                shoyu smells of chicken fat, toasted soy, and whatever aromatics the kitchen used, not just of
                sodium. When a shop nails shoyu, it tells me the whole kitchen knows what it is doing and
                respects the ingredients.
              </p>
            ),
            points: [
              { h3: 'Clarity and color', text: 'A well-made shoyu broth should be clear and amber — you should be able to see through it even as it looks deeply colored. Murky, cloudy shoyu usually signals a stock that was not properly skimmed or was rushed.' },
              { h3: 'Aromatics in the fat', text: 'Look for a thin film of chicken fat or aromatic oil on the surface. This is flavored intentionally — it carries the scent of the aromatics and adds an extra dimension of richness to each spoonful without making the broth heavy.' },
              { h3: 'The soy tare balance', text: 'The soy should season the broth rather than dominate it. If all you taste is soy sauce, the tare was too aggressive or the stock underneath was too weak. In a great shoyu, the soy is part of a conversation, not the entire speech.' },
            ],
          },
          {
            h2: 'Who shoyu ramen is perfect for',
            body: (
              <p>
                Shoyu is my pick for ramen newcomers, for lighter appetites, and for anyone who finds tonkotsu
                too rich or miso too heavy. It is also a fantastic lunch bowl because it satisfies completely
                without weighing you down for the rest of the afternoon. I find it particularly good in warmer
                months when a creamy, heavy broth feels like too much effort to eat — shoyu is refreshing in
                a way that a richer bowl cannot be. It also happens to be one of the most versatile styles,
                appearing in countless regional variations across Japan, which means there is a lot of range to
                explore even within the shoyu category alone.
              </p>
            ),
            points: [
              { h3: 'Best for first-time ramen eaters', text: 'The clean, balanced, drinkable nature of shoyu makes it the easiest classic style to love immediately. It does not challenge the palate; it welcomes it. I always recommend shoyu to friends who are new to ramen.' },
              { h3: 'Perfect for lunch', text: 'Shoyu satisfies completely without the heaviness of tonkotsu or the thickness of miso. An hour after a shoyu lunch you feel fed and energized rather than sluggish. It is genuinely the best midday bowl.' },
              { h3: 'A benchmark for the kitchen', text: 'Because it is transparent — literally and figuratively — shoyu reveals technique. If I am visiting a new shop and want to know how good it is, I order shoyu. A kitchen that makes excellent shoyu can be trusted with everything else on the menu.' },
            ],
          },
          {
            h2: 'Regional shoyu variations across Japan',
            body: (
              <p>
                While Tokyo-style shoyu is the most internationally recognized, the soy-seasoned category spans
                a wide range of regional interpretations that are each worth knowing. Kitakata in Fukushima
                Prefecture is renowned for a shoyu ramen built on a pork-and-niboshi (dried sardine) stock that
                adds a briny, umami depth the Tokyo version does not have. Wakayama in Kansai combines shoyu
                with a pork bone base for something richer than classic Tokyo shoyu but lighter than full tonkotsu.
                Even within Tokyo itself, the modern craft ramen movement has pushed shoyu into new territory
                with painstakingly layered stocks, single-origin soy sauces, and aged tares. Each variation
                respects the fundamental character of the style while pushing it in its own direction, which is
                part of what makes shoyu such an endlessly interesting category to explore.
              </p>
            ),
            points: [
              { h3: 'Tokyo shoyu', text: 'The archetype: a light, aromatic chicken-and-pork stock seasoned with a soy tare, served with wavy noodles and classic toppings. Clean, balanced, and the standard against which other shoyu is measured.' },
              { h3: 'Kitakata shoyu', text: 'Built on a blend of pork and niboshi (dried sardines), this regional style adds a distinctive briny, maritime depth that makes it more complex than Tokyo shoyu. The noodles in Kitakata are also notably flat and wavy.' },
              { h3: 'Modern craft shoyu', text: 'A growing movement of artisanal ramen chefs treats shoyu as a canvas for culinary technique: single-origin soy sauces, multi-day stocks, aromatic oils crafted from a single ingredient. These bowls can be extraordinary, and they show how much headroom the style still has.' },
            ],
          },
        ]}
        tipsHeading="My shoyu ramen tips"
        tips={[
          'Filter to "Shoyu," then sort by distance for the nearest classic bowl. The map is already set to shoyu so you just need to confirm your location.',
          'Judge it on balance — a great shoyu broth is savory and aromatic without being salty, and the soy should season the stock rather than dominate it.',
          'Look for clarity in the broth: it should be amber and translucent, not murky. Clarity signals a well-skimmed, properly simmered stock.',
          'Shoyu is a perfect lighter lunch — it satisfies completely without weighing you down for the afternoon the way a tonkotsu or miso might.',
          'It is the ideal bowl for ramen newcomers because its clean, balanced, drinkable character is immediately approachable without being boring.',
          'Use shoyu as a benchmark when visiting a new shop. If their shoyu is excellent, you can trust everything else on the menu.',
          'Look for shops that mention the type of soy they use — aged soy, single-origin soy, or blended tares — as this signals a kitchen that thinks carefully about its seasoning.',
          'Stack "Top Rated" to find the shops that truly master the style, then look in the reviews for specific mentions of the broth\'s depth and balance.',
        ]}
        faqs={[
          { q: 'What is shoyu ramen?', a: 'Shoyu ramen is the original Tokyo style — a clear, soy-sauce-seasoned broth that is light in body yet deeply savory. It usually has a chicken, pork, or chicken-and-dashi base, and the soy tare brings an aromatic, umami depth without heaviness. It is served with wavy noodles, chashu, menma, nori, and often a soft marinated egg.' },
          { q: 'How is shoyu different from other ramen styles?', a: 'Shoyu is seasoned with soy sauce and stays clear and light-bodied, unlike the creamy, opaque tonkotsu or the thick, paste-seasoned miso. It is one of the cleanest and most balanced styles, closer in spirit to shio (salt ramen) than to tonkotsu, but with the distinctive savory depth that only soy brings.' },
          { q: 'Is shoyu ramen good for beginners?', a: 'Yes — it is the style I recommend to every first-time ramen eater. Its clean, balanced, drinkable broth is immediately approachable and does not challenge the palate the way richer styles can. Once you love shoyu, you have a baseline to understand what makes every other style interesting.' },
          { q: 'How can I tell if shoyu ramen is good?', a: 'Look for a clear, amber broth that is savory and aromatic without being salty. The broth should taste of real stock and aromatics, not just soy dissolved in water. Murky broth or a flavor that is all soy and nothing else are signs of a shortcut. A film of flavored aromatic oil on the surface is a good sign.' },
          { q: 'How do I find shoyu ramen near me?', a: 'The map above is filtered to shoyu. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open a listing for hours, photos, and directions. Check reviews specifically for mentions of broth depth and balance rather than just overall ratings.' },
          { q: 'What are menma in shoyu ramen?', a: 'Menma are fermented bamboo shoots — one of the classic shoyu toppings. They are soft but with a pleasant chew, lightly salty, and carry a mild fermented tang that adds texture and flavor contrast to the clean broth. Good menma are properly fermented and not just bamboo shoots seasoned with soy; there is a meaningful difference in flavor.' },
          { q: 'Is shoyu ramen the same as soy sauce ramen?', a: 'Yes — "shoyu" is the Japanese word for soy sauce, and shoyu ramen is ramen seasoned with a soy-sauce-based tare. The soy sauce is not the entire broth; it is a concentrated seasoning (tare) whisked into a stock. The quality and type of soy sauce used matters enormously to the final character of the bowl.' },
          { q: 'Can shoyu ramen be vegetarian or vegan?', a: 'It can be, though it usually is not by default. Soy sauce itself is vegan, and shoyu adapts well to plant-based stocks — kombu and shiitake dashi produce an excellent vegetarian shoyu broth. Some modern craft ramen shops offer vegan shoyu; confirm before ordering if that is important to you.' },
        ]}
      />
    </main>
  )
}
