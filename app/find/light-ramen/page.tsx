import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Light & Clean Ramen Near Me | Clear-Broth Bowls | RamenNearYou',
  description: 'Find light and clean ramen near you — clear, delicate broths that satisfy without weighing you down. The lightest styles to order and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/light-ramen' },
  openGraph: {
    title: 'Light & Clean Ramen Near Me',
    description: 'Find light, clean, clear-broth ramen near you.',
    url: 'https://www.ramennearyou.com/find/light-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function LightRamenPage() {
  const NATIONWIDE_FILTER = { initialMoods: ["light-clean"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, NATIONWIDE_LISTICLE_CAP), { verifiedSlugs })
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
        initialMoods={['light-clean']}
        pageTitle="Light & Clean Ramen Near Me"
        pageDescription="Showing light, clean ramen near you. Enter your ZIP or use your location to find a delicate, clear-broth bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Light & Clean Ramen Near Me" }]}
        title={`Light & Clean Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/light-ramen"
        heading="How I Find Light & Clean Ramen Near Me"
        intro={[
          'Not every ramen craving calls for a heavy bowl. Sometimes I want something light and clean — a clear, delicate broth that is deeply savory but leaves me feeling good, not weighed down. The map above is filtered toward light and clean ramen near you; enter your ZIP or use your location to find the closest bowl. The lightest styles are often the most refined, and they reward the diner who pays close attention.',
          'Light ramen is one of the most underappreciated corners of the ramen world. Most conversations about ramen center on the richest, most indulgent bowls — tonkotsu, tori paitan, rich miso — but the delicate end of the spectrum is where you find some of the greatest technical mastery. Making a clear broth that is simultaneously light on the palate and deeply satisfying requires far more skill than loading a broth with fat and collagen until it tastes good.',
          'I reach for light ramen at least as often as I reach for rich ramen, and for a different set of reasons. At lunch, I want something that will not derail the afternoon. On warmer days, a heavy bowl feels like the wrong call. When I am eating ramen two days in a row, a light bowl the second night feels like a treat rather than a repetition. Understanding the range of what light ramen can offer makes me a much more satisfied ramen eater overall.',
          'The key is knowing the difference between a broth that is light by design — carefully constructed to be clear and clean while still delivering genuine depth — and one that is merely thin. A great shio bowl should taste like real stock, real aromatics, and considered seasoning. Here is how I find those bowls and what I look for when I get there.',
        ]}
        sections={[
          {
            h2: 'The lightest ramen styles',
            body: (
              <p>
                The clean end of the ramen spectrum is built on clear (chintan) broths rather than creamy
                emulsified ones. Shio (salt) is the lightest and most delicate, letting a pristine stock shine
                without anything to muddy it. Shoyu (soy) is clear and savory with a touch more depth and color,
                sitting just above shio on the richness scale. A clear chicken (tori chintan) or dashi-forward
                broth keeps things elegant and sometimes even a little briny in a way that is deeply refreshing.
                These are the bowls that prove ramen can be restorative and refined, not just rich — and they are
                often the ones I remember longest because there is nowhere for a mediocre kitchen to hide.
              </p>
            ),
            points: [
              { h3: 'Shio (salt)', text: 'The lightest classic style — a clear, salt-seasoned broth that highlights a clean, high-quality stock. The best shio bowls taste of pure, carefully made chicken or seafood dashi, and the subtlety of the seasoning lets every aromatic note come through clearly.' },
              { h3: 'Shoyu (soy)', text: 'Clear and savory with soy-driven depth; light on the palate but full of flavor. A great shoyu broth has a beautiful amber color and a savory-sweet balance from the soy tare that makes it endlessly satisfying without ever feeling heavy.' },
              { h3: 'Clear chicken and dashi', text: 'Golden tori chintan and dashi-forward broths are elegant and soothing without any heaviness. Dashi-based broths often have a subtle oceanic quality from kombu and bonito that makes them feel particularly clean and refined.' },
            ],
          },
          {
            h2: 'When a light bowl is the right call',
            body: (
              <p>
                I reach for light ramen at lunch when I do not want an afternoon slump, on warmer days when a
                heavy bowl feels like too much, and any time I want the comfort of ramen without the food coma.
                It is also the most forgiving style for a careful palate — clean and balanced rather than
                intense, which means I can taste every component individually and appreciate the work that went
                into the broth. Light ramen pairs naturally with more delicate toppings too: thin-sliced chicken,
                yuzu zest, fresh scallion, and a perfectly seasoned bamboo shoot all pop in a clear broth in a
                way they would be completely buried in a thick, creamy one.
              </p>
            ),
          },
          {
            h2: 'How to spot a great clean broth',
            body: (
              <p>
                With a light broth, quality has nowhere to hide, which makes it both the most demanding and the
                most rewarding style to evaluate. The tell is clarity and depth at the same time: the soup should
                look clean and taste like real stock and aromatics, savory without being salty or thin. A great
                shio broth shimmers when you tip the bowl — it has surface tension from gelatin but stays clear
                right through. Shops that specialize in shio or clear chicken broth are my best bets, because
                when a kitchen builds its reputation on a delicate bowl, it usually means they have the
                discipline and technique to back it up consistently.
              </p>
            ),
          },
          {
            h2: 'The toppings that work best with a light broth',
            body: (
              <p>
                Choosing the right toppings matters more in a light bowl than in a rich one, because a heavy
                topping can overwhelm a delicate broth rather than complement it. My favorites in a shio or clear
                chicken bowl are thin-sliced chicken breast or chashu, which contribute without competing;
                menma (bamboo shoots), which add texture and a subtle fermented note; and yuzu zest or a thin
                strip of citrus peel, which brightens the whole bowl with just a hint of fragrance. I tend to
                skip very rich toppings like thick fatty chashu or extra butter in a light bowl, because they
                change the character of the broth rather than working with it. A clean bowl should feel cohesive
                from the first sip to the last noodle.
              </p>
            ),
            points: [
              { h3: 'Thin-sliced chicken or delicate chashu', text: 'Light protein toppings add substance without overwhelming a clear broth. Thin-sliced chicken breast or a delicate rolled chashu contribute savory notes that work with the broth rather than competing with it.' },
              { h3: 'Citrus and fresh aromatics', text: 'A sliver of yuzu zest, a few drops of sudachi juice, or fresh scallion adds brightness to a shio or clear shoyu bowl in a way that feels intentional and elevating. These garnishes are a sign a kitchen thinks carefully about its lighter styles.' },
              { h3: 'Menma (bamboo shoots)', text: 'The subtle fermented crunch of bamboo shoots is one of the best companions to a clean broth. They add texture, a gentle savory note, and a slight sweetness that rounds out the bowl without adding any richness.' },
            ],
          },
          {
            h2: 'Light ramen vs. "not rich" ramen — the difference matters',
            body: (
              <p>
                Not every bowl that is not tonkotsu is a good light ramen. I have had plenty of shoyu or shio
                bowls that were thin and flat rather than clean and refined, and the difference is entirely in
                the kitchen's commitment to their stock. A truly great light ramen starts with a properly made
                dashi or stock — simmered gently, strained carefully, and seasoned precisely — and the result
                is something that feels intentional rather than merely restrained. When I am evaluating a light
                bowl, I taste the broth first before touching the noodles. If the broth alone is compelling —
                savory, aromatic, with distinct layers of flavor — the bowl is going to be excellent. If it
                tastes thin or flat on its own, no amount of good toppings will fix it.
              </p>
            ),
          },
        ]}
        tipsHeading="My light-ramen tips"
        tips={[
          'Filter to "Light and Clean," then sort by distance for the nearest delicate bowl — it is the fastest way to see what clear-broth options are available near you.',
          'Shio is the lightest classic style; shoyu and clear chicken broth are close behind and each have their own distinct character worth exploring.',
          'Light ramen is ideal for lunch and warm days — stacking the "Ramen for Lunch" filter alongside the light-clean filter surfaces the best midday options.',
          'Judge a light bowl on clarity plus depth: the broth should look clean and still taste of real stock and aromatics, savory without being salty or flat.',
          'Favor shops that specialize in shio or clear chicken broth for the best versions — a kitchen that has built its name on a delicate bowl invests in the technique and ingredient quality to back it up.',
          'Pay attention to toppings: a light bowl with citrus zest, bamboo shoots, and delicate chicken or chashu is a bowl that has been composed thoughtfully, not just assembled.',
          'Taste the broth first before touching the noodles — if the broth alone is compelling and savory, the bowl is going to be excellent from start to finish.',
          'Skip heavy add-ons like extra butter or fatty toppings in a light bowl; they change the character of the broth rather than enhancing it, and a great light ramen does not need them.',
        ]}
        faqs={[
          { q: 'What is light and clean ramen?', a: 'Light and clean ramen is built on a clear (chintan) broth rather than a creamy emulsified one. The broth is delicate, savory, and satisfying without being heavy or rich. Shio, shoyu, and clear chicken or dashi-forward broths are the lightest styles, and when made well they are some of the most refined bowls in all of ramen.' },
          { q: 'Which ramen is the lightest?', a: 'Shio (salt) ramen is the lightest and most delicate classic style, with a clear broth seasoned primarily with salt that lets a high-quality stock shine through. Shoyu (soy) and clear chicken or dashi-forward broths are close behind, each with their own distinct savory character. All three are significantly lighter than creamy styles like tonkotsu or tori paitan.' },
          { q: 'Is light ramen less flavorful?', a: 'No — the best clear broths are deeply savory and highly refined. Light refers to the body and feel of the broth, not the intensity of the flavor. A great shio bowl should taste of real stock, distinct aromatics, and considered seasoning, and it can be just as satisfying as a rich bowl, in a different and equally compelling way.' },
          { q: 'Is light ramen a good choice for lunch?', a: 'Yes — a clean, clear bowl satisfies without the afternoon energy dip that a very heavy bowl can cause. This is one of the main reasons I reach for light ramen at lunch. The lightness of the broth means the meal feels complete without being too much, and the flavor is still fully there from the first sip to the last.' },
          { q: 'What toppings work best with light ramen?', a: 'Delicate toppings that complement rather than overwhelm a clear broth work best. Thin-sliced chicken, a lightly seasoned bamboo shoot, citrus zest (yuzu is classic), fresh scallion, and nori are all excellent choices. I avoid very fatty chashu or extra butter in a light bowl because they change the character of the broth rather than working with it.' },
          { q: 'How do I tell a great shio broth from a mediocre one?', a: 'Taste it before you touch the noodles. A great shio broth should be clear, shimmering with a little gelatin, and taste of real stock and aromatics — savory, layered, and distinct — without being thin or flat. A mediocre shio broth tastes of salt water without depth. The quality of the stock underneath the seasoning is everything in a light bowl.' },
          { q: 'How do I find light ramen near me?', a: 'The map above is filtered toward light, clean bowls. Enter your ZIP or tap "Use my location" to sort the closest options by distance. From there I favor shops that specifically advertise shio or clear chicken broth, because those kitchens have committed to the delicate end of the spectrum and tend to execute it well.' },
          { q: 'Can light ramen be filling?', a: 'Absolutely. A well-constructed light bowl with good noodles, a properly made broth, and a thoughtful set of toppings is a complete and satisfying meal. The broth may be lighter in body than tonkotsu, but the overall bowl delivers protein, carbohydrates, and real savory satisfaction. I never leave a great shio or clear chicken bowl feeling like I needed more.' },
        ]}
      />
    </main>
  )
}
