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
  title: 'Hakata Ramen Near Me | Original Tonkotsu Ramen | RamenNearYou',
  description: 'Find Hakata ramen near you — the original tonkotsu style from Fukuoka, with thin straight noodles and kaedama refills. What it is, how to order it, and where to find it nearby.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hakata-ramen-near-me' },
  openGraph: {
    title: 'Hakata Ramen Near Me',
    description: 'Find the original Hakata-style tonkotsu ramen near you.',
    url: 'https://www.ramennearyou.com/find/hakata-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function HakataRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["hakata"] }
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
        initialFlags={['hakata']}
        pageTitle="Hakata Ramen Near Me"
        pageDescription="Showing Hakata-style ramen near you. Enter your ZIP or use your location to find a bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Hakata Ramen Near Me" }]}
        title={`Hakata Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/hakata-ramen-near-me"
        heading="My Guide to Finding Real Hakata Ramen Near Me"
        intro={[
          'Hakata ramen is where tonkotsu began — a rich, milky pork-bone broth from the Hakata district of Fukuoka on the island of Kyushu, built specifically around thin, straight, extra-firm noodles and a tradition of kaedama, where you order a fresh batch of noodles to finish off the broth once the first serving is gone. The map above is filtered to Hakata-style ramen near you; enter your ZIP or tap "Use my location" to find the closest bowl.',
          'What sets Hakata ramen apart from tonkotsu in general is how deliberately restrained the bowl is. The noodles are thin and cook fast — traditionally in under a minute — which is why Hakata shops let you order noodle firmness by name and why kaedama exists at all: the noodles are meant to be eaten quickly, in multiple small rounds, while the broth stays hot and constant underneath.',
          'Here is what makes Hakata ramen the archetype it is, the customs around ordering it, and how I approach a bowl to get the full experience.',
        ]}
        sections={[
          {
            h2: 'What defines Hakata ramen',
            body: (
              <p>
                The broth is a straight, intensely simmered pork-bone tonkotsu — bones boiled at a hard,
                rolling simmer for 12 to 18 hours until the collagen and marrow emulsify into a milky, opaque
                stock. The noodles are the real signature: extremely thin, straight, and cooked firm, designed
                to be eaten quickly before they soften in the hot broth. Toppings are minimal and deliberate —
                chashu, wood-ear mushroom, scallion — because the broth and noodles are meant to carry the
                bowl on their own, with seasoning customization left to the condiments on the table rather
                than baked into the dish.
              </p>
            ),
            points: [
              { h3: 'Thin, straight noodles', text: 'The thinnest and straightest of the tonkotsu-style noodles, cooked to order and meant to be eaten quickly before they soften.' },
              { h3: 'Noodle firmness by name', text: 'Order "katame" for extra firm, "futsuu" for standard, or "yawarakame" for soft — a Hakata-specific custom built around how fast these thin noodles cook.' },
              { h3: 'Kaedama tradition', text: 'When your bowl is down to mostly broth, order kaedama — a fresh portion of noodles dropped straight into your remaining soup so nothing goes to waste.' },
            ],
          },
          {
            h2: 'How I order Hakata ramen',
            body: (
              <p>
                I always request katame (firm) noodles, since the classic Hakata noodle is thin enough that
                it can go soft fast in the hot broth. I build the bowl at the table using the condiments —
                crushed sesame, pickled ginger, extra garlic, and chili oil are standard — adding them one at
                a time rather than all at once so I can taste what each one does. When the first round of
                noodles is gone and I still have broth left, kaedama is the move: a fresh portion of noodles
                dropped directly into what remains, so the meal continues without losing any of that
                long-simmered broth.
              </p>
            ),
            points: [
              { h3: 'Order firm noodles', text: 'Ask for katame so the thin Hakata noodles hold their bite instead of going soft partway through the bowl.' },
              { h3: 'Build the bowl at the table', text: 'Use the condiment tray thoughtfully — garlic for depth, chili oil for heat, pickled ginger for brightness — adding each gradually.' },
              { h3: 'Always order kaedama', text: 'If you still have broth once the noodles are gone, order a kaedama refill rather than leaving that long-simmered broth unfinished.' },
            ],
          },
        ]}
        tipsHeading="My Hakata ramen tips"
        tips={[
          'Filter to Hakata ramen, then sort by distance for the nearest bowl of the original tonkotsu style.',
          'Order your noodles katame (firm) — the thin Hakata noodles cook fast and can soften before you finish if ordered standard.',
          'Order kaedama when you are down to mostly broth; it is the traditional Hakata way to finish and means nothing is wasted.',
          'Use the table condiments one at a time — crushed garlic, chili oil, and pickled ginger each change the bowl in a different way.',
          'Favor shops that specialize in Hakata-style tonkotsu specifically, rather than offering many broth styles at once — focused kitchens tend to execute the noodle timing and broth intensity far more consistently.',
        ]}
        faqs={[
          { q: 'What is Hakata ramen?', a: 'Hakata ramen is the original tonkotsu ramen style, from the Hakata district of Fukuoka on Kyushu — a rich, milky pork-bone broth served with thin, straight, extra-firm noodles and built around the kaedama noodle-refill tradition.' },
          { q: 'How is Hakata ramen different from tonkotsu ramen in general?', a: 'Hakata ramen is specifically the original, archetypal tonkotsu style — the thinnest, straightest noodles and the most restrained toppings. "Tonkotsu" more broadly covers regional variations like Kurume and Kumamoto style that differ in intensity and additions.' },
          { q: 'What is kaedama?', a: 'Kaedama is an extra portion of noodles you order once your bowl is down to mostly broth. The cook drops fresh noodles directly into your remaining soup so you can finish every last drop — a defining Hakata custom.' },
          { q: 'What does "katame" mean when ordering Hakata ramen?', a: 'Katame means firm noodles. Because Hakata noodles are so thin, they cook and soften quickly in the hot broth, so ordering katame is the standard way to keep their bite through the whole bowl.' },
          { q: 'How do I find Hakata ramen near me?', a: 'The map above is filtered to Hakata-style ramen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then check menus and reviews for thin, straight noodles and kaedama service to confirm the style.' },
        ]}
      />
    </main>
  )
}
