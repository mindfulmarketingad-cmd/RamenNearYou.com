'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type BlogPage = { href: string; label: string }
type BlogGroup = { heading: string; pages: BlogPage[] }

export default function BlogSearch({ groups, extraSearchPages = [] }: { groups: BlogGroup[]; extraSearchPages?: BlogPage[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null
    const fromGroups = groups.flatMap((g) =>
      g.pages
        .filter((p) => p.label.toLowerCase().includes(query))
        .map((p) => ({ ...p, group: g.heading })),
    )
    const fromExtra = extraSearchPages
      .filter((p) => p.label.toLowerCase().includes(query))
      .map((p) => ({ ...p, group: 'Best Ramen by City' }))
      .slice(0, 150)
    return [...fromGroups, ...fromExtra]
  }, [query, groups, extraSearchPages])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles — e.g. tonkotsu, Atlanta, recipes…"
          aria-label="Search blog posts"
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
        <div>
          {results.length === 0 ? (
            <p className="text-sm text-[#6B6862]">
              No matches for &ldquo;{q}&rdquo;. Try a city, broth type, or topic like recipes or health.
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((p) => (
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
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.heading}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {g.heading}
              </h2>
              <ul className="space-y-1">
                {g.pages.map((p) => (
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
      )}
    </>
  )
}
