'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, Star } from 'lucide-react'

export type ReviewListing = {
  href: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
}

type SortOption = 'name' | 'rating' | 'reviews'

const RESULT_CAP = 200

// Client search/filter/sort over every restaurant review page — same
// pattern as the /find hub, plus a state filter and rating/review sorts.
export default function ReviewsHubSearch({ listings, total }: { listings: ReviewListing[]; total: number }) {
  const [q, setQ] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [sort, setSort] = useState<SortOption>('name')
  const query = q.trim().toLowerCase()

  const stateOptions = useMemo(() => {
    const codes = new Set(listings.map((l) => l.stateCode).filter(Boolean))
    return [...codes].sort()
  }, [listings])

  const filtered = useMemo(() => {
    let result = listings
    if (stateFilter) result = result.filter((l) => l.stateCode === stateFilter)
    if (query) {
      result = result.filter((l) =>
        `${l.name} ${l.city} ${l.stateCode}`.toLowerCase().includes(query)
      )
    }
    if (sort === 'rating') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    } else if (sort === 'reviews') {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return result
  }, [listings, stateFilter, query, sort])

  const capped = filtered.slice(0, RESULT_CAP)
  const isFiltering = query.length > 0 || stateFilter.length > 0 || sort !== 'name'

  const groups = useMemo(() => {
    if (isFiltering) return null
    const groupMap = new Map<string, ReviewListing[]>()
    for (const l of filtered) {
      const first = l.name.charAt(0).toLowerCase()
      const letter = first >= 'a' && first <= 'z' ? first.toUpperCase() : '#'
      if (!groupMap.has(letter)) groupMap.set(letter, [])
      groupMap.get(letter)!.push(l)
    }
    return Array.from(groupMap.entries())
      .map(([letter, ls]) => ({ letter, links: ls }))
      .sort((a, b) => (a.letter === '#' ? -1 : b.letter === '#' ? 1 : a.letter.localeCompare(b.letter)))
  }, [filtered, isFiltering])

  function Row({ l }: { l: ReviewListing }) {
    return (
      <Link
        href={l.href}
        className="flex items-center justify-between gap-2 text-sm text-[#1E2026] hover:text-[#96602F] hover:underline py-1 transition-colors"
      >
        <span className="truncate">{l.name} — {l.city}, {l.stateCode}</span>
        {l.rating != null && (
          <span className="flex items-center gap-1 shrink-0 text-xs text-[#6B6862] no-underline">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {l.rating.toFixed(1)}
            <span className="text-[#6B6862]/60">({l.reviewCount.toLocaleString()})</span>
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6862] hover:text-[#1E2026]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* State filter + sort */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-8">
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          aria-label="Filter by state"
          className="px-3 py-2.5 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] focus:border-[#B57F50] transition-colors"
        >
          <option value="">All States</option>
          {stateOptions.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort reviews"
          className="px-3 py-2.5 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] focus:border-[#B57F50] transition-colors"
        >
          <option value="name">Sort: Name A–Z</option>
          <option value="rating">Sort: Highest Rated</option>
          <option value="reviews">Sort: Most Reviews</option>
        </select>
      </div>

      {isFiltering ? (
        filtered.length === 0 ? (
          <p className="text-sm text-[#6B6862]">
            No matches{q ? ` for “${q}”` : ''}{stateFilter ? ` in ${stateFilter}` : ''}. Try a different search, state, or clear your filters.
          </p>
        ) : (
          <>
            <ul className="columns-1 sm:columns-2 gap-x-6 space-y-1">
              {capped.map((l) => (
                <li key={l.href} className="break-inside-avoid">
                  <Row l={l} />
                </li>
              ))}
            </ul>
            {filtered.length > RESULT_CAP && (
              <p className="text-xs text-[#6B6862] mt-3">
                Showing the first {RESULT_CAP} of {filtered.length.toLocaleString()} matches — narrow your search or state to see more.
              </p>
            )}
          </>
        )
      ) : (
        <div className="space-y-8">
          {groups!.map((g) => (
            <div key={g.letter}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {g.letter}
              </h2>
              <ul className="columns-1 sm:columns-2 gap-x-6 space-y-1">
                {g.links.map((l) => (
                  <li key={l.href} className="break-inside-avoid">
                    <Row l={l} />
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
