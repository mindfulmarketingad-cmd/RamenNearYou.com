import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import ServiceCityLinks from '@/components/service-city-links'
import { getServiceCityLinks } from '@/lib/city-filter-pages'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Ramen Tonkotsu Near Me | Rich Pork-Bone Ramen | RamenNearYou',
  description: 'Find tonkotsu ramen near you — the rich, creamy pork-bone broth from Hakata. What real tonkotsu tastes like, how to order it, and how to spot the good stuff.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tonkotsu-ramen' },
  openGraph: {
    title: 'Ramen Tonkotsu Near Me',
    description: 'Find rich, creamy tonkotsu (pork-bone) ramen near you.',
    url: 'https://www.ramennearyou.com/find/tonkotsu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function TonkotsuRamenPage() {
  const cityLinks = getServiceCityLinks('Tonkotsu')
  const NATIONWIDE_FILTER = { initialBowls: ["tonkotsu"] }
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
        initialBowls={['tonkotsu']}
        pageTitle="Ramen Tonkotsu Near Me"
        pageDescription="Showing tonkotsu (pork-bone) ramen near you. Enter your ZIP or use your location to find a rich, creamy bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Tonkotsu Near Me" }]}
        title={`Ramen Tonkotsu Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/tonkotsu-ramen"
        guideLink={{
          href: '/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen',
          title: 'Tonkotsu vs. Shoyu vs. Shio vs. Miso: The 4 Types of Ramen Explained',
          blurb: 'How tonkotsu compares to the other three classic broth styles — history, technique, flavor, and what to order.',
        }}
        heading="My Guide to Finding Real Tonkotsu Ramen Near Me"
        intro={[
          'Tonkotsu is the bowl that made me fall in love with ramen — that rich, creamy, milky-white pork broth that coats every noodle and stays with you long after the last sip. The first time I had a properly made tonkotsu, I understood immediately why people fly to Fukuoka just for a bowl. The map above is filtered to tonkotsu ramen near you, so you can skip straight to the good stuff. Enter your ZIP or use your location and the closest spots sort to the top.',
          'Great tonkotsu is a labor of love, and not every bowl labeled "tonkotsu" lives up to the name. The difference between a simmered-all-day tonkotsu and a shortcut version is unmistakable once you know what to taste for. Here is what the style actually is, how to recognize a serious version, and exactly how I order it to get the most out of every bowl.',
          'I have eaten a lot of tonkotsu over the years, in tiny counter-seat shops and in sprawling restaurants, and the through-line in every memorable bowl is time. The broth cannot be rushed. When a kitchen puts in the hours, you taste it immediately in the weight and cling of the broth. This guide is my attempt to help you find that bowl wherever you are right now.',
          'Beyond just finding a nearby spot, I want to give you the vocabulary and the confidence to walk in, read a menu, and order like you know exactly what you are doing. Tonkotsu has its own customs around noodle firmness, extra noodle portions, and condiments that are worth knowing before you sit down.',
        ]}
        sections={[
          {
            h2: 'What tonkotsu actually is',
            body: (
              <p>
                Tonkotsu means "pork bone," and that is the whole secret. The bones — typically femur and knuckle
                bones — are blanched to remove impurities, then boiled hard at a rolling simmer for 12 to 18 hours
                until the collagen and marrow fully break down into a thick, opaque, almost creamy white broth.
                It originated in Fukuoka (Hakata) on the island of Kyushu and is traditionally served with thin,
                firm, straight noodles and paper-thin slices of chashu pork. Done right, it is rich without being
                greasy — deeply porky, savory, and carrying a subtle natural sweetness that makes you want to drink
                every drop. The bowl is deliberately simple in construction because the broth itself is the star,
                and nothing should compete with it.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Milky-white and full-bodied from long-simmered pork bones — the texture should coat the noodles and cling to the side of the bowl, not sit thin and watery. If you tilt the bowl and the broth slides cleanly, it was not simmered long enough.' },
              { h3: 'The noodles', text: 'Classic Hakata style uses thin, firm, straight noodles cooked to order at your chosen firmness. "Katame" means extra firm, "futsuu" is standard, and "yawarakame" is soft. I always go katame so the noodles hold up in the rich broth rather than turning mushy.' },
              { h3: 'The toppings', text: 'Chashu pork, wood-ear mushroom (kikurage), scallion, and often a soft marinated egg (ajitsuke tamago). Many Hakata-style shops let you order kaedama — an extra portion of noodles dropped into your remaining broth so you can finish every last drop.' },
            ],
          },
          {
            h2: 'How to spot great tonkotsu',
            body: (
              <p>
                The tell is the broth's body. A serious tonkotsu has real weight and cling — you can see it
                coating the side of the bowl, and it leaves a thin film on your spoon — because it was simmered
                for the better part of a day. Thin, pale, or oily-on-top broth usually means a shortcut: either
                a concentrate was used or the simmer was cut short. I also look for shops that specialize in
                tonkotsu rather than offering ten different broths on the same menu; the focused kitchens almost
                always nail it because they are tending that one pot all day. The smell is another signal —
                a good tonkotsu shop has a deep, porky aroma that hits you as soon as you walk in.
              </p>
            ),
            points: [
              { h3: 'Broth opacity and cling', text: 'The broth should be genuinely milky and opaque, not translucent with a creamy swirl. Opacity comes from sustained high heat breaking down the collagen, and it cannot be faked quickly.' },
              { h3: 'Focused menus', text: 'A shop that does only tonkotsu, or tonkotsu with a couple of small variations, is almost always better than one offering every broth style. Specialization means that pot has been tended, tasted, and adjusted all day.' },
              { h3: 'The tare and seasoning table', text: 'Many Hakata-style shops put sesame seeds to crush, pickled ginger, extra garlic, and chili oil on the table. These are meant to customize the bowl as you eat, and their presence signals a shop that takes the full experience seriously.' },
            ],
          },
          {
            h2: 'How I order my tonkotsu',
            body: (
              <p>
                If the shop cooks noodles to order, I ask for them firm (katame) so they hold up in the rich
                broth without going soft before I finish. I add a soft egg and extra chashu without hesitation —
                the egg yolk bleeds into the broth and makes it even richer, and you can never have too much
                chashu. If there is a kaedama option, I order a second round of noodles to finish the broth at
                the end rather than leaving any behind. A little fresh crushed garlic from the table takes
                it over the top, and a small swirl of the chili oil adds a nice contrast to the richness.
                I tend to skip the pickled ginger on the first bowl so I can taste the broth clean, then add it
                toward the end for a palate-cleansing brightness.
              </p>
            ),
            points: [
              { h3: 'Build your bowl at the table', text: 'Use the condiments thoughtfully: garlic deepens the savory notes, chili oil adds heat, and pickled ginger cuts the richness. Add one at a time so you can taste the effect of each.' },
              { h3: 'The kaedama ritual', text: 'When you are down to mostly broth, order kaedama. The cook drops fresh noodles directly into your bowl. It is the Hakata way to finish, and it means nothing is wasted.' },
              { h3: 'Pacing matters', text: 'Tonkotsu broth is thick and hot, so it holds temperature well. Still, eat the noodles first before they soften too much, then slow down and enjoy the broth on its own terms.' },
            ],
          },
          ...(cityLinks.length > 0 ? [{
            h2: 'Tonkotsu Ramen by City',
            body: (
              <>
                <p>
                  Want a deeper dive into a specific city&apos;s tonkotsu scene? I have written dedicated guides
                  for these cities, each with its own map, top picks, and local notes:
                </p>
                <ServiceCityLinks links={cityLinks} />
              </>
            ),
          }] : []),
          {
            h2: 'Regional styles and variations worth knowing',
            body: (
              <p>
                While Hakata tonkotsu is the archetype, the style has spawned variations across Japan and beyond.
                Kurume tonkotsu, from a city south of Fukuoka, is even darker and more intensely flavored from
                a longer simmer and a "returning soup" technique where old broth is blended into each new batch.
                Kumamoto tonkotsu tends to be slightly lighter and is often enriched with a small amount of chicken
                broth and finished with roasted garlic oil. Outside Japan, many shops blend tonkotsu with other
                stocks or add their own signatures — a touch of soy, a hit of miso — which can produce excellent
                bowls even if they stray from the original. My approach when I encounter a variation is to ask
                the staff what makes their version distinct, then order it as they intended.
              </p>
            ),
            points: [
              { h3: 'Hakata style', text: 'The original: very thin straight noodles, clean milky broth, minimal toppings, and kaedama service. Purists love it for its restraint and intensity.' },
              { h3: 'Kurume style', text: 'Darker and more pungent from the returning-soup method, with a deeper, almost funky depth that regular tonkotsu does not have. It is an acquired taste and worth seeking out.' },
              { h3: 'Modern fusion tonkotsu', text: 'Many shops outside Japan blend tonkotsu with other elements — truffle oil, smoked chashu, or a soy tare — creating hybrid bowls that honor the technique while adding new dimensions. Approach with an open mind.' },
            ],
          },
        ]}
        tipsHeading="My tonkotsu ordering tips"
        tips={[
          'Filter to "Tonkotsu," then sort by distance for the nearest creamy bowl. The map is already set to tonkotsu so you just need to confirm your location.',
          'Favor shops that specialize in tonkotsu or list it as their signature — focused kitchens nail the long-simmered broth far more consistently than all-purpose menus.',
          'Ask for firm noodles (katame) so they hold their texture in the rich, heavy broth instead of turning soft and losing their bite.',
          'Add a soft marinated egg every time — the jammy yolk bleeds into the broth and makes it noticeably richer and more complex.',
          'Order kaedama (extra noodles) when you are down to just broth. It is the traditional Hakata way to finish and ensures you do not waste a single drop of that long-simmered stock.',
          'Use the table condiments gradually: start with the broth clean, then add crushed garlic for depth, chili oil for heat contrast, and pickled ginger at the end for brightness.',
          'Stack "Top Rated" to find the best-reviewed tonkotsu near you, then check that those reviews specifically mention the broth — not just the overall experience.',
          'If you are visiting a new area, look for spots that open early for lunch — serious tonkotsu shops often start their broth the night before and open when it is at its peak.',
        ]}
        faqs={[
          { q: 'What is tonkotsu ramen?', a: 'Tonkotsu is ramen built on a rich, creamy broth made by simmering pork bones for 12 to 18 hours until the collagen and marrow break down into a milky, opaque stock. It originated in Fukuoka (Hakata) on the island of Kyushu and is typically served with thin, firm noodles, chashu pork, wood-ear mushroom, and scallion. The broth is the entire point of the bowl.' },
          { q: 'Is tonkotsu ramen pork?', a: 'Yes — "tonkotsu" literally means pork bone. The broth is made entirely from pork bones and the bowl is usually topped with chashu pork, so it is not vegetarian unless a shop offers a dedicated plant-based version. If you avoid pork, ask specifically — some shops make a chicken or mixed-base version under the same name.' },
          { q: 'How do I find tonkotsu ramen near me?', a: 'The map above is already filtered to tonkotsu. Enter your ZIP code or tap "Use my location" to sort the closest bowls by distance, then open any listing to see hours, photos, reviews, and directions. I recommend sorting by distance first and then checking ratings.' },
          { q: 'How can I tell if tonkotsu is good?', a: 'Look for a broth with real body that coats the bowl and your spoon — the result of a long, sustained simmer. Thin, pale, or oily-on-top broth signals a shortcut. Shops that specialize in tonkotsu rather than offering many broth styles are almost always better. A good tonkotsu shop also smells deeply porky and savory from the moment you walk in.' },
          { q: 'What does "katame" mean?', a: 'Katame means firm noodles, and it is my default request at any Hakata-style shop. Thin tonkotsu noodles cook quickly and continue softening in the hot broth, so ordering them firm ensures they still have bite by the time you are halfway through the bowl. The opposite is yawarakame (soft), and futsuu is the standard in between.' },
          { q: 'What is kaedama?', a: 'Kaedama is an extra portion of noodles that you order when your bowl is mostly broth. The cook drops fresh noodles directly into your remaining soup so you can finish every drop. It is a Hakata tradition and a sign that a shop is serious about the full tonkotsu experience. Some shops include kaedama in the price; others charge a small extra fee.' },
          { q: 'Why is tonkotsu broth white and opaque?', a: 'The opacity comes from the way pork bones are cooked: at a vigorous, rolling boil for many hours, which emulsifies the fat and collagen into the water and creates a milky suspension. A slow simmer produces a clear stock; it is only the sustained high heat that drives the transformation into tonkotsu\'s signature creamy texture.' },
          { q: 'Is tonkotsu ramen healthy?', a: 'Tonkotsu is a calorie-dense, protein-rich bowl — the broth is high in collagen, fat, and sodium. It is not a diet food, but the collagen from the bones is genuinely nutritious. If you are watching sodium, drink less of the broth; the noodles and toppings on their own are more moderate. Treat it as an occasional indulgence rather than an everyday meal.' },
        ]}
      />
    </main>
  )
}
