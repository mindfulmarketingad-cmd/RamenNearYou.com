import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getStates } from '@/lib/restaurants'
import { getSupplementCitiesByState, getSupplementStateStats } from '@/lib/places-supplements'

export const metadata: Metadata = {
  title: 'Ramen Restaurants by State | RamenNearYou',
  description: 'Every state we track ramen restaurants in, with how many we currently have listed. Pick a state to see its full, ranked directory.',
  alternates: { canonical: 'https://www.ramennearyou.com/state' },
}

export default function StateIndexPage() {
  const dbStates = getStates() // { state, stateCode, stateSlug, count, cityCount }
  const knownSlugs = new Set(dbStates.map(s => s.stateSlug))

  // Supplement-only states (no DB rows) — getSupplementStateStats() gives the
  // city count but not a restaurant count, so sum it from the per-city list.
  const supplementStates = getSupplementStateStats()
    .filter(s => !knownSlugs.has(s.stateSlug))
    .map(s => ({
      state: s.state,
      stateSlug: s.stateSlug,
      count: getSupplementCitiesByState(s.stateSlug).reduce((sum, c) => sum + c.count, 0),
      cityCount: s.cityCount,
    }))

  // Hawaii's DB rows are stored under the "hi" slug rather than "hawaii" (see
  // lib/city-listicles.ts for the same quirk) — that mismatch would otherwise
  // show up here as two separate "Hawaii" cards. Dedupe by state name,
  // keeping the DB-backed entry (added first) since that's the one with
  // fully-featured individual listing pages.
  const seenNames = new Set<string>()
  const allStates = [...dbStates, ...supplementStates]
    .filter((s) => {
      const key = s.state.toLowerCase()
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    })
    .sort((a, b) => a.state.localeCompare(b.state))

  const totalRestaurants = allStates.reduce((s, st) => s + st.count, 0)
  const totalTowns = allStates.reduce((s, st) => s + st.cityCount, 0)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Header */}
      <div className="bg-[#F5F0EA] px-4 sm:px-6 pt-24 pb-8">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-4">
            <Link href="/" className="hover:text-[#96602F] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1E2026]">By State</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
            Ramen Restaurants by State
          </h1>
          <p className="text-[#6B6862] text-sm leading-relaxed max-w-2xl">
            Every state we track ramen restaurants in, with how many we currently have listed.
            Pick a state to see its full, ranked directory.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-sm text-[#6B6862] mb-6">
          Currently tracking <strong className="text-[#1E2026]">{totalRestaurants.toLocaleString()}</strong> ramen
          restaurants across <strong className="text-[#1E2026]">{allStates.length}</strong> states and{' '}
          <strong className="text-[#1E2026]">{totalTowns.toLocaleString()}</strong> towns.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allStates.map((s) => (
            <Link
              key={s.stateSlug}
              href={`/${s.stateSlug}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-black/10 bg-white hover:border-[#B57F50]/50 hover:bg-[#FAFAF9] transition-colors"
            >
              <span className="text-sm font-medium text-[#1E2026]">{s.state}</span>
              <span className="text-xs text-[#6B6862] shrink-0">{s.count.toLocaleString()}</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-black/8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">
            Looking for something more specific?
          </h2>
          <p className="text-[#6B6862] text-sm leading-relaxed max-w-2xl">
            Each state page lists every ramen restaurant we track there, ranked by rating, with search and
            filter by city or feature. If you&apos;d rather search by name, ZIP code, or feature across the
            whole directory instead of browsing state by state, use{' '}
            <Link href="/search" className="text-[#96602F] hover:underline">Search Ramen Near You</Link> or{' '}
            <Link href="/find" className="text-[#96602F] hover:underline">search the live map</Link>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
