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
  title: 'Hokkaido Ramen Near Me | Sapporo Miso & Northern Styles | RamenNearYou',
  description: 'Find Hokkaido ramen near you — Sapporo miso, Hakodate shio, and Asahikawa shoyu. The northern Japanese styles to know and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hokkaido-ramen' },
  openGraph: {
    title: 'Hokkaido Ramen Near Me',
    description: 'Find Hokkaido-style ramen — Sapporo miso and more — near you.',
    url: 'https://www.ramennearyou.com/find/hokkaido-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function HokkaidoRamenPage() {
  const NATIONWIDE_FILTER = { initialQuery: "hokkaido" }
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
        initialQuery="hokkaido"
        pageTitle="Hokkaido Ramen Near Me"
        pageDescription="Find Hokkaido-style ramen near you — Sapporo miso and more. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Hokkaido Ramen Near Me" }]}
        title={`Hokkaido Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/hokkaido-ramen"
        heading="My Guide to Hokkaido Ramen Near Me"
        intro={[
          'Hokkaido, Japan\'s cold and rugged northern island, is one of ramen\'s most important homelands — and its bowls are built for winter: hearty, warming, and deeply satisfying in a way that makes sense given the climate they evolved in. I fell in love with Hokkaido-style ramen the first time I had a proper Sapporo miso bowl, and I have been chasing that experience ever since. The map above helps you find Hokkaido-style ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'What makes Hokkaido ramen so compelling to me is that it feels purposeful. Every element — the thick miso broth, the pat of butter, the corn kernels, the layer of fat on the Asahikawa style — exists for a reason, and that reason is keeping a diner warm and satisfied in a place where winters are serious. That same logic makes Hokkaido bowls the perfect comfort food for anyone, anywhere, when the weather turns cold or when you simply need something deeply nourishing.',
          'When people say "Hokkaido ramen," they usually mean one of three distinct city styles. Each city developed its own broth, its own noodle, and its own personality over decades of tradition. Here is what each one is, why each one matters, and how I find a great version outside of Japan.',
          'Finding authentic Hokkaido-style ramen outside Japan is genuinely possible if you know what to look for. Sapporo miso is the most widely available of the three styles, but dedicated shops sometimes carry all three, and the regional detail they put into the bowl reflects genuine respect for the tradition.',
        ]}
        sections={[
          {
            h2: 'The three great Hokkaido styles',
            body: (
              <p>
                Hokkaido\'s ramen reputation rests on three cities, each of which developed a signature broth
                style that reflects its geography, climate, and culinary culture. Sapporo, the island\'s capital
                and largest city, gave the world miso ramen — hearty, rich, and deeply warming. Hakodate, a
                historic port city in the south, developed a clear, delicate salt broth that reflects its
                maritime history. Asahikawa, an inland city known for harsh winters, created a shoyu-based
                style with a layer of fat on top to retain heat. Together they cover rich, light, and balanced,
                so there is a Hokkaido bowl for every mood and occasion.
              </p>
            ),
            points: [
              { h3: 'Sapporo miso', text: 'The most famous Hokkaido style — a hearty, fermented-soybean broth, often enriched with corn, butter, bean sprouts, and ground pork over thick, curly noodles. Pure cold-weather comfort and the style you are most likely to find at shops outside Japan.' },
              { h3: 'Hakodate shio', text: 'A clear, delicate salt-based broth from the port city of Hakodate — light, clean, and refined. It showcases the quality of the stock beneath the seasoning, making it an elegant counterpoint to the heavier Sapporo style.' },
              { h3: 'Asahikawa shoyu', text: 'A soy-based broth with a deliberate layer of lard or oil floating on top to trap heat and keep the bowl piping hot in bitter cold. Paired with wavy noodles, it is a distinctive style that rewards those who seek it out.' },
            ],
          },
          {
            h2: 'Why Hokkaido ramen is built for cold',
            body: (
              <p>
                Hokkaido winters are genuinely brutal — cold, long, and snowy in a way that shapes daily life
                on the island. The ramen evolved to match those conditions, and every design choice reflects
                the climate it was built for. Sapporo\'s miso broth is thick and warming, the fermented soybean
                adding a depth of flavor that sustains rather than just satisfies. Asahikawa\'s shoyu style
                famously floats a layer of fat on top — not for richness alone, but specifically to trap heat
                so the bowl stays hot to the very last sip in freezing air. Even the toppings tell the same
                story: corn, butter, plenty of pork, and generous portions lean hearty and caloric. It is ramen
                as fuel against the cold, and it is wonderful any time you want that level of comfort,
                regardless of the actual weather outside.
              </p>
            ),
          },
          {
            h2: 'The magic of Sapporo miso ramen',
            body: (
              <p>
                Sapporo miso deserves its own examination because it is such a distinctive and beloved bowl.
                The miso tare in a great Sapporo bowl is not a single ingredient — it is a blend of different
                miso types, sometimes with added fats and aromatics, that creates a complex, layered seasoning.
                The broth beneath is typically a pork-based stock that combines with the miso for incredible
                depth. The toppings are integral rather than decorative: corn adds sweetness, butter adds
                richness and a glossy sheen, bean sprouts add texture and freshness, and ground pork adds
                body and savory intensity. Thick, curly noodles are the right vehicle, catching and holding
                all that rich broth in every wave and ridge.
              </p>
            ),
            points: [
              { h3: 'Blended miso tare', text: 'The best Sapporo miso uses a blend of miso types rather than a single kind, creating complexity and depth that a single-variety tare cannot achieve on its own.' },
              { h3: 'Integral toppings', text: 'Corn, butter, bean sprouts, and ground pork are not garnish in a Sapporo bowl — they are structural elements that contribute sweetness, richness, texture, and savory depth to the finished dish.' },
              { h3: 'Thick, curly noodles', text: 'The right noodle for a miso bowl grabs and holds the rich broth. Thin, straight noodles slip through; thick, wavy noodles carry every component of the soup in each bite.' },
            ],
          },
          {
            h2: 'How to find Hokkaido-style bowls',
            body: (
              <p>
                Sapporo miso is the most common Hokkaido style you will encounter outside Japan, which makes
                the "Miso" filter on the map a great starting point for any Hokkaido search. For the Hakodate
                and Asahikawa styles, I check listings and menus for explicit references to these cities or
                their signature characteristics — the corn-and-butter combination for Sapporo, the exceptional
                clarity and lightness for Hakodate shio, the fat-on-top technique for Asahikawa shoyu. Shops
                that name a specific Hokkaido city on their menu are usually proud of the tradition and have
                done the homework to do it justice. I also look at listing photos for the telltale signs: that
                beautiful knob of butter melting across a miso broth is one of ramen\'s most appealing sights.
              </p>
            ),
          },
        ]}
        tipsHeading="My Hokkaido ramen tips"
        tips={[
          'For the classic Sapporo style, use the "Miso" filter on the map — it is the most common and widely available Hokkaido bowl outside Japan.',
          'Look for the corn-and-butter miso signature in listing photos — that melting pat of butter over a rich miso broth is one of ramen\'s most recognizable and appealing images.',
          'Want something lighter? Seek out Hakodate-style shio broth instead — it is clean, clear, and elegant, a beautiful contrast to the heavier Sapporo style.',
          'Asahikawa shoyu with its fat-on-top technique is worth finding on a cold day — the bowl stays remarkably hot to the last sip, which is the whole point.',
          'Shops that name a specific Hokkaido city on their menu are signaling genuine knowledge of the tradition; they have usually done the research to do it right.',
          'Order thick, curly noodles with a Sapporo miso bowl if you have a choice — they grab and hold the rich broth better than thin, straight noodles.',
          'Corn, butter, bean sprouts, and ground pork are not optional extras in a proper Sapporo bowl — they are integral to the dish and you should embrace all of them.',
          'Hokkaido miso ramen is my top pick for cold days and for anyone who wants ramen that feels genuinely nourishing rather than just satisfying.',
        ]}
        faqs={[
          { q: 'What is Hokkaido ramen?', a: 'Hokkaido ramen refers to the hearty, warming styles from Japan\'s cold northern island, centered on three cities: Sapporo (miso), Hakodate (shio), and Asahikawa (shoyu). Each style reflects the climate and culinary culture of its city of origin.' },
          { q: 'What is Sapporo ramen?', a: 'Sapporo ramen is the famous Hokkaido miso style — a rich, fermented-soybean broth seasoned with a blended miso tare and often topped with corn, butter, bean sprouts, and ground pork over thick, curly noodles. It is the most widely available Hokkaido style outside Japan.' },
          { q: 'What are the three Hokkaido ramen styles?', a: 'Sapporo miso (hearty fermented-soybean broth with corn and butter), Hakodate shio (clear, delicate salt broth from a port city), and Asahikawa shoyu (soy broth with a layer of fat on top to retain heat). Together they cover rich, light, and balanced.' },
          { q: 'Why is Hokkaido ramen so rich?', a: 'It evolved for harsh northern winters. Thick miso broth, a fat layer on Asahikawa shoyu to trap heat, and hearty toppings like corn and butter all serve the practical purpose of keeping diners warm and sustained against the cold. The result is some of the most comforting ramen you can find.' },
          { q: 'What makes Hakodate ramen different from Sapporo?', a: 'Hakodate shio uses a clear, delicate salt-based broth rather than the rich, opaque miso of Sapporo. It is lighter, more refined, and showcases the quality of the base stock. Hakodate\'s port city history and milder climate compared to inland Hokkaido influenced this lighter style.' },
          { q: 'How do I find Hokkaido ramen near me?', a: 'Use the map above and stack the "Miso" filter for the classic Sapporo style, or check listings and menu descriptions for references to Sapporo, Hakodate, or Asahikawa. Look for the corn-and-butter combination in photos as a reliable visual marker.' },
          { q: 'What is the fat layer on Asahikawa shoyu ramen?', a: 'Asahikawa shoyu ramen deliberately floats a layer of lard or oil on top of the broth to act as insulation, trapping heat and keeping the bowl piping hot even in very cold weather. It is a functional design that also adds richness to the overall flavor.' },
          { q: 'Are corn and butter traditional in Hokkaido ramen?', a: 'Yes — corn and butter are strongly associated with Sapporo miso ramen in particular and with Hokkaido cuisine more broadly. Hokkaido is Japan\'s major dairy-producing region, and the island\'s corn is celebrated. These ingredients are integral to the Sapporo style, not modern additions.' },
        ]}
      />
    </main>
  )
}
