'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight, ChevronUp, ChevronDown,
  SlidersHorizontal, X, ArrowUpDown, Search, Flame, Leaf,
  Droplets, Soup, Wind, List, LayoutGrid, PlusCircle, Lock,
} from 'lucide-react'
import { restaurants, getBrothTypes } from '@/lib/restaurants'
import { searchRestaurants } from '@/lib/search'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/client'
import type { MapBounds } from '@/components/ramen-map'

const FREE_SEARCHES = 1

const RamenMap = dynamic(() => import('@/components/ramen-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
    </div>
  ),
})

function boundsRoughlyEqual(a: MapBounds, b: MapBounds) {
  const e = 0.0005
  return (
    Math.abs(a.north - b.north) < e && Math.abs(a.south - b.south) < e &&
    Math.abs(a.east - b.east) < e && Math.abs(a.west - b.west) < e
  )
}

const DISTANCE_OPTIONS = [5, 10, 20, 50] as const
type DistanceMiles = typeof DISTANCE_OPTIONS[number]
const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$'] as const
type SortBy = 'distance' | 'rating' | 'reviews' | 'alpha'
const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'distance', label: 'Nearest first' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'alpha', label: 'A → Z' },
]

const BROTH_FILTERS = [
  {
    key: 'Vegan',
    label: 'Vegan',
    icon: Leaf,
    idle: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
    active: 'bg-emerald-500 text-white border border-emerald-500',
  },
  {
    key: 'Spicy',
    label: 'Spicy',
    icon: Flame,
    idle: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
    active: 'bg-red-500 text-white border border-red-500',
  },
  {
    key: 'Tonkotsu',
    label: 'Tonkotsu',
    icon: Wind,
    idle: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
    active: 'bg-amber-500 text-white border border-amber-500',
  },
  {
    key: 'Shoyu',
    label: 'Shoyu',
    icon: Droplets,
    idle: 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200',
    active: 'bg-stone-600 text-white border border-stone-600',
  },
  {
    key: 'Miso',
    label: 'Miso',
    icon: Soup,
    idle: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100',
    active: 'bg-orange-500 text-white border border-orange-500',
  },
] as const

