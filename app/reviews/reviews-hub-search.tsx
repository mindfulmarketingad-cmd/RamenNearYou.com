'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

export type ReviewLink = { href: string; label: string }
export type LetterGroup = { letter: string; links: ReviewLink[] }

const RESULT_CAP = 200

// Client search over every restaurant review page — same pattern as the /find hub.
export default function ReviewsHubSearch({ groups, total }: { groups: LetterGroup[]; total: number }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return null
    const matches: ReviewLink[] = []
    for (const g of groups) {
      for (const l of g.links) {
        if (l.label.toLowerCase().includes(query)) {
          matches.push(l)
          if (matches.length >= RESULT_CAP) return matches
        }
      }
    }
    return matches
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
          placeholder={`Search ${total.toLocaleString()} restaurant reviews — name or city…`}
          aria-label="Search restaurant reviews"
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
            No matches for &ldquo;{q}&rdquo;. Try a restaurant name or a city.
          </p>
        ) : (
          <>
            <ul className="columns-1 sm:columns-2 gap-x-6 space-y-1">
              {results.map((l) => (
                <li key={l.href} className="break-inside-avoid">
                  <Link
                    href={l.href}
                    className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {results.length >= RESULT_CAP && (
              <p className="text-xs text-[#9B9490] mt-3">
                Showing the first {RESULT_CAP} matches — keep typing to narrow it down.
              </p>
            )}
          </>
        )
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.letter}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {g.letter}
              </h2>
              <ul className="columns-1 sm:columns-2 gap-x-6 space-y-1">
                {g.links.map((l) => (
                  <li key={l.href} className="break-inside-avoid">
                    <Link
                      href={l.href}
                      className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                    >
                      {l.label}
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
