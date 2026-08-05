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
  title: 'Japanese Ramen Near Me | Authentic Japanese Ramen Shops | RamenNearYou',
  description: 'Find Japanese ramen near you — authentic shops serving tonkotsu, shoyu, miso, and shio. The regional styles to know and how to find a traditional bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/japanese-ramen' },
  openGraph: {
    title: 'Japanese Ramen Near Me',
    description: 'Find authentic Japanese ramen shops near you.',
    url: 'https://www.ramennearyou.com/find/japanese-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function JapaneseRamenPage() {
  const NATIONWIDE_FILTER = {  }
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
        pageTitle="Japanese Ramen Near Me"
        pageDescription="Find authentic Japanese ramen near you. Enter your ZIP or use your location, then filter by broth, price, and hours."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Japanese Ramen Near Me" }]}
        title={`Japanese Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/japanese-ramen"
        heading="My Guide to Authentic Japanese Ramen Near Me"
        intro={[
          'Ramen is one of Japan’s great culinary gifts, and a proper Japanese ramen shop is a thing of beauty — focused, precise, and obsessed with broth. The map above helps you find Japanese ramen near you; enter your ZIP or use your location to see the closest shops, then filter by the broth or style you are craving.',
          'Japanese ramen is not one dish but a family of regional styles, each with its own broth, noodle, and personality. Here is a quick tour of the classics and how I find a genuinely authentic bowl.',
        ]}
        sections={[
          {
            h2: 'The four classic broths',
            body: (
              <p>
                Most Japanese ramen comes back to four foundational broths. Knowing them makes ordering anywhere
                easy, because nearly every bowl is a variation on one of these.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'Rich, creamy pork-bone broth from Hakata (Fukuoka), served with thin, firm noodles. The bold, indulgent classic.' },
              { h3: 'Shoyu', text: 'The original Tokyo style — a clear, soy-seasoned broth that is light yet deeply savory.' },
              { h3: 'Miso', text: 'Hearty, fermented-soybean broth from Sapporo, rich and slightly sweet with thicker noodles.' },
              { h3: 'Shio', text: 'The lightest style — a clear, salt-seasoned broth that highlights a clean, refined stock.' },
            ],
          },
          {
            h2: 'Regional styles worth knowing',
            body: (
              <p>
                Beyond the four broths, Japan’s regions each put their stamp on ramen: Hakata’s thin-noodle
                tonkotsu, Sapporo’s corn-and-butter miso, Kitakata’s flat-noodle shoyu, Tokyo’s classic chicken-
                and-dashi shoyu, and specialties like tsukemen (dipping noodles) and mazemen (brothless). Part of
                the fun is recognizing which tradition a shop is drawing from.
              </p>
            ),
          },
          {
            h2: 'How to find an authentic bowl',
            body: (
              <p>
                I look for shops that focus on a small number of broths and make them well, fresh noodles with
                real bite, and the classic toppings done right (proper chashu, a marinated egg, menma). A
                focused menu is usually a good sign — it means the kitchen is committed to its craft rather than
                trying to do everything. Stack the broth filters above to jump straight to the style you want.
              </p>
            ),
          },
        ]}
        tipsHeading="My Japanese ramen tips"
        tips={[
          'Learn the four broths — tonkotsu, shoyu, miso, shio — and ordering anywhere gets easy.',
          'Favor shops with a focused menu; specialists usually make more authentic bowls.',
          'Use the broth filters above to jump straight to the style you are craving.',
          'Look for the classic toppings done well: proper chashu, a marinated egg, and menma.',
          'Stack “Top Rated” to find the most beloved authentic shops near you.',
        ]}
        faqs={[
          { q: 'What are the main types of Japanese ramen?', a: 'The four classic broths are tonkotsu (creamy pork bone), shoyu (soy sauce), miso (fermented soybean), and shio (salt). Most Japanese ramen is a regional variation on one of these.' },
          { q: 'What makes ramen authentically Japanese?', a: 'A focus on carefully made broth, fresh noodles with real bite, and classic toppings like proper chashu, a marinated egg, and menma. Shops that specialize in a few broths tend to be the most authentic.' },
          { q: 'What is the most popular Japanese ramen?', a: 'Tonkotsu and shoyu are the most widely loved. Tonkotsu is the rich, creamy crowd-pleaser; shoyu is the original, balanced Tokyo style that suits almost everyone.' },
          { q: 'How is Japanese ramen different from instant ramen?', a: 'Shop ramen is built on broth simmered for hours, fresh noodles, and fresh toppings — a world apart from the dried, packaged instant version, which was inspired by it but is a different food entirely.' },
          { q: 'How do I find Japanese ramen near me?', a: 'Use the map above — enter your ZIP or tap “Use my location” to see authentic shops nearby, then filter by broth (tonkotsu, shoyu, miso, shio) to find your bowl.' },
        ]}
      />
    </main>
  )
}
