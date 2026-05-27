'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ArrowLeft, Star, Search } from 'lucide-react'
import { restaurants, type Restaurant } from '@/lib/restaurants'

interface Props {
  currentRestaurant: Restaurant
  onClose: () => void
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getTodayHours(restaurant: Restaurant): string {
  const todayName = DAYS[new Date().getDay()]
  const todayHours = restaurant.hours?.[todayName]
  return todayHours ? todayHours.join(', ') : '—'
}

function StarRow({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[#6B6862]">—</span>
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-[#1E2026]/20'
          }`}
        />
      ))}
    </span>
  )
}

function PhotoCell({ src, name }: { src: string; name: string }) {
  if (!src) {
    return (
      <div className="w-full h-32 rounded-lg bg-[#F5F4F0] flex items-center justify-center text-[#6B6862] text-xs">
        No photo
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="w-full h-32 object-cover rounded-lg"
      onError={(e) => {
        const t = e.target as HTMLImageElement
        t.style.display = 'none'
      }}
    />
  )
}

type CompareRow = {
  label: string
  leftVal: string | React.ReactNode
  rightVal: string | React.ReactNode
  leftRaw: string
  rightRaw: string
  isPhoto?: boolean
}

function buildRows(left: Restaurant, right: Restaurant): CompareRow[] {
  const todayLeft = getTodayHours(left)
  const todayRight = getTodayHours(right)

  const statusLeft = left.businessStatus === 'OPERATIONAL' ? 'Open' : 'Closed'
  const statusRight = right.businessStatus === 'OPERATIONAL' ? 'Open' : 'Closed'

  const ratingLeft = left.rating
    ? `${left.rating.toFixed(1)} (${left.reviewCount.toLocaleString()} reviews)`
    : '—'
  const ratingRight = right.rating
    ? `${right.rating.toFixed(1)} (${right.reviewCount.toLocaleString()} reviews)`
    : '—'

  return [
    {
      label: 'Photo',
      leftVal: <PhotoCell src={left.photo} name={left.name} />,
      rightVal: <PhotoCell src={right.photo} name={right.name} />,
      leftRaw: left.photo,
      rightRaw: right.photo,
      isPhoto: true,
    },
    {
      label: 'Rating',
      leftVal: left.rating ? (
        <span className="flex flex-wrap items-center gap-1.5">
          <StarRow rating={left.rating} />
          <span className="text-[#1E2026] text-sm font-semibold">{left.rating.toFixed(1)}</span>
          <span className="text-[#6B6862] text-xs">({left.reviewCount.toLocaleString()})</span>
        </span>
      ) : '—',
      rightVal: right.rating ? (
        <span className="flex flex-wrap items-center gap-1.5">
          <StarRow rating={right.rating} />
          <span className="text-[#1E2026] text-sm font-semibold">{right.rating.toFixed(1)}</span>
          <span className="text-[#6B6862] text-xs">({right.reviewCount.toLocaleString()})</span>
        </span>
      ) : '—',
      leftRaw: ratingLeft,
      rightRaw: ratingRight,
    },
    {
      label: 'Price Range',
      leftVal: left.priceRange || '—',
      rightVal: right.priceRange || '—',
      leftRaw: left.priceRange || '',
      rightRaw: right.priceRange || '',
    },
    {
      label: 'Address',
      leftVal: left.address || '—',
      rightVal: right.address || '—',
      leftRaw: left.address || '',
      rightRaw: right.address || '',
    },
    {
      label: 'Phone',
      leftVal: left.phone || '—',
      rightVal: right.phone || '—',
      leftRaw: left.phone || '',
      rightRaw: right.phone || '',
    },
    {
      label: "Today's Hours",
      leftVal: todayLeft,
      rightVal: todayRight,
      leftRaw: todayLeft,
      rightRaw: todayRight,
    },
    {
      label: 'Status',
      leftVal: (
        <span className={left.businessStatus === 'OPERATIONAL' ? 'text-emerald-500 font-semibold' : 'text-red-500 font-semibold'}>
          {statusLeft}
        </span>
      ),
      rightVal: (
        <span className={right.businessStatus === 'OPERATIONAL' ? 'text-emerald-500 font-semibold' : 'text-red-500 font-semibold'}>
          {statusRight}
        </span>
      ),
      leftRaw: statusLeft,
      rightRaw: statusRight,
    },
    {
      label: 'Cuisine',
      leftVal: left.subtypes || '—',
      rightVal: right.subtypes || '—',
      leftRaw: left.subtypes || '',
      rightRaw: right.subtypes || '',
    },
    {
      label: 'Dine-in',
      leftVal: left.amenities.dineIn ? 'Yes' : 'No',
      rightVal: right.amenities.dineIn ? 'Yes' : 'No',
      leftRaw: String(left.amenities.dineIn),
      rightRaw: String(right.amenities.dineIn),
    },
    {
      label: 'Takeout',
      leftVal: left.amenities.takeout ? 'Yes' : 'No',
      rightVal: right.amenities.takeout ? 'Yes' : 'No',
      leftRaw: String(left.amenities.takeout),
      rightRaw: String(right.amenities.takeout),
    },
    {
      label: 'Delivery',
      leftVal: left.amenities.delivery ? 'Yes' : 'No',
      rightVal: right.amenities.delivery ? 'Yes' : 'No',
      leftRaw: String(left.amenities.delivery),
      rightRaw: String(right.amenities.delivery),
    },
    {
      label: 'Outdoor Seating',
      leftVal: left.amenities.outdoorSeating ? 'Yes' : 'No',
      rightVal: right.amenities.outdoorSeating ? 'Yes' : 'No',
      leftRaw: String(left.amenities.outdoorSeating),
      rightRaw: String(right.amenities.outdoorSeating),
    },
    {
      label: 'Reservations',
      leftVal: left.amenities.acceptsReservations ? 'Yes' : 'No',
      rightVal: right.amenities.acceptsReservations ? 'Yes' : 'No',
      leftRaw: String(left.amenities.acceptsReservations),
      rightRaw: String(right.amenities.acceptsReservations),
    },
    {
      label: 'Vegan Options',
      leftVal: left.amenities.veganOptions ? 'Yes' : 'No',
      rightVal: right.amenities.veganOptions ? 'Yes' : 'No',
      leftRaw: String(left.amenities.veganOptions),
      rightRaw: String(right.amenities.veganOptions),
    },
  ]
}

export default function RestaurantCompareModal({ currentRestaurant, onClose }: Props) {
  const [phase, setPhase] = useState<'search' | 'compare'>('search')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Restaurant | null>(null)

  // Escape key + backdrop close
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const filtered = query.trim().length === 0
    ? restaurants.filter((r) => r.slug !== currentRestaurant.slug).slice(0, 30)
    : restaurants
        .filter((r) => {
          if (r.slug === currentRestaurant.slug) return false
          const q = query.toLowerCase()
          return r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q)
        })
        .slice(0, 50)

  function selectRestaurant(r: Restaurant) {
    setSelected(r)
    setPhase('compare')
  }

  function goBack() {
    setPhase('search')
    setSelected(null)
  }

  const rows = selected ? buildRows(currentRestaurant, selected) : []

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-start justify-center overflow-y-auto p-4 pt-8 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-black/8 animate-in fade-in slide-in-from-bottom-4 duration-300 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            {phase === 'compare' && (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[#6B6862] hover:text-[#1E2026] text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Search again
              </button>
            )}
            {phase === 'search' && (
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1E2026]">Compare Restaurants</h2>
                <p className="text-[#6B6862] text-xs mt-0.5">
                  Comparing with <span className="text-[#1E2026] font-medium">{currentRestaurant.name}</span>
                </p>
              </div>
            )}
            {phase === 'compare' && selected && (
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1E2026]">Side-by-Side Comparison</h2>
                <p className="text-[#6B6862] text-xs mt-0.5">
                  {currentRestaurant.name} vs. {selected.name}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase 1: Search */}
        {phase === 'search' && (
          <div className="px-5 sm:px-7 py-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by restaurant name or city…"
                className="w-full pl-9 pr-4 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-xl text-[#1E2026] text-sm placeholder-[#9B9490]/60 outline-none focus:border-[#B57F50]/50 focus:ring-1 focus:ring-[#B57F50]/20"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-[#6B6862] text-sm py-10">No restaurants found matching &ldquo;{query}&rdquo;</p>
            ) : (
              <div className="overflow-y-auto max-h-[60vh] rounded-xl border border-black/5 divide-y divide-black/5">
                {filtered.map((r) => (
                  <button
                    key={r.slug}
                    onClick={() => selectRestaurant(r)}
                    className="w-full text-left px-4 py-3 hover:bg-[#F5F4F0] transition-colors flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0">
                      <p className="text-[#1E2026] text-sm font-semibold truncate group-hover:text-[#B57F50] transition-colors">
                        {r.name}
                      </p>
                      <p className="text-[#6B6862] text-xs mt-0.5 truncate">
                        {r.city}, {r.stateCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.rating && (
                        <span className="flex items-center gap-1 text-xs text-[#6B6862]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {r.rating.toFixed(1)}
                        </span>
                      )}
                      {r.priceRange && (
                        <span className="text-xs text-[#6B6862]">{r.priceRange}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Compare */}
        {phase === 'compare' && selected && (
          <div className="overflow-x-auto">
            {/* Column headers */}
            <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b border-black/5">
              <div className="px-4 py-3 bg-[#F5F4F0]" />
              <div className="px-4 py-3 border-l border-black/5 bg-[#F5F4F0]">
                <p className="font-serif font-bold text-[#1E2026] text-sm truncate">{currentRestaurant.name}</p>
                <p className="text-[#6B6862] text-xs mt-0.5 truncate">{currentRestaurant.city}, {currentRestaurant.stateCode}</p>
              </div>
              <div className="px-4 py-3 border-l border-black/5 bg-[#F5F4F0]">
                <p className="font-serif font-bold text-[#1E2026] text-sm truncate">{selected.name}</p>
                <p className="text-[#6B6862] text-xs mt-0.5 truncate">{selected.city}, {selected.stateCode}</p>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/5">
              {rows.map((row) => {
                const isDifferent = !row.isPhoto && row.leftRaw !== row.rightRaw
                const rowBg = isDifferent ? 'bg-amber-50' : ''
                const diffBorder = isDifferent ? 'border-l-2 border-amber-400' : ''

                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] ${rowBg}`}
                  >
                    {/* Label */}
                    <div className="px-4 py-3 flex items-start">
                      <span className="text-[#6B6862] text-xs font-medium leading-relaxed">{row.label}</span>
                    </div>

                    {/* Left value */}
                    <div className={`px-4 py-3 border-l border-black/5 text-[#1E2026] text-sm leading-relaxed ${diffBorder}`}>
                      {row.leftVal}
                    </div>

                    {/* Right value */}
                    <div className={`px-4 py-3 border-l border-black/5 text-[#1E2026] text-sm leading-relaxed ${isDifferent ? 'border-l-2 border-amber-400' : ''}`}>
                      {row.rightVal}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="px-5 sm:px-7 py-4 border-t border-black/5 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-amber-100 border-l-2 border-amber-400 shrink-0" />
              <span className="text-[#6B6862] text-xs">Highlighted rows indicate differences between the two restaurants</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
