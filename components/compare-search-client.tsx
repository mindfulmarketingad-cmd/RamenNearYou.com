'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { safePhotoSrc } from '@/lib/photo-guard'
import { Search, Star, ArrowLeftRight, X } from 'lucide-react'

type SearchResult = {
  slug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  priceRange: string
  citySlug: string
  stateSlug: string
  photo: string
}

export type PreloadedRestaurant = {
  slug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  priceRange: string
  photo: string
  address: string
} | null

interface Props {
  restaurantA: PreloadedRestaurant
}

/* ── Chip: shows a locked restaurant ── */
function RestaurantChip({
  r,
  onClear,
}: {
  r: PreloadedRestaurant | SearchResult
  onClear?: () => void
}) {
  if (!r) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#B57F50]/30 shadow-sm">
      {safePhotoSrc(r.photo) && (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safePhotoSrc(r.photo)!} alt={r.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#1E2026] text-sm truncate">{r.name}</p>
        <p className="text-[#6B6862] text-xs truncate">
          {r.city}, {r.stateCode}
        </p>
        {r.rating != null && (
          <span className="flex items-center gap-1 text-xs text-[#6B6862] mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {r.rating.toFixed(1)}
            {r.priceRange && (
              <span className="ml-1 text-[#6B6862]">· {r.priceRange}</span>
            )}
          </span>
        )}
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="p-1 rounded-full hover:bg-black/5 transition-colors shrink-0"
          aria-label="Remove"
        >
          <X className="w-4 h-4 text-[#6B6862]" />
        </button>
      )}
    </div>
  )
}

/* ── SearchBox: debounced typeahead ── */
function SearchBox({
  label,
  placeholder,
  exclude,
  onSelect,
}: {
  label: string
  placeholder: string
  exclude: string
  onSelect: (r: SearchResult) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchResults = (q: string) => {
    setLoading(true)
    fetch(`/api/restaurants/search?q=${encodeURIComponent(q)}&exclude=${exclude}`)
      .then(r => r.json())
      .then((data: SearchResult[]) => {
        setResults(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  // Initial load
  useEffect(() => {
    fetchResults('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exclude])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchResults(val), 250)
  }

  return (
    <div className="flex-1">
      <p className="text-xs font-semibold text-[#6B6862] uppercase tracking-wider mb-2">{label}</p>
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-[#1E2026] text-sm placeholder-[#9B9490]/60 outline-none focus:border-[#B57F50]/60 focus:ring-2 focus:ring-[#B57F50]/15 transition-all"
          autoComplete="off"
        />
      </div>
      <div className="bg-white rounded-xl border border-black/8 overflow-hidden max-h-72 overflow-y-auto divide-y divide-black/5 shadow-sm">
        {loading && results.length === 0 && (
          <p className="text-center text-[#6B6862] text-sm py-8">Searching…</p>
        )}
        {!loading && results.length === 0 && (
          <p className="text-center text-[#6B6862] text-sm py-8">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}
        {results.map(r => (
          <button
            key={r.slug}
            onClick={() => onSelect(r)}
            className="w-full text-left px-4 py-3 hover:bg-[#F5F4F0] transition-colors flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0 flex items-center gap-2.5">
              {safePhotoSrc(r.photo) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={safePhotoSrc(r.photo)!}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">
                  {r.name}
                </p>
                <p className="text-xs text-[#6B6862] truncate">
                  {r.city}, {r.stateCode}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              {r.rating != null && (
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
    </div>
  )
}

/* ── VS divider ── */
function VsDivider() {
  return (
    <div className="flex items-center justify-center md:mt-7 shrink-0">
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1E2026] text-white shadow-lg">
        <ArrowLeftRight className="w-5 h-5" />
      </span>
    </div>
  )
}

/* ── Main export ── */
export default function CompareSearchClient({ restaurantA }: Props) {
  const router = useRouter()
  const [selectedA, setSelectedA] = useState<SearchResult | null>(null)

  function handleSelectB(b: SearchResult) {
    const slugA = restaurantA?.slug ?? selectedA?.slug
    if (!slugA) return
    router.push(`/compare/${slugA}-vs-${b.slug}`)
  }

  /* ── Case 1: restaurantA pre-loaded from ?a= param ── */
  if (restaurantA) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[1fr_56px_1fr] gap-4 md:gap-5 items-start">
        <div>
          <p className="text-xs font-semibold text-[#6B6862] uppercase tracking-wider mb-2">
            Restaurant A
          </p>
          <RestaurantChip
            r={restaurantA}
            onClear={() => router.push('/compare')}
          />
        </div>

        <VsDivider />

        <SearchBox
          label="Pick Restaurant B"
          placeholder="Search by name or city…"
          exclude={restaurantA.slug}
          onSelect={handleSelectB}
        />
      </div>
    )
  }

  /* ── Case 2: Nothing selected yet ── */
  if (!selectedA) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-sm text-[#6B6862] text-center mb-5">
          Start by searching for the first restaurant you want to compare.
        </p>
        <SearchBox
          label="Pick Restaurant A"
          placeholder="Search by name or city…"
          exclude=""
          onSelect={setSelectedA}
        />
      </div>
    )
  }

  /* ── Case 3: A selected, pick B ── */
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_56px_1fr] gap-4 md:gap-5 items-start">
      <div>
        <p className="text-xs font-semibold text-[#6B6862] uppercase tracking-wider mb-2">
          Restaurant A
        </p>
        <RestaurantChip r={selectedA} onClear={() => setSelectedA(null)} />
      </div>

      <VsDivider />

      <SearchBox
        label="Pick Restaurant B"
        placeholder="Search by name or city…"
        exclude={selectedA.slug}
        onSelect={handleSelectB}
      />
    </div>
  )
}
