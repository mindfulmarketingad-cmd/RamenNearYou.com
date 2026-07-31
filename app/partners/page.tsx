import Link from 'next/link'
import { Star } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PartnersDirectory from './partners-directory'
import { phoRestaurants, getPhoStats, getPhoCities, phoCityParam } from '@/lib/pho'

export const metadata = {
  title: 'All Ramen Restaurants in USA',
  description: 'Search and filter every ramen restaurant listed on RamenNearYou. Find your business and claim your free listing to update hours, photos, and get featured placement.',
  alternates: { canonical: 'https://www.ramennearyou.com/partners' },
}

export default function PartnersPage() {
  const phoStats = getPhoStats()
  const phoCities = getPhoCities().slice(0, 12)
  // Highest-rated pho listings with enough reviews to be a meaningful score.
  const featuredPho = phoRestaurants
    .filter(p => p.rating != null && p.reviewCount >= 100)
    .slice(0, 12)

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">Partners</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
            Ramen Restaurant Locator
          </h1>
          <p className="text-[#6B6862] text-sm max-w-2xl mb-8">
            Search or filter to find your restaurant, then claim your free listing to update your hours,
            photos, and description — and get featured placement on the map.
          </p>

          <PartnersDirectory />

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

            <h3 className="text-[#1E2026] font-semibold text-sm mb-3">Top-rated pho listings</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {featuredPho.map(p => (
                <Link
                  key={p.slug}
                  href={`/partners/${p.slug}`}
                  className="p-4 rounded-xl bg-white border border-black/8 hover:border-[#16a34a]/40 transition-colors group"
                >
                  <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#16a34a] transition-colors truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#6B6862] mt-0.5 truncate">{p.city}, {p.stateCode}</p>
                  {p.rating != null && (
                    <span className="flex items-center gap-0.5 text-xs text-[#6B6862] mt-1.5">
                      <Star className="w-3 h-3 fill-[#B57F50] text-[#96602F]" />
                      {p.rating.toFixed(1)}
                      <span> ({p.reviewCount.toLocaleString()})</span>
                    </span>
                  )}
                </Link>
              ))}
            </div>

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
        </div>
      </div>
      <Footer />
    </main>
  )
}
