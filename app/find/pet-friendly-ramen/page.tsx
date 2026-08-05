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
  title: 'Pet Friendly Ramen Restaurants Near Me | RamenNearYou',
  description: 'Find pet friendly ramen near you — ramen spots with outdoor seating where you can bring your dog. Browse by rating and distance, then confirm the pet policy before you go.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/pet-friendly-ramen' },
  openGraph: {
    title: 'Pet Friendly Ramen Restaurants Near Me',
    description: 'Find ramen spots with outdoor seating where you can bring your dog.',
    url: 'https://www.ramennearyou.com/find/pet-friendly-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function PetFriendlyRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["outdoor-seating"] }
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
        initialFlags={['outdoor-seating']}
        pageTitle="Pet Friendly Ramen Restaurants Near Me"
        pageDescription="Showing ramen spots with outdoor seating near you — your best bet for bringing a dog along. Enter your ZIP or use your location to find one nearby, then confirm the pet policy before you go."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Pet Friendly Ramen Restaurants Near Me" }]}
        title={`Pet Friendly Ramen Restaurants Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/pet-friendly-ramen"
        heading="How I Find Pet Friendly Ramen Near Me"
        intro={[
          'Bringing your dog along for a bowl of ramen usually comes down to one thing: a patio. Most health codes keep pets out of indoor dining areas, so outdoor seating is where pet friendly ramen actually happens. The map above starts filtered to ramen restaurants with outdoor seating near you — the strongest signal that you can bring a four-legged friend. Enter your ZIP or tap "Use my location" to find one nearby.',
          'Pet policies vary and are not something this map tracks directly, so here is how I confirm a spot is genuinely dog-friendly before showing up with mine, plus a few tips for a smooth patio meal.',
        ]}
        sections={[
          {
            h2: 'Why "Outdoor Seating" is the starting filter',
            body: (
              <p>
                In most areas, health regulations keep pets out of indoor dining rooms, so a patio, sidewalk tables,
                or a covered outdoor area is almost always where dogs are welcome. Filtering to ramen spots with
                outdoor seating is the most reliable way to surface places that can accommodate a pet — far more
                dependable than hoping an indoor-only shop makes an exception.
              </p>
            ),
            points: [
              { h3: 'Patios & sidewalk seating', text: 'The most common place a restaurant can legally welcome dogs — leashed and beside your table.' },
              { h3: 'Covered outdoor areas', text: 'Great for hotter or rainier days when you still want to bring your pet along.' },
              { h3: 'Counter shops with a patio', text: 'Even a small ramen counter with a couple of outdoor tables can be dog-friendly.' },
            ],
          },
          {
            h2: 'Confirming the pet policy before you go',
            body: (
              <p>
                Whether a specific restaurant welcomes dogs — and any rules about where they can sit — is not
                something this map tracks directly. Once you have a shortlist from the outdoor-seating filter, I
                call ahead or check the restaurant&apos;s website and recent reviews (people often mention bringing
                their dog) to confirm before making the trip. Service animals are protected by law and allowed
                indoors regardless of a restaurant&apos;s general pet policy.
              </p>
            ),
          },
          {
            h2: 'Making it a smooth patio meal',
            body: (
              <p>
                I go a little outside peak hours so the patio is calmer for the dog, bring water and something to
                keep them settled, and pick a table at the edge so they are out of the server&apos;s path. A quick
                heads-up to the host that you have a dog also lets them seat you somewhere that works for everyone.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for pet friendly ramen"
        tips={[
          'Start with the "Outdoor Seating" filter (already on) — patios are where pet friendly dining almost always happens.',
          'Call ahead or check recent reviews to confirm the restaurant actually welcomes dogs on its patio.',
          'Go a little outside peak hours so the patio is calmer and easier for your dog.',
          'Bring water and pick an edge table so your dog stays out of the server\'s path.',
          'Service animals are allowed indoors by law, regardless of a restaurant\'s general pet policy.',
        ]}
        faqs={[
          { q: 'Where can I find pet friendly ramen near me?', a: 'Use the map above — it starts filtered to ramen spots with outdoor seating, the strongest signal that you can bring a dog. Enter your ZIP or tap "Use my location" to see the closest ones, then confirm the pet policy directly.' },
          { q: 'Can I bring my dog inside a ramen restaurant?', a: 'Usually not — most health codes keep pets out of indoor dining areas, which is why a patio or outdoor seating is where pet friendly ramen happens. Service animals are the exception and are allowed indoors by law.' },
          { q: 'Does this map confirm a restaurant allows dogs?', a: 'Not directly — pet policies vary and change. The outdoor-seating filter surfaces likely candidates; call ahead or check recent reviews to confirm before you go.' },
          { q: 'What should I bring for a patio ramen meal with my dog?', a: 'Water, something to keep them settled, and a leash — and pick an edge table so your dog stays out of the server\'s path. Going outside peak hours makes for a calmer experience.' },
        ]}
      />
    </main>
  )
}
