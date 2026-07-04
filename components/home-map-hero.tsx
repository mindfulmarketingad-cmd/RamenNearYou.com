'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Sparkles, Clock, SlidersHorizontal, Heart, Bookmark,
  List, Map as MapIcon, HelpCircle, ArrowUpDown,
} from 'lucide-react'
import type { MapBounds } from '@/components/ramen-map'
import RestaurantImage from '@/components/restaurant-image'
import { isOpenNow, isOpenLate, isOpenPastMidnight, opensEarly, isOpenOnWeekend } from '@/lib/hours'
import { STATE_SLUG_TO_CODE, STATE_CODE_TO_NAME } from '@/lib/state-lookups'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import {
  BOWL_META, BOWL_BY_KEY, MOOD_META, MOOD_BY_KEY, PRICE_META,
  FEATURE_META, FEATURE_KEYS, FEATURE_BY_KEY, MISC_FLAG_BY_KEY, matchesPrice,
  type MapPoint, type MatchedChip,
} from '@/lib/ramen-taxonomy'

type SortOption = 'default' | 'name-az' | 'name-za' | 'most-reviews' | 'highest-rated'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Recommended' },
  { value: 'most-reviews', label: 'Most Reviews' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'name-az', label: 'Name (A–Z)' },
  { value: 'name-za', label: 'Name (Z–A)' },
]

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

interface RegionOption {
  cityName: string
  stateName: string
  citySlug: string
  stateSlug: string
  stateCode: string
}

const USA_CENTER = { lat: 39.5, lng: -98.35 } // Continental USA default

// $49.99/month featured-listing checkout — same link used by /claim-your-listing.
const STRIPE_CLAIM_LINK = 'https://buy.stripe.com/3cIfZi96i6cM7My9pIfrW09'

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