function milesToKm(miles: number) { return miles * 1.60934 }
function kmToMiles(km: number) { return km * 0.621371 }

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type GeoState = 'idle' | 'loading' | 'granted' | 'denied'
type ViewMode = 'list' | 'grid'

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#B57F50] text-white'
          : 'bg-black/5 text-[#6B6862] hover:bg-black/8 hover:text-[#1E2026] border border-black/8'
      }`}
    >
      {label}
    </button>
  )
}


export default function SearchMapPage() {
  return <Suspense><SearchMapInner /></Suspense>
}

function SearchMapInner() {
  const searchParams = useSearchParams()
  const cityParam = searchParams.get('city')
  const stateParam = searchParams.get('state')
  const qParam = searchParams.get('q')?.trim() ?? ''
  const zipParam = searchParams.get('zip')?.trim() ?? ''

  const qRestaurants = useMemo(() => {
    if (!qParam) return null
    return searchRestaurants(qParam)
  }, [qParam])

  const cityRestaurants = useMemo(() => {
    if (!cityParam || !stateParam) return null
    return restaurants.filter(r => r.citySlug === cityParam && r.stateSlug === stateParam)
  }, [cityParam, stateParam])

  const queryCenter = useMemo(() => {
    const list = qRestaurants ?? cityRestaurants
    if (!list?.length) return null
    const withCoords = list.filter(r => r.latitude && r.longitude)
    if (!withCoords.length) return null
    return {
      lat: withCoords.reduce((s, r) => s + r.latitude!, 0) / withCoords.length,
      lng: withCoords.reduce((s, r) => s + r.longitude!, 0) / withCoords.length,
    }
  }, [qRestaurants, cityRestaurants])

  const cityCenter = queryCenter

  const cityName = qParam
    ? `"${qParam}"`
    : cityRestaurants?.[0]
      ? `${cityRestaurants[0].city}, ${cityRestaurants[0].stateCode}`
      : null

  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState('')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [localQuery, setLocalQuery] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')

  // Search gating — anonymous visitors get FREE_SEARCHES searches, then must sign in.
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [searchesUsed, setSearchesUsed] = useState(0)
  const [searchGateOpen, setSearchGateOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem('sm_search_count') || '0', 10)
      if (!Number.isNaN(stored)) setSearchesUsed(stored)
    } catch { /* ignore */ }

    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Returns true if the search may proceed; otherwise opens the sign-in gate.
  function attemptSearch(): boolean {
    if (signedIn === true) return true
    if (signedIn === null) return true // auth state not resolved yet — don't gate prematurely
    if (searchesUsed >= FREE_SEARCHES) {
      setSearchGateOpen(true)
      return false
    }
    const next = searchesUsed + 1
    setSearchesUsed(next)
    try { localStorage.setItem('sm_search_count', String(next)) } catch { /* ignore */ }
    return true
  }

  function handleLocalQueryChange(value: string) {
    // Starting a new name search (empty → text) counts as a search.
    if (localQuery === '' && value !== '') {
      if (!attemptSearch()) return
    }
    setLocalQuery(value)
  }

  async function geocodeLocation(query: string) {
    const clean = query.trim()
    if (!clean) return
    if (!/^\d{5}$/.test(clean)) {
      setGeocodeError('Please enter a valid 5-digit ZIP code')
      return
    }
    if (!attemptSearch()) return
    setGeocoding(true)
    setGeocodeError('')
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(clean)}&countrycodes=us&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      if (data.length > 0) {
        setGeocodedCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } else {
        setGeocodeError('ZIP code not found — check the number and try again')
      }
    } catch {
      setGeocodeError('Search failed — check your connection')
    } finally {
      setGeocoding(false)
    }
  }

  useEffect(() => {
    if (zipParam && /^\d{5}$/.test(zipParam)) {
      setLocationSearch(zipParam)
      geocodeLocation(zipParam)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipParam])

  // Filter state
  const [distanceMiles, setDistanceMiles] = useState<DistanceMiles>(20)
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(new Set())
  const [selectedBroths, setSelectedBroths] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortBy>('distance')

  // "Search this area" state
  const [visibleBounds, setVisibleBounds] = useState<MapBounds | null>(null)
  const [searchedBounds, setSearchedBounds] = useState<MapBounds | null>(null)

  const showSearchAreaButton =
    !!visibleBounds && (!searchedBounds || !boundsRoughlyEqual(visibleBounds, searchedBounds))

  function handleSearchThisArea() {
    if (!attemptSearch()) return
    if (visibleBounds) setSearchedBounds(visibleBounds)
  }

  function clearAreaSearch() {
    setSearchedBounds(null)
  }

  const activeFilterCount =
    ((cityParam || qParam) ? 0 : distanceMiles !== 20 ? 1 : 0) +
    selectedPrices.size +
    selectedBroths.size

  function togglePrice(p: string) {
    setSelectedPrices(prev => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })
  }

  function toggleBroth(b: string) {
    setSelectedBroths(prev => {
      const next = new Set(prev)
      next.has(b) ? next.delete(b) : next.add(b)
      return next
    })
  }

  function clearFilters() {
    setDistanceMiles(20)
    setSelectedPrices(new Set())
    setSelectedBroths(new Set())
  }

  function requestLocation() {
    setGeoState('loading')
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
      },
      (err) => {
        setGeoError(err.message)
        setGeoState('denied')
      },
      { timeout: 10000 }
    )
  }

  useEffect(() => { if (!cityParam && !qParam) requestLocation() }, [cityParam, qParam])

  const nearby = useMemo(() => {
    if (cityParam || qParam) return []
    if (!userPos) return []
    const maxKm = milesToKm(distanceMiles)
    return restaurants
      .filter(r => r.latitude && r.longitude)
      .map(r => ({
        ...r,
        distKm: haversineKm(userPos.lat, userPos.lng, r.latitude!, r.longitude!),
      }))
      .filter(r => r.distKm <= maxKm)
      .sort((a, b) => a.distKm - b.distKm)
  }, [userPos, distanceMiles, cityParam, qParam])

  const filtered = useMemo(() => {
    let base: (typeof restaurants[number] & { distKm: number })[]
    if (searchedBounds) {
      base = restaurants
        .filter(r => r.latitude && r.longitude)
        .filter(r =>
          r.latitude! <= searchedBounds.north &&
          r.latitude! >= searchedBounds.south &&
          r.longitude! <= searchedBounds.east &&
          r.longitude! >= searchedBounds.west
        )
        .map(r => ({
          ...r,
          distKm: userPos ? haversineKm(userPos.lat, userPos.lng, r.latitude!, r.longitude!) : 0,
        }))
    } else if (qParam) {
      base = (qRestaurants ?? [])
        .filter(r => r.latitude && r.longitude)
        .map(r => ({
          ...r,
          distKm: userPos ? haversineKm(userPos.lat, userPos.lng, r.latitude!, r.longitude!) : 0,
        }))
    } else if (cityParam) {
      base = (cityRestaurants ?? []).map(r => ({ ...r, distKm: 0 }))
    } else {
      base = nearby
    }
    const afterFilter = base.filter(r => {
      if (selectedPrices.size > 0 && !selectedPrices.has(r.priceRange || '')) return false
      if (selectedBroths.size > 0) {
        const broths = getBrothTypes(r).map(b => b as string)
        if (!broths.some(b => selectedBroths.has(b))) return false
      }
      return true
    })
    const sorted = [...afterFilter]
    if (sortBy === 'rating') sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    else if (sortBy === 'reviews') sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (sortBy === 'alpha') sorted.sort((a, b) => a.name.localeCompare(b.name))
    else sorted.sort((a, b) => a.distKm - b.distKm)
    return sorted
  }, [nearby, selectedPrices, selectedBroths, cityParam, qParam, cityRestaurants, qRestaurants, sortBy, searchedBounds, userPos])

  // Further filter by the local search query
  const displayList = useMemo(() => {
    if (!localQuery.trim()) return filtered
    const q = localQuery.toLowerCase()
    return filtered.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    )
  }, [filtered, localQuery])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
    const el = document.getElementById(`card-${slug}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const effectivePos = geocodedCenter ?? ((cityParam || qParam) ? cityCenter : userPos)

  // ── Geo permission screens ─────────────────────────────────────────────────
  if (!cityParam && !qParam && (geoState === 'idle' || geoState === 'loading')) {
    return (
      <main className="min-h-screen bg-[#ffffff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#B57F50]/20 flex items-center justify-center">
            {geoState === 'loading'
              ? <Loader2 className="w-7 h-7 text-[#B57F50] animate-spin" />
              : <Navigation className="w-7 h-7 text-[#B57F50]" />}
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1E2026]">
            {geoState === 'loading' ? 'Getting your location…' : 'Ramen Map | Searchmap For Ramen Restaurants'}
          </h1>
          {geoState === 'idle' && (
            <>
              <p className="text-[#6B6862] text-sm max-w-xs">
                We&apos;ll show all ramen restaurants within 20 miles of your current location.
              </p>
              <button
                onClick={requestLocation}
                className="px-6 py-3 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Allow Location Access
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  if (!cityParam && !qParam && geoState === 'denied') {
    return (
      <main className="min-h-screen bg-[#ffffff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <MapPin className="w-10 h-10 text-[#B57F50]/50" />
          <h1 className="font-serif text-2xl font-bold text-[#1E2026]">Ramen Map | Searchmap For Ramen Restaurants</h1>
          <p className="text-[#6B6862] text-sm max-w-xs">{geoError || 'Enable location in your browser settings and try again.'}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={requestLocation}
              className="px-5 py-2.5 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link href="/cities" className="px-5 py-2.5 border border-black/8 text-[#6B6862] hover:text-[#1E2026] text-sm font-medium rounded-lg transition-colors">
              Browse by City
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Map view ───────────────────────────────────────────────────────────────
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#ffffff]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* ── Left panel ── */}
        <div className="w-full sm:w-80 lg:w-96 flex flex-col bg-[#F5F4F0] border-r border-black/5 overflow-hidden shrink-0 hidden sm:flex">

          {/* Location search (zip / city / state → fly map) */}
          <div className="px-3 pt-3 pb-2 border-b border-black/5">
            <form onSubmit={e => { e.preventDefault(); geocodeLocation(locationSearch) }}>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B57F50]" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={locationSearch}
                  onChange={e => { setLocationSearch(e.target.value.replace(/\D/g, '')); setGeocodeError('') }}
                  placeholder="Enter ZIP code…"
                  className="w-full pl-8 pr-16 py-2 text-sm bg-white border border-black/8 rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                />
                <button
                  type="submit"
                  disabled={geocoding}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-medium rounded transition-colors disabled:opacity-60"
                >
                  {geocoding ? '…' : 'Go'}
                </button>
              </div>
              {geocodeError && (
                <div className="mt-1.5 flex flex-col gap-1">
                  <p className="text-red-400 text-xs">{geocodeError}</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(locationSearch + ' ramen')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#B57F50] hover:text-[#c8934f] transition-colors font-medium"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    Search Google Maps →
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Restaurant name search */}
          <div className="px-3 pt-2 pb-2 border-b border-black/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
              <input
                type="text"
                value={localQuery}
                onChange={e => handleLocalQueryChange(e.target.value)}
                placeholder="Search restaurants…"
                className="w-full pl-8 pr-8 py-2 text-sm bg-white border border-black/8 rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
              />
              {localQuery && (
                <button
                  onClick={() => setLocalQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9490] hover:text-[#1E2026]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Broth filter chips — always visible, coloured */}
          <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-black/5">
            {BROTH_FILTERS.map(f => {
              const active = selectedBroths.has(f.key)
              const Icon = f.icon
              return (
                <button
                  key={f.key}
                  onClick={() => toggleBroth(f.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${active ? f.active : f.idle}`}
                >
                  <Icon className="w-3 h-3" />
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Header row: count + sort + filter toggle + view toggle */}
          <div className="px-3 py-2 border-b border-black/5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-[#1E2026] font-semibold text-sm shrink-0">
                {displayList.length} spot{displayList.length !== 1 ? 's' : ''}
                {activeFilterCount > 0 && (
                  <span className="text-[#6B6862] font-normal"> (filtered)</span>
                )}
              </p>
              <div className="flex items-center gap-1.5">
                {/* View toggle */}
                <div className="flex rounded-lg overflow-hidden border border-black/8 bg-white">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'}`}
                    title="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Filters button */}
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-[#B57F50] text-white'
                      : 'bg-white text-[#6B6862] hover:text-[#1E2026] border border-black/8'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white text-[#B57F50] text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sort row */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3 h-3 text-[#6B6862] shrink-0" />
              <span className="text-[#6B6862] text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
                className="flex-1 bg-white border border-black/8 text-[#1E2026] text-xs rounded-lg px-2 py-1 outline-none focus:border-[#B57F50] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Expandable filter panel */}
            {showFilters && (
              <div className="mt-3 space-y-3 pt-3 border-t border-black/5">
                {!cityParam && !qParam && (
                  <div>
                    <p className="text-[#6B6862] text-xs font-medium mb-1.5">Distance</p>
                    <div className="flex flex-wrap gap-1.5">
                      {DISTANCE_OPTIONS.map(d => (
                        <FilterChip key={d} label={`${d} mi`} active={distanceMiles === d} onClick={() => setDistanceMiles(d)} />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[#6B6862] text-xs font-medium mb-1.5">Price</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRICE_OPTIONS.map(p => (
                      <FilterChip key={p} label={p} active={selectedPrices.has(p)} onClick={() => togglePrice(p)} />
                    ))}
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#6B6862] hover:text-[#1E2026] transition-colors">
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results list / grid */}
          <div className="flex-1 overflow-y-auto">
            {displayList.length === 0 ? (
              /* ── No results ── */
              <div className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#B57F50]/10 flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-[#B57F50]/50" />
                </div>
                <div>
                  <p className="text-[#1E2026] font-semibold text-sm mb-1">No ramen spots found</p>
                  <p className="text-[#6B6862] text-xs leading-relaxed">
                    {activeFilterCount > 0 || localQuery
                      ? 'Try clearing your filters or adjusting your search.'
                      : 'We don\'t have any listings in this area yet.'}
                  </p>
                </div>
                {(activeFilterCount > 0 || localQuery) && (
                  <button
                    onClick={() => { clearFilters(); setLocalQuery('') }}
                    className="text-xs text-[#B57F50] hover:text-[#c8934f] font-medium transition-colors"
                  >
                    Clear all filters →
                  </button>
                )}
                <div className="w-full mt-1 rounded-xl border border-[#B57F50]/20 bg-[#B57F50]/5 p-4">
                  <p className="text-[#1E2026] text-xs font-semibold mb-1">Know a ramen spot here?</p>
                  <p className="text-[#6B6862] text-xs mb-3 leading-relaxed">
                    Help the community by submitting a listing — it&apos;s free and takes 2 minutes.
                  </p>
                  <Link
                    href="/list"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Submit a Listing
                  </Link>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* ── Grid view ── */
              <div className="p-2 grid grid-cols-2 gap-2">
                {displayList.map(r => {
                  const active = r.slug === selectedSlug
                  return (
                    <button
                      key={r.slug}
                      id={`card-${r.slug}`}
                      onClick={() => setSelectedSlug(r.slug)}
                      onMouseEnter={() => setHoveredSlug(r.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className={`text-left rounded-xl overflow-hidden border transition-all ${
                        active ? 'border-[#B57F50] shadow-md' : 'border-black/6 hover:border-[#B57F50]/40'
                      } bg-white`}
                    >
                      <div className="relative w-full h-24 bg-[#F5F4F0]">
                        {r.photo ? (
                          <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Utensils className="w-4 h-4 text-[#B57F50]/30" />
                          </div>
                        )}
                        {r.distKm > 0 && (
                          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                            {kmToMiles(r.distKm).toFixed(1)} mi
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className={`font-semibold text-xs truncate leading-snug ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                        <p className="text-[#9B9490] text-[10px] truncate mt-0.5">{r.city}, {r.stateCode}</p>
                        {r.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span className="text-[10px] text-[#1E2026]/70 font-medium">{r.rating.toFixed(1)}</span>
                            {r.priceRange && (
                              <span className="text-[10px] text-[#1E2026]/40 ml-auto">{r.priceRange}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* ── List view ── */
              <div className="divide-y divide-black/5">
                {displayList.map(r => {
                  const active = r.slug === selectedSlug
                  return (
                    <button
                      key={r.slug}
                      id={`card-${r.slug}`}
                      onClick={() => setSelectedSlug(r.slug)}
                      onMouseEnter={() => setHoveredSlug(r.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className={`w-full text-left flex gap-3 p-3 transition-colors hover:bg-black/5 ${active ? 'bg-[#B57F50]/10 border-l-2 border-[#B57F50]' : ''}`}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                        {r.photo ? (
                          <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-[#B57F50]/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                        <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {r.rating.toFixed(1)}
                            </span>
                          )}
                          {r.priceRange && <span className="text-xs text-[#1E2026]/40">{r.priceRange}</span>}
                          {r.distKm > 0 && (
                            <span className="text-[#B57F50] text-xs font-medium">
                              {kmToMiles(r.distKm).toFixed(1)} mi
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#1E2026]/20 shrink-0 self-center" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit listing CTA (bottom) */}
          <div className="p-3 border-t border-black/5 bg-[#F5F4F0]">
            <Link
              href="/list"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#B57F50]/30 bg-[#B57F50]/10 hover:bg-[#B57F50]/20 text-[#c8934f] text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Submit a Listing
            </Link>
          </div>

          {/* View listing link */}
          {selectedSlug && (() => {
            const r = displayList.find(x => x.slug === selectedSlug)
            return r ? (
              <div className="p-3 border-t border-black/5">
                <Link
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="block w-full py-2.5 text-center text-sm font-medium bg-[#B57F50] hover:bg-[#c8934f] text-white rounded-lg transition-colors"
                >
                  View {r.name} →
                </Link>
              </div>
            ) : null
          })()}
        </div>

        {/* ── Map ── */}
        <div className="flex-1 relative">
          {effectivePos && (
            <RamenMap
              restaurants={filtered}
              userLat={effectivePos.lat}
              userLng={effectivePos.lng}
              selectedSlug={selectedSlug}
              hoveredSlug={hoveredSlug}
              onSelect={handleSelect}
              onUserMove={setVisibleBounds}
              centerLatLng={geocodedCenter}
            />
          )}

          {showSearchAreaButton && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={handleSearchThisArea}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold shadow-lg shadow-black/30 transition-colors"
              >
                <Search className="w-4 h-4" />
                Search this area
              </button>
            </div>
          )}

          {searchedBounds && (
            <div className="absolute top-4 right-4 z-[1000]">
              <button
                onClick={clearAreaSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-white/15 hover:border-white/30 text-[#6B6862] hover:text-[#1E2026] text-xs font-medium shadow-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Clear area filter
              </button>
            </div>
          )}

          {/* Mobile bottom sheet — visible only below sm */}
          <div
            className={`absolute bottom-0 left-0 right-0 sm:hidden z-[999] flex flex-col bg-[#F5F4F0] border-t border-black/10 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] transition-[height] duration-300 ease-out ${
              mobileDrawerOpen ? 'h-[72vh]' : 'h-auto'
            }`}
          >
            {/* Drag handle — tap to open/close list */}
            <button
              onClick={() => setMobileDrawerOpen(v => !v)}
              className="flex flex-col items-center gap-1 pt-2 pb-1 shrink-0 w-full"
              aria-label={mobileDrawerOpen ? 'Collapse list' : 'Show restaurant list'}
            >
              <div className="w-9 h-1 rounded-full bg-black/20" />
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#B57F50] uppercase tracking-wide">
                {mobileDrawerOpen
                  ? <><ChevronDown className="w-3 h-3" /> Hide list</>
                  : <><ChevronUp className="w-3 h-3" /> {displayList.length} spot{displayList.length !== 1 ? 's' : ''} — tap to browse</>
                }
              </span>
            </button>

            {/* Controls — always visible */}
            <div className="shrink-0">
              {/* Location search */}
              <div className="px-3 pt-1 pb-2 border-b border-black/8">
                <form onSubmit={e => { e.preventDefault(); geocodeLocation(locationSearch) }}>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B57F50]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={locationSearch}
                      onChange={e => { setLocationSearch(e.target.value.replace(/\D/g, '')); setGeocodeError('') }}
                      placeholder="Enter ZIP code…"
                      className="w-full pl-8 pr-14 py-2.5 text-sm bg-white border border-black/8 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={geocoding}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                    >
                      {geocoding ? '…' : 'Go'}
                    </button>
                  </div>
                  {geocodeError && (
                    <div className="mt-1.5 flex flex-col gap-1">
                      <p className="text-red-400 text-xs">{geocodeError}</p>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(locationSearch + ' ramen')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#B57F50] hover:text-[#c8934f] transition-colors font-medium"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        Search Google Maps →
                      </a>
                    </div>
                  )}
                </form>
              </div>

              {/* Status + filter toggle row */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-[#1E2026] font-medium">
                  {displayList.length} spot{displayList.length !== 1 ? 's' : ''}
                  {cityName ? ` in ${cityName}` : ` within ${distanceMiles} mi`}
                </span>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    showFilters || activeFilterCount > 0 ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] bg-black/8 border border-black/10'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}` : 'Filters'}
                </button>
              </div>

              {/* Broth chips — always visible on mobile */}
              <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {BROTH_FILTERS.map(f => {
                  const active = selectedBroths.has(f.key)
                  const Icon = f.icon
                  return (
                    <button
                      key={f.key}
                      onClick={() => toggleBroth(f.key)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${active ? f.active : f.idle}`}
                    >
                      <Icon className="w-3 h-3" />
                      {f.label}
                    </button>
                  )
                })}
              </div>

              {/* Expandable filter panel */}
              {showFilters && (
                <div className="px-3 pb-3 pt-1 space-y-3 border-t border-black/8 max-h-48 overflow-y-auto">
                  <div>
                    <p className="text-[#6B6862] text-xs font-medium mb-1.5">Sort by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SORT_OPTIONS.map(o => (
                        <FilterChip key={o.value} label={o.label} active={sortBy === o.value} onClick={() => setSortBy(o.value)} />
                      ))}
                    </div>
                  </div>
                  {!cityParam && (
                    <div>
                      <p className="text-[#6B6862] text-xs font-medium mb-1.5">Distance</p>
                      <div className="flex flex-wrap gap-1.5">
                        {DISTANCE_OPTIONS.map(d => (
                          <FilterChip key={d} label={`${d} mi`} active={distanceMiles === d} onClick={() => setDistanceMiles(d)} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[#6B6862] text-xs font-medium mb-1.5">Price</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRICE_OPTIONS.map(p => (
                        <FilterChip key={p} label={p} active={selectedPrices.has(p)} onClick={() => togglePrice(p)} />
                      ))}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#B57F50] font-medium">
                      <X className="w-3 h-3" /> Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable restaurant list — only visible when drawer is open */}
            {mobileDrawerOpen && (
              <div className="flex-1 overflow-y-auto border-t border-black/8">
                {displayList.length === 0 ? (
                  <div className="p-6 flex flex-col items-center text-center gap-3">
                    <Utensils className="w-8 h-8 text-[#B57F50]/30" />
                    <p className="text-[#1E2026] font-semibold text-sm">No ramen spots found</p>
                    <p className="text-[#6B6862] text-xs">
                      {activeFilterCount > 0 ? 'Try clearing your filters.' : 'We don\'t have any listings in this area yet.'}
                    </p>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-[#B57F50] font-medium">Clear filters →</button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-black/5">
                    {displayList.map(r => {
                      const active = r.slug === selectedSlug
                      return (
                        <button
                          key={r.slug}
                          id={`mobile-card-${r.slug}`}
                          onClick={() => {
                            setSelectedSlug(r.slug)
                            setMobileDrawerOpen(false)
                          }}
                          className={`w-full text-left flex gap-3 p-3 transition-colors active:bg-black/5 ${active ? 'bg-[#B57F50]/10 border-l-2 border-[#B57F50]' : ''}`}
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                            {r.photo ? (
                              <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Utensils className="w-5 h-5 text-[#B57F50]/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm truncate ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                            <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {r.rating && (
                                <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  {r.rating.toFixed(1)}
                                </span>
                              )}
                              {r.priceRange && <span className="text-xs text-[#1E2026]/40">{r.priceRange}</span>}
                              {r.distKm > 0 && (
                                <span className="text-[#B57F50] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#1E2026]/20 shrink-0 self-center" />
                        </button>
                      )
                    })}
                    {/* Submit listing CTA at bottom of list */}
                    <div className="p-4">
                      <Link
                        href="/list"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#B57F50]/30 bg-[#B57F50]/10 text-[#c8934f] text-xs font-semibold"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Submit a Listing
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected restaurant CTA */}
            {selectedSlug && !mobileDrawerOpen && (() => {
              const r = displayList.find(x => x.slug === selectedSlug)
              return r ? (
                <div className="shrink-0 px-3 pb-3 pt-1 border-t border-black/8">
                  <Link
                    href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
                  >
                    View {r.name} →
                  </Link>
                </div>
              ) : null
            })()}
          </div>
        </div>
      </div>

      {/* Sign-in gate — shown after the free search is used up */}
      {searchGateOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 text-center">
            <button
              onClick={() => setSearchGateOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-[#9B9490] hover:text-[#1E2026] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-[#B57F50]/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#B57F50]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
              Sign in to keep searching
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
              You&apos;ve used your free search. Create a free account or sign in to search unlimited ramen spots, save your favorites, and get directions.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/auth/signup?redirectTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/searchmap')}`}
                className="w-full px-5 py-3 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
              >
                Create free account
              </Link>
              <Link
                href={`/auth/login?redirectTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/searchmap')}`}
                className="w-full px-5 py-3 rounded-xl bg-white border border-black/10 text-[#1E2026] hover:border-black/20 text-sm font-semibold transition-colors"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
