'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type CatPage = { href: string; label: string }
type Category = { heading: string; pages: CatPage[] }

// Client search over the broth-comparison pages so visitors can jump straight
// to the matchup they want — mirrors the /find hub format.
export default function ComparisonsSearch({ categories }: { categories: Category[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null
    return categories.flatMap((c) =>
      c.pages
        .filter((p) => p.label.toLowerCase().includes(query))
        .map((p) => ({ ...p, group: c.heading })),
    )
  }, [query, categories])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9490]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search comparisons — e.g. tonkotsu, miso, vegan…"
          aria-label="Search broth comparisons"
          className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9490] hover:text-[#1E2026]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results ? (
        /* ── Filtered results ── */
        <div>
          {results.length === 0 ? (
            <p className="text-sm text-[#6B6862]">
              No matches for &ldquo;{q}&rdquo;. Try a broth type like tonkotsu, miso, shoyu, shio, spicy, or vegan.
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        /* ── Default browse view ── */
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
                      className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
