'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronDown, MapPin, Star, Navigation } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'
import { type Restaurant } from '@/lib/restaurants'

const brothTypes = ['All', 'Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan']
const CITIES = ['in Atlanta', 'in Hampton', 'in Los Angeles', 'in Dallas', 'in Houston', 'in Denver']

export default function Hero() {
  const router = useRouter()
  const [brothType, setBrothType] = useState('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Restaurant[]>([])
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Typing animation state
  const [displayCity, setDisplayCity] = useState('')
  const [cityIdx, setCityIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const target = CITIES[cityIdx]

    if (isPaused) {
      const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true) }, 1600)
      return () => clearTimeout(t)
    }

    if (isDeleting) {
      if (displayCity.length === 0) {
        const t = setTimeout(() => {
          setIsDeleting(false)
          setCityIdx(i => (i + 1) % CITIES.length)
        }, 250)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setDisplayCity(s => s.slice(0, -1)), 38)
      return () => clearTimeout(t)
    }

    if (displayCity.length < target.length) {
      const t = setTimeout(() => setDisplayCity(target.slice(0, displayCity.length + 1)), 72)
      return () => clearTimeout(t)
    }

    setIsPaused(true)
  }, [displayCity, cityIdx, isDeleting, isPaused])

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
    const params = new URLSearchParams({ q: query.trim() })
    if (brothType !== 'All') params.set('broth', brothType)
    router.push(`/search?${params.toString()}`)
  }

  function handleSelect(r: Restaurant) {
    setShowResults(false)
    setQuery(r.name)
    router.push(`/${r.citySlug}/${r.stateSlug}/${r.slug}`)
  }

  return (
    <section className="relative z-30 bg-white pb-16 sm:pb-20 pt-28">
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-4">
          Ramen Directory
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E2026] leading-tight mb-5">
          Ramen Near Me
          <span className="block text-[#B57F50] min-h-[1.15em]">
            {displayCity}
            <span
              className="inline-block w-[3px] h-[0.85em] bg-[#B57F50] align-middle ml-1 -mb-0.5 rounded-sm"
              style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
            />
          </span>
        </h1>
        <p className="text-[#4A4D55] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Find the best ramen near me — top-rated ramen restaurants searched by city, broth type, or restaurant name.
        </p>

        {/* Search bar */}
        <div ref={wrapperRef} className="relative max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-0 rounded-xl overflow-hidden shadow-2xl border border-black/8 bg-[#F5F4F0]"
          >
            {/* Broth type dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-full px-4 py-4 text-sm text-[#1E2026] bg-[#F5F4F0] border-b sm:border-b-0 sm:border-r border-black/8 whitespace-nowrap hover:bg-black/5 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="text-[#6B6862] text-xs mr-1">Broth:</span>
                <span>{brothType}</span>
                <ChevronDown className={`w-4 h-4 text-[#6B6862] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute top-full left-0 mt-1 w-44 bg-[#F5F4F0] border border-black/8 rounded-lg shadow-xl z-20 overflow-hidden"
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
                            ? 'bg-[#B57F50]/20 text-[#B57F50]'
                            : 'text-[#6B6862] hover:bg-black/5 hover:text-[#1E2026]'
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
              className="flex-1 px-5 py-4 bg-[#F5F4F0] text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none"
              autoComplete="off"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Find Ramen
            </button>
          </form>

          {/* Find Near Me button */}
          <div className="mt-3 flex justify-center">
            <Link
              href="/searchmap"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B57F50]/10 hover:bg-[#B57F50]/20 border border-[#B57F50]/25 text-[#B57F50] text-sm font-medium transition-all duration-200"
            >
              <Navigation className="w-4 h-4" />
              Find Ramen Near Me
            </Link>
          </div>

          {/* Autocomplete dropdown */}
          {showResults && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-[#F5F4F0] border border-black/8 rounded-xl shadow-2xl z-30 overflow-hidden">
              {results.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors text-left border-b border-black/5 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#B57F50]/15 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#B57F50]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1E2026] text-sm font-medium truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
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
                  </button>
                </li>
              ))}
              {results.length > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={handleSubmit as unknown as React.MouseEventHandler}
                    className="w-full px-4 py-3 text-center text-[#B57F50] text-xs font-medium hover:bg-black/5 transition-colors"
                  >
                    See all results for &ldquo;{query}&rdquo; →
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Wave into dark body */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none -mb-px pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 block"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40"
            fill="none"
            stroke="#1E2026"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  )
}
