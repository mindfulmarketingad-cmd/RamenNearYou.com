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
  title: 'Korean Ramen Near Me | Ramyun & Korean-Style Noodles | RamenNearYou',
  description: 'Find Korean ramen near you — spicy ramyun, budae jjigae, and Korean-style noodle spots. How Korean ramyun differs from Japanese ramen and what to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/korean-ramen' },
  openGraph: {
    title: 'Korean Ramen Near Me',
    description: 'Find Korean ramen and ramyun near you.',
    url: 'https://www.ramennearyou.com/find/korean-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function KoreanRamenPage() {
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
        pageTitle="Korean Ramen Near Me"
        pageDescription="Find Korean ramen and ramyun near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Korean Ramen Near Me" }]}
        title={`Korean Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/korean-ramen"
        heading="My Guide to Korean Ramen (Ramyun) Near Me"
        intro={[
          'Korean ramen, or ramyun, has its own bold, spicy personality that is distinct from its Japanese cousin — think fiery broths, chewy noodles, and comforting heat. The map above helps you find Korean-style ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'If your idea of Korean ramen stops at the instant packet, there is a whole world to explore. Here is what ramyun is, how it differs from Japanese ramen, and what to order.',
        ]}
        sections={[
          {
            h2: 'What Korean ramyun is',
            body: (
              <p>
                Ramyun centers on a bold, often spicy broth built with gochugaru (Korean chili flakes) and
                gochujang (chili paste), giving it a deep, fiery red character. Korean noodles tend to be
                springy and chewy, and bowls are frequently loaded with toppings like egg, scallion, kimchi,
                vegetables, and sometimes cheese or sliced rice cakes. Even sit-down versions often build on the
                comforting, soul-warming spirit of the instant classic.
              </p>
            ),
            points: [
              { h3: 'Gochugaru & gochujang heat', text: 'Korean chili flakes and paste give ramyun its signature spicy, savory, deeply red broth.' },
              { h3: 'Chewy noodles', text: 'Springy, bouncy noodles are a hallmark — satisfying and great at carrying the spicy broth.' },
              { h3: 'Bold toppings', text: 'Egg, scallion, kimchi, vegetables, rice cakes, and sometimes cheese pile on flavor and comfort.' },
            ],
          },
          {
            h2: 'Budae jjigae and beyond',
            body: (
              <p>
                Korean noodle culture goes well past a single bowl. Budae jjigae (army stew) is a bubbling,
                spicy hot pot loaded with ramyun noodles, sausage, spam, tofu, and cheese — pure indulgent
                comfort. You will also find jjamppong, a spicy seafood noodle soup of Korean-Chinese origin.
                Many Korean restaurants serve these alongside or instead of a classic ramyun bowl.
              </p>
            ),
          },
          {
            h2: 'How to find Korean ramen',
            body: (
              <p>
                Korean ramyun is often served at Korean restaurants and pojangmacha-style spots rather than
                Japanese ramen-yas, so I check listings for Korean restaurants and look for ramyun, budae
                jjigae, or jjamppong on the menu. If you love heat, stack the “Spicy” filter — Korean bowls
                reliably bring it.
              </p>
            ),
          },
        ]}
        tipsHeading="My Korean ramen tips"
        tips={[
          'Look for Korean restaurants and check menus for ramyun, budae jjigae, or jjamppong.',
          'Love heat? Stack the “Spicy” filter — Korean bowls reliably deliver.',
          'Try budae jjigae (army stew) for the ultimate spicy, indulgent comfort bowl.',
          'Add an egg, kimchi, and cheese to lean into the Korean comfort-food spirit.',
          'Jjamppong is the move if you want a spicy seafood noodle soup.',
        ]}
        faqs={[
          { q: 'What is Korean ramen?', a: 'Korean ramen, or ramyun, is a bold, often spicy noodle soup built with gochugaru (chili flakes) and gochujang (chili paste), with springy noodles and toppings like egg, scallion, kimchi, and sometimes cheese.' },
          { q: 'How is Korean ramyun different from Japanese ramen?', a: 'Japanese ramen emphasizes long-simmered broths (tonkotsu, shoyu, miso, shio). Korean ramyun leans spicier and chili-forward with chewier noodles and bolder, comfort-driven toppings.' },
          { q: 'What is budae jjigae?', a: 'Budae jjigae (“army stew”) is a spicy Korean hot pot loaded with ramyun noodles, sausage, spam, tofu, vegetables, and cheese — a hearty, indulgent communal dish.' },
          { q: 'Is Korean ramen always spicy?', a: 'Most ramyun is spicy to some degree, thanks to gochugaru and gochujang, but heat levels vary and milder versions exist. Stack the “Spicy” filter if you specifically want the fiery ones.' },
          { q: 'How do I find Korean ramen near me?', a: 'Use the map above and look for Korean restaurants, checking menus for ramyun, budae jjigae, or jjamppong. Stack the “Spicy” filter to surface the boldest bowls.' },
        ]}
      />
    </main>
  )
}
