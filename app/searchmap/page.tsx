'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Navigation, Loader2, Utensils, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { restaurants, getBrothTypes } from '@/lib/restaurants'
import Navbar from '@/components/navbar'

const RamenMap = dynamic(() => import('@/components/ramen-map'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-[#1E2026]">
    <Loader2 className="w-8 h-8 text-[#77567A] animate-spin" />
  </div>
)})

const DISTANCE_OPTIONS = [5, 10, 20, 50] as const
type DistanceMiles = typeof DISTANCE_OPTIONS[number]

const BROTH_OPTIONS = ['Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan'] as const
const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$'] as const

function milesToKm(miles: number) { return miles * 1.60934 }
function kmToMiles(km: number) { return km * 0.621371 }

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type GeoState = 'idle' | 'loading' | 'granted' | 'denied'

function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#77567A] text-white'
          : 'bg-white/5 text-[#B0B3BB] hover:bg-white/10 hover:text-white border border-white/10'
      }`}
    >
      {label}
    </button>
  )
}

export default function SearchMapPage() {
  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState('')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [distanceMiles, setDistanceMiles] = useState<DistanceMiles>(20)
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(new Set())
  const [selectedBroths, setSelectedBroths] = useState<Set<string>>(new Set())

  const activeFilterCount =
    (distanceMiles !== 20 ? 1 : 0) + selectedPrices.size + selectedBroths.size

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

  useEffect(() => { requestLocation() }, [])

  const nearby = useMemo(() => {
    if (!userPos) return []
    const maxKm = milesToKm(distanceMiles)
    return restaurants
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        ...r,
        distKm: haversineKm(userPos.lat, userPos.lng, r.latitude!, r.longitude!),
      }))
      .filter((r) => r.distKm <= maxKm)
      .sort((a, b) => a.distKm - b.distKm)
  }, [userPos, distanceMiles])

  const filtered = useMemo(() => {
    return nearby.filter((r) => {
      if (selectedPrices.size > 0) {
        const price = r.priceRange || ''
        if (!selectedPrices.has(price)) return false
      }
      if (selectedBroths.size > 0) {
        const broths = getBrothTypes(r).map(b => b as string)
        if (!broths.some(b => selectedBroths.has(b))) return false
      }
      return true
    })
  }, [nearby, selectedPrices, selectedBroths])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
    const el = document.getElementById(`card-${slug}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  // ── Geo permission screens ──────────────────────────────────────────────────
  if (geoState === 'idle' || geoState === 'loading') {
    return (
      <main className="min-h-screen bg-[#2F323A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#77567A]/20 flex items-center justify-center">
            {geoState === 'loading'
              ? <Loader2 className="w-7 h-7 text-[#77567A] animate-spin" />
              : <Navigation className="w-7 h-7 text-[#77567A]" />}
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            {geoState === 'loading' ? 'Getting your location…' : 'Ramen Near Me'}
          </h1>
          {geoState === 'idle' && (
            <>
              <p className="text-[#B0B3BB] text-sm max-w-xs">
                We&apos;ll show all ramen restaurants within 20 miles of your current location.
              </p>
              <button
                onClick={requestLocation}
                className="px-6 py-3 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Allow Location Access
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  if (geoState === 'denied') {
    return (
      <main className="min-h-screen bg-[#2F323A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <MapPin className="w-10 h-10 text-[#77567A]/50" />
          <h1 className="font-serif text-2xl font-bold text-white">Location access denied</h1>
          <p className="text-[#B0B3BB] text-sm max-w-xs">{geoError || 'Enable location in your browser settings and try again.'}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={requestLocation}
              className="px-5 py-2.5 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link href="/cities" className="px-5 py-2.5 border border-white/10 text-[#B0B3BB] hover:text-white text-sm font-medium rounded-lg transition-colors">
              Browse by City
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Map view ────────────────────────────────────────────────────────────────
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#2F323A]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Left panel */}
        <div className="w-full sm:w-80 lg:w-96 flex flex-col bg-[#1E2026] border-r border-white/5 overflow-hidden shrink-0 hidden sm:flex">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">
                  {filtered.length} spot{filtered.length !== 1 ? 's' : ''}
                  {activeFilterCount > 0 && (
                    <span className="text-[#B0B3BB] font-normal"> (filtered)</span>
                  )}
                </p>
                <p className="text-[#B0B3BB] text-xs mt-0.5 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#77567A]" />
                  within {distanceMiles} mi
                </p>
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#77567A] text-white'
                    : 'bg-white/5 text-[#B0B3BB] hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#77567A] text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="mt-3 space-y-3 pt-3 border-t border-white/5">
                {/* Distance */}
                <div>
                  <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Distance</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DISTANCE_OPTIONS.map((d) => (
                      <FilterChip
                        key={d}
                        label={`${d} mi`}
                        active={distanceMiles === d}
                        onClick={() => setDistanceMiles(d)}
                      />
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Price</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRICE_OPTIONS.map((p) => (
                      <FilterChip
                        key={p}
                        label={p}
                        active={selectedPrices.has(p)}
                        onClick={() => togglePrice(p)}
                      />
                    ))}
                  </div>
                </div>

                {/* Broth type */}
                <div>
                  <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Broth Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {BROTH_OPTIONS.map((b) => (
                      <FilterChip
                        key={b}
                        label={b}
                        active={selectedBroths.has(b)}
                        onClick={() => toggleBroth(b)}
                      />
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-[#B0B3BB] hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#B0B3BB] text-sm">No ramen restaurants match your filters.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[#77567A] text-xs hover:underline mt-2 inline-block">
                    Clear filters →
                  </button>
                )}
              </div>
            ) : (
              filtered.map((r) => {
                const active = r.slug === selectedSlug
                return (
                  <button
                    key={r.slug}
                    id={`card-${r.slug}`}
                    onClick={() => setSelectedSlug(r.slug)}
                    className={`w-full text-left flex gap-3 p-3 transition-colors hover:bg-white/5 ${active ? 'bg-[#77567A]/10 border-l-2 border-[#77567A]' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#2F323A] shrink-0">
                      {r.photo ? (
                        <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-[#77567A]/30" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${active ? 'text-[#b07db5]' : 'text-white'}`}>{r.name}</p>
                      <p className="text-[#B0B3BB] text-xs truncate">{r.city}, {r.stateCode}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {r.rating && (
                          <span className="flex items-center gap-0.5 text-xs text-white/60">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {r.rating.toFixed(1)}
                          </span>
                        )}
                        {r.priceRange && (
                          <span className="text-xs text-white/40">{r.priceRange}</span>
                        )}
                        <span className="text-[#77567A] text-xs font-medium">
                          {kmToMiles(r.distKm).toFixed(1)} mi
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 shrink-0 self-center" />
                  </button>
                )
              })
            )}
          </div>

          {/* View listing link */}
          {selectedSlug && (() => {
            const r = filtered.find(x => x.slug === selectedSlug)
            return r ? (
              <div className="p-3 border-t border-white/5">
                <Link
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="block w-full py-2.5 text-center text-sm font-medium bg-[#77567A] hover:bg-[#8a6a8d] text-white rounded-lg transition-colors"
                >
                  View {r.name} →
                </Link>
              </div>
            ) : null
          })()}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {userPos && (
            <RamenMap
              restaurants={filtered}
              userLat={userPos.lat}
              userLng={userPos.lng}
              selectedSlug={selectedSlug}
              onSelect={handleSelect}
            />
          )}

          {/* Mobile bottom sheet — filter bar + result count */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-[999] w-[calc(100%-2rem)] max-w-sm">
            <div className="bg-[#1E2026] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
              {/* Count row */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                <span className="text-sm text-white font-medium">
                  {filtered.length} spot{filtered.length !== 1 ? 's' : ''} within {distanceMiles} mi
                </span>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-[#77567A] text-white'
                      : 'text-[#B0B3BB] bg-white/5'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  {activeFilterCount > 0 ? `${activeFilterCount} active` : 'Filter'}
                </button>
              </div>

              {/* Mobile filter panel */}
              {showFilters && (
                <div className="px-4 py-3 space-y-3">
                  {/* Distance */}
                  <div>
                    <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Distance</p>
                    <div className="flex flex-wrap gap-1.5">
                      {DISTANCE_OPTIONS.map((d) => (
                        <FilterChip key={d} label={`${d} mi`} active={distanceMiles === d} onClick={() => setDistanceMiles(d)} />
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div>
                    <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Price</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRICE_OPTIONS.map((p) => (
                        <FilterChip key={p} label={p} active={selectedPrices.has(p)} onClick={() => togglePrice(p)} />
                      ))}
                    </div>
                  </div>
                  {/* Broth */}
                  <div>
                    <p className="text-[#B0B3BB] text-xs font-medium mb-1.5">Broth Type</p>
                    <div className="flex flex-wrap gap-1.5">
                      {BROTH_OPTIONS.map((b) => (
                        <FilterChip key={b} label={b} active={selectedBroths.has(b)} onClick={() => toggleBroth(b)} />
                      ))}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#B0B3BB] hover:text-white">
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
