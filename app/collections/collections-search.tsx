'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type ColPage = { href: string; label: string }
type ColGroup = { heading: string; pages: ColPage[] }

export default function CollectionsSearch({ collections }: { collections: ColGroup[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null
    return collections.flatMap((c) =>
      c.pages
        .filter((p) => p.label.toLowerCase().includes(query))
        .map((p) => ({ ...p, group: c.heading })),
    )
  }, [query, collections])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9490]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search collections — e.g. bowls, cookers…"
          aria-label="Search collections"
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
        <div>
          {results.length === 0 ? (
            <p className="text-sm text-[#6B6862]">
              No matches for &ldquo;{q}&rdquo;. Try searching for bowls or cookers.
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
        <div className="space-y-8">
          {collections.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {col.heading}
              </h2>
              <ul className="space-y-1">
                {col.pages.map((p) => (
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
