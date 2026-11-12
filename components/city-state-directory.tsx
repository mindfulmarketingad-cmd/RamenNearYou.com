import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStates } from '@/lib/restaurants'
import { getSupplementStateStats } from '@/lib/places-supplements'

export default function CityStateDirectory() {
  // Merge DB states with supplement-only states so all 50 show up, mirroring
  // /cities. Dedupe case-insensitively by state name (Hawaii exists under both
  // "hi" and "hawaii" slugs, DC under two capitalizations); the DB entry wins.
  // Quebec is a Canadian supplement dataset — not a US state, so skip it here.
  const dbStates = getStates()
  const seenNames = new Set(dbStates.map(s => s.state.toLowerCase()))
  const states = [
    ...dbStates.map(s => ({ state: s.state, stateSlug: s.stateSlug, cityCount: s.cityCount })),
    ...getSupplementStateStats().filter(
      s => !seenNames.has(s.state.toLowerCase()) && s.stateSlug !== 'quebec'
    ),
  ].sort((a, b) => a.state.localeCompare(b.state))

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-brand-ink text-xs font-medium uppercase tracking-widest mb-2">Browse the Directory</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
          Ramen Restaurants by State
        </h2>
        <p className="text-ink-soft text-sm sm:text-base max-w-xl leading-relaxed mb-10">
          Find ramen spots and restaurants near you. Pick your state to browse every city in our directory.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {states.map((s) => (
            <Link
              key={s.stateSlug}
              href={`/${s.stateSlug}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-sunken border border-line/5 hover:border-brand/40 hover:bg-brand/5 transition-colors group"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-ink text-sm font-medium group-hover:text-brand-ink transition-colors truncate">
                  {s.state}
                </span>
              </span>
              <span className="flex items-center gap-1 shrink-0 ml-2">
                <span className="text-ink-soft text-xs">{s.cityCount} {s.cityCount === 1 ? 'city' : 'cities'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-brand-ink/50 group-hover:text-brand-ink transition-colors" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
