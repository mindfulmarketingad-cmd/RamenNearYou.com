import Link from 'next/link'
import { getCities, getStates } from '@/lib/restaurants'

export default function CityStateDirectory() {
  const states = getStates().sort((a, b) => a.state.localeCompare(b.state))
  const cities = getCities()

  const citiesByState = new Map<string, typeof cities>()
  for (const c of cities) {
    const list = citiesByState.get(c.stateSlug) ?? []
    list.push(c)
    citiesByState.set(c.stateSlug, list)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Browse the Directory</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
          Ramen Restaurants by City &amp; State
        </h2>
        <p className="text-[#6B6862] text-sm sm:text-base max-w-xl leading-relaxed mb-10">
          Find ramen spots and restaurants near you by browsing every city and state in our directory.
        </p>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-8 space-y-8">
          {states.map((s) => {
            const stateCities = (citiesByState.get(s.stateSlug) ?? []).sort((a, b) =>
              a.city.localeCompare(b.city)
            )
            if (stateCities.length === 0) return null
            return (
              <div key={s.stateSlug} className="break-inside-avoid">
                <Link
                  href={`/${s.stateSlug}`}
                  className="block text-[#B57F50] font-semibold text-sm mb-2 hover:text-[#1E2026] transition-colors"
                >
                  {s.state}
                </Link>
                <ul className="space-y-1">
                  {stateCities.map((c) => (
                    <li key={`${c.citySlug}-${c.stateSlug}`}>
                      <Link
                        href={`/${c.citySlug}/${c.stateSlug}`}
                        className="text-[#1E2026] text-sm hover:text-[#B57F50] transition-colors"
                      >
                        {c.city} Ramen Restaurants
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
