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
}

const PAGE_SIZE = 60

export default function ReviewsIndexClient({ items }: { items: ReviewIndexItem[] }) {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.stateCode.toLowerCase().includes(q)
    )
  }, [query, items])

  const visible = filtered.slice(0, limit)

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9490]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(PAGE_SIZE)
          }}
          placeholder="Search by restaurant, city, or state…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/10 bg-white text-[#1E2026] placeholder-[#9B9490] text-sm outline-none focus:border-[#B57F50] transition-colors"
        />
      </div>

      <p className="text-xs text-[#6B6862] mb-4">
        {filtered.length.toLocaleString()} restaurant{filtered.length === 1 ? '' : 's'}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((r) => (
          <Link
            key={r.reviewSlug}
            href={`/reviews/${r.reviewSlug}`}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-black/5 hover:border-[#B57F50]/40 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1E2026] truncate">{r.name}</p>
              <p className="text-xs text-[#6B6862] truncate">
                {r.city}, {r.stateCode}
              </p>
            </div>
            {r.rating != null && (
              <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#1E2026]">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {r.rating.toFixed(1)}
              </span>
            )}
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-[#6B6862] py-12">No restaurants match “{query}”.</p>
      )}

      {limit < filtered.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE * 2)}
            className="px-6 py-3 rounded-xl bg-[#1E2026] hover:bg-[#33363d] text-white text-sm font-semibold transition-colors"
          >
            Load more ({(filtered.length - limit).toLocaleString()} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
