'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Flame, Leaf, Droplets, Soup, Wind, Moon, Tag, Gem,
  PlusCircle, List as ListIcon, Map as MapIcon,
} from 'lucide-react'
import { restaurants, getBrothTypes } from '@/lib/restaurants'
import type { MapBounds } from '@/components/ramen-map'
import RestaurantImage from '@/components/restaurant-image'

const RamenMap = dynamic(() => import('@/components/ramen-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
    </div>
  ),
})

// ── Quick filters (Google-Maps style pills) ───────────────────────────────────
const QUICK_FILTERS = [
  { key: 'closest', label: 'Closest', icon: Navigation },
  { key: 'open-late', label: 'Open Late', icon: Moon },
  { key: 'cheap', label: 'Cheap', icon: Tag },
  { key: 'upscale', label: 'Upscale', icon: Gem },
] as const

const BROTH_FILTERS = [
  { key: 'Tonkotsu', label: 'Tonkotsu', icon: Wind, idle: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', active: 'bg-amber-500 text-white border-amber-500' },
  { key: 'Shoyu', label: 'Shoyu', icon: Droplets, idle: 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200', active: 'bg-stone-600 text-white border-stone-600' },
  { key: 'Miso', label: 'Miso', icon: Soup, idle: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100', active: 'bg-orange-500 text-white border-orange-500' },
  { key: 'Spicy', label: 'Spicy', icon: Flame, idle: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100', active: 'bg-red-500 text-white border-red-500' },
  { key: 'Vegan', label: 'Vegan', icon: Leaf, idle: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', active: 'bg-emerald-500 text-white border-emerald-500' },
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

// Latest closing time (in minutes from midnight) for today; null if closed/unknown.
function latestCloseToday(hours: Record<string, string[]> | null): number | null {
  if (!hours) return null
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const slots = hours[days[new Date().getDay()]]
  if (!slots || slots[0] === 'Closed') return null
  let latest: number | null = null
  for (const slot of slots) {
    const m = slot.match(/-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
    if (!m) continue
    let h = parseInt(m[1])
    const mi = m[2] ? parseInt(m[2]) : 0
    const mer = m[3].toUpperCase()
    if (mer === 'PM' && h !== 12) h += 12
    if (mer === 'AM' && h === 12) h = 0
    let close = h * 60 + mi
    if (close < 360) close += 1440 // closes after midnight
    if (latest === null || close > latest) latest = close
  }
  return latest
}

// "Open late" = open until 9 PM or later today.
function isOpenLate(r: typeof restaurants[number]): boolean {
  const close = latestCloseToday(r.hours)
  return close !== null && close >= 21 * 60
}

function isCheap(r: typeof restaurants[number]): boolean {
  return r.priceRange === '$' || r.priceRange === '$$'
}

function isUpscale(r: typeof restaurants[number]): boolean {
  return r.priceRange === '$$$' || r.priceRange === '$$$$' || !!r.amenities?.trendy
}

type GeoState = 'idle' | 'loading' | 'granted' | 'denied'
type MobileView = 'map' | 'list'

// A sensible default center while we wait for (or are denied) geolocation:
// the most-reviewed restaurant, which lands us in a populated metro.
const FALLBACK_CENTER = (() => {
  const withCoords = restaurants.filter(r => r.latitude && r.longitude)
  const top = [...withCoords].sort((a, b) => b.reviewCount - a.reviewCount)[0]
  return top ? { lat: top.latitude!, lng: top.longitude! } : { lat: 40.7128, lng: -74.006 }
})()

export default function HomeMapHero() {
  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [localQuery, setLocalQuery] = useState('')
  const [quickFilters, setQuickFilters] = useState<Set<string>>(new Set())
  const [selectedBroths, setSelectedBroths] = useState<Set<string>>(new Set())
  const [mobileView, setMobileView] = useState<MobileView>('map')
  const [, setVisibleBounds] = useState<MapBounds | null>(null)
  const [mapDragCenter, setMapDragCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [showSearchAreaBtn, setShowSearchAreaBtn] = useState(false)
  const [searchingArea, setSearchingArea] = useState(false)

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

  useEffect(() => { requestLocation() }, [])

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
      const data = await res.json()
      if (data.length > 0) {
        setGeocodedCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } else {
        setGeocodeError('ZIP code not found')
      }
    } catch {
      setGeocodeError('Search failed — check your connection')
    } finally {
      setGeocoding(false)
    }
  }

  function toggleQuick(key: string) {
    setQuickFilters(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleBroth(key: string) {
    setSelectedBroths(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Center the distance math + map on the best signal we have.
  const distanceOrigin = geocodedCenter ?? userPos ?? FALLBACK_CENTER
  const effectiveCenter = distanceOrigin

  const closestActive = quickFilters.has('closest')

  const displayList = useMemo(() => {
    const enriched = restaurants
      .filter(r => r.latitude && r.longitude)
      .map(r => ({
        ...r,
        distKm: haversineKm(distanceOrigin.lat, distanceOrigin.lng, r.latitude!, r.longitude!),
      }))

    let list = enriched.filter(r => {
      if (quickFilters.has('open-late') && !isOpenLate(r)) return false
      if (quickFilters.has('cheap') && !isCheap(r)) return false
      if (quickFilters.has('upscale') && !isUpscale(r)) return false
      if (selectedBroths.size > 0) {
        const broths = getBrothTypes(r).map(b => b as string)
        if (!broths.some(b => selectedBroths.has(b))) return false
      }
      return true
    })

    if (localQuery.trim()) {
      const q = localQuery.toLowerCase()
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      )
    }

    // Sort: nearest first when "Closest" is on (or we have a real location);
    // otherwise lead with the highest-rated, most-reviewed spots.
    if (closestActive || userPos || geocodedCenter) {
      list.sort((a, b) => a.distKm - b.distKm)
    } else {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    }

    return list.slice(0, 300)
  }, [distanceOrigin, quickFilters, selectedBroths, localQuery, closestActive, userPos, geocodedCenter])

  // Restaurants shown as markers on the map (slightly broader cap for context).
  const mapRestaurants = useMemo(() => displayList.slice(0, 300), [displayList])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
    const el = document.getElementById(`home-card-${slug}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const activeCount = quickFilters.size + selectedBroths.size
  function clearAll() {
    setQuickFilters(new Set())
    setSelectedBroths(new Set())
    setLocalQuery('')
  }

  const handleMapCenter = useCallback((center: { lat: number; lng: number }) => {
    setMapDragCenter(center)
    setShowSearchAreaBtn(true)
  }, [])

  async function handleSearchArea() {
    if (!mapDragCenter) return
    setSearchingArea(true)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapDragCenter.lat}&lon=${mapDragCenter.lng}`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      const zip: string | undefined = data?.address?.postcode?.replace(/[^0-9]/g, '').slice(0, 5)
      if (zip) setLocationSearch(zip)
      setGeocodedCenter(mapDragCenter)
    } catch {
      // silently fall back — just re-center without ZIP update
      setGeocodedCenter(mapDragCenter)
    } finally {
      setSearchingArea(false)
      setShowSearchAreaBtn(false)
      setMapDragCenter(null)
    }
  }

  return (
    <section className="pt-16 bg-[#F5F4F0]">
      {/* SEO heading + intro — kept visible for crawlers and users */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">
          Find Ramen Near You
        </h1>
        <p className="text-[#6B6862] text-sm mt-1">
          Search the map for the best ramen restaurants near you — filter by broth, price, and hours.
        </p>
      </div>

      {/* Filter bar (Google-Maps style) */}
      <div className="border-y border-black/8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* ZIP / location search */}
            <form
              onSubmit={e => { e.preventDefault(); geocodeLocation(locationSearch) }}
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

            {/* Quick filters */}
            {QUICK_FILTERS.map(f => {
              const active = quickFilters.has(f.key)
              const Icon = f.icon
              const disabled = f.key === 'closest' && !userPos && !geocodedCenter
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    if (f.key === 'closest' && !userPos && !geocodedCenter) { requestLocation(); return }
                    toggleQuick(f.key)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                    active
                      ? 'bg-[#1E2026] text-white border-[#1E2026]'
                      : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
                  } ${disabled ? 'opacity-70' : ''}`}
                  title={disabled ? 'Allow location access to sort by distance' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              )
            })}

            <div className="h-5 w-px bg-black/10 shrink-0" />

            {/* Broth filters */}
            {BROTH_FILTERS.map(f => {
              const active = selectedBroths.has(f.key)
              const Icon = f.icon
              return (
                <button
                  key={f.key}
                  onClick={() => toggleBroth(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${active ? f.active : `bg-white ${f.idle}`}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              )
            })}

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

      {/* Map + list */}
      <div className="relative h-[68vh] min-h-[460px] flex">
        {/* Left list panel */}
        <div className={`w-full sm:w-80 lg:w-96 bg-white border-r border-black/8 flex-col overflow-hidden shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden'} sm:flex`}>
          {/* Name search + count */}
          <div className="px-3 py-2.5 border-b border-black/8">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
              <input
                type="text"
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
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
              {displayList.length} ramen spot{displayList.length !== 1 ? 's' : ''}
              {activeCount > 0 && <span className="text-[#6B6862] font-normal"> (filtered)</span>}
            </p>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {displayList.length === 0 ? (
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
                  const active = r.slug === selectedSlug
                  const showDist = (closestActive || !!userPos || !!geocodedCenter)
                  return (
                    <Link
                      key={r.slug}
                      id={`home-card-${r.slug}`}
                      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                      onMouseEnter={() => setHoveredSlug(r.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className={`w-full text-left flex gap-3 p-3 transition-colors hover:bg-black/5 ${active ? 'bg-[#B57F50]/10 border-l-2 border-[#B57F50]' : ''}`}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0">
                        <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="64px" />
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
                          {showDist && r.distKm > 0 && (
                            <span className="text-[#B57F50] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#1E2026]/20 shrink-0 self-center" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit listing CTA */}
          <div className="p-3 border-t border-black/8">
            <Link
              href="/list"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#B57F50]/30 bg-[#B57F50]/10 hover:bg-[#B57F50]/20 text-[#c8934f] text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Submit a Listing
            </Link>
          </div>
        </div>

        {/* Map */}
        <div className={`flex-1 relative ${mobileView === 'list' ? 'hidden' : 'block'} sm:block`}>
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
          />

          {/* Search this area button — appears after user drags the map */}
          {showSearchAreaBtn && (
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

          {geoState === 'idle' && !showSearchAreaBtn && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={requestLocation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold shadow-lg shadow-black/30 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Use my location
              </button>
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
      </div>
    </section>
  )
}
