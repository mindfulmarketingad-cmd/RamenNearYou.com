import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCities, getStates } from '@/lib/restaurants'
import { getSupplementStateStats, getSupplementCitiesByState } from '@/lib/places-supplements'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import CitiesDirectory from './cities-directory'
import AdUnitHorizontal from '@/components/ad-unit-horizontal'
import AdUnitVertical from '@/components/ad-unit-vertical'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Ramen Restaurants by City & State | Ramen Near You',
  description: 'Find ramen restaurants in cities across every US state. Browse our full directory by city and state.',
}

// Every city with its own /{city}/{state} page — DB cities (2+ listings)
// merged with Google Places supplement-only cities, deduped and summed by
// citySlug so a city with rows in both sources counts once.
function getAllCitiesByState() {
  const byState = new Map<string, { stateSlug: string; state: string; cities: Map<string, { city: string; citySlug: string; count: number }> }>()

  const stateEntry = (stateSlug: string, state: string) => {
    let e = byState.get(stateSlug)
    if (!e) { e = { stateSlug, state, cities: new Map() }; byState.set(stateSlug, e) }
    if (state && !e.state) e.state = state
    return e
  }

  for (const s of getStates()) stateEntry(s.stateSlug, s.state)
  for (const c of getCities()) {
    stateEntry(c.stateSlug, '').cities.set(c.citySlug, { city: c.city, citySlug: c.citySlug, count: c.count })
  }
  for (const s of getSupplementStateStats()) {
    const e = stateEntry(s.stateSlug, s.state)
    for (const sc of getSupplementCitiesByState(s.stateSlug)) {
      const hit = e.cities.get(sc.citySlug)
      if (hit) hit.count += sc.count
      else e.cities.set(sc.citySlug, { city: sc.city, citySlug: sc.citySlug, count: sc.count })
    }
  }

  return Array.from(byState.values())
    .map(e => ({
      stateSlug: e.stateSlug,
      state: e.state,
      cities: Array.from(e.cities.values()).sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => a.state.localeCompare(b.state))
}

export default function CitiesPage() {
  const statesWithCities = getAllCitiesByState()
  const totalCities = statesWithCities.reduce((s, st) => s + st.cities.length, 0)
  const totalRestaurants = statesWithCities.reduce((s, st) => s + st.cities.reduce((c, ci) => c + ci.count, 0), 0)

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Browse by City &amp; State</span>
          </nav>
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6">
            <RestaurantImage src={pickStockPhoto('cities-hub')} alt="A bowl of ramen" fill className="object-cover" sizes="1024px" priority />
          </div>
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">Ramen Restaurants by City &amp; State</h1>
          <p className="text-[#6B6862] text-lg">
            Find ramen spots and restaurants near you by browsing every city and state in our directory.
          </p>
          <p className="text-[#6B6862] text-sm mt-2">
            {statesWithCities.length} states · {totalCities.toLocaleString()} cities · {totalRestaurants.toLocaleString()} restaurants
          </p>
        </div>
      </section>

      {/* Above the fold, directly under the header — this hub had no ads at all. */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl mx-auto"><AdUnitHorizontal /></div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <CitiesDirectory statesWithCities={statesWithCities} />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto"><AdUnitVertical /></div>
      </section>

      <Footer />
    </main>
  )
}
