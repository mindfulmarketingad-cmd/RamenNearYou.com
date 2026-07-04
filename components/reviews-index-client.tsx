'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Star, Search } from 'lucide-react'

export interface ReviewIndexItem {
  name: string
  reviewSlug: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  description: string
}

type SortBy = 'rating' | 'reviews' | 'name'

const PAGE_SIZE = 60

// Short excerpt centered on the matched word, so a search like "miso" shows
// exactly why a restaurant matched even when it's not in the name or city.
function matchExcerpt(description: string, q: string): string | null {
  const idx = description.toLowerCase().indexOf(q)
  if (idx === -1) return null
  const start = Math.max(0, idx - 40)
  const end = Math.min(description.length, idx + q.length + 60)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < description.length ? '…' : ''
  return `${prefix}${description.slice(start, end).trim()}${suffix}`
}

export default function ReviewsIndexClient({ items }: { items: ReviewIndexItem[] }) {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('rating')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const states = useMemo(
    () => Array.from(new Set(items.map((r) => r.stateCode))).sort(),
    [items]
  )
  const cities = useMemo(() => {
    const pool = state ? items.filter((r) => r.stateCode === state) : items
    return Array.from(new Set(pool.map((r) => r.city))).sort()
  }, [items, state])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter((r) => {
      if (state && r.stateCode !== state) return false
      if (city && r.city !== city) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.stateCode.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    })

    list = [...list]
    if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    }
    return list
  }, [query, state, city, sortBy, items])

  const visible = filtered.slice(0, limit)
  const q = query.trim().toLowerCase()

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9490]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(PAGE_SIZE)
          }}
          placeholder="Search by restaurant, city, state, or broth like “miso”…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/10 bg-white text-[#1E2026] placeholder-[#9B9490] text-sm outline-none focus:border-[#B57F50] transition-colors"
        />
      </div>

      {/* State + city + sort filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-white text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none"
        >
          <option value="rating">Sort: Top Rated</option>
          <option value="reviews">Sort: Most Reviews</option>
          <option value="name">Sort: Name A-Z</option>
        </select>
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value)
            setCity('')
            setLimit(PAGE_SIZE)
          }}
          className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-white text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none"
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            setLimit(PAGE_SIZE)
          }}
          className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-white text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {(state || city) && (
          <button
            onClick={() => { setState(''); setCity(''); setLimit(PAGE_SIZE) }}
            className="px-4 py-3 rounded-xl border border-black/10 text-[#6B6862] text-sm font-medium hover:border-[#B57F50]/40 hover:text-[#B57F50] transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-[#6B6862] mb-4">
        {filtered.length.toLocaleString()} restaurant{filtered.length === 1 ? '' : 's'}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((r) => {
          const nameOrLocationMatch = q
            ? r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.stateCode.toLowerCase().includes(q)
            : true
          const excerpt = q && !nameOrLocationMatch ? matchExcerpt(r.description, q) : null
          return (
            <Link
              key={r.reviewSlug}
              href={`/reviews/${r.reviewSlug}`}
              className="flex flex-col gap-1.5 px-4 py-3 rounded-none bg-white border border-black/5 hover:border-[#B57F50]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E2026] truncate">{r.name}</p>
                  <p className="text-xs text-[#6B6862] truncate">
                    {r.city}, {r.stateCode} · {(r.reviewCount ?? 0).toLocaleString()} reviews
                  </p>
                </div>
                {r.rating != null && (
                  <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#1E2026]">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {r.rating.toFixed(1)}
                  </span>
                )}
              </div>
              {excerpt && (
                <p className="text-xs text-[#9B9490] leading-snug line-clamp-2">
                  &ldquo;{excerpt}&rdquo;
                </p>
              )}
            </Link>
          )
        })}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-[#6B6862] py-12">No restaurants match “{query}”.</p>
      )}

      {limit < filtered.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE * 2)}
            className="px-6 py-3 rounded-none bg-[#1E2026] hover:bg-[#33363d] text-white text-sm font-semibold transition-colors"
          >
            Load more ({(filtered.length - limit).toLocaleString()} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