// ── Color-coded badges showing which active filter(s) a card matched ────────
function MatchedChips({ chips }: { chips: MatchedChip[] }) {
  if (chips.length === 0) return null
  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {chips.map(c => (
        <span
          key={c.label}
          style={{ backgroundColor: `${c.hex}1a`, color: c.hex, borderColor: `${c.hex}40` }}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold border whitespace-nowrap"
        >
          <span className="leading-none">{c.emoji}</span>{c.label}
        </span>
      ))}
    </div>
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
  const router = useRouter()

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
  const [sortBy, setSortBy] = useState<SortOption>('default')

  // Location toggle — city pages default to a preset (regionBoundary), but the
  // control is editable everywhere: users can type or pick any city/state to
  // restrict results to, and clear it to broaden back out to the full map.
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(
    regionBoundary
      ? { ...regionBoundary, stateCode: STATE_SLUG_TO_CODE[regionBoundary.stateSlug] ?? '' }
      : null
  )
  const [regionQuery, setRegionQuery] = useState('')
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)

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

  function handleSaveSearch() {
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

  // Fetch the city boundary outline whenever the selected region changes
  // (city pages start with one preset; users can pick a different city too).
  // Cached server-side.
  useEffect(() => {
    if (!selectedRegion) { setBoundary(null); return }
    const { cityName, stateName, citySlug, stateSlug } = selectedRegion
    const key = `${citySlug}:${stateSlug}`
    let cancelled = false
    fetch(`/api/city-boundary?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateName)}&key=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d?.geojson) setBoundary(d.geojson) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [selectedRegion])

  // Unique city/state options derived from the already-loaded map dataset —
  // no extra network request needed for the location picker.
  const cityOptions = useMemo(() => {
    const map = new Map<string, RegionOption>()
    for (const r of data) {
      if (!r.citySlug || !r.stateSlug) continue
      const key = `${r.citySlug}|${r.stateSlug}`
      if (!map.has(key)) {
        map.set(key, {
          cityName: r.city,
          stateName: STATE_CODE_TO_NAME[r.stateCode] ?? r.stateCode,
          citySlug: r.citySlug,
          stateSlug: r.stateSlug,
          stateCode: r.stateCode,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => a.cityName.localeCompare(b.cityName))
  }, [data])

  const regionMatches = useMemo(() => {
    const q = regionQuery.trim().toLowerCase()
    if (!q) return cityOptions.slice(0, 50)
    return cityOptions
      .filter(c =>
        c.cityName.toLowerCase().includes(q) ||
        c.stateName.toLowerCase().includes(q) ||
        c.stateCode.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [regionQuery, cityOptions])

  function selectRegion(opt: RegionOption) {
    setSelectedRegion(opt)
    setRegionQuery('')
    setShowRegionDropdown(false)
    // Recenter the map on the chosen city (average of its known listings).
    const matches = data.filter(r => r.citySlug === opt.citySlug && r.stateSlug === opt.stateSlug && r.latitude && r.longitude)
    if (matches.length > 0) {
      const avgLat = matches.reduce((s, r) => s + (r.latitude ?? 0), 0) / matches.length
      const avgLng = matches.reduce((s, r) => s + (r.longitude ?? 0), 0) / matches.length
      setGeocodedCenter({ lat: avgLat, lng: avgLng })
    }
  }

  function clearRegion() {
    setSelectedRegion(null)
    setRegionQuery('')
  }

  // If the current region + filter combination exactly matches a page we
  // already publish (a curated /find/{modifier}-in-{city}-{state} page, or
  // the plain /find/{city}-{state} page when no other filter is active),
  // send the user to that canonical URL instead of only filtering in place.
  useEffect(() => {
    if (!selectedRegion) return
    const cityState = `${selectedRegion.citySlug}-${selectedRegion.stateCode.toLowerCase()}`
    const noOtherFilters = flags.size === 0 && bowls.size === 0 && moods.size === 0 && prices.size === 0 && !localQuery.trim()

    let targetPath: string | null = null

    if (noOtherFilters) {
      targetPath = `/find/${cityState}`
    } else if (moods.size === 0 && prices.size === 0) {
      // Modifiers only ever gate on a single bowl, a single flag, or a
      // query string — never a combination — so only look for a match
      // when the active filters take exactly that shape.
      const match = FIND_MODIFIERS.find(m => {
        const wantBowls = m.filter.initialBowls ?? []
        const wantFlags = m.filter.initialFlags ?? []
        const wantQuery = m.filter.initialQuery ?? ''
        if (wantBowls.length === 0 && wantFlags.length === 0 && !wantQuery) return false
        const bowlsMatch = wantBowls.length === bowls.size && wantBowls.every(b => bowls.has(b))
        const flagsMatch = wantFlags.length === flags.size && wantFlags.every(f => flags.has(f))
        const queryMatch = wantQuery
          ? localQuery.trim().toLowerCase() === wantQuery.toLowerCase()
          : !localQuery.trim()
        return bowlsMatch && flagsMatch && queryMatch
      })
      if (match) targetPath = `/find/${match.prefix}-${cityState}`
    }

    if (targetPath && typeof window !== 'undefined' && targetPath !== window.location.pathname) {
      router.push(targetPath)
    }
  }, [selectedRegion, flags, bowls, moods, prices, localQuery, router])

  function revertSave(slug: string, wasSaved: boolean) {
    setSaves(prev => {
      const next = new Set(prev)
      wasSaved ? next.add(slug) : next.delete(slug)
      return next
    })
  }

  async function handleToggleSave(e: React.MouseEvent, slug: string) {
    e.preventDefault()
    e.stopPropagation()
    const isSaved = saves.has(slug)
    setSaves(prev => {
      const next = new Set(prev)
      isSaved ? next.delete(slug) : next.add(slug)
      return next
    })
    try {
      const res = await fetch('/api/saves', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (res.status === 401) {
        revertSave(slug, isSaved)
        toast('Sign in to save restaurants', {
          description: 'Create a free account to keep a list of your favorite ramen spots.',
          action: {
            label: 'Sign In',
            onClick: () => router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`),
          },
        })
        return
      }
      if (!res.ok) throw new Error('Save failed')
    } catch {
      revertSave(slug, isSaved)
    }
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
        if (selectedRegion && !(r.citySlug === selectedRegion.citySlug && r.stateSlug === selectedRegion.stateSlug)) return false
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
        if (flags.has('korean-style') && !/korean|gochujang|kimchi|doenjang/i.test(r.name)) return false
        if (flags.has('japanese-fusion') && !/fusion/i.test(r.name)) return false
        if (flags.has('halal') && !/halal/i.test(r.name)) return false
        if (flags.has('gluten-free') && !/gluten.free|gluten free/i.test(r.name)) return false
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

      if (sortBy === 'name-az') {
        list.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'name-za') {
        list.sort((a, b) => b.name.localeCompare(a.name))
      } else if (sortBy === 'most-reviews') {
        list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      } else if (sortBy === 'highest-rated') {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      } else if (flags.has('top-rated') && !hasLocation && !zipFilter) {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      } else if (hasLocation || zipFilter) {
        list.sort((a, b) => a.distKm - b.distKm)
      } else {
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      }

      // Featured listings are pinned to the top (stable — keeps prior ordering).
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

      // Tag each result with which active filter(s) it matched, so the card
      // (and the map popup) can show a color-coded chip explaining why it's
      // in the results — e.g. the "vegan" bowl filter shows a green chip.
      const withChips = list.map(r => {
        const matchedChips: MatchedChip[] = []
        for (const b of BOWL_META) {
          if (!bowls.has(b.key)) continue
          const has = (r.bowls ?? []).includes(b.key) || (b.key === 'miso' && /miso/i.test(r.name))
          if (has) matchedChips.push({ label: b.label, emoji: b.emoji, hex: b.hex })
        }
        for (const m of MOOD_META) {
          if (moods.has(m.key) && (r.moods ?? []).includes(m.key)) {
            matchedChips.push({ label: m.label, emoji: m.emoji, hex: m.hex })
          }
        }
        for (const f of flags) {
          const meta = FEATURE_BY_KEY[f] ?? MISC_FLAG_BY_KEY[f]
          if (meta) matchedChips.push({ label: meta.label, emoji: meta.emoji, hex: meta.hex })
        }
        return { ...r, matchedChips }
      })

      return withChips.slice(0, 300)
    } catch {
      return []
    }
  }, [data, distanceOrigin, flags, bowls, moods, prices, localQuery, hasLocation, zipFilter, geocodedCenter, sortBy, selectedRegion])

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
            {/* Location toggle — always visible, not part of the horizontal
                scroll strip (so its dropdown never gets clipped). Editable
                everywhere: pick a preset city or type/choose any other. */}
            {selectedRegion ? (
              <button
                onClick={clearRegion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border bg-[#1E2026] text-white border-[#1E2026] shrink-0"
                title="Remove city filter to see more results"
              >
                <MapPin className="w-3.5 h-3.5" />
                {selectedRegion.cityName}, {selectedRegion.stateCode}
                <X className="w-3 h-3 ml-0.5" />
              </button>
            ) : (
              <div className="relative shrink-0">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B57F50] pointer-events-none" />
                <input
                  type="text"
                  value={regionQuery}
                  onChange={e => { setRegionQuery(e.target.value); setShowRegionDropdown(true) }}
                  onFocus={() => setShowRegionDropdown(true)}
                  onBlur={() => setTimeout(() => setShowRegionDropdown(false), 150)}
                  placeholder="City, State"
                  aria-label="Filter by city and state"
                  className="w-36 sm:w-40 pl-7 pr-2 py-1.5 text-xs font-semibold bg-white border border-black/12 rounded-full outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                />
                {showRegionDropdown && (
                  <div className="absolute z-20 left-0 top-full mt-1 w-64 max-h-64 overflow-y-auto bg-white border border-black/8 rounded-xl shadow-xl">
                    {regionMatches.length === 0 ? (
                      <p className="p-3 text-xs text-[#6B6862]">
                        {dataLoading ? 'Loading cities…' : 'No matching city.'}
                      </p>
                    ) : (
                      regionMatches.map(opt => (
                        <button
                          key={`${opt.citySlug}-${opt.stateSlug}`}
                          type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => selectRegion(opt)}
                          className="block w-full text-left px-3 py-2 text-xs text-[#1E2026] hover:bg-[#F5F4F0] transition-colors"
                        >
                          {opt.cityName}, {opt.stateCode}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
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
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                  showFilters ? 'bg-[#1E2026] text-white border-[#1E2026]' : 'bg-white text-[#1E2026] border-black/12 hover:border-black/30'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                {activeCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">{activeCount}</span>
                )}
              </button>

              {/* Sort dropdown — to the right of Filters */}
              <div className="relative shrink-0">
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B57F50] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort results"
                  className="appearance-none pl-7 pr-6 py-1.5 text-xs font-semibold bg-white border border-black/12 rounded-full outline-none text-[#1E2026] hover:border-black/30 focus:border-[#B57F50] transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

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
                    <Chip key={b.key} active={bowls.has(b.key)} hex={b.hex} emoji={b.emoji} label={b.label} onClick={() => toggleBowl(b.key)} />
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
                    <Chip key={m.key} active={moods.has(m.key)} hex={m.hex} emoji={m.emoji} label={m.label} onClick={() => toggleMood(m.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Utensils className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Cuisine & Dietary</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('ramen-sushi')} emoji="🍣" label="Ramen + Sushi" onClick={() => toggleFlag('ramen-sushi')} />
                  <Chip active={flags.has('fish-ramen')} emoji="🐟" label="Fish Ramen" onClick={() => toggleFlag('fish-ramen')} />
                  <Chip active={flags.has('korean-style')} emoji="🌶" label="Korean-Style" onClick={() => toggleFlag('korean-style')} />
                  <Chip active={flags.has('japanese-fusion')} emoji="🔀" label="Japanese Fusion" onClick={() => toggleFlag('japanese-fusion')} />
                  <Chip active={flags.has('halal')} emoji="☪️" label="Halal-Friendly" onClick={() => toggleFlag('halal')} />
                  <Chip active={flags.has('gluten-free')} emoji="🌾" label="Gluten-Free Options" onClick={() => toggleFlag('gluten-free')} />
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#B57F50]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Hours &amp; Quality</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('open-now')} emoji="🟢" label="Open Now" onClick={() => toggleFlag('open-now')} />
                  <Chip active={flags.has('open-late')} emoji="🌙" label="Open Late (10pm+)" onClick={() => toggleFlag('open-late')} />
                  <Chip active={flags.has('open-midnight')} emoji="🌃" label="Past Midnight" onClick={() => toggleFlag('open-midnight')} />
                  <Chip active={flags.has('open-early')} emoji="☕" label="Open Early" onClick={() => toggleFlag('open-early')} />
                  <Chip active={flags.has('open-weekends')} emoji="📆" label="Open Weekends" onClick={() => toggleFlag('open-weekends')} />
                  <Chip active={flags.has('top-rated')} emoji="⭐" label="Top Rated" onClick={() => toggleFlag('top-rated')} />
                  <Chip active={flags.has('hidden-gems')} emoji="💎" label="Hidden Gems" onClick={() => toggleFlag('hidden-gems')} />
                  <Chip active={flags.has('new-ramen')} emoji="🆕" label="New Spots" onClick={() => toggleFlag('new-ramen')} />
                </div>
              </section>

              <section className="py-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#B57F50] text-xs font-bold w-3.5 text-center">$</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">Price</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_META.map(p => (
                    <Chip key={p.key} active={prices.has(p.key)} label={p.label} onClick={() => togglePrice(p.key)} />
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
                    <Chip key={f.key} active={flags.has(f.key)} hex={f.hex} emoji={f.emoji} label={f.label} onClick={() => toggleFlag(f.key)} />
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
                  {(activeCount > 0 || selectedRegion) && <span className="text-[#6B6862] font-normal"> (filtered)</span>}
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
                <p className="text-[#6B6862] text-xs">
                  {selectedRegion
                    ? `Try removing the ${selectedRegion.cityName} filter to see more results, or clear your other filters.`
                    : 'Try clearing your filters or searching a different ZIP.'}
                </p>
                <div className="flex items-center gap-3">
                  {selectedRegion && (
                    <button onClick={clearRegion} className="text-xs text-[#B57F50] font-medium">
                      Remove {selectedRegion.cityName} filter →
                    </button>
                  )}
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-[#B57F50] font-medium">Clear all filters →</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {displayList.map((r, i) => {
                  // Some duplicate DB rows share an identical slug within the
                  // same city (e.g. two distinct "Lifting Noodles Ramen"
                  // locations in Atlanta) — fold in zip/lat/lng/index so the
                  // React key never collides and sorting stays stable.
                  const uid = `${r.citySlug}-${r.stateSlug}-${r.slug}-${r.zip || `${r.latitude},${r.longitude}`}-${i}`
                  const active = r.slug === selectedSlug
                  const showDist = hasLocation
                  const isSupp = !!r.googleMapsUrl
                  // Every DB restaurant has its own internal listing page;
                  // only Google Places supplement listings (isSupp) don't, so
                  // those keep linking out to Google Maps.
                  const hasInternalPage = !isSupp
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
                      {hasInternalPage ? (
                        <div
                          role="link"
                          tabIndex={0}
                          onClick={() => router.push(internalUrl)}
                          onKeyDown={(e) => { if (e.key === 'Enter') router.push(internalUrl) }}
                          className={`flex gap-3 pr-10 cursor-pointer ${r.featured ? 'p-4 pb-2' : 'p-3 pb-1.5'}`}
                        >
                          <div className={`relative rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0 ${r.featured ? 'w-20 h-20' : 'w-14 h-14'}`}>
                            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes={r.featured ? '80px' : '56px'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {r.featured && (
                              <span className="inline-flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f5b301] to-[#d4880b] text-white text-[9px] font-bold uppercase tracking-wide shadow-sm">
                                👑 #1 Featured
                              </span>
                            )}
                            <p className={`font-semibold truncate ${r.featured ? 'text-base' : 'text-sm'} ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
                            <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {r.rating && (
                                r.reviewSlug ? (
                                  <Link
                                    href={`/reviews/${r.reviewSlug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-0.5 text-xs text-[#1E2026]/60 hover:text-[#B57F50] hover:underline"
                                  >
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
                                  </Link>
                                ) : (
                                  <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
                                  </span>
                                )
                              )}
                              {r.priceRange && <span className="text-xs text-[#1E2026]/40">{r.priceRange}</span>}
                              {isOpenNow(r.hours) && <span className="text-emerald-600 text-xs font-medium">Open</span>}
                              {showDist && r.distKm > 0 && <span className="text-[#B57F50] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>}
                            </div>
                            <MatchedChips chips={r.matchedChips} />
                          </div>
                        </div>
                      ) : (
                        <a
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex gap-3 pr-10 ${r.featured ? 'p-4 pb-2' : 'p-3 pb-1.5'}`}
                        >
                          <div className={`relative rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0 ${r.featured ? 'w-20 h-20' : 'w-14 h-14'}`}>
                            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes={r.featured ? '80px' : '56px'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {r.featured && (
                              <span className="inline-flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f5b301] to-[#d4880b] text-white text-[9px] font-bold uppercase tracking-wide shadow-sm">
                                👑 #1 Featured
                              </span>
                            )}
                            <p className={`font-semibold truncate ${r.featured ? 'text-base' : 'text-sm'} ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>{r.name}</p>
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
                            <MatchedChips chips={r.matchedChips} />
                          </div>
                        </a>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-1.5 px-3 pb-2.5 pt-1">
                        {hasInternalPage ? (
                          <Link
                            href={internalUrl}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                          >
                            View Menu
                          </Link>
                        ) : (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
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
                        {hasInternalPage ? (
                          <Link
                            href={internalUrl}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
                          >
                            View Details
                          </Link>
                        ) : (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
                          >
                            Order Now
                          </a>
                        )}
                        <a
                          href={STRIPE_CLAIM_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#6B6862] hover:border-[#B57F50] hover:text-[#B57F50] transition-colors whitespace-nowrap"
                        >
                          Own This Business?
                        </a>
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
                onClick={requestLocation}
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
