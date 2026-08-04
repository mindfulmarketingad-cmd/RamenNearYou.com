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
  title: 'Thick Noodle Ramen Near Me | Chewy, Wavy Noodles | RamenNearYou',
  description: 'Find thick noodle ramen near you — chewy, wavy noodles with serious bite. Which broths suit thick noodles, why they matter, and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/thick-noodle-ramen' },
  openGraph: {
    title: 'Thick Noodle Ramen Near Me',
    description: 'Find chewy, thick-noodle ramen near you.',
    url: 'https://www.ramennearyou.com/find/thick-noodle-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ThickNoodleRamenPage() {
  const NATIONWIDE_FILTER = {  }
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
        pageTitle="Thick Noodle Ramen Near Me"
        pageDescription="Find ramen restaurants serving thick, chewy noodles near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Thick Noodle Ramen Near Me" }]}
        title={`Thick Noodle Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/thick-noodle-ramen"
        heading="Why I Seek Out Thick Noodle Ramen Near Me"
        intro={[
          'For me, the noodle is half the bowl, and thick noodles bring a chew and presence that thin strands just cannot match. That springy, toothsome bite holding onto a hearty broth is one of ramen\'s great pleasures. I have spent years seeking out bowls where the noodle itself is a major character rather than just a vehicle for broth, and thick noodles almost always deliver on that front. The map above helps you find ramen near you — enter your ZIP or use your location and look for the shops doing thick, chewy noodles.',
          'Noodle thickness is not a minor detail; it changes the entire eating experience from start to finish. A thick noodle requires more chewing, releases more starch into the broth as you eat, and creates a more filling, satisfying meal overall. The gauge of a noodle also determines which broths it pairs well with, which toppings feel right, and even how quickly you need to eat before the texture changes. Understanding thickness helps you order better every single time.',
          'I gravitate toward thick noodles when I want a bowl that feels substantial and hearty rather than delicate and refined. There is a time and place for a beautiful, refined thin-noodle bowl, but when I am craving real substance — after a long day, in cold weather, or when I just want to feel full and satisfied — thick noodles are where I turn. The styles that use them tend to be bold and concentrated, and the pairing makes total sense once you understand the logic behind it.',
          'The map above gives you everything you need to find thick-noodle ramen nearby right now. Here is why thick noodles matter, which styles rely on them, and how I hunt down the best bowls in any city I visit.',
        ]}
        sections={[
          {
            h2: 'Why noodle thickness matters',
            body: (
              <p>
                Thicker noodles have more chew and hold their texture longer in the bowl, so they stand up to
                heavy, robust broths without going soft. A thin noodle in a heavy miso or rich tsukemen dipping
                broth would absorb liquid quickly, lose its bite, and turn mushy before you finish. Thick noodles
                resist that fate, staying springy and satisfying from the first slurp to the last. They also
                carry more sauce or broth per bite because more surface area contacts the liquid with each pull.
                This is why styles built on intensity — like tsukemen and mazemen — almost always use thick
                noodles. If you have ever wished a bowl had more substance or felt that the noodle was getting
                lost in the broth, the noodle gauge was probably the missing piece.
              </p>
            ),
            points: [
              { h3: 'More chew', text: 'Thick, often wavy noodles deliver a satisfying, springy bite that holds up from first slurp to last. The extra dough means more resistance, and that resistance is what makes eating them so rewarding.' },
              { h3: 'Stands up to rich broth', text: 'They resist going mushy in heavy broths, so the texture stays right even as you take your time with the bowl. In concentrated dipping broths, this is essential — a thin noodle would fall apart.' },
              { h3: 'Carries more flavor', text: 'A thicker strand grabs more broth or tare per bite because more surface area contacts the liquid. This is especially important in mazemen and tsukemen, where concentration is everything.' },
            ],
          },
          {
            h2: 'Which styles use thick noodles',
            body: (
              <p>
                Thick noodles are the default for tsukemen (dipping ramen) and mazemen (brothless ramen), where
                texture is everything and there is no large volume of thin broth to dilute the experience. In
                tsukemen, you dip cold or room-temperature noodles into a small, intensely concentrated hot
                broth — the noodles need to be thick enough to carry that broth without disintegrating. Mazemen
                mixes noodles with a concentrated sauce or tare with no broth at all, so again, a sturdy noodle
                is essential. Hearty miso ramen, especially the Sapporo style, also favors thicker, curlier
                noodles to match its body and complement the corn and butter toppings common in that regional
                style. If you want guaranteed chew, those styles are the most reliable bet wherever you are eating.
              </p>
            ),
          },
          {
            h2: 'Wavy versus straight thick noodles',
            body: (
              <p>
                Not all thick noodles are the same — the shape matters as much as the gauge. Wavy thick noodles,
                common in Sapporo miso and many mazemen, have folds and ridges that trap even more broth or
                sauce in each bite. Straight thick noodles, common in some tsukemen styles, have a cleaner
                pull and a slightly more refined chew. I personally prefer wavy thick noodles in miso-based
                bowls because the waves create little pockets of flavor throughout the strand. In tsukemen I
                often prefer a straight-but-thick noodle that gives a clean, firm resistance when pulled from
                the dipping broth. When checking a menu or shop listing, look for photos that show the noodle
                detail — you can usually see the shape clearly, and it gives you a real preview of the eating
                experience before you even walk in.
              </p>
            ),
            points: [
              { h3: 'Wavy noodles trap sauce', text: 'The ridges and folds in wavy noodles create pockets that hold broth and tare, making each bite more flavorful and intensely seasoned.' },
              { h3: 'Straight thick noodles are clean', text: 'A straight thick noodle gives a firm, honest chew without the extra sauce-trapping of waves — great in dipping broths where you want control over each dip.' },
              { h3: 'Look for photos in listings', text: 'Noodle shape is visible in good food photos, so checking a shop\'s photo gallery tells you what to expect before you order.' },
            ],
          },
          {
            h2: 'How to find thick-noodle bowls',
            body: (
              <p>
                Noodle gauge is not always labeled on menus, so I have developed a few reliable strategies for
                finding thick-noodle bowls without leaving things to chance. First, I filter to tsukemen and
                mazemen — those styles almost always guarantee thick, chewy strands, and if a shop specializes
                in them, the noodles are almost certainly made to be thick by design. Second, I look for
                Sapporo-style miso, which is strongly associated with thicker, curlier noodles. Third, when
                checking any listing, I open the photos section and look at the noodle detail in the bowl images.
                A thick noodle is usually obvious from the photo alone. Finally, when I am at a new shop and
                uncertain, I simply ask — ramen cooks are passionate about their noodles and will happily tell
                you the gauge, the flour blend, and often how the noodles are made.
              </p>
            ),
          },
        ]}
        tipsHeading="My thick-noodle tips"
        tips={[
          'For guaranteed chew, filter to tsukemen or mazemen first — both styles almost always use thick noodles by design.',
          'Sapporo-style miso ramen is another reliable home for thick, curly noodles; look for corn and butter toppings as a visual clue.',
          'Thick noodles hold up in rich broths, so you can take your time without worrying about them going soft before you finish.',
          'Open the photo gallery in any listing and look at the noodle detail — a thick noodle is almost always obvious from a well-shot bowl photo.',
          'Ask the shop directly about noodle gauge; ramen cooks are proud of their noodles and happy to describe the thickness, shape, and flour blend.',
          'Wavy thick noodles trap more sauce and broth per bite than straight ones — if maximum flavor saturation is your goal, seek out the wavy variety.',
          'In cold weather, lean toward thick-noodle miso or tonkotsu bowls where the hearty noodles match the warming richness of the broth.',
          'If you are ordering tsukemen for the first time, try dipping just a few noodles at a time to appreciate the texture of the thick strand against the concentrated broth.',
        ]}
        faqs={[
          { q: 'What is thick noodle ramen?', a: 'It is ramen made with thicker, often wavy noodles that have more chew and hold their texture longer in the bowl. Thick noodles suit hearty, intense bowls and styles like tsukemen, mazemen, and Sapporo-style miso. The extra gauge gives them a satisfying, springy resistance that thinner noodles simply cannot provide.' },
          { q: 'Why do some ramen styles use thick noodles?', a: 'Thick noodles stand up to rich, robust broths without going mushy and carry more broth or tare per bite. In tsukemen, where you dip noodles into a small, intensely concentrated broth, thickness is essential — a thin noodle would absorb too much liquid and fall apart. In mazemen, the thick noodle holds the sauce-like coating across its entire surface.' },
          { q: 'Which ramen styles have the thickest noodles?', a: 'Tsukemen and mazemen almost always use thick, chewy noodles, and Sapporo-style miso favors thicker, curlier ones. Filter to those styles for a reliable chew. Some regional Japanese styles outside Hakata also use thicker noodles in miso or shoyu bases.' },
          { q: 'Are thick or thin noodles better for ramen?', a: 'Neither is objectively better — it is about matching the noodle to the broth and style. Thick noodles suit heavy, concentrated bowls like tsukemen and miso; thin noodles suit light, clear, or very creamy ones like Hakata tonkotsu. Understanding the pairing helps you appreciate both more deeply, and personal preference ultimately guides the choice.' },
          { q: 'How do I find thick noodle ramen near me?', a: 'Use the map above to find ramen nearby, then favor tsukemen, mazemen, or Sapporo miso styles, which reliably use thick noodles. Check menus and photo galleries on each listing for visual confirmation of the noodle style, and do not hesitate to ask the shop directly.' },
          { q: 'Do thick noodles go soft faster or slower than thin noodles?', a: 'Slower, generally. Thick noodles have more dough to absorb broth before they go soft, which is one of the main reasons concentrated styles like tsukemen and hearty miso rely on them. You have more time to eat without the texture degrading, though fresh thick noodles are still best eaten promptly.' },
          { q: 'What is the difference between wavy and straight thick noodles?', a: 'Wavy thick noodles have ridges and folds that trap more broth and sauce per bite, making them especially good in miso and mazemen. Straight thick noodles offer a cleaner, firmer chew and are often preferred in tsukemen where you want more control over how much concentrated broth comes with each bite.' },
          { q: 'Can I request thick noodles at any ramen shop?', a: 'Most ramen shops use a specific noodle matched to their broth, and they may not offer a thickness choice. Some shops do offer a noodle selection, but in most cases the noodle type is fixed per dish. The best approach is to order styles — tsukemen, mazemen, miso — that are built around thick noodles from the start.' },
        ]}
      />
    </main>
  )
}
