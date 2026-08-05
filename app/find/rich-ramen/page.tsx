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
  title: 'Rich & Creamy Ramen Near Me | Thick, Decadent Bowls | RamenNearYou',
  description: 'Find rich and creamy ramen near you — the thickest, most decadent bowls, from tonkotsu to chicken paitan. What makes broth creamy and how to find the richest bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/rich-ramen' },
  openGraph: {
    title: 'Rich & Creamy Ramen Near Me',
    description: 'Find the richest, creamiest ramen bowls near you.',
    url: 'https://www.ramennearyou.com/find/rich-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RichRamenPage() {
  const NATIONWIDE_FILTER = { initialMoods: ["rich-creamy"] }
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
        initialMoods={['rich-creamy']}
        pageTitle="Rich & Creamy Ramen Near Me"
        pageDescription="Showing rich, creamy ramen near you. Enter your ZIP or use your location to find a decadent bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Rich & Creamy Ramen Near Me" }]}
        title={`Rich & Creamy Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/rich-ramen"
        heading="Where I Find the Richest, Creamiest Ramen Near Me"
        intro={[
          'Some days only a thick, decadent, lip-coating bowl will do — the kind of ramen so rich it feels genuinely indulgent, the kind that leaves a little collagen on your lips and makes every noodle slippery and satisfying. The map above is filtered toward rich and creamy ramen near you, the most luxurious bowls in your area. Enter your ZIP or use your location to find the closest one and start planning your meal.',
          'Richness in ramen is one of those qualities that sounds simple but is actually the product of tremendous technical work. The thick, opaque, milky texture of a great tonkotsu or chicken paitan does not happen by accident — it is the result of hours of hard boiling, careful temperature management, and a precise understanding of how collagen, fat, and water interact under heat. When you taste a truly exceptional rich broth, you are tasting that effort in every sip.',
          'I have been chasing rich ramen for as long as I have been eating ramen seriously, and my understanding of what makes a great creamy bowl has evolved considerably over the years. Early on I thought richness was just about quantity of fat — more lard, more butter, more pork. Now I understand that the best rich broths have something more important: structure. The collagen from the bones gives the broth body that clings to noodles without feeling greasy, and that distinction is everything.',
          'Whether you are a tonkotsu purist, a fan of the sweeter and slightly lighter chicken paitan, or someone who loves a deeply rich miso or sesame bowl, this guide covers the full spectrum of rich ramen styles and how to order for maximum satisfaction. The richest bowl near you is waiting.',
        ]}
        sections={[
          {
            h2: 'What makes a broth rich and creamy',
            body: (
              <p>
                That creamy, opaque texture comes from emulsification — boiling bones hard and long until
                collagen, fat, and marrow break down and blend into the liquid. The result is a broth with body
                that clings to every noodle and coats the palate in a way that a clear broth never can. Tonkotsu
                (pork) and tori paitan (chicken) are the classic creamy broths, produced through this exact
                process of aggressive simmering over many hours. Rich miso and certain sesame bowls achieve their
                body through a different mechanism — paste and fat blended into the broth rather than bone
                collagen — but deliver an equally satisfying result. Understanding which technique a kitchen
                uses helps you predict what the broth will taste like before you even order.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'The benchmark for rich ramen — pork bones simmered hard for many hours into a milky, collagen-heavy broth that coats the bowl and clings to every strand of noodle. The best tonkotsu has a porky sweetness underneath the richness that makes it genuinely complex rather than just heavy.' },
              { h3: 'Chicken paitan', text: 'Creamy and luxurious from hard-simmered chicken bones, a touch lighter and sweeter than pork tonkotsu but equally rich in body and deeply satisfying. Chicken paitan is one of the most exciting styles in contemporary ramen, and excellent versions can be every bit as impressive as the best tonkotsu.' },
              { h3: 'Rich miso and sesame', text: 'Body from fermented soybean paste, ground sesame, and fat rather than bones — hearty, full, and deeply savory. Rich miso ramen in particular is a style with tremendous range: it can be warming and rustic or refined and complex depending on the miso blend and the tare that accompanies it.' },
            ],
          },
          {
            h2: 'The richest bowls to order',
            body: (
              <p>
                For maximum decadence, I look for tonkotsu (especially with a swirl of black garlic oil or
                extra fat), tori paitan, and rich or spicy miso. Adding extra chashu — thick-cut, properly
                braised, with a caramelized edge — and a soft, jammy seasoned egg pushes a bowl further into
                genuinely indulgent territory. If a shop is known for a thick "double soup" (kotteri) or an
                extra-rich house broth with additional fat blended in, that is exactly what this craving calls
                for. I also pay attention to how a shop describes the noodle recommendation for their richest
                bowls — a thick, wavy noodle specifically developed to hold creamy broth is a signal the kitchen
                has thought through the whole experience.
              </p>
            ),
          },
          {
            h2: 'Balancing the richness',
            body: (
              <p>
                A truly rich bowl is glorious but intense, and knowing how to work with that intensity rather
                than against it makes the experience significantly better from start to finish. I order firm
                noodles (かた) when I am getting a rich tonkotsu, because firm noodles cut through the heaviness
                texturally and stay interesting longer as the meal progresses. A squeeze of acidity — from a
                wedge of sudachi or a spoonful of pickled ginger — resets the palate between bites and keeps
                every sip feeling fresh rather than cumulative. A crisp, cold drink on the side does something
                similar. The goal is to enjoy the richness fully without getting overwhelmed by it halfway
                through the bowl.
              </p>
            ),
          },
          {
            h2: 'Kotteri vs. assari — understanding richness levels',
            body: (
              <p>
                Many tonkotsu and paitan shops in Japan offer a richness spectrum described as kotteri (heavy)
                and assari (lighter), and some ramen shops outside Japan have adopted this same language or
                something equivalent. Kotteri means extra fat has been added to the broth — typically a float
                of back fat or extra pork oil — making the bowl denser and more coating. Assari is the same
                broth base without the additional fat, which is slightly less rich but still plenty creamy from
                the collagen itself. When I am in full indulgence mode, I go kotteri. When I want the flavor
                and body of a rich broth without quite as much fat, I ask for the lighter preparation. Both
                are excellent; the choice depends on the mood and how hungry I am.
              </p>
            ),
            points: [
              { h3: 'Kotteri (heavy)', text: 'Extra fat added to the broth — back fat, pork oil, or both — for maximum richness and a coating, lip-glossing texture. This is the full indulgence version of a rich ramen and one of the most satisfying things you can eat on the right day.' },
              { h3: 'Assari (lighter)', text: 'The same rich broth base without the extra fat, letting the collagen and bone flavor come through more clearly. Still creamy and full-bodied from hours of simmering, but with a slightly cleaner finish that some diners prefer.' },
              { h3: 'Black garlic oil (mayu)', text: 'A swirl of charred garlic oil on top of a tonkotsu or paitan bowl adds a smoky, bitter-sweet depth that takes the richness in a completely new direction. If a shop offers it, I almost always say yes — it is one of the great ramen finishing flourishes.' },
            ],
          },
          {
            h2: 'How I evaluate a rich ramen shop before I go',
            body: (
              <p>
                When I am looking for the best rich ramen in a new area, I look for a few specific signals in
                reviews and menu descriptions. First, I want to see the broth described with specificity —
                "eighteen-hour tonkotsu" or "hard-simmered chicken paitan" tells me the kitchen understands
                what it takes to make a genuinely rich broth. Generic descriptions like "creamy soup" or "rich
                broth" without any elaboration are less reassuring. Second, I look for photos that show the
                visual texture of the broth — a great tonkotsu should look opaque and milky, almost like thin
                whole milk, not translucent or thin. Third, I check whether the shop has a reputation for their
                chashu, because a kitchen that takes the time to properly braise their pork belly is usually a
                kitchen that takes everything else seriously too.
              </p>
            ),
          },
        ]}
        tipsHeading="My rich-ramen tips"
        tips={[
          'Filter to "Rich and Creamy," then sort by distance for the nearest decadent bowl — it is the fastest way to see what truly rich options are near you right now.',
          'Tonkotsu, chicken paitan, and rich miso are the most reliably creamy styles; a shop that specializes in one of these is almost always a better bet than a generalist shop with a token creamy bowl.',
          'Add black garlic oil (mayu), extra thick-cut chashu, and a soft jammy egg for maximum indulgence — these three additions push any rich bowl into genuinely special territory.',
          'Order firm noodles (kata) in a rich bowl; they cut through the heaviness texturally and hold up better as the meal progresses without turning soft in the thick broth.',
          'Use pickled ginger or a squeeze of acidity to reset your palate between bites; it keeps a rich bowl feeling fresh from the first sip to the last and prevents the richness from becoming overwhelming.',
          'A crisp, cold drink alongside a heavy bowl makes the whole experience better — the contrast keeps every bite feeling lively rather than cumulative.',
          'Look for shops that describe their broth with specifics like simmering time or bone type; that level of detail signals a kitchen that has mastered what it takes to produce a genuinely great rich broth.',
          'Check photos in reviews before visiting; a great tonkotsu should look opaque and milky in the bowl — if the broth looks clear or thin in photos, the bowl probably will not deliver the richness you are after.',
        ]}
        faqs={[
          { q: 'What is rich and creamy ramen?', a: 'Rich and creamy ramen has a thick, opaque, lip-coating broth that comes from long-simmered bones — typically pork (tonkotsu) or chicken (tori paitan) — or from blended miso and sesame bowls. The texture clings to every noodle and coats the palate in a way that a clear broth never can. It is the most indulgent and satisfying end of the ramen spectrum.' },
          { q: 'What makes ramen broth creamy?', a: 'Emulsification — boiling bones hard for many hours until collagen, fat, and marrow break down and blend into the liquid, giving the broth its milky, opaque body. The collagen from the bones is what gives a great tonkotsu or paitan its characteristic texture that clings to noodles. Miso and sesame bowls achieve richness differently, through the fat and protein content of the paste itself rather than through bone collagen.' },
          { q: 'Which ramen is the richest?', a: 'Tonkotsu is the benchmark, especially kotteri-style with extra back fat or pork oil; tori paitan (chicken) is comparably rich and creamy; and thick or spicy miso is also very satisfying. Adding extra chashu and a soft egg pushes any of these styles further into genuinely indulgent territory. Black garlic oil (mayu) on tonkotsu adds a smoky depth that many people find to be the most luxurious version of the bowl.' },
          { q: 'How do I balance a very rich bowl?', a: 'Order firm noodles, which cut through the heaviness texturally and stay interesting as the meal progresses. Use pickled ginger or a little acidity — a squeeze of citrus or a spoonful of vinegar — to reset your palate between bites. Keep a crisp, cold drink on the side for the same reason. A little contrast with the richness keeps every sip and every bite feeling fresh rather than overwhelming.' },
          { q: 'What is kotteri vs. assari in ramen?', a: 'Kotteri means extra fat has been added to the broth — typically back fat or pork oil floated on top — for maximum richness and an even more coating texture. Assari is the same base broth without the added fat, which is still creamy from collagen but with a slightly cleaner finish. Many tonkotsu and paitan shops let you choose between the two, and both are excellent depending on how much richness you are in the mood for.' },
          { q: 'What is black garlic oil (mayu) in ramen?', a: 'Mayu is a charred garlic oil made by blackening garlic cloves and blending them into lard or pork fat, then swirling the result into the bowl just before serving. It adds a distinctive smoky, bitter-sweet depth that transforms a tonkotsu or paitan bowl into something more complex and more exciting. It is one of the great ramen finishing touches, and if a shop offers it I almost always say yes.' },
          { q: 'How do I find rich ramen near me?', a: 'The map above is filtered toward rich, creamy bowls. Enter your ZIP or tap "Use my location" to sort the closest decadent ramen by distance. From there I look for shops that describe their broth with specifics — simmering time, bone type, kotteri options — because that level of detail signals a kitchen that has committed to the craft of making genuinely great rich broth.' },
          { q: 'Is chicken paitan as rich as tonkotsu?', a: 'Yes — a well-made tori paitan is just as rich and creamy as tonkotsu, because it uses the same emulsification technique of hard-simmering bones until the collagen and fat break down and blend into the broth. The flavor is different: slightly sweeter and lighter from the chicken rather than the deep porky savor of tonkotsu. Many people who find tonkotsu too heavy prefer chicken paitan, and outstanding versions can be every bit as impressive as the best pork ramen.' },
        ]}
      />
    </main>
  )
}
