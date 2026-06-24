'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Sparkles, Clock, SlidersHorizontal, Heart, Bookmark,
} from 'lucide-react'
import type { MapBounds } from '@/components/ramen-map'
import RestaurantImage from '@/components/restaurant-image'
import SigninGateModal from '@/components/signin-gate-modal'
import SubscribeGateModal from '@/components/subscribe-gate-modal'
import { useGate } from '@/lib/use-gate'
import { isOpenNow, isOpenLate, isOpenPastMidnight, opensEarly, isOpenOnWeekend } from '@/lib/hours'
import {
  BOWL_META, BOWL_BY_KEY, MOOD_META, MOOD_BY_KEY, PRICE_META,
  FEATURE_META, FEATURE_KEYS, matchesPrice, type MapPoint,
} from '@/lib/ramen-taxonomy'

const RamenMap = dynamic(() => import('@/components/ramen-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
    </div>
  ),
})

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

const USA_CENTER = { lat: 39.5, lng: -98.35 } // Continental USA default

// ── Reusable colored chip ─────────────────────────────────────────────────────
function Chip({
  active, hex, emoji, label, onClick,
}: { active: boolean; hex?: string; emoji?: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={active && hex ? { backgroundColor: hex, borderColor: hex, color: '#fff' } : undefined}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
        active && !hex
          ? 'bg-[#1E2026] text-white border-[#1E2026]'
          : !active
            ? 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
            : ''
      }`}
    >
      {emoji && <span className="text-sm leading-none">{emoji}</span>}
      {label}
    </button>
  )
}

interface HomeMapHeroProps {
  initialFlags?: string[]
  initialBowls?: string[]
  initialMoods?: string[]
  initialPrices?: string[]
  initialCenter?: { lat: number; lng: number }
  initialQuery?: string
  pageTitle?: string
  pageDescription?: string
  // When set, the map fetches and draws this city's boundary outline (Zillow-style).
  regionBoundary?: { cityName: string; stateName: string; citySlug: string; stateSlug: string }
}

export default function HomeMapHero({
  initialFlags = [],
  initialBowls = [],
  initialMoods = [],
  initialPrices = [],
  initialCenter,
  initialQuery = '',
  pageTitle = 'Find Ramen Near You',
  pageDescription = 'Search the map by bowl, mood, price, and hours — then find your best bowl right now.',
  regionBoundary,
}: HomeMapHeroProps) {
  // Slim dataset — fetched after mount so the 25 MB source never ships in the bundle.
  const [data, setData] = useState<MapPoint[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(false)

  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(initialCenter ?? null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [localQuery, setLocalQuery] = useState(initialQuery)

  // Filter state
  const [flags, setFlags] = useState<Set<string>>(new Set(initialFlags))
  const [bowls, setBowls] = useState<Set<string>>(new Set(initialBowls))
  const [moods, setMoods] = useState<Set<string>>(new Set(initialMoods))
  const [prices, setPrices] = useState<Set<string>>(new Set(initialPrices))
  const [showFilters, setShowFilters] = useState(false)
  const [zipFilter, setZipFilter] = useState('')

  const [searchSaved, setSearchSaved] = useState(false)

  const [saves, setSaves] = useState<Set<string>>(new Set())

  // City boundary outline (Zillow-style) — fetched once for city pages.
  const [boundary, setBoundary] = useState<unknown | null>(null)

  // Live "members searching now" count — slowly drifts between 20 and 24.
  // Starts at a fixed value so SSR and first client render match (no hydration
  // mismatch); the random walk only begins after mount.
  const [searchingNow, setSearchingNow] = useState(22)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      setSearchingNow(prev => {
        const step = Math.random() < 0.5 ? -1 : 1
        return Math.min(24, Math.max(20, prev + step))
      })
      timer = setTimeout(tick, 4000 + Math.random() * 4000) // every ~4–8s
    }
    timer = setTimeout(tick, 4000 + Math.random() * 4000)
    return () => clearTimeout(timer)
  }, [])

  // Only mount the Leaflet map on sm+ viewports — initialising Leaflet in a
  // CSS-hidden (display:none) zero-height container on mobile throws and sends
  // the whole component into the ErrorBoundary crash loop.
  const [showMap, setShowMap] = useState(false)
  useEffect(() => { setShowMap(window.innerWidth >= 640) }, [])

  const [, setVisibleBounds] = useState<MapBounds | null>(null)
  const [mapDragCenter, setMapDragCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [showSearchAreaBtn, setShowSearchAreaBtn] = useState(false)
  const [searchingArea, setSearchingArea] = useState(false)

  // Access gating
  const { evaluate, evaluatePremium } = useGate()
  const [gateMode, setGateMode] = useState<null | 'signin' | 'subscribe'>(null)

  function requireAccess(): boolean {
    const result = evaluate()
    if (result === 'ok') return true
    setGateMode(result)
    return false
  }
  function requirePremium(): boolean {
    const result = evaluatePremium()
    if (result === 'ok') return true
    setGateMode(result)
    return false
  }
  const withGate = (fn: () => void) => () => { if (requireAccess()) fn() }

  function handleSaveSearch() {
    if (!requireAccess()) return
    const state = {
      locationSearch,
      flags: [...flags],
      bowls: [...bowls],
      moods: [...moods],
      prices: [...prices],
      localQuery,
    }
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    saved.unshift({ ...state, savedAt: Date.now() })
    localStorage.setItem('savedSearches', JSON.stringify(saved.slice(0, 10)))
    setSearchSaved(true)
    setTimeout(() => setSearchSaved(false), 2000)
  }

  // Fetch the slim map dataset once, with one retry to ride out transient blips.
  useEffect(() => {
    let cancelled = false
    async function load(attempt = 0): Promise<void> {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 6000)
      try {
        const res = await fetch('/api/ramen-map', { cache: 'force-cache', signal: controller.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const d: MapPoint[] = await res.json()
        if (!cancelled) { setData(d); setDataError(false); setDataLoading(false) }
      } catch {
        clearTimeout(timer)
        if (cancelled) return
        if (attempt < 2) { setTimeout(() => load(attempt + 1), 800 * (attempt + 1)); return }
        setDataError(true); setDataLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Load saved restaurants for the current user (empty set if not signed in).
  useEffect(() => {
    fetch('/api/saves').then(r => r.json()).then(({ saves: slugs }) => {
      if (Array.isArray(slugs)) setSaves(new Set(slugs))
    }).catch(() => {})
  }, [])

  // Fetch the city boundary outline once (city pages only). Cached server-side.
  useEffect(() => {
    if (!regionBoundary) { setBoundary(null); return }
    const { cityName, stateName, citySlug, stateSlug } = regionBoundary
    const key = `${citySlug}:${stateSlug}`
    let cancelled = false
    fetch(`/api/city-boundary?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateName)}&key=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d?.geojson) setBoundary(d.geojson) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [regionBoundary])

  async function handleToggleSave(e: React.MouseEvent, slug: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!requireAccess()) return
    const isSaved = saves.has(slug)
    setSaves(prev => {
      const next = new Set(prev)
      isSaved ? next.delete(slug) : next.add(slug)
      return next
    })
    await fetch('/api/saves', {
      method: isSaved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {
      setSaves(prev => {
        const next = new Set(prev)
        isSaved ? next.add(slug) : next.delete(slug)
        return next
      })
    })
  }

  // Geolocation is requested only on explicit user action (never on load).
  function requestLocation() {
    if (!('geolocation' in navigator)) { setGeoState('denied'); return }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
      },
      () => setGeoState('denied'),
      { timeout: 10000 }
    )
  }

  async function geocodeLocation(query: string) {
    const clean = query.trim()
    if (!/^\d{5}$/.test(clean)) {
      setGeocodeError('Enter a valid 5-digit ZIP code')
      return
    }
    setGeocoding(true)
    setGeocodeError('')
    setZipFilter(clean)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(clean)}&countrycodes=us&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const result = await res.json()
      if (result.length > 0) {
        setGeocodedCenter({ lat: parseFloat(result[0].lat), lng: parseFloat(result[0].lon) })
      }
      // No error if geocode fails — we still filter by zip in the list
    } catch {
      // Geocode failure is non-fatal; list is already filtered by zip
    } finally {
      setGeocoding(false)
    }
  }

  const toggleIn = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) =>
    setter(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const toggleFlag = toggleIn(setFlags)
  const toggleBowl = toggleIn(setBowls)
  const toggleMood = toggleIn(setMoods)
  const togglePrice = toggleIn(setPrices)

  // Fallback center: most-reviewed spot in the dataset, until geo/ZIP resolves.
  const fallbackCenter = useMemo(() => {
    if (!data.length) return USA_CENTER
    const top = data.reduce((a, b) => (b.reviewCount > a.reviewCount ? b : a))
    return top.latitude && top.longitude ? { lat: top.latitude, lng: top.longitude } : USA_CENTER
  }, [data])

  const distanceOrigin = geocodedCenter ?? userPos ?? fallbackCenter
  const hasLocation = !!userPos || !!geocodedCenter

  // Map visual center and zoom — USA overview until the user sets a location.
  const mapCenter = geocodedCenter ?? userPos ?? (initialCenter ?? null)
  const mapZoom = mapCenter ? 11 : 4
  const mapInitCenter = mapCenter ?? USA_CENTER

  // Accent color drives the map pins — matches the first active bowl/mood chip.
  const accentColor = useMemo(() => {
    const b = [...bowls][0]
    if (b && BOWL_BY_KEY[b]) return BOWL_BY_KEY[b].hex
    const m = [...moods][0]
    if (m && MOOD_BY_KEY[m]) return MOOD_BY_KEY[m].hex
    return '#B57F50'
  }, [bowls, moods])

  const displayList = useMemo(() => {
    try {
      const enriched = data.map(r => ({
        ...r,
        distKm: r.latitude != null && r.longitude != null
          ? haversineKm(distanceOrigin.lat, distanceOrigin.lng, r.latitude, r.longitude)
          : Infinity,
      }))

      let list = enriched.filter(r => {
        if (flags.has('open-now') && !isOpenNow(r.hours)) return false
        if (flags.has('open-late') && !isOpenLate(r.hours, 22 * 60)) return false
        if (flags.has('open-midnight') && !isOpenPastMidnight(r.hours)) return false
        if (flags.has('top-rated') && ((r.rating ?? 0) < 4.3 || r.reviewCount < 20)) return false
        if (flags.has('hidden-gems') && !((r.rating ?? 0) >= 4.5 && r.reviewCount < 100)) return false
        if (flags.has('open-early') && !opensEarly(r.hours)) return false
        if (flags.has('open-weekends') && !isOpenOnWeekend(r.hours)) return false
        // Feature/amenity flags — DB listings carry an amenities array; Places
        // supplements don't, so they're excluded when an amenity filter is on.
        for (const f of FEATURE_KEYS) {
          if (flags.has(f) && !(r.amenities ?? []).includes(f)) return false
        }
        if (bowls.size > 0 && !(r.bowls ?? []).some(k => bowls.has(k))) return false
        if (moods.size > 0 && !(r.moods ?? []).some(k => moods.has(k))) return false
        if (prices.size > 0 && ![...prices].some(k => matchesPrice(r, k))) return false
        return true
      })

      // ZIP search: show exact-ZIP matches when present; otherwise fall back to
      // the geocoded center and show nearby spots sorted by distance (below).
      // Never returns an empty list just because the slim dataset lacks zips.
      if (zipFilter) {
        const exact = list.filter(r => r.zip === zipFilter)
        if (exact.length > 0) {
          list = exact
        } else if (geocodedCenter) {
          // No exact-ZIP rows (e.g. slim data lacks zips) — show spots within ~25mi.
          list = list.filter(r => r.distKm <= 40)
        }
      }

      if (localQuery.trim()) {
        const q = localQuery.toLowerCase()
        list = list.filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      }

      if (flags.has('top-rated') && !hasLocation && !zipFilter) {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      } else if (hasLocation || zipFilter) {
        list.sort((a, b) => a.distKm - b.distKm)
      } else {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      }

      // Featured listings are pinned to the top (stable — keeps prior ordering).
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

      return list.slice(0, 300)
    } catch {
      return []
    }
  }, [data, distanceOrigin, flags, bowls, moods, prices, localQuery, hasLocation, zipFilter, geocodedCenter])

  const mapRestaurants = useMemo(() => displayList.slice(0, 300), [displayList])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
    document.getElementById(`home-card-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const handleMapCenter = useCallback((center: { lat: number; lng: number }) => {
    setMapDragCenter(center)
    setShowSearchAreaBtn(true)
  }, [])

  async function handleSearchArea() {
    if (!mapDragCenter) return
    if (!requireAccess()) return
    setSearchingArea(true)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapDragCenter.lat}&lon=${mapDragCenter.lng}`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const result = await res.json()
      const zip: string | undefined = result?.address?.postcode?.replace(/[^0-9]/g, '').slice(0, 5)
      if (zip) setLocationSearch(zip)
      setGeocodedCenter(mapDragCenter)
    } catch {
      setGeocodedCenter(mapDragCenter)
    } finally {
      setSearchingArea(false)
      setShowSearchAreaBtn(false)
      setMapDragCenter(null)
    }
  }


  const activeCount = flags.size + bowls.size + moods.size + prices.size
  function clearAll() {
    setFlags(new Set())
    setBowls(new Set())
    setMoods(new Set())
    setPrices(new Set())
    setLocalQuery('')
  }

  return (
    <section className="pt-16 bg-[#F5F4F0]">
      {/* SEO heading + intro — kept visible for crawlers and users */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">
          {pageTitle}
        </h1>
        <p className="text-[#6B6862] text-sm mt-1">
          {pageDescription}
        </p>
      </div>

      {/* Top filter bar */}
      <div className="border-t border-black/8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              <form
                onSubmit={e => { e.preventDefault(); if (!requireAccess()) return; geocodeLocation(locationSearch) }}
                className="relative shrink-0"
              >
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B57F50]" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={locationSearch}
                  onChange={e => { const v = e.target.value.replace(/\D/g, ''); setLocationSearch(v); setGeocodeError(''); if (!v) setZipFilter('') }}
                  placeholder="ZIP code"
                  className="w-44 pl-7 pr-10 py-1.5 text-sm bg-white border border-black/12 rounded-full outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                />
                <button
                  type="submit"
                  disabled={geocoding}
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold rounded-full transition-colors disabled:opacity-60"
                >
                  {geocoding ? '…' : 'Go'}
                </button>
              </form>

              <div className="h-5 w-px bg-black/10 shrink-0" />

              <button
                onClick={() => { if (!requireAccess()) return; setShowFilters(v => !v) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                  showFilters ? 'bg-[#1E2026] text-white border-[#1E2026]' : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                {activeCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">{activeCount}</span>
                )}
              </button>

              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#6B6862] hover:text-[#1E2026] whitespace-nowrap shrink-0"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Live activity — "members searching now" (social proof) */}
            <div
              className="hidden md:flex items-center gap-1.5 shrink-0 mr-1 text-xs font-medium text-[#6B6862]"
              aria-live="polite"
              title="Members browsing the ramen map right now"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="tabular-nums text-[#1E2026] font-semibold">{searchingNow}</span>
              <span>members searching now</span>
            </div>

            {/* Save Search — pinned to the right outside the scrollable area */}
            <button
              onClick={handleSaveSearch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all shrink-0 ${
                searchSaved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-[#1E2026] border-black/12 hover:border-[#B57F50] hover:text-[#B57F50]'
              }`}
              aria-label="Save this search"
            >
              <Bookmark className={`w-3.5 h-3.5 transition-all ${searchSaved ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{searchSaved ? 'Saved ✓' : 'Save Search'}</span>
            </button>
          </div>
          {geocodeError && <p className="text-red-500 text-xs mt-1.5">{geocodeError}</p>}
        </div>
      </div>

      {/* Expandable full filter panel */}
      {showFilters && (
        <div className="border-t border-black/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Panel header */}
            <div className="flex items-center justify-between pb-3 mb-1 border-b border-black/8">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B57F50]" />
                <h3 className="text-sm font-bold text-[#1E2026]">Filters</h3>
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">{activeCount}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <button onClick={clearAll} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#6B6862] hover:text-[#1E2026] transition-colors">
                    <X className="w-3.5 h-3.5" /> Clear all
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="px-3 py-1.5 rounded-full bg-[#1E2026] text-white text-xs font-semibold hover:bg-black transition-colors">
                  Done
                </button>
              </div>
            </div>

            {/* Grouped filter sections */}
            <div className="divide-y divide-black/8">
              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Utensils className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Instant Bowl Finder</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BOWL_META.map(b => (
                    <Chip key={b.key} active={bowls.has(b.key)} hex={b.hex} emoji={b.emoji} label={b.label} onClick={() => { if (!requireAccess()) return; toggleBowl(b.key) }} />
                  ))}
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Mood</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_META.map(m => (
                    <Chip key={m.key} active={moods.has(m.key)} hex={m.hex} emoji={m.emoji} label={m.label} onClick={() => { if (!requireAccess()) return; toggleMood(m.key) }} />
                  ))}
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Hours &amp; Quality</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('open-now')} emoji="🟢" label="Open Now" onClick={() => { if (!requireAccess()) return; toggleFlag('open-now') }} />
                  <Chip active={flags.has('open-late')} emoji="🌙" label="Open Late (10pm+)" onClick={() => { if (!requireAccess()) return; toggleFlag('open-late') }} />
                  <Chip active={flags.has('open-midnight')} emoji="🌃" label="Past Midnight" onClick={() => { if (!requireAccess()) return; toggleFlag('open-midnight') }} />
                  <Chip active={flags.has('open-early')} emoji="☕" label="Open Early" onClick={() => { if (!requireAccess()) return; toggleFlag('open-early') }} />
                  <Chip active={flags.has('open-weekends')} emoji="📆" label="Open Weekends" onClick={() => { if (!requireAccess()) return; toggleFlag('open-weekends') }} />
                  <Chip active={flags.has('top-rated')} emoji="⭐" label="Top Rated" onClick={() => { if (!requireAccess()) return; toggleFlag('top-rated') }} />
                  <Chip active={flags.has('hidden-gems')} emoji="💎" label="Hidden Gems" onClick={() => { if (!requireAccess()) return; toggleFlag('hidden-gems') }} />
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#B57F50] text-xs font-bold w-3.5 text-center">$</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Price</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_META.map(p => (
                    <Chip key={p.key} active={prices.has(p.key)} label={p.label} onClick={() => { if (!requireAccess()) return; togglePrice(p.key) }} />
                  ))}
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Features &amp; Amenities</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FEATURE_META.map(f => (
                    <Chip key={f.key} active={flags.has(f.key)} hex={f.hex} emoji={f.emoji} label={f.label} onClick={() => { if (!requireAccess()) return; toggleFlag(f.key) }} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}



      {/* Map + list */}
      <div className="relative h-[68vh] min-h-[460px] flex border-t border-black/8 overflow-hidden">
        {/* Left list panel */}
        <div className="w-full sm:w-80 lg:w-96 bg-white border-r border-black/8 flex-col overflow-hidden shrink-0 flex">
          <div className="px-3 py-2.5 border-b border-black/8">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
              <input
                type="text"
                value={localQuery}
                onFocus={() => requireAccess()}
                onChange={e => { if (!requireAccess()) return; setLocalQuery(e.target.value) }}
                placeholder="Search restaurants…"
                className="w-full pl-8 pr-8 py-2 text-sm bg-[#F5F4F0] border border-black/8 rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
              />
              {localQuery && (
                <button onClick={() => setLocalQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9490] hover:text-[#1E2026]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[#1E2026] font-semibold text-sm">
              {dataLoading ? 'Loading ramen spots…' : (
                <>
                  {displayList.length} ramen spot{displayList.length !== 1 ? 's' : ''}
                  {activeCount > 0 && <span className="text-[#6B6862] font-normal"> (filtered)</span>}
                </>
              )}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {dataLoading ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Loader2 className="w-7 h-7 text-[#B57F50] animate-spin" />
                <p className="text-[#6B6862] text-sm">Loading the ramen map…</p>
              </div>
            ) : dataError ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Utensils className="w-8 h-8 text-[#B57F50]/30" />
                <p className="text-[#1E2026] font-semibold text-sm">Couldn&apos;t load the map</p>
                <button onClick={() => location.reload()} className="text-xs text-[#B57F50] font-medium">Retry →</button>
              </div>
            ) : displayList.length === 0 ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Utensils className="w-8 h-8 text-[#B57F50]/30" />
                <p className="text-[#1E2026] font-semibold text-sm">No ramen spots found</p>
                <p className="text-[#6B6862] text-xs">Try clearing your filters or searching a different ZIP.</p>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-[#B57F50] font-medium">Clear all filters →</button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {displayList.map(r => {
                  const uid = `${r.citySlug}-${r.stateSlug}-${r.slug}`
                  const active = r.slug === selectedSlug
                  const showDist = hasLocation
                  const isSupp = !!r.googleMapsUrl
                  // Every listing (DB and Google Places) now has an internal page.
                  const internalUrl = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
                  const directionsUrl = r.googleMapsLink
                    ?? r.googleMapsUrl
                    ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + r.city + ' ' + r.stateCode)}`
                  return (
                    <div
                      key={uid}
                      id={`home-card-${r.slug}`}
                      onMouseEnter={() => setHoveredSlug(r.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className={`relative transition-colors ${
                        r.featured
                          ? 'bg-amber-50/60 border-l-[3px] border-[#f5b301]'
                          : active ? 'bg-[#B57F50]/10 border-l-2 border-[#B57F50]' : 'hover:bg-black/5'
                      }`}
                    >
                      {/* Main clickable row — internal listing page */}
                      <Link href={internalUrl} onClick={e => { if (!requireAccess()) e.preventDefault() }} className="flex gap-3 p-3 pb-1.5 pr-10">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0">
                          <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="56px" />
                          {r.featured && (
                            <span className="absolute top-0 left-0 bg-gradient-to-br from-[#f5b301] to-[#d4880b] text-white text-[8px] leading-none px-1 py-0.5 rounded-br-md font-bold">★</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {r.featured && (
                            <span className="inline-flex items-center gap-1 mb-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-[#9a6b0b] text-[9px] font-bold uppercase tracking-wide border border-[#f5b301]/40">
                              👑 Featured
                            </span>
                          )}
                          <p className={`font-semibold text-sm truncate ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                          <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {r.rating && (
                              <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
                              </span>
                            )}
                            {r.priceRange && <span className="text-xs text-[#1E2026]/40">{r.priceRange}</span>}
                            {isOpenNow(r.hours) && <span className="text-emerald-600 text-xs font-medium">Open</span>}
                            {showDist && r.distKm > 0 && <span className="text-[#B57F50] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>}
                          </div>
                        </div>
                      </Link>

                      {/* Action buttons */}
                      <div className="flex gap-1.5 px-3 pb-2.5 pt-1">
                        <button
                          onClick={e => { e.stopPropagation(); if (!requireAccess()) return; window.location.href = internalUrl }}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                        >
                          View Menu
                        </button>
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                        >
                          Get Directions
                        </a>
                        <button
                          onClick={e => { e.stopPropagation(); if (!requireAccess()) return; window.location.href = internalUrl }}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
                        >
                          Order Now
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); window.location.href = '/claim-your-listing' }}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#6B6862] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                        >
                          Claim Listing
                        </button>
                      </div>

                      {/* Save button — DB listings only (saves are keyed to DB slugs) */}
                      {!isSupp && (
                        <button
                          onClick={(e) => handleToggleSave(e, r.slug)}
                          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm border border-black/8 hover:border-[#B57F50]/40 transition-colors"
                          aria-label={saves.has(r.slug) ? 'Unsave restaurant' : 'Save restaurant'}
                        >
                          <Heart className={`w-3.5 h-3.5 transition-colors ${saves.has(r.slug) ? 'fill-[#B57F50] text-[#B57F50]' : 'text-[#9B9490]'}`} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Map — only mounted after JS confirms a sm+ viewport to avoid
            Leaflet throwing in a CSS-hidden zero-height container on mobile */}
        <div className="flex-1 relative hidden sm:block">
          {!showMap ? null : dataLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
              <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
            </div>
          ) : (
            <RamenMap
              restaurants={mapRestaurants}
              userLat={mapInitCenter.lat}
              userLng={mapInitCenter.lng}
              initialZoom={mapZoom}
              selectedSlug={selectedSlug}
              hoveredSlug={hoveredSlug}
              onSelect={handleSelect}
              onUserMove={setVisibleBounds}
              onMapCenter={handleMapCenter}
              centerLatLng={geocodedCenter}
              userLocation={userPos}
              accentColor={accentColor}
              boundary={boundary}
            />
          )}

          {showSearchAreaBtn && !dataLoading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={handleSearchArea}
                disabled={searchingArea}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F4F0] text-[#1E2026] text-sm font-semibold shadow-lg shadow-black/25 border border-black/10 transition-colors disabled:opacity-70"
              >
                {searchingArea
                  ? <><Loader2 className="w-4 h-4 animate-spin text-[#B57F50]" /> Searching…</>
                  : <><Search className="w-4 h-4 text-[#B57F50]" /> Search this area</>}
              </button>
            </div>
          )}

          {geoState === 'idle' && !showSearchAreaBtn && !dataLoading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={withGate(requestLocation)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold shadow-lg shadow-black/30 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Use my location
              </button>
            </div>
          )}

        </div>


      </div>

      {gateMode === 'signin' && <SigninGateModal onClose={() => setGateMode(null)} redirectTo="/" />}
      {gateMode === 'subscribe' && <SubscribeGateModal onClose={() => setGateMode(null)} featureName="Ramen Pass features" />}
    </section>
  )
}
