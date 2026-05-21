'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Star } from 'lucide-react'
import { restaurants } from '@/lib/restaurants'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const trimmed = query.trim().toLowerCase()

  const results = trimmed
    ? restaurants
        .filter(
          (r) =>
            r.name.toLowerCase().includes(trimmed) ||
            r.city.toLowerCase().includes(trimmed) ||
            r.postalCode.startsWith(trimmed) ||
            (r.description && r.description.toLowerCase().includes(trimmed))
        )
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 8)
    : restaurants
        .filter((r) => r.rating !== null)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6)

  function handleSelect(citySlug: string, stateSlug: string, slug: string) {
    onClose()
    router.push(`/${citySlug}/${stateSlug}/${slug}`)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      } bg-black/60 backdrop-blur-sm`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`max-w-xl w-full bg-[#F5F4F0] rounded-2xl border border-black/8 shadow-2xl transition-all duration-200 ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/8">
          <Search className="w-4 h-4 text-[#6B6862] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onClose()
                router.push(`/search?q=${encodeURIComponent(query.trim())}`)
              }
            }}
            placeholder="Search by name, city, or zip code…"
            className="flex-1 bg-transparent text-[#1E2026] text-sm placeholder-[#9B9490]/60 outline-none"
          />
        </div>

        <div className="py-2">
          {!trimmed && (
            <p className="px-4 pt-1 pb-2 text-xs font-semibold text-[#6B6862]/50 uppercase tracking-wider">
              Popular
            </p>
          )}

          {results.length > 0 ? (
            results.map((r) => (
              <button
                key={r.slug}
                onClick={() => handleSelect(r.citySlug, r.stateSlug, r.slug)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 transition-colors text-left group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[#1E2026] text-sm font-medium truncate">{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[#6B6862] text-xs shrink-0">
                      {r.city}, {r.stateCode}
                    </span>
                    {r.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-400 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {r.rating.toFixed(1)}
                      </span>
                    )}
                    {r.priceRange && (
                      <span className="px-1.5 py-0.5 rounded bg-black/5 text-[#6B6862] text-[10px] font-medium shrink-0">
                        {r.priceRange}
                      </span>
                    )}
                    {r.amenities.dineIn && (
                      <span className="px-1.5 py-0.5 rounded bg-[#B57F50]/15 text-[#B57F50] text-[10px] font-medium shrink-0">
                        Dine-in
                      </span>
                    )}
                    {r.amenities.delivery && (
                      <span className="px-1.5 py-0.5 rounded bg-[#B57F50]/15 text-[#B57F50] text-[10px] font-medium shrink-0">
                        Delivery
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B6862]/40 group-hover:text-[#6B6862] transition-colors shrink-0 ml-3" />
              </button>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-sm text-[#6B6862]">
              No restaurants found
            </p>
          )}

          {trimmed && results.length > 0 && (
            <button
              onClick={() => { onClose(); router.push(`/search?q=${encodeURIComponent(trimmed)}`) }}
              className="w-full px-4 py-3 text-center text-[#B57F50] text-xs font-medium hover:bg-black/5 transition-colors border-t border-black/5"
            >
              See all results for &ldquo;{trimmed}&rdquo; →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
