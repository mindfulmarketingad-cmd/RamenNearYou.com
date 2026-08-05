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
  title: 'Ramen Noodles Near Me | Fresh Ramen Noodle Restaurants | RamenNearYou',
  description: 'Find ramen noodles near you — real ramen noodle restaurants serving fresh, springy noodles in house-made broth. Browse nearby spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-noodles' },
  openGraph: {
    title: 'Ramen Noodles Near Me',
    description: 'Find ramen noodle restaurants serving fresh noodles in house-made broth, near you.',
    url: 'https://www.ramennearyou.com/find/ramen-noodles',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenNoodlesPage() {
  const NATIONWIDE_FILTER = {  }
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
        pageTitle="Ramen Noodles Near Me"
        pageDescription="Showing ramen noodle restaurants near you — real bowls of fresh noodles in house-made broth, sorted by rating and distance. Enter your ZIP or tap &quot;Use my location.&quot;"
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Noodles Near Me" }]}
        title={`Ramen Noodles Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-noodles"
        heading="How I Find Real Ramen Noodles Near Me"
        intro={[
          'There is a world of difference between a 25-cent instant brick and a proper bowl of fresh ramen noodles in a long-simmered broth. When I want the real thing, I use the map above to find ramen noodle restaurants near me — set your ZIP or location and the closest, best-rated spots sort straight to the top. Fresh ramen noodles are not an ingredient; they are the centerpiece of the entire bowl, and finding a restaurant that treats them that way is worth the search.',
          'I have been obsessed with ramen noodles specifically — not just the broth, not just the toppings — for a long time. The noodle is where a kitchen shows its attention to detail. A great noodle has spring, bite, and a texture that holds up in the broth without turning soft. It is made with kansui, an alkaline water that gives it that distinctive chew and pale yellow color. A kitchen that gets the noodle right almost always gets everything else right too.',
          'Here is what separates great ramen noodles from the rest, how to read a menu and listing for signals that a kitchen takes its noodles seriously, and how to find a restaurant serving them near you. The noodle is the soul of the bowl, and once you start paying attention to it, you will never look at a ramen menu the same way again.',
          'Most people think about ramen broth first and noodles second. I think about them simultaneously, because the best bowls are the ones where the two are matched intentionally — a thin, straight noodle cut for a tonkotsu that lets the rich broth cling to every strand, or a thick, wavy noodle for a miso that holds up to the weight of fermented paste and corn. That pairing is a sign of a kitchen that understands what it is doing at a deep level.',
        ]}
        sections={[
          {
            h2: 'What are real ramen noodles?',
            body: (
              <p>
                Authentic ramen noodles are wheat noodles made with kansui — an alkaline mineral water that gives
                them their signature springy, chewy bite and pale yellow color. The alkalinity changes the structure
                of the gluten in the wheat, creating a texture you simply cannot get from noodles made with plain
                water. They come in many shapes suited to specific broths: thin and straight for tonkotsu, where
                the rich broth clings to every surface; thick and wavy for miso, to hold the heavier, more
                complex broth; extra-thick and extra-chewy for tsukemen, where the noodle is dipped rather than
                submerged. The best ramen noodle restaurants either make their noodles in-house on a daily basis
                or source them fresh from a dedicated noodle maker — never from a dried instant pack, which lacks
                the kansui entirely and produces a completely different texture.
              </p>
            ),
            points: [
              { h3: 'Made with kansui', text: 'Alkaline water gives ramen noodles their springy bite, chewy texture, and golden color. This is the single most important distinction between real ramen noodles and everything else.' },
              { h3: 'Matched to the broth', text: 'Thin noodles for rich tonkotsu, thick wavy noodles for miso, extra-thick for tsukemen dipping. The pairing is intentional and signals a kitchen that understands the full architecture of a bowl.' },
              { h3: 'Fresh, not instant', text: 'Top shops make noodles in-house or source them fresh daily. Fresh noodles have a texture and spring that dried noodles simply cannot replicate, and you can taste the difference in every bite.' },
            ],
          },
          {
            h2: 'How to find a ramen noodle restaurant nearby',
            body: (
              <p>
                Use the map to see every ramen noodle spot near you sorted by distance, then read the menu and recent
                reviews carefully. Shops that specifically mention house-made or fresh noodles on the menu are already
                signaling that they take the noodle seriously. Reviews that praise the noodle texture — "the noodles
                had such great bite," "the chewiness was perfect," "I could taste that the noodles were fresh" — are
                worth more to me than reviews that only mention the broth. Dedicated ramen shops almost always take
                their noodles seriously, which is another reason to favor focused ramen-ya over restaurants that
                include ramen as one option among many. A kitchen that has staked its identity on the bowl is almost
                always more careful about every element of that bowl.
              </p>
            ),
          },
          {
            h2: 'Restaurant ramen noodles vs. instant',
            body: (
              <p>
                Instant ramen has its place, but restaurant ramen noodles are a different dish entirely: cooked to
                order in boiling water to the precise firmness the kitchen intends, served with real spring and bite
                in a broth that has been simmering for hours, and finished with chashu, a marinated egg, nori, and
                fresh toppings chosen to complement the specific noodle and broth combination. The instant version
                pre-fries and dries the noodle, which fundamentally changes its texture — you get something that
                softens quickly in hot water rather than something that holds up and stays chewy through the meal.
                If you have only had instant ramen, your first bowl of properly made restaurant ramen noodles is
                usually a revelation, the moment you understand why people travel hours for a bowl.
              </p>
            ),
          },
          {
            h2: 'Noodle styles and what they tell you about the kitchen',
            body: (
              <p>
                The noodle a kitchen chooses for each bowl tells you a lot about how carefully the chef thought
                through the dish. A thin, straight noodle in a tonkotsu means the chef wants the broth — rich,
                opaque, coating — to be the dominant sensation. A wavy, medium noodle in a shoyu catches the
                lighter broth in its ridges, delivering more flavor per bite. An extra-thick flat noodle in a
                miso stands up to the weight of the fermented paste and the toppings without disappearing into
                the bowl. Kitchens that match their noodles to their broths with this kind of deliberateness are
                the ones I seek out, because that attention to detail usually extends to everything else on the
                table — the quality of the chashu, the seasoning of the tare, the temperature of the bowl when
                it arrives.
              </p>
            ),
            points: [
              { h3: 'Thin, straight noodles', text: 'Classic for tonkotsu and certain shoyu styles. They let a rich or clear broth cling tightly and deliver flavor with every strand.' },
              { h3: 'Thick, wavy noodles', text: 'The traditional match for miso ramen and some regional styles. The waves catch and hold the heavier broth, making each bite more substantial.' },
              { h3: 'Extra-thick noodles', text: 'Used in tsukemen (dipping ramen) and some regional specialties. The extra heft stands up to intense dipping broths without falling apart.' },
            ],
          },
        ]}
        tipsHeading="My tips for great ramen noodles"
        tips={[
          'Look for "house-made" or "fresh" noodles on the menu — texture is everything and the difference between fresh and dried is immediately obvious in every bite.',
          'Read reviews for praise of the noodles specifically, not just the broth; a reviewer who noticed the noodle quality paid real attention to the food.',
          'Match the noodle to the bowl: thin for tonkotsu, thick and wavy for miso, extra-thick for tsukemen dipping.',
          'Ask for kaedama (a noodle refill) at shops that offer it if you finish the noodles before the broth — it is one of the great pleasures of a serious tonkotsu shop.',
          'Eat fast — fresh noodles soften the longer they sit in hot broth, and the texture that makes them great starts to fade within a few minutes.',
          'Request firm noodles (kata) if the shop offers a firmness option so they hold up better while you work through the bowl.',
          'Pay attention to the noodle-broth pairing on the menu — a kitchen that matches them deliberately is one that understands the full architecture of a ramen bowl.',
          'If you can see the noodle-making area from your seat or it is described on the menu, that is a strong signal the kitchen takes its noodles seriously enough to make them in-house.',
        ]}
        faqs={[
          { q: 'How do I find ramen noodles near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." It shows ramen noodle restaurants nearby, sorted by rating and distance, so the best fresh-noodle bowls are easy to find. Look for listings that mention house-made or fresh noodles on the menu.' },
          { q: 'What are ramen noodles made of?', a: 'Authentic ramen noodles are wheat noodles made with kansui, an alkaline mineral water that gives them their springy, chewy texture and pale yellow color. The alkalinity changes the gluten structure in a way that plain-water noodles simply cannot replicate.' },
          { q: 'Are restaurant ramen noodles different from instant?', a: 'Very different. Restaurant ramen noodles are cooked to order and served firm and springy in a broth simmered for hours. Instant noodles are pre-fried and dried, which fundamentally changes their texture and flavor. If you have only had instant, your first fresh bowl is usually a revelation.' },
          { q: 'Which ramen noodle restaurants are best near me?', a: 'Sort the map by rating and look for shops that make noodles in-house or source them fresh. Reviews that specifically praise the noodle texture — not just the broth — are the strongest signal you will find a kitchen that takes the noodle as seriously as everything else.' },
          { q: 'What is kaedama?', a: 'Kaedama is a noodle refill offered at some ramen shops, most commonly tonkotsu-style places. When you finish your noodles but still have broth left, you can order a fresh serving of noodles to drop into the remaining broth. It is one of the great simple pleasures of a serious ramen meal.' },
          { q: 'Why do ramen noodles have a different color and texture from other noodles?', a: 'Ramen noodles get their pale yellow color and springy, chewy texture from kansui — an alkaline mineral water used in the dough. The alkalinity changes the structure of the gluten in the wheat flour, creating the distinctive bite that makes ramen noodles different from udon, soba, or pasta.' },
          { q: 'What does "noodle firmness" mean when ordering ramen?', a: 'Many ramen shops let you choose how firm your noodles are cooked. Kata means firm, with maximum chew and the slowest softening in the broth. Futsuu is medium, the default. Yawarakai is soft, for those who prefer a more tender bite. I default to kata so the noodles hold up longer while I eat.' },
          { q: 'Which noodle style goes with which ramen broth?', a: 'Thin, straight noodles are the classic match for tonkotsu and most shoyu styles. Thick, wavy noodles pair traditionally with miso. Extra-thick noodles are used in tsukemen dipping ramen. A kitchen that makes these pairings deliberately is usually one that understands what it is doing.' },
        ]}
      />
    </main>
  )
}
