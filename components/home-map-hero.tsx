'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Sparkles, Flame, Clock, SlidersHorizontal,
  List as ListIcon, Map as MapIcon, Check, Trophy,
} from 'lucide-react'
import type { MapBounds } from '@/components/ramen-map'
import RestaurantImage from '@/components/restaurant-image'
import SigninGateModal from '@/components/signin-gate-modal'
import SubscribeGateModal from '@/components/subscribe-gate-modal'
import AiRamenSearchPanel from '@/components/ai-ramen-search-panel'
import { useGate } from '@/lib/use-gate'
import { isOpenNow, isOpenLate, isOpenPastMidnight } from '@/lib/hours'
import {
  BOWL_META, BOWL_BY_KEY, MOOD_META, MOOD_BY_KEY, PRICE_META,
  matchesPrice, type MapPoint,
} from '@/lib/ramen-taxonomy'
import { loadPassport, savePassport, earnedBadges, nextBadge } from '@/lib/passport'

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
type MobileView = 'map' | 'list'

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 } // NYC until data/geo resolves

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
  pageTitle?: string
  pageDescription?: string
}

export default function HomeMapHero({
  initialFlags = [],
  initialBowls = [],
  initialMoods = [],
  initialPrices = [],
  pageTitle = 'Find Ramen Near You',
  pageDescription = 'Search the map by bowl, mood, price, and hours — then find your best bowl right now.',
}: HomeMapHeroProps) {
  // Slim dataset — fetched after mount so the 25 MB source never ships in the bundle.
  const [data, setData] = useState<MapPoint[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(false)

  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [localQuery, setLocalQuery] = useState('')

  // Filter state
  const [flags, setFlags] = useState<Set<string>>(new Set(initialFlags))
  const [bowls, setBowls] = useState<Set<string>>(new Set(initialBowls))
  const [moods, setMoods] = useState<Set<string>>(new Set(initialMoods))
  const [prices, setPrices] = useState<Set<string>>(new Set(initialPrices))
  const [showFilters, setShowFilters] = useState(false)

  const [showAiPanel, setShowAiPanel] = useState(false)

  // Map modes
  const [heatmap, setHeatmap] = useState(false)
  const [passportMode, setPassportMode] = useState(false)
  const [visited, setVisited] = useState<Set<string>>(new Set())

  const [mobileView, setMobileView] = useState<MobileView>('map')
  const [, setVisibleBounds] = useState<MapBounds | null>(null)
  const [mapDragCenter, setMapDragCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [showSearchAreaBtn, setShowSearchAreaBtn] = useState(false)
  const [searchingArea, setSearchingArea] = useState(false)

  // Access gating
  const { evaluate, evaluatePremium } = useGate()
  const [gateMode, setGateMode] = useState<null | 'signin' | 'subscribe'>(null)

  useEffect(() => { setVisited(loadPassport()) }, [])

  // Returns true if the action may proceed; otherwise opens the appropriate gate.
  function requireAccess(): boolean {
    const result = evaluate()
    if (result === 'ok') return true
    setGateMode(result)
    return false
  }
  // requirePremium: also requires an active Ramen Pass subscription.
  function requirePremium(): boolean {
    const result = evaluatePremium()
    if (result === 'ok') return true
    setGateMode(result)
    return false
  }
  const withGate = (fn: () => void) => () => { if (requireAccess()) fn() }

  // Fetch the slim map dataset once, with one retry to ride out transient blips.
  useEffect(() => {
    let cancelled = false
    async function load(attempt = 0): Promise<void> {
      try {
        const res = await fetch('/api/ramen-map', { cache: 'force-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const d: MapPoint[] = await res.json()
        if (!cancelled) { setData(d); setDataError(false); setDataLoading(false) }
      } catch {
        if (cancelled) return
        if (attempt < 2) { setTimeout(() => load(attempt + 1), 800 * (attempt + 1)); return }
        setDataError(true); setDataLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

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
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(clean)}&countrycodes=us&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const result = await res.json()
      if (result.length > 0) {
        setGeocodedCenter({ lat: parseFloat(result[0].lat), lng: parseFloat(result[0].lon) })
      } else {
        setGeocodeError('ZIP code not found')
      }
    } catch {
      setGeocodeError('Search failed — check your connection')
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
    if (!data.length) return DEFAULT_CENTER
    const top = data.reduce((a, b) => (b.reviewCount > a.reviewCount ? b : a))
    return top.latitude && top.longitude ? { lat: top.latitude, lng: top.longitude } : DEFAULT_CENTER
  }, [data])

  const distanceOrigin = geocodedCenter ?? userPos ?? fallbackCenter
  const effectiveCenter = distanceOrigin
  const closestActive = flags.has('closest')
  const hasLocation = !!userPos || !!geocodedCenter

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
        if (bowls.size > 0 && !(r.bowls ?? []).some(k => bowls.has(k))) return false
        if (moods.size > 0 && !(r.moods ?? []).some(k => moods.has(k))) return false
        if (prices.size > 0 && ![...prices].some(k => matchesPrice(r, k))) return false
        return true
      })

      if (localQuery.trim()) {
        const q = localQuery.toLowerCase()
        list = list.filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      }

      if (closestActive || hasLocation) {
        list.sort((a, b) => a.distKm - b.distKm)
      } else {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      }

      return list.slice(0, 300)
    } catch {
      return []
    }
  }, [data, distanceOrigin, flags, bowls, moods, prices, localQuery, closestActive, hasLocation])

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


  function toggleVisited(slug: string) {
    setVisited(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      savePassport(next)
      return next
    })
  }

  const activeCount = flags.size + bowls.size + moods.size + prices.size
  function clearAll() {
    setFlags(new Set())
    setBowls(new Set())
    setMoods(new Set())
    setPrices(new Set())
    setLocalQuery('')
  }

  const visitedHere = displayList.filter(r => visited.has(r.slug)).length
  const totalVisited = visited.size
  const next = nextBadge(totalVisited)
  const badges = earnedBadges(totalVisited)

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
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
                onChange={e => { setLocationSearch(e.target.value.replace(/\D/g, '')); setGeocodeError('') }}
                placeholder="ZIP code"
                className="w-28 pl-7 pr-10 py-1.5 text-sm bg-white border border-black/12 rounded-full outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
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
              onClick={() => { if (requirePremium()) setShowAiPanel(true) }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#6366f1] shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ramen AI
            </button>

            <Chip active={flags.has('closest')} label="Closest" emoji="🧭"
              onClick={() => { if (!requireAccess()) return; if (!hasLocation) { requestLocation(); return } toggleFlag('closest') }} />
            <Chip active={flags.has('open-now')} label="Open Now" emoji="🟢"
              onClick={withGate(() => toggleFlag('open-now'))} />

            <button
              onClick={withGate(() => setShowFilters(v => !v))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                showFilters ? 'bg-[#1E2026] text-white border-[#1E2026]' : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              {activeCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">{activeCount}</span>
              )}
            </button>

            <div className="h-5 w-px bg-black/10 shrink-0" />

            <button
              onClick={withGate(() => setHeatmap(v => !v))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                heatmap ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Heatmap
            </button>
            <button
              onClick={withGate(() => setPassportMode(v => !v))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                passportMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Passport
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
          {geocodeError && <p className="text-red-500 text-xs mt-1.5">{geocodeError}</p>}
        </div>
      </div>

      {/* Expandable full filter panel */}
      {showFilters && (
        <div className="border-t border-black/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#B57F50]" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Instant Bowl Finder</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BOWL_META.map(b => (
                  <Chip key={b.key} active={bowls.has(b.key)} hex={b.hex} emoji={b.emoji} label={b.label} onClick={() => toggleBowl(b.key)} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B57F50]" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Mood</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_META.map(m => (
                  <Chip key={m.key} active={moods.has(m.key)} hex={m.hex} emoji={m.emoji} label={m.label} onClick={() => toggleMood(m.key)} />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[#B57F50] text-xs font-bold">$</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Price</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_META.map(p => (
                    <Chip key={p.key} active={prices.has(p.key)} label={p.label} onClick={() => togglePrice(p.key)} />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Hours</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('open-now')} emoji="🟢" label="Open Now" onClick={() => toggleFlag('open-now')} />
                  <Chip active={flags.has('open-late')} emoji="🌙" label="Open Late (10pm+)" onClick={() => toggleFlag('open-late')} />
                  <Chip active={flags.has('open-midnight')} emoji="🌃" label="Past Midnight" onClick={() => toggleFlag('open-midnight')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passport progress banner */}
      {passportMode && (
        <div className="border-t border-black/8 bg-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">
                Ramen Passport — {totalVisited} visited
                {displayList.length > 0 && <span className="font-normal text-emerald-700"> · {visitedHere}/{displayList.length} in this area</span>}
              </span>
            </div>
            {badges.length > 0 && (
              <div className="flex items-center gap-1.5">
                {badges.map(b => (
                  <span key={b.key} title={b.label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-xs font-medium text-emerald-700">
                    <span>{b.emoji}</span>{b.label}
                  </span>
                ))}
              </div>
            )}
            {next && (
              <span className="text-xs text-emerald-700">
                {next.threshold - totalVisited} more to unlock {next.emoji} {next.label}
              </span>
            )}
            <span className="text-xs text-emerald-600/80 ml-auto hidden sm:inline">Tap ✓ on a card to mark it visited</span>
          </div>
        </div>
      )}


      {/* Map + list */}
      <div className="relative h-[68vh] min-h-[460px] flex border-t border-black/8 overflow-hidden">
        {/* Left list panel */}
        <div className={`w-full sm:w-80 lg:w-96 bg-white border-r border-black/8 flex-col overflow-hidden shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden'} sm:flex`}>
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
                  const showDist = closestActive || hasLocation
                  const isVisited = visited.has(r.slug)
                  return (
                    <Link
                      key={uid}
                      id={`home-card-${r.slug}`}
                      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                      onMouseEnter={() => setHoveredSlug(r.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className={`w-full text-left flex gap-3 p-3 transition-colors hover:bg-black/5 ${active ? 'bg-[#B57F50]/10 border-l-2 border-[#B57F50]' : ''}`}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0">
                        <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="64px" />
                        {isVisited && (
                          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-600 border border-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-semibold text-sm truncate ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                        </div>
                        <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {r.rating.toFixed(1)}
                            </span>
                          )}
                          {r.priceRange && <span className="text-xs text-[#1E2026]/40">{r.priceRange}</span>}
                          {isOpenNow(r.hours) && <span className="text-emerald-600 text-xs font-medium">Open</span>}
                          {showDist && r.distKm > 0 && (
                            <span className="text-[#B57F50] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>
                          )}
                        </div>
                      </div>
                      {passportMode ? (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleVisited(r.slug) }}
                          title={isVisited ? 'Visited — tap to remove' : 'Mark as visited'}
                          className={`self-center shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                            isVisited ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-black/15 text-[#9B9490] hover:border-emerald-500 hover:text-emerald-600'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#1E2026]/20 shrink-0 self-center" />
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Map */}
        <div className={`flex-1 relative ${mobileView === 'list' ? 'hidden' : 'block'} sm:block`}>
          {dataLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
              <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
            </div>
          ) : (
            <RamenMap
              restaurants={mapRestaurants}
              userLat={effectiveCenter.lat}
              userLng={effectiveCenter.lng}
              selectedSlug={selectedSlug}
              hoveredSlug={hoveredSlug}
              onSelect={handleSelect}
              onUserMove={setVisibleBounds}
              onMapCenter={handleMapCenter}
              centerLatLng={geocodedCenter}
              userLocation={userPos}
              accentColor={accentColor}
              heatmap={heatmap}
              visitedSlugs={visited}
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

          {heatmap && !dataLoading && (
            <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 rounded-lg shadow-lg border border-black/10 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B6862] mb-1">Ramen density</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#6B6862]">Low</span>
                <div className="h-2 w-20 rounded-full bg-gradient-to-r from-[#fcd34d] via-[#f97316] to-[#dc2626]" />
                <span className="text-[10px] text-[#6B6862]">High</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile map/list toggle */}
        <button
          onClick={() => setMobileView(v => (v === 'map' ? 'list' : 'map'))}
          className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E2026] text-white text-sm font-semibold shadow-lg"
        >
          {mobileView === 'map'
            ? <><ListIcon className="w-4 h-4" /> Show list</>
            : <><MapIcon className="w-4 h-4" /> Show map</>}
        </button>

        {/* AI ramen search panel — slides in over the map */}
        {showAiPanel && (
          <AiRamenSearchPanel
            onClose={() => setShowAiPanel(false)}
            allRestaurants={data}
            userLat={userPos?.lat ?? geocodedCenter?.lat}
            userLng={userPos?.lng ?? geocodedCenter?.lng}
            onSelectSlug={(slug) => {
              setSelectedSlug(slug)
              setShowAiPanel(false)
              setTimeout(() => {
                document.getElementById(`home-card-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
              }, 60)
            }}
          />
        )}
      </div>

      {gateMode === 'signin' && <SigninGateModal onClose={() => setGateMode(null)} redirectTo="/" />}
      {gateMode === 'subscribe' && <SubscribeGateModal onClose={() => setGateMode(null)} featureName="Ramen Pass features" />}
    </section>
  )
}
