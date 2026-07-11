import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCities, getStates } from '@/lib/restaurants'
import { getSupplementStateStats } from '@/lib/places-supplements'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Ramen Restaurants by City & State | Ramen Near You',
  description: 'Find ramen restaurants in cities across every US state. Browse our full directory by city and state.',
}

export default function CitiesPage() {
  const cities = getCities()
  const dbStates = getStates()
  const dbStateSlugs = new Set(dbStates.map(s => s.stateSlug))

  // Merge DB states with supplement-only states so all 50 show up.
  // For DB states, boost cityCount with supplement cities not already in DB.
  const suppStats = getSupplementStateStats()
  const suppBySlug = new Map(suppStats.map(s => [s.stateSlug, s]))

  const allStates = [
    // DB states: combine DB city count + any extra supplement cities
    ...dbStates.map(s => {
      const supp = suppBySlug.get(s.stateSlug)
      return {
        state: s.state,
        stateSlug: s.stateSlug,
        cityCount: s.cityCount + (supp ? supp.cityCount : 0),
      }
    }),
    // Supplement-only states (no DB rows at all)
    ...suppStats.filter(s => !dbStateSlugs.has(s.stateSlug)),
  ].sort((a, b) => a.state.localeCompare(b.state))

  const totalCities = cities.length
  const totalRestaurants = cities.reduce((s, c) => s + c.count, 0)

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Browse by State</span>
          </nav>
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6">
            <RestaurantImage src={pickStockPhoto('cities-hub')} alt="A bowl of ramen" fill className="object-cover" sizes="1024px" priority />
          </div>
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">Ramen Restaurants by City &amp; State</h1>
          <p className="text-[#6B6862] text-lg">
            Find ramen spots and restaurants near you by browsing every city and state in our directory.
          </p>
          <p className="text-[#9B9490] text-sm mt-2">{allStates.length} states · {totalCities.toLocaleString()} cities · {totalRestaurants.toLocaleString()} restaurants</p>
        </div>
      </section>

      {/* State grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allStates.map((s) => (
              <Link
                key={s.stateSlug}
                href={`/${s.stateSlug}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5F4F0] border border-black/5 hover:border-[#B57F50]/40 hover:bg-[#B57F50]/5 transition-colors group"
              >
                <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors">{s.state}</span>
                <span className="text-[#6B6862] text-xs shrink-0 ml-2">{s.cityCount} {s.cityCount === 1 ? 'city' : 'cities'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
