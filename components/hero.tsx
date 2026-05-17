'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronDown, MapPin, Star } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'
import type { Restaurant } from '@/lib/restaurants'

const brothTypes = ['All', 'Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan']

export default function Hero() {
  const router = useRouter()
  const [brothType, setBrothType] = useState('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Restaurant[]>([])
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hits = searchRestaurants(query)
    setResults(hits.slice(0, 6))
    setShowResults(query.trim().length > 1 && hits.length > 0)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false)
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setShowResults(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function handleSelect(r: Restaurant) {
    setShowResults(false)
    setQuery(r.name)
    router.push(`/${r.citySlug}/${r.stateSlug}/${r.slug}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-ramen.jpg)' }}
      />
      <div className="absolute inset-0 bg-[#2F323A]/75" />
      <div className="absolute inset-0 noise-texture pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#77567A]/50 bg-[#77567A]/10 text-[#B0B3BB] text-xs font-medium mb-6 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#77567A] inline-block" />
          Atlanta, GA &mdash; Expanding Soon
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance mb-3">
          Ramen Near Me
        </h1>
        <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#77567A] mb-5 text-balance">
          Find Your Best Local Ramen
        </p>
        <p className="text-[#B0B3BB] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Looking for the best ramen? We&apos;ve curated top-rated ramen restaurants across Atlanta and beyond.
          Search by restaurant name, city, or zip code.
        </p>

        {/* Search bar */}
        <div ref={wrapperRef} className="relative max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1E2026]"
          >
            {/* Broth type dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-full px-4 py-4 text-sm text-white bg-[#1E2026] border-b sm:border-b-0 sm:border-r border-white/10 whitespace-nowrap hover:bg-white/5 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="text-[#B0B3BB] text-xs mr-1">Broth:</span>
                <span>{brothType}</span>
                <ChevronDown className={`w-4 h-4 text-[#B0B3BB] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute top-full left-0 mt-1 w-44 bg-[#1E2026] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
                >
                  {brothTypes.map((type) => (
                    <li key={type}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={brothType === type}
                        onClick={() => { setBrothType(type); setDropdownOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          brothType === type
                            ? 'bg-[#77567A]/20 text-[#77567A]'
                            : 'text-[#B0B3BB] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Text input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length > 1 && results.length > 0 && setShowResults(true)}
              placeholder="Restaurant name, city, or zip code"
              className="flex-1 px-5 py-4 bg-[#1E2026] text-white placeholder-[#B0B3BB]/60 text-sm outline-none"
              autoComplete="off"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Find Ramen
            </button>
          </form>

          {/* Autocomplete dropdown */}
          {showResults && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-[#1E2026] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
              {results.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#77567A]/15 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#77567A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.name}</p>
                      <p className="text-[#B0B3BB] text-xs truncate">{r.address}</p>
                    </div>
                    {r.rating && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-white/60 text-xs">{r.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
              {results.length > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={handleSubmit as any}
                    className="w-full px-4 py-3 text-center text-[#77567A] text-xs font-medium hover:bg-white/5 transition-colors"
                  >
                    See all results for &ldquo;{query}&rdquo; →
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#B0B3BB]/50 text-xs">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#77567A]/60 rounded-full" />
      </div>
    </section>
  )
}
