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
  title: 'Kagoshima Ramen Near Me | Mild Kyushu Pork-Bone Ramen | RamenNearYou',
  description: 'Find Kagoshima ramen near you — a milder, gentler pork-bone broth than Hakata tonkotsu, often blended with chicken stock and finished with fried garlic chips.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/kagoshima-ramen-near-me' },
  openGraph: {
    title: 'Kagoshima Ramen Near Me',
    description: 'Find mild, Kagoshima-style pork-bone ramen near you.',
    url: 'https://www.ramennearyou.com/find/kagoshima-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function KagoshimaRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["kagoshima"] }
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
        initialFlags={['kagoshima']}
        pageTitle="Kagoshima Ramen Near Me"
        pageDescription="Showing Kagoshima-style ramen near you. Enter your ZIP or use your location to find a bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Kagoshima Ramen Near Me" }]}
        title={`Kagoshima Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/kagoshima-ramen-near-me"
        heading="My Guide to Finding Real Kagoshima Ramen Near Me"
        intro={[
          'Kagoshima ramen comes from the southern tip of Kyushu, and it is the mellow, easygoing cousin of the more famous Hakata tonkotsu just up the coast. The broth is still built on pork bones, but it is simmered gentler and often blended with chicken or vegetable stock, producing a softer, slightly sweet bowl without the intense, funky depth some people find overwhelming in a straight tonkotsu. The map above is filtered to Kagoshima-style ramen near you — enter your ZIP or tap "Use my location" to find the closest bowl.',
          'What I appreciate about Kagoshima ramen is how approachable it is. It keeps the richness and comfort of a pork-bone broth while dialing back the intensity, which makes it a great entry point if you have found other tonkotsu-style bowls too heavy or too porky-smelling. It is also frequently finished with fried garlic chips, adding a nutty crunch that plays well against the soft broth.',
          'Here is what makes Kagoshima ramen its own distinct style, how it differs from its Hakata neighbor, and how to order it well.',
        ]}
        sections={[
          {
            h2: 'What makes Kagoshima ramen different',
            body: (
              <p>
                Like Hakata tonkotsu, the broth starts with pork bones, but Kagoshima kitchens typically
                simmer it less aggressively and blend in chicken or vegetable stock, which softens the
                intensity and rounds out the flavor. The result is milder, a touch sweeter, and noticeably
                less &quot;porky&quot; in aroma than a straight tonkotsu. Noodles tend to be a bit thicker
                and softer than the razor-thin Hakata style, and the bowl is very often finished with fried
                garlic chips scattered on top, adding texture and a nutty note that complements the softer
                broth underneath.
              </p>
            ),
            points: [
              { h3: 'A gentler pork-bone broth', text: 'Simmered less aggressively than Hakata tonkotsu and often blended with chicken or vegetable stock for a milder, rounder flavor.' },
              { h3: 'Fried garlic chips', text: 'A common finishing touch — crisp, nutty garlic chips scattered over the top add crunch and a toasted flavor that plays against the soft broth.' },
              { h3: 'Slightly thicker noodles', text: 'Kagoshima noodles tend to be a touch thicker and softer than the thin, extra-firm Hakata style, matching the broth\'s gentler character.' },
            ],
          },
          {
            h2: 'How to order Kagoshima ramen',
            body: (
              <p>
                If you have tried tonkotsu before and found it too heavy or too intensely porky, Kagoshima
                ramen is worth seeking out as a gentler alternative. I recommend trying the bowl as served
                first, since the balance between pork and blended stock is usually already dialed in. If
                fried garlic chips are not already on the bowl, ask if they are available — they are one of
                the style&apos;s best features and worth adding if the kitchen offers them separately.
              </p>
            ),
            points: [
              { h3: 'Order it as served first', text: 'The pork-to-blended-stock ratio is usually already well balanced, so taste the bowl as intended before customizing it.' },
              { h3: 'Ask about garlic chips', text: 'If they are not already on your bowl, ask — the crisp, toasted garlic adds a texture and flavor contrast that is core to the style.' },
              { h3: 'A good entry point', text: 'If tonkotsu has felt too rich or porky for you in the past, Kagoshima ramen is one of the friendliest ways back into pork-bone ramen.' },
            ],
          },
        ]}
        tipsHeading="My Kagoshima ramen tips"
        tips={[
          'Filter to Kagoshima ramen, then sort by distance for the nearest bowl — it is the fastest starting point.',
          'If you have found tonkotsu too heavy before, start here — Kagoshima ramen is the gentler, milder version of the same pork-bone tradition.',
          'Ask about fried garlic chips if they are not already on your bowl; they are one of the style\'s signature finishing touches.',
          'Read recent reviews for mentions of "Kagoshima" specifically to confirm a shop runs the milder style rather than straight Hakata tonkotsu.',
        ]}
        faqs={[
          { q: 'What is Kagoshima ramen?', a: 'Kagoshima ramen is a Kyushu pork-bone ramen style from the southern tip of the island — milder than Hakata tonkotsu, often blended with chicken or vegetable stock, and typically finished with fried garlic chips.' },
          { q: 'How is Kagoshima ramen different from Hakata tonkotsu?', a: 'Both start with pork bones, but Kagoshima broth is simmered less aggressively and blended with other stocks, giving a softer, slightly sweet, less "porky" bowl compared to a straight, intensely simmered Hakata tonkotsu.' },
          { q: 'Is Kagoshima ramen a good starting point for ramen newcomers?', a: 'Yes — its milder, rounder flavor makes it one of the more approachable pork-bone styles, especially for anyone who has found straight tonkotsu too heavy or intense.' },
          { q: 'How do I find Kagoshima ramen near me?', a: 'The map above is filtered to Kagoshima-style ramen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then check menus and reviews to confirm the style.' },
        ]}
      />
    </main>
  )
}
