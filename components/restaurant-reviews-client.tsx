'use client'

import { useState, useMemo } from 'react'
import { Star, Search } from 'lucide-react'
import type { GeneratedReview } from '@/lib/reviews'

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#1E2026]/15'}`}
        />
      ))}
    </span>
  )
}

export default function RestaurantReviewsClient({ reviews }: { reviews: GeneratedReview[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter(
      (r) =>
        r.body.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.aspects.some((a) => a.value.toLowerCase().includes(q) || a.label.toLowerCase().includes(q))
    )
  }, [query, reviews])

  return (
    <div>
      {/* Keyword filter */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter reviews by keyword (e.g. broth, noodles, egg, service)…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/10 bg-white text-[#1E2026] placeholder-[#9B9490] text-sm outline-none focus:border-[#B57F50] transition-colors"
        />
      </div>

      <p className="text-xs text-[#6B6862] mb-5">
        Showing {filtered.length} of {reviews.length} review{reviews.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-4">
        {filtered.map((r, idx) => (
          <article key={idx} className="bg-white rounded-2xl border border-black/5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#B57F50]/15 border border-[#B57F50]/30 flex items-center justify-center text-sm font-bold text-[#96602F]">
                  {r.author[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1E2026]">{r.author}</p>
                  <p className="text-xs text-[#6B6862]">{r.date}</p>
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>

            <p className="text-[#3a3d44] text-sm leading-relaxed mb-4">{r.body}</p>

            <div className="flex flex-wrap gap-1.5">
              {r.aspects.map((a) => (
                <span
                  key={a.label}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F4F0] border border-black/5 text-[11px] text-[#6B6862]"
                >
                  <span className="font-semibold text-[#1E2026]">{a.label}:</span> {a.value}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[#6B6862] py-12">No reviews match “{query}”.</p>
      )}
    </div>
  )
}
