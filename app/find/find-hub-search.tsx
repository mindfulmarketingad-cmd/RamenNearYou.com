'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type CatPage = { href: string; label: string }
type Category = { heading: string; pages: CatPage[] }
type CityState = { stateCode: string; stateName: string; cities: { param: string; city: string }[] }

const CITY_RESULT_CAP = 120

function stateHref(stateName: string, stateCode: string) {
  return `/${(stateName ?? stateCode).toLowerCase().replace(/\s+/g, '-')}`
}

// Client search over the curated /find pages (filters/broths/styles) and every
// city page, so visitors can jump straight to the search they want.
export default function FindHubSearch({
  categories,
  cityPagesByState,
  totalCityPages,
}: {
  categories: Category[]
  cityPagesByState: CityState[]
  totalCityPages: number
}) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null

    const filterMatches = categories.flatMap((c) =>
      c.pages
        .filter((p) => p.label.toLowerCase().includes(query))
        .map((p) => ({ ...p, group: c.heading })),
    )

    const cityMatches: CatPage[] = []
    for (const st of cityPagesByState) {
      for (const c of st.cities) {
        const label = `${c.city}, ${st.stateCode}`
        if (label.toLowerCase().includes(query) || c.city.toLowerCase().includes(query)) {
          cityMatches.push({ href: `/find/${c.param}`, label })
          if (cityMatches.length >= CITY_RESULT_CAP) break
        }
      }
      if (cityMatches.length >= CITY_RESULT_CAP) break
    }

    return { filterMatches, cityMatches }
  }, [query, categories, cityPagesByState])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search ramen pages and cities — e.g. tonkotsu, open late, Austin…"
          aria-label="Search Find pages"
          className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6862] hover:text-[#1E2026]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results ? (
        /* ── Filtered results ── */
        <div className="space-y-8">
          {results.filterMatches.length === 0 && results.cityMatches.length === 0 && (
            <p className="text-sm text-[#6B6862]">
              No matches for &ldquo;{q}&rdquo;. Try a broth (tonkotsu, miso), a feature (open late, delivery), or a city.
            </p>
          )}

          {results.filterMatches.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                Filters &amp; Styles
              </h2>
              <ul className="space-y-1">
                {results.filterMatches.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.cityMatches.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                Cities
              </h2>
              <ul className="columns-2 sm:columns-3 gap-x-6 space-y-1">
                {results.cityMatches.map((p) => (
                  <li key={p.href} className="break-inside-avoid">
                    <Link
                      href={p.href}
                      className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {results.cityMatches.length >= CITY_RESULT_CAP && (
                <p className="text-xs text-[#6B6862] mt-3">
                  Showing the first {CITY_RESULT_CAP} cities — keep typing to narrow it down.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── Default browse view ── */
        <>
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat.heading}>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                  {cat.heading}
                </h2>
                <ul className="space-y-1">
                  {cat.pages.map((p) => (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
                      >
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* All city pages, grouped by state */}
          <div className="mt-14 pt-10 border-t border-black/10">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-1">Ramen by City</h2>
            <p className="text-[#6B6862] text-sm mb-8">
              Browse all {totalCityPages.toLocaleString()} city pages across {cityPagesByState.length} states.
            </p>

            <div className="space-y-8">
              {cityPagesByState.map((state) => (
                <div key={state.stateCode}>
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                    <Link href={stateHref(state.stateName, state.stateCode)} className="hover:text-[#96602F] transition-colors">
                      {state.stateName}
                    </Link>
                  </h3>
                  <ul className="columns-2 sm:columns-3 gap-x-6 space-y-1">
                    {state.cities.map((c) => (
                      <li key={c.param} className="break-inside-avoid">
                        <Link
                          href={`/find/${c.param}`}
                          className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
                        >
                          {c.city}, {state.stateCode}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
