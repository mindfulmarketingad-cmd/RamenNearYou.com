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
  title: 'Lanzhou Ramen Near Me | Hand-Pulled Beef Noodle Soup | RamenNearYou',
  description: 'Find Lanzhou ramen near you — hand-pulled beef noodle soup with a clear, aromatic broth. What Lanzhou lamian is, the noodle widths, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/lanzhou-ramen' },
  openGraph: {
    title: 'Lanzhou Ramen Near Me',
    description: 'Find hand-pulled Lanzhou beef noodle soup near you.',
    url: 'https://www.ramennearyou.com/find/lanzhou-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function LanzhouRamenPage() {
  const NATIONWIDE_FILTER = { initialQuery: "lanzhou" }
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
        initialQuery="lanzhou"
        pageTitle="Lanzhou Ramen Near Me"
        pageDescription="Find Lanzhou hand-pulled beef noodle soup near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Lanzhou Ramen Near Me" }]}
        title={`Lanzhou Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/lanzhou-ramen"
        heading="My Guide to Lanzhou Beef Noodle Soup Near Me"
        intro={[
          'Lanzhou ramen is a showstopper — watching a cook stretch a single piece of dough into a bowl of perfectly even noodles never gets old, and the clear, aromatic beef broth that follows is world-class. The map above helps you find Lanzhou-style hand-pulled noodles near you; enter your ZIP or use your location to find the closest shop.',
          'Technically it is Chinese lamian rather than Japanese ramen, but it is one of the great noodle soups on earth and absolutely worth seeking out. Here is what it is and how to order it.',
        ]}
        sections={[
          {
            h2: 'What Lanzhou beef noodle soup is',
            body: (
              <p>
                Lanzhou lamian comes from Lanzhou, the capital of China’s Gansu province, and is famous for the
                “one clear, two white, three red, four green, five yellow” ideal: clear broth, white radish,
                red chili oil, green cilantro and scallion, and yellow noodles. The broth is a clear, deeply
                aromatic beef soup spiced with warm seasonings, and the noodles are hand-pulled to order — a
                world apart from the rich, cloudy broths of Japanese ramen.
              </p>
            ),
            points: [
              { h3: 'Clear beef broth', text: 'A clean, aromatic beef soup spiced with warming seasonings — light-bodied but profoundly flavorful.' },
              { h3: 'Hand-pulled noodles', text: 'Stretched to order from a single piece of dough, so they are impossibly fresh and springy.' },
              { h3: 'Classic garnish', text: 'White radish, red chili oil, green cilantro and scallion over those yellow noodles — the signature look.' },
            ],
          },
          {
            h2: 'Choosing your noodle width',
            body: (
              <p>
                The best part of ordering Lanzhou noodles is picking your width. Shops typically offer a range —
                from ultra-thin “capellini-like” strands to wide, belt-like noodles, with several in between.
                Thin noodles soak up more broth and cook delicately; wide noodles bring serious chew. I love
                trying a different width each visit to find my favorite.
              </p>
            ),
          },
          {
            h2: 'How I order Lanzhou ramen',
            body: (
              <p>
                I get the classic beef noodle soup, pick a medium noodle width my first time, and add extra
                chili oil for warmth and color. A side of the thin-sliced beef or some braised sides rounds it
                out. Look for shops with “Lanzhou,” “lamian,” or “hand-pulled” in the name — they are the real
                deal and usually pull the noodles right in front of you.
              </p>
            ),
          },
        ]}
        tipsHeading="My Lanzhou ramen tips"
        tips={[
          'Look for “Lanzhou,” “lamian,” or “hand-pulled” shops — they pull noodles to order.',
          'Choose your noodle width — try a medium gauge first, then explore thin and wide.',
          'Add extra chili oil for the classic warmth and red color.',
          'The broth is clear and aromatic, not cloudy — judge it on clean, deep beef flavor.',
          'Add sliced beef or braised sides to round out the bowl.',
        ]}
        faqs={[
          { q: 'What is Lanzhou ramen?', a: 'Lanzhou ramen (lamian) is a Chinese hand-pulled beef noodle soup from Lanzhou, Gansu province. It features a clear, aromatic, spiced beef broth, noodles pulled to order, and garnishes of radish, chili oil, cilantro, and scallion.' },
          { q: 'Is Lanzhou ramen the same as Japanese ramen?', a: 'No — it is Chinese lamian, with a clear beef broth and hand-pulled noodles, distinct from the rich, cloudy broths and machine-cut noodles of Japanese ramen. Both are exceptional noodle soups.' },
          { q: 'What noodle widths can I get?', a: 'Most Lanzhou shops offer a range, from ultra-thin strands to wide, belt-like noodles, with several gauges in between. Thin noodles cook delicately; wide ones bring more chew.' },
          { q: 'What does Lanzhou beef noodle soup taste like?', a: 'A clear, light-bodied but deeply aromatic beef broth spiced with warm seasonings, brightened by chili oil and cilantro — clean and savory rather than rich and creamy.' },
          { q: 'How do I find Lanzhou ramen near me?', a: 'Use the map above and look for shops with “Lanzhou,” “lamian,” or “hand-pulled” in the name. Enter your ZIP or tap “Use my location” to find the closest one.' },
        ]}
      />
    </main>
  )
}
