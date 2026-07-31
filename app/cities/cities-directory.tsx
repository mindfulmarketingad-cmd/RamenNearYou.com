'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type City = { city: string; citySlug: string; count: number }
type StateGroup = { stateSlug: string; state: string; cities: City[] }

const CITY_RESULT_CAP = 150

// Search over every city (client-side, since the full list is small text)
// plus a state jump-list, then the full state → city grid below.
export default function CitiesDirectory({ statesWithCities }: { statesWithCities: StateGroup[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const matches = useMemo(() => {
    if (!query) return null
    const out: Array<{ href: string; label: string }> = []
    for (const st of statesWithCities) {
      for (const c of st.cities) {
        const label = `${c.city}, ${st.state}`
        if (label.toLowerCase().includes(query) || c.city.toLowerCase().includes(query)) {
          out.push({ href: `/${c.citySlug}/${st.stateSlug}`, label })
          if (out.length >= CITY_RESULT_CAP) return out
        }
      }
    }
    return out
  }, [query, statesWithCities])

  return (
    <>
      <div className="relative mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cities — e.g. Atlanta, Austin, Portland…"
          aria-label="Search cities"
          className="w-full pl-10 pr-10 py-3 text-sm bg-[#F5F4F0] border border-black/12 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
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

      {matches ? (
        <div>
          {matches.length === 0 ? (
            <p className="text-sm text-[#6B6862]">No cities match &ldquo;{q}&rdquo;.</p>
          ) : (
            <ul className="columns-2 sm:columns-3 md:columns-4 gap-x-6 space-y-1">
              {matches.map((m) => (
                <li key={m.href} className="break-inside-avoid">
                  <Link href={m.href} className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {matches.length >= CITY_RESULT_CAP && (
            <p className="text-xs text-[#6B6862] mt-3">Showing the first {CITY_RESULT_CAP} cities — keep typing to narrow it down.</p>
          )}
        </div>
      ) : (
        <>
          {/* Jump list */}
          <div className="flex flex-wrap gap-2 mb-10">
            {statesWithCities.map((s) => (
              <a
                key={s.stateSlug}
                href={`#state-${s.stateSlug}`}
                className="px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-xs font-medium text-[#1E2026] hover:border-[#B57F50]/40 hover:text-[#96602F] transition-colors"
              >
                {s.state}
              </a>
            ))}
          </div>

          <div className="space-y-10">
            {statesWithCities.map((s) => (
              <div key={s.stateSlug} id={`state-${s.stateSlug}`} className="scroll-mt-24">
                <h2 className="flex items-baseline gap-2 mb-3">
                  <Link href={`/${s.stateSlug}`} className="font-serif text-xl font-bold text-[#1E2026] hover:text-[#96602F] transition-colors">
                    {s.state}
                  </Link>
                  <span className="text-[#6B6862] text-xs font-normal">
                    {s.cities.length} {s.cities.length === 1 ? 'city' : 'cities'}
                  </span>
                </h2>
                <ul className="columns-2 sm:columns-3 md:columns-4 gap-x-6 space-y-1">
                  {s.cities.map((c) => (
                    <li key={c.citySlug} className="break-inside-avoid">
                      <Link
                        href={`/${c.citySlug}/${s.stateSlug}`}
                        className="block text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
                      >
                        {c.city} <span className="text-[#9B9490] text-xs">({c.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
