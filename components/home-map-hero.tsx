'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Sparkles, Clock, SlidersHorizontal, Heart, Bookmark,
  List, Map as MapIcon, HelpCircle,
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

  const [helpOpen, setHelpOpen] = useState(false)

  // Mount the Leaflet map after hydration. On mobile the map renders full-screen
  // (the list is an absolute overlay on top of it, so the map container always
  // has height) — this avoids the old crash from initialising Leaflet in a
  // zero-height container while still giving mobile users the map by default.
  const [showMap, setShowMap] = useState(false)
  useEffect(() => { setShowMap(true) }, [])

  // Mobile-only view toggle: full-screen map (default) ⇄ list overlay. Ignored
  // on sm+ where the list sidebar and map are shown side by side.
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')

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
        // "Ramen + Sushi" — spots that also do sushi. The slim payload only
        // carries the name, so we match shops whose name signals sushi.
        if (flags.has('ramen-sushi') && !/sushi|sashimi|izakaya|japanese/i.test(r.name)) return false
        // "New Spots" — recently opened shops haven't accumulated many reviews
        // yet, so we surface rated spots with a low review count.
        if (flags.has('new-ramen') && !((r.reviewCount ?? 0) > 0 && (r.reviewCount ?? 0) <= 75)) return false
        // "Fish Ramen" — seafood-broth bowls (gyokai/niboshi) and seafood-forward
        // shops. The slim payload only carries the name, so match on the name.
        if (flags.has('fish-ramen') && !/fish|seafood|gyokai|niboshi|shellfish|crab|shrimp|clam|oyster|sushi/i.test(r.name)) return false
        if (flags.has('hanabi') && !/hanabi/i.test(r.name)) return false
        if (flags.has('shokku') && !/shokku/i.test(r.name)) return false
        // Feature/amenity flags — DB listings carry an amenities array; Places
        // supplements don't, so they're excluded when an amenity filter is on.
        for (const f of FEATURE_KEYS) {
          if (flags.has(f) && !(r.amenities ?? []).includes(f)) return false
        }
        if (bowls.size > 0) {
          const matchesBowl = (r.bowls ?? []).some(k => bowls.has(k))
          const nameMatchesMiso = bowls.has('miso') && /miso/i.test(r.name)
          if (!matchesBowl && !nameMatchesMiso) return false
        }
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
    const result = evaluate()
    if (result !== 'ok') { setGateMode(result); return }
    setSelectedSlug(slug)
    document.getElementById(`home-card-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluate])

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

            {/* Help button */}
            <button
              onClick={() => setHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-black/12 bg-white text-[#6B6862] hover:border-[#B57F50] hover:text-[#B57F50] transition-all shrink-0"
              aria-label="How to use this map"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Help</span>
            </button>

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
                    <Chip key={b.key} active={bowls.has(b.key)} hex={b.hex} emoji={b.emoji} label={b.label} onClick={() => { if (!requirePremium()) return; toggleBowl(b.key) }} />
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
                    <Chip key={m.key} active={moods.has(m.key)} hex={m.hex} emoji={m.emoji} label={m.label} onClick={() => { if (!requirePremium()) return; toggleMood(m.key) }} />
                  ))}
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Utensils className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Cuisine</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('ramen-sushi')} emoji="🍣" label="Ramen + Sushi" onClick={() => { if (!requirePremium()) return; toggleFlag('ramen-sushi') }} />
                  <Chip active={flags.has('fish-ramen')} emoji="🐟" label="Fish Ramen" onClick={() => { if (!requirePremium()) return; toggleFlag('fish-ramen') }} />
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Hours &amp; Quality</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('open-now')} emoji="🟢" label="Open Now" onClick={() => { if (!requirePremium()) return; toggleFlag('open-now') }} />
                  <Chip active={flags.has('open-late')} emoji="🌙" label="Open Late (10pm+)" onClick={() => { if (!requirePremium()) return; toggleFlag('open-late') }} />
                  <Chip active={flags.has('open-midnight')} emoji="🌃" label="Past Midnight" onClick={() => { if (!requirePremium()) return; toggleFlag('open-midnight') }} />
                  <Chip active={flags.has('open-early')} emoji="☕" label="Open Early" onClick={() => { if (!requirePremium()) return; toggleFlag('open-early') }} />
                  <Chip active={flags.has('open-weekends')} emoji="📆" label="Open Weekends" onClick={() => { if (!requirePremium()) return; toggleFlag('open-weekends') }} />
                  <Chip active={flags.has('top-rated')} emoji="⭐" label="Top Rated" onClick={() => { if (!requirePremium()) return; toggleFlag('top-rated') }} />
                  <Chip active={flags.has('hidden-gems')} emoji="💎" label="Hidden Gems" onClick={() => { if (!requirePremium()) return; toggleFlag('hidden-gems') }} />
                  <Chip active={flags.has('new-ramen')} emoji="🆕" label="New Spots" onClick={() => { if (!requirePremium()) return; toggleFlag('new-ramen') }} />
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#B57F50] text-xs font-bold w-3.5 text-center">$</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Price</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_META.map(p => (
                    <Chip key={p.key} active={prices.has(p.key)} label={p.label} onClick={() => { if (!requirePremium()) return; togglePrice(p.key) }} />
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
                    <Chip key={f.key} active={flags.has(f.key)} hex={f.hex} emoji={f.emoji} label={f.label} onClick={() => { if (!requirePremium()) return; toggleFlag(f.key) }} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}



      {/* Map + list */}
      <div className="relative h-[80vh] sm:h-[68vh] min-h-[460px] flex border-t border-black/8 overflow-hidden">
        {/* Left list panel — static sidebar on sm+, full-screen overlay on mobile */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} sm:flex absolute inset-0 z-[1100] sm:static sm:inset-auto sm:z-auto w-full sm:w-80 lg:w-96 bg-white border-r border-black/8 flex-col overflow-hidden shrink-0`}>
          <div className="px-3 py-2.5 border-b border-black/8 flex items-center justify-between gap-2">
            <p className="text-[#1E2026] font-semibold text-sm">
              {dataLoading ? 'Loading ramen spots…' : (
                <>
                  {displayList.length} ramen spot{displayList.length !== 1 ? 's' : ''}
                  {activeCount > 0 && <span className="text-[#6B6862] font-normal"> (filtered)</span>}
                </>
              )}
            </p>
            {/* Back to full-screen map (mobile only) */}
            <button
              onClick={() => setMobileView('map')}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E2026] text-white text-xs font-semibold"
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
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
                  // Only the one featured listing has an internal detail page.
                  const isIkedo = r.slug === 'ikedo-ramen' && r.citySlug === 'port-washington'
                  const internalUrl = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
                  const directionsUrl = r.googleMapsLink
                    ?? r.googleMapsUrl
                    ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + r.city + ' ' + r.stateCode)}`
                  // Non-ikedo listings link out to their Google Maps listing
                  const externalUrl = directionsUrl
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
                      {/* Main clickable row */}
                      {isIkedo ? (
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
                      ) : (
                        <a
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => { if (!requireAccess()) e.preventDefault() }}
                          className="flex gap-3 p-3 pb-1.5 pr-10"
                        >
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
                        </a>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-1.5 px-3 pb-2.5 pt-1">
                        {isIkedo ? (
                          <button
                            onClick={e => { e.stopPropagation(); if (!requireAccess()) return; window.location.href = internalUrl }}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                          >
                            View Menu
                          </button>
                        ) : (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => { e.stopPropagation(); if (!requireAccess()) e.preventDefault() }}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                          >
                            View Menu
                          </a>
                        )}
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                        >
                          Get Directions
                        </a>
                        {isIkedo ? (
                          <button
                            onClick={e => { e.stopPropagation(); if (!requireAccess()) return; window.location.href = internalUrl }}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
                          >
                            Order Now
                          </button>
                        ) : (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => { e.stopPropagation(); if (!requireAccess()) e.preventDefault() }}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
                          >
                            Order Now
                          </a>
                        )}
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

        {/* Map — full-screen on mobile (list overlays it), side-by-side on sm+ */}
        <div className="flex-1 relative block">
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

          {/* Floating list-view toggle (mobile only) — opens the list overlay */}
          <button
            onClick={() => setMobileView('list')}
            className="sm:hidden absolute bottom-4 right-4 z-[1000] flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg shadow-black/25 border border-black/10 text-[#1E2026] active:scale-95 transition-transform"
            aria-label={`Show list of ${displayList.length} ramen spots`}
          >
            <List className="w-6 h-6" />
            {displayList.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">
                {displayList.length > 99 ? '99+' : displayList.length}
              </span>
            )}
          </button>

        </div>


      </div>

      {gateMode === 'signin' && <SigninGateModal onClose={() => setGateMode(null)} redirectTo="/" />}
      {gateMode === 'subscribe' && <SubscribeGateModal onClose={() => setGateMode(null)} featureName="Ramen Pass features" />}

      {/* Help modal */}
      {helpOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setHelpOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <h2 className="font-serif text-xl font-bold text-[#1E2026]">How to use the Ramen Map</h2>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#6B6862] hover:text-[#1E2026] transition-colors"
                aria-label="Close help"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 text-sm text-[#1E2026]">
              <div className="flex gap-3">
                <span className="text-2xl leading-none mt-0.5">📍</span>
                <div>
                  <p className="font-semibold mb-1">Find ramen near you</p>
                  <p className="text-[#6B6862]">Type your ZIP code into the search bar and press <strong>Go</strong>, or tap <strong>Use my location</strong> (the arrow icon) to automatically center the map on where you are. The list on the left sorts by distance.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl leading-none mt-0.5">🔍</span>
                <div>
                  <p className="font-semibold mb-1">Filter by broth, mood, or features</p>
                  <p className="text-[#6B6862]">Tap <strong>Filters</strong> to open the filter panel. Pick a broth style (tonkotsu, miso, shoyu…), a vibe (date night, late night, hidden gems…), or features like outdoor seating or a full bar. Filters stack — combine as many as you like.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl leading-none mt-0.5">🗺️</span>
                <div>
                  <p className="font-semibold mb-1">Browse the map</p>
                  <p className="text-[#6B6862]">Click any pin on the map to highlight that restaurant in the list. Pan or zoom the map and tap <strong>Search this area</strong> to reload results for the visible region. On mobile, use the circular list button (bottom-right) to switch between map and list view.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl leading-none mt-0.5">⭐</span>
                <div>
                  <p className="font-semibold mb-1">Read ratings and reviews</p>
                  <p className="text-[#6B6862]">Each card shows the star rating and review count. Click a card to open the full restaurant page with address, hours, phone number, and a link to get directions.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl leading-none mt-0.5">🔖</span>
                <div>
                  <p className="font-semibold mb-1">Save your search</p>
                  <p className="text-[#6B6862]">Tap <strong>Save Search</strong> to bookmark your current filters and location so you can come back to the same view later.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-black/8 bg-[#F5F4F0] rounded-b-2xl">
              <button
                onClick={() => setHelpOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
              >
                Got it — start searching
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
