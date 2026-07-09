'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type RecipeLink = { href: string; label: string }
type RecipeGroup = { heading: string; recipes: RecipeLink[] }

// Client search over the recipe pages — same pattern as the /find hub.
export default function RecipesHubSearch({ groups }: { groups: RecipeGroup[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null
    return groups.flatMap((g) =>
      g.recipes.filter((r) => r.label.toLowerCase().includes(query)),
    )
  }, [query, groups])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9490]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes — e.g. miso, tonkotsu, chicken…"
          aria-label="Search recipes"
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
        results.length === 0 ? (
          <p className="text-sm text-[#6B6862]">
            No matches for &ldquo;{q}&rdquo;. Try a broth (miso, tonkotsu) or a protein (chicken, shrimp).
          </p>
        ) : (
          <ul className="space-y-1">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.heading}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {g.heading}
              </h2>
              <ul className="space-y-1">
                {g.recipes.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                    >
                      {r.label}
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
