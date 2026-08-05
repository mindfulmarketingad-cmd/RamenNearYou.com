import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ErrorBoundary from '@/components/error-boundary'
import HomeMapHero from '@/components/home-map-hero'
import PseoListicle from '@/components/pseo-listicle'
import { restaurantsToListicleItems, phoToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'
import { restaurants } from '@/lib/restaurants'
import { miscPartners, miscPartnerToPhoShape } from '@/lib/misc-partners'
import { phoRestaurants, getPhoStats, getPhoCities, phoCityParam } from '@/lib/pho'

export const metadata = {
  title: 'Ramen Restaurant Locator',
  description: 'Find your ramen or pho restaurant on RamenNearYou, claim your listing for $19.99/mo, and update your hours, photos, and description. Learn how claiming and featured placement work.',
  alternates: { canonical: 'https://www.ramennearyou.com/partners' },
}

const partnersFaqs = [
  {
    q: 'How much does it cost to claim my restaurant listing?',
    a: "Claiming a listing on RamenNearYou is $19.99/month. You create an account, subscribe, submit your claim, and our team verifies ownership before approving it.",
  },
  {
    q: 'How long does claim verification take?',
    a: 'Most claims are reviewed within a few business days. Once approved, your listing gets a verified badge, ads are removed from your dedicated page, and you can update your hours, photos, menu, and description anytime.',
  },
  {
    q: "What if my restaurant isn't listed at all?",
    a: "If you can't find your restaurant using the search above, contact us and we'll get it added to the directory so you can claim it.",
  },
  {
    q: 'Does claiming remove ads from my listing page?',
    a: "Yes. Once your claim is approved, your restaurant's dedicated listing page runs ad-free — one of the perks of verifying ownership.",
  },
  {
    q: 'How do I get my restaurant featured on the map?',
    a: 'Featured placement is a separate, paid option from claiming — it puts your restaurant at the top of your city page, state page, and homepage with a gold pin on the map. Plans start at $19.99/month; see /featured-listing for details.',
  },
]

export default async function PartnersPage() {
  const phoStats = getPhoStats()
  const phoCities = getPhoCities().slice(0, 12)

  // Every restaurant on the site in one directory: DB ramen listings, pho
  // listings, and misc partners (non-restaurant POIs that still get a
  // /partners/{slug} page) — the same three sources /find pages pull from,
  // combined instead of scoped to a city or state.
  const verifiedSlugs = await getAllVerifiedSlugs()
  const ramenItems = restaurantsToListicleItems(restaurants, { verifiedSlugs })
  const phoItems = phoToListicleItems(phoRestaurants)
  const miscItems = phoToListicleItems(miscPartners.map(miscPartnerToPhoShape))
  const allItems = [...ramenItems, ...phoItems, ...miscItems]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))

  const mapSlot = (
    <ErrorBoundary fallback={null}>
      <HomeMapHero
        mapOnly={false}
        pageTitle="Ramen Restaurant Locator"
        pageDescription="Every ramen and pho restaurant we track. Enter your ZIP or use your location, then filter by broth, price, and hours."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <PseoListicle
        breadcrumb={[
          { label: 'Ramen Near You', href: '/' },
          { label: 'Partners' },
        ]}
        title={`Ramen Restaurant Locator — ${allItems.length.toLocaleString()} Spots`}
        subtitle="Every ramen and pho restaurant we track, ranked by rating and review volume — claimed or not. Search by name or city, then claim your listing to take control of it."
        items={allItems}
        noun="restaurant"
        nounPlural="restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <div className="pt-4 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Owner-facing SEO content: real, honest answers about how the
              claim and featured-placement flows actually work — not generic
              filler, since these are the exact questions an owner searching
              for their restaurant has. */}
          <section className="mt-16 pt-12 border-t border-black/10 max-w-3xl">
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">How Do I Find My Ramen Restaurant on This Page?</h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Use the search bar above to look up your restaurant by name or city. Every ramen restaurant we
              track is searchable here, whether or not it&apos;s been claimed yet. If it doesn&apos;t come up,
              it may be listed under a slightly different name or spelling — try just the city, or see the
              FAQ below for what to do if it isn&apos;t listed at all.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">How Do I Claim My Restaurant Listing for Free?</h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Open your restaurant&apos;s listing page and look for the &ldquo;Own this business?&rdquo;
              section. Create a free account, submit your claim, and our team reviews it to verify ownership.
              There&apos;s no cost and no card required — claiming just gives you control over your own
              listing.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">What Happens After I Submit a Claim?</h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Your claim goes into a review queue while our team verifies you&apos;re actually associated with
              the business. Once approved, you get a verified badge on your listing and the search map, your
              page runs ad-free, and you can update your hours, photos, menu, and description whenever
              something changes.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">How Do I Get My Restaurant Featured on the Map?</h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Featured placement is a separate, paid upgrade from claiming — it puts your restaurant at the
              top of your city page, state page, and the homepage with a gold pin on the search map. Plans
              start at $19.99/month; see{' '}
              <Link href="/featured-listing" className="text-[#96602F] hover:underline">our featured listing page</Link>{' '}
              for full details and to get started.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">Can I List a Pho Restaurant Here Too?</h2>
            <p className="text-[#6B6862] text-sm leading-relaxed">
              Yes. Pho restaurants get their own profile pages under this same directory, and the claim
              process works identically — search for your restaurant, open its listing, and claim it for
              free. See the pho section below for our current pho coverage.
            </p>
          </section>

          {/* Pho partner listings — a separate cuisine from the ramen directory
              above, with their own detail pages under /partners/{slug}. */}
          <section className="mt-16 pt-12 border-t border-black/10">
            <p className="text-[#16a34a] text-xs font-semibold uppercase tracking-widest mb-2">Pho Restaurants</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">
              Pho Restaurants Near You
            </h2>
            <p className="text-[#6B6862] text-sm max-w-2xl mb-8">
              We list {phoStats.restaurants} pho restaurants across {phoStats.cities} cities and{' '}
              {phoStats.states} states. Each has a full profile with hours, amenities, ratings, and
              what to order. Pho spots show as{' '}
              <span className="text-[#16a34a] font-semibold">green pins</span> on the{' '}
              <Link href="/find" className="text-[#96602F] hover:underline">search map</Link>.
            </p>

            <h3 className="text-[#1E2026] font-semibold text-sm mb-3">Pho by city</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {phoCities.map(c => (
                <Link
                  key={`${c.citySlug}-${c.stateCode}`}
                  href={`/find/${phoCityParam(c.citySlug, c.stateCode)}`}
                  className="text-sm text-[#96602F] hover:underline"
                >
                  {c.city}, {c.stateCode} ({c.count})
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16 pt-12 border-t border-black/10 max-w-3xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {partnersFaqs.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-[#1E2026] font-semibold text-base mb-1.5">{q}</h3>
                  <p className="text-[#6B6862] text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: partnersFaqs.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />
    </main>
  )
}
