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
  title: 'Ramen Spicy Miso Near Me | Kara Miso & Chili-Spiked Broth | RamenNearYou',
  description: 'Find spicy miso ramen near you — fermented miso broth spiked with chili for real heat. What kara miso is, how it compares to plain miso, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-spicy-miso-near-me' },
  openGraph: {
    title: 'Ramen Spicy Miso Near Me',
    description: 'Find spicy miso ramen near you — fermented miso broth spiked with real chili heat.',
    url: 'https://www.ramennearyou.com/find/ramen-spicy-miso-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenSpicyMisoNearMePage() {
  const NATIONWIDE_FILTER = { initialBowls: ["spicy-miso"] }
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
        initialBowls={['spicy-miso']}
        pageTitle="Ramen Spicy Miso Near Me"
        pageDescription="Showing spicy miso ramen near you. Enter your ZIP or use your location to find a chili-spiked, fermented bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen Spicy Miso Near Me" }]}
        title={`Ramen Spicy Miso Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-spicy-miso-near-me"
        heading="My Guide to Finding Real Spicy Miso Ramen Near Me"
        intro={[
          'Spicy miso is the bowl I order when I want everything at once — the deep, fermented, savory-sweet body of a good miso broth, plus a real chili kick that keeps every spoonful interesting. It is not just miso ramen with hot sauce dumped on top; done right, the chili is worked into the tare itself so the heat and the fermented richness build together instead of fighting each other. The map above is already filtered to spicy miso, so you can jump straight to a bowl that actually delivers both.',
          'This style is often called kara miso in Japan, and it comes directly out of Sapporo\'s miso ramen tradition — cooks started adding chili paste or chili oil to the tare to cut through the cold Hokkaido winters even harder than plain miso already does. The result is a broth that is thick, complex, and genuinely warming in two different senses of the word.',
          'Not every shop does this well. Some just add a splash of rayu on top of a standard miso bowl, which gives you heat without integration. The versions worth seeking out actually build the chili into the base, so the spice has depth instead of just sitting on the surface. Here is what to look for, how it compares to plain miso, and how I order it.',
        ]}
        sections={[
          {
            h2: 'What makes spicy miso different from plain miso',
            body: (
              <p>
                The base is the same story as classic miso ramen — a pork or chicken stock finished with fermented
                soybean paste for that thick, umami-heavy body. What changes is the tare: a good spicy miso shop
                blends chili paste, doubanjiang, or a housemade chili oil directly into the miso tare before it
                ever hits the broth, so the heat is distributed evenly and layered underneath the fermented
                sweetness rather than floating on top as an afterthought. The best versions taste like miso first
                and spicy second — the chili should deepen the bowl, not mask it.
              </p>
            ),
            points: [
              { h3: 'The tare is built with heat in mind', text: 'Chili paste or oil is mixed into the miso tare itself, not drizzled on afterward. This is the single biggest tell of a kitchen that takes the style seriously.' },
              { h3: 'Miso sweetness tempers the burn', text: 'The natural sweetness in miso — especially white or blended miso — softens the sharp edge of chili heat, so the spice feels warming and exciting rather than punishing.' },
              { h3: 'Toppings stay close to Sapporo tradition', text: 'Ground pork, corn, bean sprouts, and scallion are still standard; some shops swap the usual butter for a chili-infused oil finish instead.' },
            ],
          },
          {
            h2: 'Kara miso vs. Korean-style spicy ramen',
            body: (
              <p>
                It is easy to lump every spicy ramen bowl together, but kara miso and Korean-influenced spicy
                ramen come from different traditions and taste noticeably different. Kara miso keeps the
                fermented, savory-sweet miso character front and center, with chili working as an accent inside
                a Japanese tare. Korean-influenced bowls typically lean on gochugaru or gochujang, which bring a
                fruitier, smokier, more fermented-chili heat of their own and often sit on a different broth base
                entirely. Neither is better — they are just different flavor families — but if you are craving
                that specific rich-and-savory miso backbone with heat layered in, kara miso is the one to order.
              </p>
            ),
            points: [
              { h3: 'Kara miso', text: 'Japanese chili paste or oil blended into a classic miso tare — savory, fermented, and warming with a clean, direct heat.' },
              { h3: 'Korean-influenced spicy ramen', text: 'Gochugaru or gochujang bring a fruitier, smokier heat, often on a different broth base — worth trying if you want a completely different spice profile.' },
              { h3: 'How to tell them apart on a menu', text: 'Look for the word "miso" in the name — if it is there, you are almost certainly getting the kara miso style rather than a Korean-influenced bowl.' },
            ],
          },
          {
            h2: 'How I order spicy miso ramen',
            body: (
              <p>
                I always ask how the heat is built in before I order, if it is not obvious from the menu
                description — a shop that can answer confidently usually nailed the tare. I add a soft egg every
                time; the yolk mellows the spice just enough to keep me eating comfortably through the whole bowl
                without losing the heat entirely. If a shop offers a spice-level choice, I start one notch below
                where I think I want to land, since a well-built kara miso tends to build in intensity as you eat
                rather than hitting hardest on the first spoonful.
              </p>
            ),
            points: [
              { h3: 'Add a soft egg', text: 'The jammy yolk cuts the heat just enough to keep the bowl balanced, without diluting the chili character of the broth.' },
              { h3: 'Order one spice level down', text: 'Kara miso broth builds heat as you eat. Starting a notch below your usual preference keeps the whole bowl enjoyable rather than front-loaded.' },
              { h3: 'Ask about the tare', text: 'A kitchen that can describe exactly how the chili is incorporated is a kitchen that treats this as a real dish, not a garnish.' },
            ],
          },
        ]}
        tipsHeading="My spicy miso ordering tips"
        tips={[
          'Filter to this map view, then sort by distance for the nearest chili-spiked bowl near you.',
          'Look for menu language like "kara miso" or "spicy miso" specifically — a shop that names the style usually built the tare intentionally rather than just adding hot sauce.',
          'Add a soft marinated egg every time; it mellows the heat just enough to keep the bowl balanced from first bite to last.',
          'Start one spice level below your usual preference — a well-built kara miso broth intensifies as you eat.',
          'If the menu lists both plain miso and spicy miso, ask which is the kitchen\'s specialty before choosing — some shops are known specifically for one or the other.',
          'Pair it with a side of gyoza rather than anything else spicy, so the heat of the broth stays the star of the meal.',
        ]}
        faqs={[
          { q: 'What is spicy miso ramen?', a: 'Spicy miso ramen — often called kara miso — is classic Sapporo-style miso ramen with chili paste or chili oil blended directly into the tare. It keeps the fermented, savory-sweet character of miso broth while adding real, building heat.' },
          { q: 'Is spicy miso ramen the same as Korean spicy ramen?', a: 'No. Spicy miso ramen uses a Japanese miso tare with Japanese chili preparations, giving a fermented, savory-sweet heat. Korean-influenced spicy ramen typically uses gochugaru or gochujang and often a different broth base, producing a fruitier, smokier kind of heat.' },
          { q: 'How spicy is spicy miso ramen usually?', a: 'It varies by shop, but a well-made kara miso broth builds heat gradually rather than hitting hard immediately. Many shops also offer adjustable spice levels — ask before ordering if you want to control the intensity.' },
          { q: 'How do I find spicy miso ramen near me?', a: 'The map above is already filtered to spicy miso. Enter your ZIP code or tap "Use my location" to sort the closest bowls by distance, then open a listing for hours, reviews, and directions.' },
          { q: 'What toppings come with spicy miso ramen?', a: 'Most shops keep the classic Sapporo toppings — ground pork, corn, bean sprouts, and scallion — sometimes swapping the traditional butter finish for a chili oil drizzle instead.' },
        ]}
      />
    </main>
  )
}
