'use client'

import { useState, useEffect, useMemo, useCallback, useRef, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  MapPin, Star, Navigation, Loader2, Utensils, ChevronRight,
  X, Search, Sparkles, Clock, SlidersHorizontal, Heart, Bookmark,
  List, Map as MapIcon, HelpCircle, ArrowUpDown, BadgeCheck,
} from 'lucide-react'
import type { MapBounds } from '@/components/ramen-map'
import RestaurantImage from '@/components/restaurant-image'
import { isOpenNow, isOpenLate, isOpenPastMidnight, opensEarly, isOpenOnWeekend, getOpenStatus } from '@/lib/hours'
import { useCurrentUser } from '@/lib/use-current-user'
import { useModalA11y } from '@/lib/use-modal-a11y'
import LoginGateModal from '@/components/login-gate-modal'
import AdUnitHorizontal from '@/components/ad-unit-horizontal'
import InquireButton from '@/components/inquire-button'
import ShareButton from '@/components/share-button'
import { STATE_SLUG_TO_CODE, STATE_CODE_TO_NAME } from '@/lib/state-lookups'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import {
  BOWL_META, BOWL_BY_KEY, MOOD_META, MOOD_BY_KEY, PRICE_META,
  FEATURE_META, FEATURE_KEYS, FEATURE_BY_KEY, MISC_FLAG_BY_KEY, matchesPrice,
  mapPointReviewSlug, mapPointMapsUrl, mapPointHref, priceRangeLabel,
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

// Data-driven (rather than hand-repeated Chip elements) so both rendering
// and the per-section active-filter counts in the filter panel share one
// source of truth.
const CUISINE_DIETARY_META = [
  { key: 'pho', emoji: '🍲', label: 'Pho' },
  { key: 'ramen-sushi', emoji: '🍣', label: 'Ramen + Sushi' },
  { key: 'sushi', emoji: '🍣', label: 'Sushi' },
  { key: 'lo-mein', emoji: '🍝', label: 'Lo Mein' },
  { key: 'fish-ramen', emoji: '🐟', label: 'Fish Ramen' },
  { key: 'korean-style', emoji: '🌶', label: 'Korean-Style' },
  { key: 'japanese-fusion', emoji: '🔀', label: 'Japanese Fusion' },
  { key: 'halal', emoji: '☪️', label: 'Halal-Friendly' },
  { key: 'gluten-free', emoji: '🌾', label: 'Gluten-Free Options' },
]
const HOURS_QUALITY_META = [
  { key: 'open-now', emoji: '🟢', label: 'Open Now' },
  { key: 'open-late', emoji: '🌙', label: 'Open Late (10pm+)' },
  { key: 'open-midnight', emoji: '🌃', label: 'Past Midnight' },
  { key: 'open-early', emoji: '☕', label: 'Open Early' },
  { key: 'open-weekends', emoji: '📆', label: 'Open Weekends' },
  { key: 'top-rated', emoji: '⭐', label: 'Top Rated' },
  { key: 'hidden-gems', emoji: '💎', label: 'Hidden Gems' },
  { key: 'new-ramen', emoji: '🆕', label: 'New Spots' },
]

const RamenMap = dynamic(() => import('@/components/ramen-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
    </div>
  ),
})

function kmToMiles(km: number) { return km * 0.621371 }

// Directions that start from the visitor's own location whenever we know
// it, so "Get Directions" from the map pin doesn't force them to re-enter
// an origin Google Maps could already infer.
function buildDirectionsUrl(r: MapPoint, userPos: { lat: number; lng: number } | null) {
  const destination = encodeURIComponent(`${r.name} ${r.city}, ${r.stateCode}`)
  if (userPos) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${destination}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${destination}`
}

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
  // Whole-state pages (e.g. /north-carolina) filter by state only and draw
  // the state's outline instead of one city's — cityName holds the state
  // name in that case and citySlug is unused.
  isState?: boolean
}

const USA_CENTER = { lat: 39.5, lng: -98.35 } // Continental USA default

// Reverse-geocoding (Nominatim) returns a full state name — map it back to the
// 2-letter code used everywhere else on the site.
const STATE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_NAME).map(([code, name]) => [name, code])
)

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

// ── Filter-panel section header with an active-count badge, so a visitor can
//    tell at a glance which categories already have filters applied without
//    reading every chip. ──────────────────────────────────────────────────
function FilterSectionHeading({
  icon, label, count,
}: { icon: ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">{label}</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">{count}</span>
      )}
    </div>
  )
}

// ── Open / closing-soon / closed tag for the listing cards ──────────────────
function OpenStatusTag({ hours }: { hours: Record<string, string[]> | null | undefined }) {
  const s = getOpenStatus(hours)
  if (!s) return null
  if (s.status === 'closed') {
    return <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-semibold">Closed</span>
  }
  if (s.status === 'closing-soon') {
    return (
      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold">
        Closes soon · {s.closesAt}
      </span>
    )
  }
  return <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Open</span>
}

// ── Color-coded badges showing which active filter(s) a card matched ────────
function MatchedChips({ chips }: { chips?: MatchedChip[] }) {
  if (!chips || chips.length === 0) return null
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

// The listing's OWN callouts (its bowls + amenities), independent of any
// active filter — so the map detail card always describes the place even
// when no filters are set. Any chips it already matched an active filter on
// are listed first so they still stand out.
function listingChips(r: MapPoint & { matchedChips?: MatchedChip[] }): MatchedChip[] {
  const seen = new Set<string>()
  const out: MatchedChip[] = []
  const push = (m?: { label: string; emoji: string; hex: string }) => {
    if (m && !seen.has(m.label)) { seen.add(m.label); out.push({ label: m.label, emoji: m.emoji, hex: m.hex }) }
  }
  for (const c of r.matchedChips ?? []) push(c)
  for (const b of r.bowls ?? []) push(BOWL_BY_KEY[b])
  for (const a of r.amenities ?? []) push(FEATURE_BY_KEY[a])
  for (const m of r.moods ?? []) push(MOOD_BY_KEY[m])
  return out.slice(0, 6)
}

// Google-style $ / $$ / $$$ / $$$$ scale — the restaurant's tier is dark,
// the rest of the scale is dimmed, so it reads as a range at a glance.
function PriceScale({ priceRange }: { priceRange: string }) {
  const level = Math.min(Math.max((priceRange.match(/\$/g) || []).length, 1), 4)
  return (
    <span className="inline-flex items-center text-sm font-semibold" aria-label={`Price level ${level} of 4`}>
      {[1, 2, 3, 4].map(i => (
        <span key={i} className={i <= level ? 'text-[#1E2026]' : 'text-[#1E2026]/25'}>$</span>
      ))}
    </span>
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
  regionBoundary?: { cityName: string; stateName: string; citySlug: string; stateSlug: string; isState?: boolean }
  // Hard radius cutoff (e.g. "ramen near me within 5 mi" pages) — only takes
  // effect once the visitor's location is known (geolocation or ZIP search).
  maxDistanceMiles?: number
  // Play the one-time entrance reveal when the map first paints (veil
  // dissolve + tile fade + pin bloom). Opt-in, and only used on the homepage:
  // on /find pages visitors often arrive repeatedly from search, where a
  // recurring intro would wear out fast.
  introAnimation?: boolean
  // Full-screen map-only layout: the map fills the viewport below the navbar
  // with the controls floating on top and no left-hand list panel. Defaults on
  // (homepage + all /find pages); state pages opt out to keep the list layout.
  mapOnly?: boolean
}

export default function HomeMapHero({
  initialFlags = [],
  initialBowls = [],
  initialMoods = [],
  initialPrices = [],
  initialCenter,
  initialQuery = '',
  pageTitle = 'Find Ramen Near Me | Ramen Map',
  pageDescription = 'Search the map by bowl, mood, price, and hours — then find your best bowl right now.',
  regionBoundary,
  maxDistanceMiles,
  mapOnly = true,
  introAnimation = false,
}: HomeMapHeroProps) {
  const router = useRouter()
  const pathname = usePathname()

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
  const [adDismissed, setAdDismissed] = useState(false)
  const [zipFilter, setZipFilter] = useState('')
  // Defaults to highest-rated so listings (numbered in the list panel) lead
  // with top-rated businesses — easiest for owners/visitors to find who's on
  // top. But that default must yield to distance once the visitor's exact
  // location is known (sortTouched tracks whether they explicitly picked a
  // sort themselves) — otherwise "highest rated nationwide" would silently
  // override "nearby spots" the moment geolocation resolves.
  const [sortBy, setSortBy] = useState<SortOption>('highest-rated')
  const [sortTouched, setSortTouched] = useState(false)

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

  // Escape closes the "Choose area" popover, same as any other dismissible overlay.
  useEffect(() => {
    if (!showRegionDropdown) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowRegionDropdown(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showRegionDropdown])

  // Auto-detected location (reverse-geocoded from the browser's geolocation)
  // shown as the pulsing-dot "Roswell, GA · Choose area" pill when no explicit
  // city has been picked. Informational + drives distance sort (via userPos)
  // rather than a hard city filter — "Choose area" still opens the full
  // city/ZIP picker for an exact filter.
  const [detectedArea, setDetectedArea] = useState<{ cityName: string; stateCode: string } | null>(null)

  const [searchSaved, setSearchSaved] = useState(false)

  const [saves, setSaves] = useState<Set<string>>(new Set())

  // Directions/Save/Claim on each card require login — logged-out clicks
  // open this modal instead of following the link.
  const { user, authChecked } = useCurrentUser()
  const [gateOpen, setGateOpen] = useState(false)
  function requireAuth(e: React.MouseEvent): boolean {
    if (!authChecked || !user) {
      e.preventDefault()
      if (authChecked) setGateOpen(true)
      return false
    }
    return true
  }

  // City boundary outline (Zillow-style) — fetched once for city pages.
  const [boundary, setBoundary] = useState<unknown | null>(null)

  const [helpOpen, setHelpOpen] = useState(false)
  const helpPanelRef = useModalA11y(helpOpen, () => setHelpOpen(false))

  // Mount the Leaflet map after hydration. On mobile the map renders full-screen
  // (the list is an absolute overlay on top of it, so the map container always
  // has height) — this avoids the old crash from initialising Leaflet in a
  // zero-height container while still giving mobile users the map by default.
  const [showMap, setShowMap] = useState(false)
  useEffect(() => { setShowMap(true) }, [])
  const rafRef = useRef<number | null>(null)

  // One-time entrance reveal, in two phases (see globals.css). We arm first —
  // map hidden behind an opaque cream veil — let Leaflet do its heavy
  // synchronous marker build underneath, and only start the animation once the
  // browser has actually painted a frame. Firing it immediately meant the
  // ~1.8s main-thread block from marker creation swallowed the whole thing.
  // Torn down at the end so the pin bloom can't replay on every filter change.
  const mapReady = showMap && !dataLoading
  const [introPhase, setIntroPhase] = useState<'armed' | 'playing' | null>(null)
  const introStarted = useRef(false)
  useEffect(() => {
    if (!introAnimation || !mapReady || introStarted.current) return
    introStarted.current = true
    setIntroPhase('armed')

    let playTimer: ReturnType<typeof setTimeout>
    let endTimer: ReturnType<typeof setTimeout>
    // Two frames, so we're past the commit that mounts the markers, plus a
    // short settle for the marker build itself to finish.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        playTimer = setTimeout(() => {
          setIntroPhase('playing')
          endTimer = setTimeout(() => setIntroPhase(null), 1300)
        }, 120)
      })
      rafRef.current = raf2
    })
    rafRef.current = raf1
    return () => {
      cancelAnimationFrame(raf1)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(playTimer)
      clearTimeout(endTimer)
    }
  }, [introAnimation, mapReady])

  // Mobile-only view toggle: full-screen map (default) ⇄ list overlay. Ignored
  // on sm+ where the list sidebar and map are shown side by side.
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  // Map vs. list view for the stacked (mapOnly) layout. Map is the default —
  // list swaps the map + carousel for a 3-column grid of result cards.
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const listView = mapOnly && viewMode === 'list'

  const [visibleBounds, setVisibleBounds] = useState<MapBounds | null>(null)
  const [mapDragCenter, setMapDragCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [showSearchAreaBtn, setShowSearchAreaBtn] = useState(false)
  const [searchingArea, setSearchingArea] = useState(false)
  // "Update results as I move the map" — when on, the list is filtered to the
  // map's current viewport (Google-Maps style) instead of requiring a tap on
  // the "Search this area" button.
  const [updateOnMapMove, setUpdateOnMapMove] = useState(false)

  function handleSaveSearch(e: React.MouseEvent) {
    if (!requireAuth(e)) return
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

  // Fetch the city (or, for whole-state pages, state) boundary outline
  // whenever the selected region changes. Cached server-side either way.
  useEffect(() => {
    if (!selectedRegion) { setBoundary(null); return }
    const { cityName, stateName, citySlug, stateSlug, isState } = selectedRegion
    let cancelled = false
    const url = isState
      ? `/api/state-boundary?state=${encodeURIComponent(stateName)}&key=${encodeURIComponent(stateSlug)}`
      : `/api/city-boundary?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateName)}&key=${encodeURIComponent(`${citySlug}:${stateSlug}`)}`
    fetch(url)
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

  // Legacy `/searchmap?city=&state=&q=&zip=` links (quiz results, broth-city
  // pages, city directories, search page) redirect here — apply them once the
  // city dataset is loaded so those links actually filter instead of landing
  // on a generic nationwide map. Read directly from the URL (not the
  // App Router's useSearchParams hook) so this client component doesn't force
  // every one of the 70+ pages that render it to add a Suspense boundary.
  const appliedUrlParams = useRef(false)
  useEffect(() => {
    if (appliedUrlParams.current || dataLoading || typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const cityParam = params.get('city')
    const stateParam = params.get('state')
    const qParam = params.get('q')
    const zipParam = params.get('zip')
    if (!cityParam && !stateParam && !qParam && !zipParam) return
    appliedUrlParams.current = true

    if (cityParam && stateParam) {
      const match = cityOptions.find(c => c.citySlug === cityParam && c.stateSlug === stateParam)
      if (match) selectRegion(match)
    }
    if (qParam) setLocalQuery(qParam)
    if (zipParam && /^\d{5}$/.test(zipParam)) {
      setLocationSearch(zipParam)
      geocodeLocation(zipParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoading, cityOptions])

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
    if (!selectedRegion || selectedRegion.isState) return
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
    if (!requireAuth(e)) return
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
        setGateOpen(true)
        return
      }
      if (!res.ok) throw new Error('Save failed')
    } catch {
      revertSave(slug, isSaved)
    }
  }

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

  // Auto-detect the visitor's location on load (silently — the browser's own
  // permission prompt is the only interruption) so the top bar can show
  // "Roswell, GA · Choose area" instead of making everyone type a city or ZIP
  // first.
  //
  // Two deliberate exceptions:
  //  - regionBoundary pages already have a fixed city (e.g. a broth-in-{city}
  //    SEO page), so they shouldn't recenter on the visitor's GPS.
  //  - The homepage does NOT auto-locate. Landing visitors pick their own area
  //    ("Choose area", or the "Use my location" button on the map) so the first
  //    move on the page is theirs rather than something done for them.
  useEffect(() => {
    if (regionBoundary) return
    if (pathname === '/') return
    requestLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reverse-geocode the detected (or ZIP-searched) position into a "City, ST"
  // label for the pill. Failure is silent — "Choose area" still works either way.
  useEffect(() => {
    if (!userPos) return
    let cancelled = false
    ;(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userPos.lat}&lon=${userPos.lng}&zoom=10&addressdetails=1`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const json = await res.json()
        const addr = json?.address ?? {}
        const cityName: string = addr.city || addr.town || addr.village || addr.hamlet || addr.county || ''
        const stateCode = STATE_NAME_TO_CODE[addr.state ?? ''] ?? ''
        if (!cancelled && cityName && stateCode) setDetectedArea({ cityName, stateCode })
      } catch {
        // Silent — pill just shows the pin icon instead of a resolved label.
      }
    })()
    return () => { cancelled = true }
  }, [userPos])

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
        // "Update results as I move the map" — keep only spots inside the
        // current viewport. Runs first so it composes with every other filter.
        if (updateOnMapMove && visibleBounds && r.latitude != null && r.longitude != null) {
          if (
            r.latitude < visibleBounds.south || r.latitude > visibleBounds.north ||
            r.longitude < visibleBounds.west || r.longitude > visibleBounds.east
          ) return false
        }
        if (selectedRegion) {
          if (selectedRegion.isState) {
            if (r.stateSlug !== selectedRegion.stateSlug) return false
          } else if (!(r.citySlug === selectedRegion.citySlug && r.stateSlug === selectedRegion.stateSlug)) {
            return false
          }
        }
        if (flags.has('open-now') && !isOpenNow(r.hours)) return false
        if (flags.has('open-late') && !isOpenLate(r.hours, 22 * 60)) return false
        if (flags.has('open-midnight') && !isOpenPastMidnight(r.hours)) return false
        if (flags.has('top-rated') && ((r.rating ?? 0) < 4.3 || r.reviewCount < 20)) return false
        if (flags.has('hidden-gems') && !((r.rating ?? 0) >= 4.5 && r.reviewCount < 100)) return false
        if (flags.has('open-early') && !opensEarly(r.hours)) return false
        if (flags.has('open-weekends') && !isOpenOnWeekend(r.hours)) return false
        if (flags.has('verified') && !r.claimed) return false
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
        // Regional Japanese ramen styles — the slim payload only carries the
        // name, so match shops whose name signals the specific style.
        if (flags.has('muroran-curry') && !/muroran|curry/i.test(r.name)) return false
        if (flags.has('kagoshima') && !/kagoshima/i.test(r.name)) return false
        if (flags.has('hakata') && !/hakata/i.test(r.name)) return false
        if (flags.has('champon') && !/champon/i.test(r.name)) return false
        // "Pho" — Vietnamese pho listings, flagged explicitly in the data
        // rather than guessed from the name.
        if (flags.has('pho') && !r.pho) return false
        // "Sushi" — sushi bars and Japanese spots likely to serve sushi.
        if (flags.has('sushi') && !/sushi|sashimi|nigiri|omakase/i.test(r.name)) return false
        // "Lo Mein" — Chinese restaurants/noodle houses likely to serve lo mein.
        if (flags.has('lo-mein') && !/lo.?mein|chow mein|chinese|\bwok\b/i.test(r.name)) return false
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

      // Hard radius cutoff ("ramen near me within N mi" pages) — only once
      // the visitor's location is actually known (geolocation or ZIP).
      if (maxDistanceMiles != null && hasLocation) {
        list = list.filter(r => kmToMiles(r.distKm) <= maxDistanceMiles)
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
      } else if (sortBy === 'highest-rated' && sortTouched) {
        // Only honor the "Highest Rated" default as an explicit sort once the
        // visitor actually picked it themselves — otherwise it silently beats
        // out distance below the moment geolocation/ZIP resolves.
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
  }, [data, distanceOrigin, flags, bowls, moods, prices, localQuery, hasLocation, zipFilter, geocodedCenter, sortBy, sortTouched, selectedRegion, maxDistanceMiles, updateOnMapMove, visibleBounds])

  const mapRestaurants = useMemo(() => displayList.slice(0, 300), [displayList])

  // Themed discovery shelves under the map (map view only) — Google-Maps /
  // Netflix style rows. These are deliberately independent of the active
  // filters (they're for browsing, not refining) but they DO respect the
  // chosen area: a picked city/state scopes them, otherwise they cover
  // everything within 25 miles (~40.2 km) of the visitor's resolved location.
  const shelves = useMemo(() => {
    const pool = data
      .map(r => ({
        ...r,
        distKm: r.latitude != null && r.longitude != null
          ? haversineKm(distanceOrigin.lat, distanceOrigin.lng, r.latitude, r.longitude)
          : Infinity,
      }))
      .filter(r => {
        if (selectedRegion) {
          return selectedRegion.isState
            ? r.stateSlug === selectedRegion.stateSlug
            : r.citySlug === selectedRegion.citySlug && r.stateSlug === selectedRegion.stateSlug
        }
        return r.distKm <= 40.2336
      })

    const byRating = (a: typeof pool[number], b: typeof pool[number]) =>
      (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
    const take = (list: typeof pool) => list.slice(0, 15)

    const defs: { key: string; title: string; subtitle: string; items: typeof pool }[] = [
      {
        key: 'open-now',
        title: 'Open Now',
        subtitle: 'Serving right this minute',
        items: take(pool.filter(r => isOpenNow(r.hours)).sort(byRating)),
      },
      {
        key: 'top-rated',
        title: 'Top Rated',
        subtitle: '4.5+ stars with real review volume',
        items: take(pool.filter(r => (r.rating ?? 0) >= 4.5 && r.reviewCount >= 50).sort(byRating)),
      },
      {
        key: 'new-spots',
        title: 'New Spots',
        subtitle: 'Recently opened, still building a following',
        items: take(
          pool
            .filter(r => (r.reviewCount ?? 0) > 0 && (r.reviewCount ?? 0) <= 75)
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.reviewCount - b.reviewCount)
        ),
      },
      {
        key: 'upscale',
        title: 'Upscale',
        subtitle: 'Higher-end bowls worth dressing up for',
        items: take(pool.filter(r => r.priceRange === '$$$' || r.priceRange === '$$$$').sort(byRating)),
      },
      {
        key: 'cheap',
        title: 'Cheap Eats',
        subtitle: 'Great ramen under about $10',
        items: take(pool.filter(r => r.priceRange === '$').sort(byRating)),
      },
    ]

    // Only surface a shelf with enough entries to be worth scrolling.
    return defs.filter(s => s.items.length >= 3)
  }, [data, distanceOrigin, selectedRegion])

  // The pin the visitor last clicked on the map — drives the floating detail
  // card in mapOnly layouts (no list panel to show this info alongside).
  const selectedRestaurant = useMemo(
    () => mapRestaurants.find(r => r.slug === selectedSlug) ?? null,
    [mapRestaurants, selectedSlug]
  )

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
    document.getElementById(`home-card-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const handleMapCenter = useCallback((center: { lat: number; lng: number }) => {
    setMapDragCenter(center)
    // When auto-update is on, results already follow the map — no manual
    // "Search this area" prompt needed.
    if (!updateOnMapMove) setShowSearchAreaBtn(true)
  }, [updateOnMapMove])

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

  // One card renderer for every surface — the main results list, the themed
  // shelves below the map, and the classic sidebar row — so a change to the
  // callouts or CTAs can't drift between them.
  //   'carousel' = fixed-width card in a horizontal strip
  //   'grid'     = full-width card in the 3-column list view
  //   'row'      = photo-left row for the narrow /[city] sidebar
  // The themed shelves reuse this renderer but don't compute matchedChips
  // (those explain the active filters, which the shelves deliberately ignore).
  type ResultItem = Omit<(typeof displayList)[number], 'matchedChips'> & { matchedChips?: MatchedChip[] }
  function renderResultCard(r: ResultItem, i: number, layout: 'carousel' | 'grid' | 'row', keyPrefix = '') {
    // Some duplicate DB rows share an identical slug within the
    // same city (e.g. two distinct "Lifting Noodles Ramen"
    // locations in Atlanta) — fold in zip/lat/lng/index so the
    // React key never collides and sorting stays stable.
    const uid = `${keyPrefix}${r.citySlug}-${r.stateSlug}-${r.slug}-${r.zip || `${r.latitude},${r.longitude}`}-${i}`
    const active = r.slug === selectedSlug
    const showDist = hasLocation
    const isSupp = !!r.supp
    // Every restaurant — DB or Google Places supplement — has its
    // own internal listing page (both render through
    // RestaurantListingPage at the same /{city}/{state}/{slug}
    // URL), so cards always link internally. isSupp still gates
    // the Save button below (saves are keyed to DB slugs only).
    const internalUrl = mapPointHref(r)
    const rSlugReview = mapPointReviewSlug(r)
    // Order Online / Reserve A Table both send the visitor to the restaurant's
    // own site. Roughly 14% of DB listings — and every Google Places supplement,
    // which has no website field in the scraped data at all — have no URL on
    // file; those fall back to the restaurant's Google Maps listing, which
    // carries their real site and order/reserve links. Never an internal page:
    // an "Order Online" click should always leave for the restaurant.
    const websiteHref = r.website
      ? (/^https?:\/\//i.test(r.website) ? r.website : `https://${r.website}`)
      : mapPointMapsUrl(r)

    const open = () => router.push(internalUrl)

    // ── Shared pieces, so the carousel card and the sidebar row
    //    always carry the same callouts and CTAs ──
    const featuredBadge = r.featured ? (
      <span className="inline-flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f5b301] to-[#d4880b] text-white text-[9px] font-bold uppercase tracking-wide shadow-sm">
        👑 #1 Featured
      </span>
    ) : null

    const titleRow = (
      <p className={`flex items-center gap-1 font-semibold truncate ${r.featured ? 'text-base' : 'text-sm'} ${active ? 'text-[#c8934f]' : 'text-[#1E2026]'}`}>
        <span className="truncate">{r.name}</span>
        {r.claimed && !r.featured && <BadgeCheck className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />}
      </p>
    )

    const metaRow = (
      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
        {r.rating && (
          rSlugReview ? (
            <Link
              href={`/reviews/${rSlugReview}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 text-xs text-[#1E2026]/60 hover:text-[#96602F] hover:underline"
            >
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
            </Link>
          ) : (
            <span className="flex items-center gap-0.5 text-xs text-[#1E2026]/60">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
            </span>
          )
        )}
        {priceRangeLabel(r.priceRange) && <span className="text-xs text-[#1E2026]/60">{priceRangeLabel(r.priceRange)}</span>}
        <OpenStatusTag hours={r.hours} />
        {showDist && r.distKm > 0 && <span className="text-[#96602F] text-xs font-medium">{kmToMiles(r.distKm).toFixed(1)} mi</span>}
      </div>
    )

    const serviceLine = (
      <p className="text-[#1E2026]/50 text-xs mt-0.5 truncate">
        Dine-in{r.amenities?.includes('delivers') ? ' · Delivery' : ''}
      </p>
    )

    const ctaRow = (
      <div className="flex flex-wrap gap-1.5">
        <a
          href={websiteHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-[#B57F50] text-white border border-[#B57F50] hover:bg-[#c8934f] transition-colors whitespace-nowrap"
        >
          Order Online
        </a>
        <a
          href={websiteHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border border-black/12 text-[#1E2026] hover:border-[#B57F50] hover:text-[#96602F] transition-colors whitespace-nowrap"
        >
          Reserve A Table
        </a>
      </div>
    )

    const saveBtn = !isSupp ? (
      <button
        onClick={(e) => handleToggleSave(e, r.slug)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm border border-black/8 hover:border-[#B57F50]/40 transition-colors"
        aria-label={saves.has(r.slug) ? 'Unsave restaurant' : 'Save restaurant'}
      >
        <Heart className={`w-3.5 h-3.5 transition-colors ${saves.has(r.slug) ? 'fill-[#B57F50] text-[#96602F]' : 'text-[#6B6862]'}`} />
      </button>
    ) : null

    // ── mapOnly: horizontal carousel card (photo on top) ──
    if (layout !== 'row') {
      return (
        <div
          key={uid}
          id={`home-card-${r.slug}`}
          onMouseEnter={() => setHoveredSlug(r.slug)}
          onMouseLeave={() => setHoveredSlug(null)}
          className={`relative flex flex-col rounded-xl overflow-hidden border transition-colors ${
            layout === 'grid' ? 'w-full' : 'shrink-0 w-56 snap-start'
          } ${
            r.featured
              ? 'border-[#f5b301] bg-amber-50/60'
              : active
                ? 'border-[#B57F50] bg-[#B57F50]/10'
                : 'border-black/8 bg-white hover:border-[#B57F50]/40'
          }`}
        >
          <div
            role="link"
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => { if (e.key === 'Enter') open() }}
            className="cursor-pointer"
          >
            <div className={`relative w-full bg-[#F5F4F0] ${layout === 'grid' ? 'h-44' : 'h-28'}`}>
              <RestaurantImage
                src={r.photo}
                alt={r.name}
                fill
                className="object-cover"
                sizes={layout === 'grid' ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : '224px'}
              />
              <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#96602F] font-bold text-[11px] tabular-nums">
                {i + 1}
              </span>
            </div>
            <div className="px-2.5 pt-2">
              {featuredBadge}
              {titleRow}
              <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
              {metaRow}
              {serviceLine}
              <MatchedChips chips={r.matchedChips} />
            </div>
          </div>
          <div className="px-2.5 pb-2.5 pt-2 mt-auto">{ctaRow}</div>
          {saveBtn}
        </div>
      )
    }

    // ── classic sidebar: vertical row (photo on the left) ──
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
        <div
          role="link"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => { if (e.key === 'Enter') open() }}
          className={`flex gap-3 pr-10 cursor-pointer ${r.featured ? 'p-4 pb-2' : 'p-3 pb-1.5'}`}
        >
          <span className="self-center shrink-0 w-5 text-center text-[#96602F] font-bold text-sm tabular-nums">
            {i + 1}
          </span>
          <div className={`relative rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0 ${r.featured ? 'w-20 h-20' : 'w-14 h-14'}`}>
            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes={r.featured ? '80px' : '56px'} />
          </div>
          <div className="flex-1 min-w-0">
            {featuredBadge}
            {titleRow}
            <p className="text-[#6B6862] text-xs truncate">{r.city}, {r.stateCode}</p>
            {metaRow}
            {serviceLine}
            <MatchedChips chips={r.matchedChips} />
          </div>
        </div>
        <div className="px-3 pb-2.5 pt-1">{ctaRow}</div>
        {saveBtn}
      </div>
    )
  }

  return (
    <section
      data-intro={introPhase ?? undefined}
      className={mapOnly ? 'pt-16 bg-[#F5F4F0] relative' : 'pt-16 bg-[#F5F4F0]'}
    >
      {/* SEO heading + intro — kept in the DOM for SEO; visually hidden in the
          full-screen map-only layout so the map owns the whole viewport. */}
      <div className={mapOnly ? 'sr-only' : 'max-w-7xl mx-auto px-4 sm:px-6 pt-2.5 sm:pt-5 pb-2 sm:pb-3'}>
        <h1 className="font-serif text-lg sm:text-3xl font-bold text-[#1E2026] truncate sm:overflow-visible sm:whitespace-normal">
          {pageTitle}
        </h1>
        <p className="hidden sm:block text-[#6B6862] text-sm mt-1">
          {pageDescription}
        </p>
      </div>

      {/* Controls wrapper — floats over the top of the map in mapOnly mode.
          In list view there's no map to float over, so it sits in flow. */}
      <div className={`${mapOnly && !listView
        ? 'absolute top-[4.25rem] inset-x-0 z-[1200] px-2 sm:px-4 flex flex-col items-stretch sm:items-center gap-2 pointer-events-none'
        : listView ? 'px-2 sm:px-4 pt-3 flex flex-col items-stretch sm:items-center gap-2' : ''}${
          introPhase ? ' map-chrome-reveal' : ''}`}>

      {/* Top filter bar — one horizontally scrollable pill strip on mobile
          (AllTrails-style); on sm+ the location/help/save controls stay pinned
          with only the middle section scrolling. */}
      <div className={mapOnly ? 'bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-black/10 pointer-events-auto w-full sm:w-auto sm:max-w-4xl' : 'border-t border-black/8 bg-white'}>
        <div className={mapOnly ? 'px-3 sm:px-4 py-2.5' : 'max-w-7xl mx-auto px-4 sm:px-6 py-2.5'}>
          <div
            // `overflow-x-auto` clips vertical overflow too (per the CSS spec,
            // a non-visible overflow-x forces overflow-y to auto as well) —
            // that was clipping the "Choose area" dropdown invisible on
            // mobile. Relax to visible while the dropdown is open so it can
            // float above the map instead.
            className={`flex items-center justify-center gap-2 ${showRegionDropdown ? 'overflow-visible' : 'overflow-x-auto scrollbar-hide'} sm:overflow-x-visible`}
          >
            {/* Location — auto-detected via geolocation (blue pulsing dot +
                reverse-geocoded "City, ST") when no explicit city is picked;
                "Choose area" opens the picker for an exact city or ZIP. */}
            {selectedRegion ? (
              <button
                onClick={clearRegion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border bg-[#1E2026] text-white border-[#1E2026] shrink-0"
                title="Remove filter to see more results"
              >
                <MapPin className="w-3.5 h-3.5" />
                {selectedRegion.isState ? selectedRegion.cityName : `${selectedRegion.cityName}, ${selectedRegion.stateCode}`}
                {/* How many spots the chosen area currently has (respects any
                    other active filters, so it matches the list heading). */}
                {!dataLoading && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-white/25 text-white text-[10px] font-bold tabular-nums">
                    {displayList.length}
                  </span>
                )}
                <X className="w-3 h-3 ml-0.5" />
              </button>
            ) : (
              <div className="relative shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border border-black/12 bg-white">
                  {geoState === 'loading' && !detectedArea ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#9B9490] animate-pulse shrink-0" />
                      <span className="text-[#6B6862] font-medium">Locating…</span>
                    </>
                  ) : detectedArea ? (
                    <>
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                      </span>
                      <span className="font-bold text-[#1E2026]">{detectedArea.cityName}, {detectedArea.stateCode}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-[#96602F] shrink-0" />
                      {/* No location yet (the homepage never auto-locates) —
                          prompt for the pick instead of showing a bare "·". */}
                      <span className="text-[#6B6862] font-medium">Where to?</span>
                    </>
                  )}
                  <span className="text-[#6B6862]">·</span>
                  <button
                    onClick={() => setShowRegionDropdown(v => !v)}
                    aria-haspopup="dialog"
                    aria-expanded={showRegionDropdown}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Choose area
                  </button>
                </div>

                {showRegionDropdown && (
                  <>
                    {/* Click-away backdrop */}
                    <div className="fixed inset-0 z-[1290]" onClick={() => setShowRegionDropdown(false)} />
                    <div
                      role="dialog"
                      aria-label="Choose an area"
                      className="absolute z-[1300] left-0 top-full mt-2 w-72 max-w-[85vw] bg-white border border-black/8 rounded-xl shadow-xl p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6862] mb-2 px-0.5">Search by city</p>
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6862]" />
                        <input
                          autoFocus
                          type="text"
                          value={regionQuery}
                          onChange={e => setRegionQuery(e.target.value)}
                          placeholder="City, State"
                          aria-label="Search by city and state"
                          className="w-full pl-8 pr-2 py-2 text-xs bg-[#F5F4F0] border border-black/8 rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto mb-3 border border-black/6 rounded-lg divide-y divide-black/5">
                        {regionMatches.length === 0 ? (
                          <p className="p-2.5 text-xs text-[#6B6862]">
                            {dataLoading ? 'Loading cities…' : 'No matching city.'}
                          </p>
                        ) : (
                          regionMatches.map(opt => (
                            <button
                              key={`${opt.citySlug}-${opt.stateSlug}`}
                              type="button"
                              onClick={() => { selectRegion(opt); setShowRegionDropdown(false) }}
                              className="block w-full text-left px-2.5 py-2 text-xs text-[#1E2026] hover:bg-[#F5F4F0] transition-colors"
                            >
                              {opt.cityName}, {opt.stateCode}
                            </button>
                          ))
                        )}
                      </div>

                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6862] mb-2 px-0.5">Or search by ZIP</p>
                      <form
                        onSubmit={e => { e.preventDefault(); geocodeLocation(locationSearch); setShowRegionDropdown(false) }}
                        className="relative mb-2"
                      >
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          value={locationSearch}
                          onChange={e => { const v = e.target.value.replace(/\D/g, ''); setLocationSearch(v); setGeocodeError(''); if (!v) setZipFilter('') }}
                          placeholder="ZIP code"
                          aria-label="Search by ZIP code"
                          className="w-full pl-3 pr-14 py-2 text-xs bg-[#F5F4F0] border border-black/8 rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={geocoding}
                          className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#B57F50] hover:bg-[#c8934f] text-white text-[11px] font-semibold rounded-md transition-colors disabled:opacity-60"
                        >
                          {geocoding ? '…' : 'Go'}
                        </button>
                      </form>
                      {geocodeError && <p className="text-[10px] text-red-500 mb-2 px-0.5">{geocodeError}</p>}

                      <button
                        onClick={() => { requestLocation(); setShowRegionDropdown(false) }}
                        className="flex items-center justify-center gap-1.5 w-full px-2.5 py-2 rounded-lg border border-black/10 text-xs font-semibold text-[#1E2026] hover:border-[#B57F50] transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#96602F]" /> Use my current location
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="hidden sm:block h-5 w-px bg-black/10 shrink-0" />

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

            <ShareButton
              url={`https://www.ramennearyou.com${pathname}`}
              title={pageTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border bg-white text-[#1E2026] border-black/12 hover:border-black/30 transition-colors shrink-0"
            />

            {/* Map / List view toggle — segmented control */}
            {mapOnly && (
              <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-[#F5F4F0] border border-black/12 shrink-0">
                <button
                  onClick={() => setViewMode('map')}
                  aria-pressed={viewMode === 'map'}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    viewMode === 'map' ? 'bg-[#1E2026] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    viewMode === 'list' ? 'bg-[#1E2026] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>
            )}
          </div>
          {geocodeError && <p className="text-red-500 text-xs mt-1.5">{geocodeError}</p>}
        </div>
      </div>

      {/* Ad — floats directly under the filter bar, on top of the map.
          Dismissible so it never permanently blocks the map view. */}
      {mapOnly && !adDismissed && (
        <div className="relative bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-black/10 pointer-events-auto w-full sm:w-auto sm:max-w-4xl overflow-hidden">
          <button
            onClick={() => setAdDismissed(true)}
            aria-label="Dismiss ad"
            className="absolute top-1.5 right-1.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/90 border border-black/10 text-[#6B6862] hover:text-[#1E2026] hover:bg-white shadow-sm transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <AdUnitHorizontal />
        </div>
      )}

      {/* Expandable full filter panel */}
      {showFilters && (
        <div className={mapOnly ? 'bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-black/10 pointer-events-auto w-full sm:w-auto sm:max-w-4xl lg:max-w-5xl max-h-[calc(100dvh-12rem)] overflow-y-auto' : 'border-t border-black/8 bg-white'}>
          <div className={mapOnly ? 'px-3 sm:px-4 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 py-4'}>
            {/* Panel header */}
            <div className="flex items-center justify-between pb-3 mb-1 border-b border-black/8">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#96602F]" />
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

            {/* Grouped filter sections — a single scrolling list on mobile;
                a clean 2/3-column card grid on desktop so related filters
                sit side by side instead of one long vertical scroll. */}
            <div className="divide-y divide-black/8 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 sm:items-start">
              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading icon={<ArrowUpDown className="w-3.5 h-3.5 text-[#96602F]" />} label="Sort" count={0} />
                <div className="relative">
                  <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#96602F] pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value as SortOption); setSortTouched(true) }}
                    aria-label="Sort results"
                    className="w-full appearance-none pl-7 pr-6 py-1.5 text-xs font-semibold bg-white border border-black/12 rounded-full outline-none text-[#1E2026] hover:border-black/30 focus:border-[#B57F50] transition-colors cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading icon={<Utensils className="w-3.5 h-3.5 text-[#96602F]" />} label="Instant Bowl Finder" count={bowls.size} />
                <div className="flex flex-wrap gap-1.5">
                  {BOWL_META.map(b => (
                    <Chip key={b.key} active={bowls.has(b.key)} hex={b.hex} emoji={b.emoji} label={b.label} onClick={() => toggleBowl(b.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading icon={<Sparkles className="w-3.5 h-3.5 text-[#96602F]" />} label="Mood" count={moods.size} />
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_META.map(m => (
                    <Chip key={m.key} active={moods.has(m.key)} hex={m.hex} emoji={m.emoji} label={m.label} onClick={() => toggleMood(m.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading
                  icon={<Utensils className="w-3.5 h-3.5 text-[#96602F]" />}
                  label="Cuisine & Dietary"
                  count={CUISINE_DIETARY_META.filter(c => flags.has(c.key)).length}
                />
                <div className="flex flex-wrap gap-1.5">
                  {CUISINE_DIETARY_META.map(c => (
                    <Chip key={c.key} active={flags.has(c.key)} emoji={c.emoji} label={c.label} onClick={() => toggleFlag(c.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading
                  icon={<Clock className="w-3.5 h-3.5 text-[#96602F]" />}
                  label="Hours & Quality"
                  count={HOURS_QUALITY_META.filter(h => flags.has(h.key)).length}
                />
                <div className="flex flex-wrap gap-1.5">
                  {HOURS_QUALITY_META.map(h => (
                    <Chip key={h.key} active={flags.has(h.key)} emoji={h.emoji} label={h.label} onClick={() => toggleFlag(h.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading icon={<span className="text-[#96602F] text-xs font-bold w-3.5 text-center">$</span>} label="Price" count={prices.size} />
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_META.map(p => (
                    <Chip key={p.key} active={prices.has(p.key)} label={p.label} onClick={() => togglePrice(p.key)} />
                  ))}
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading icon={<BadgeCheck className="w-3.5 h-3.5 text-[#96602F]" />} label="Ownership" count={flags.has('verified') ? 1 : 0} />
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={flags.has('verified')} emoji="✅" label="Verified Listings" onClick={() => toggleFlag('verified')} />
                </div>
              </section>

              <section className="py-3.5 sm:py-3.5 sm:px-3.5 sm:bg-[#F5F4F0] sm:rounded-xl">
                <FilterSectionHeading
                  icon={<Heart className="w-3.5 h-3.5 text-[#96602F]" />}
                  label="Features & Amenities"
                  count={FEATURE_META.filter(f => flags.has(f.key)).length}
                />
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

      {/* /Controls wrapper (mapOnly floats this over the map) */}
      </div>

      {/* Map + list. mapOnly: stacks a shorter map above an always-visible
          card list (Google-Maps-app style) at every breakpoint. Classic
          (!mapOnly) layout is unchanged — full-height map + side list on
          desktop, toggle between the two on mobile. */}
      <div className={mapOnly
        ? 'relative flex flex-col'
        : 'relative h-[calc(100dvh-13rem)] sm:h-[68vh] min-h-[460px] flex border-t border-black/8 overflow-hidden'}>
        {/* Left list panel — always shown for the classic layout (mobile via
            its own toggle, desktop always); in mapOnly it's always visible
            below the map, at every breakpoint. */}
        <div className={mapOnly
          ? 'flex flex-col w-full bg-white overflow-hidden shrink-0 order-2'
          : `${mobileView === 'list' ? 'flex' : 'hidden'} sm:flex absolute inset-0 z-[1100] sm:static sm:inset-auto sm:z-auto w-full sm:w-80 lg:w-96 bg-white border-r border-black/8 flex-col overflow-hidden shrink-0`}>
          <div className="px-3 py-2.5 border-b border-black/8 flex items-center justify-between gap-2">
            <p className="text-[#1E2026] font-semibold text-sm">
              {dataLoading ? 'Loading ramen spots…' : (
                <>
                  {displayList.length} ramen spot{displayList.length !== 1 ? 's' : ''}
                  {(activeCount > 0 || selectedRegion) && <span className="text-[#6B6862] font-normal"> (filtered)</span>}
                </>
              )}
            </p>
          </div>

          {/* Back to full-screen map — floating bottom-center pill. Classic
              layout only: mobile-only (desktop always shows the panel
              there). mapOnly no longer needs this — the map is always
              visible above the list at every breakpoint now. */}
          {!mapOnly && (
            <button
              onClick={() => setMobileView('map')}
              className="flex sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-10 items-center gap-2 px-6 py-3 rounded-full bg-[#B57F50] text-white text-sm font-bold shadow-lg shadow-black/30 active:scale-95 transition-transform"
            >
              <MapIcon className="w-5 h-5" /> Map
            </button>
          )}

          <div className="flex-1 overflow-y-auto">
            {dataLoading ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Loader2 className="w-7 h-7 text-[#96602F] animate-spin" />
                <p className="text-[#6B6862] text-sm">Loading the ramen map…</p>
              </div>
            ) : dataError ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Utensils className="w-8 h-8 text-[#96602F]/30" />
                <p className="text-[#1E2026] font-semibold text-sm">Couldn&apos;t load the map</p>
                <button onClick={() => location.reload()} className="text-xs text-[#96602F] font-medium">Retry →</button>
              </div>
            ) : displayList.length === 0 ? (
              <div className="p-6 flex flex-col items-center text-center gap-3">
                <Utensils className="w-8 h-8 text-[#96602F]/30" />
                <p className="text-[#1E2026] font-semibold text-sm">No ramen spots found</p>
                <p className="text-[#6B6862] text-xs">
                  {selectedRegion
                    ? `Try removing the ${selectedRegion.cityName} filter to see more results, or clear your other filters.`
                    : 'Try clearing your filters or searching a different ZIP.'}
                </p>
                <div className="flex items-center gap-3">
                  {selectedRegion && (
                    <button onClick={clearRegion} className="text-xs text-[#96602F] font-medium">
                      Remove {selectedRegion.cityName} filter →
                    </button>
                  )}
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-[#96602F] font-medium">Clear all filters →</button>
                  )}
                </div>
              </div>
            ) : (
              <div className={listView
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3 sm:px-4 py-4 max-w-7xl mx-auto w-full'
                : mapOnly
                  ? 'flex gap-3 overflow-x-auto scrollbar-hide px-3 py-3 snap-x snap-mandatory'
                  : 'divide-y divide-black/5'}>
                {displayList.map((r, i) => renderResultCard(r, i, listView ? 'grid' : mapOnly ? 'carousel' : 'row'))}
              </div>
            )}

            {/* Themed discovery shelves — one horizontal carousel per theme
                (Open Now / Top Rated / New Spots / Upscale / Cheap Eats),
                using the same result card as the main list. Map view only;
                list view is the 3-column grid instead. */}
            {mapOnly && !listView && !dataLoading && shelves.map((shelf) => (
              <div key={shelf.key} className="border-t border-black/8 pt-3 pb-1">
                <div className="px-3 mb-2.5">
                  <h3 className="font-serif text-lg font-bold text-[#1E2026]">{shelf.title}</h3>
                  <p className="text-[#6B6862] text-xs">{shelf.subtitle}</p>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide px-3 pb-3 snap-x snap-mandatory">
                  {shelf.items.map((r, i) => renderResultCard(r, i, 'carousel', `${shelf.key}-`))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Map — shorter fixed height above the card list in mapOnly (every
            breakpoint, taller on larger screens), fills the container
            otherwise (right pane in the classic layout). */}
        <div className={`${listView
          ? 'hidden'
          : mapOnly ? 'h-[45vh] min-h-[280px] sm:h-[55vh] sm:min-h-[380px] relative block' : 'flex-1 relative block'}${
            introPhase ? ' map-reveal-target' : ''}`}>
          {introPhase && <div className="map-reveal-veil" aria-hidden="true" />}
          {!showMap ? null : dataLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
              <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
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
              onMarkerHover={setHoveredSlug}
              onUserMove={setVisibleBounds}
              onMapCenter={handleMapCenter}
              centerLatLng={geocodedCenter}
              userLocation={userPos}
              onLocateRequest={requestLocation}
              accentColor={accentColor}
              boundary={boundary}
              disablePopups={mapOnly}
            />
          )}

          {/* Full detail card for the selected pin — mapOnly has no list panel,
              so this floating card is the only place to see hours/directions/
              chips before committing to the full listing page. */}
          {mapOnly && selectedRestaurant && (() => {
            const r = selectedRestaurant
            const internalUrl = mapPointHref(r)
            const directionsUrl = buildDirectionsUrl(r, userPos)
            const isSupp = !!r.supp
            const rSlugReview = mapPointReviewSlug(r)
            return (
              <div className="absolute inset-x-0 bottom-0 sm:bottom-6 sm:left-4 sm:inset-x-auto z-[1300] px-2 pb-2 sm:px-0 sm:pb-0 pointer-events-none">
                <div className="pointer-events-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-black/10 w-full sm:w-96 max-h-[70vh] sm:max-h-[calc(100dvh-8rem)] overflow-y-auto">
                  <div className="relative">
                    <div className="relative w-full h-36 sm:h-40 bg-[#F5F4F0]">
                      <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="384px" />
                    </div>
                    <button
                      onClick={() => setSelectedSlug(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm border border-black/10 hover:bg-white transition-colors"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4 text-[#1E2026]" />
                    </button>
                    {r.featured && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f5b301] to-[#d4880b] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
                        👑 #1 Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={internalUrl} className="font-serif text-lg font-bold text-[#1E2026] hover:text-[#96602F] transition-colors leading-tight">
                      {r.name}
                    </Link>
                    <p className="text-[#6B6862] text-sm mt-0.5">{r.city}, {r.stateCode}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {r.rating != null && (
                        rSlugReview ? (
                          <Link
                            href={`/reviews/${rSlugReview}`}
                            className="flex items-center gap-1 text-sm text-[#1E2026]/70 hover:text-[#96602F] hover:underline"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {r.rating.toFixed(1)}{r.reviewCount ? ` (${r.reviewCount.toLocaleString()})` : ''}
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-[#1E2026]/70">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{r.rating.toFixed(1)}
                          </span>
                        )
                      )}
                      {r.priceRange && <PriceScale priceRange={r.priceRange} />}
                      <OpenStatusTag hours={r.hours} />
                    </div>
                    <MatchedChips chips={listingChips(r)} />

                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => requireAuth(e)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#B57F50] text-white text-xs font-semibold hover:bg-[#c8934f] transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Get Directions
                      </a>
                      <Link
                        href={internalUrl}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/12 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50] hover:text-[#96602F] transition-colors"
                      >
                        View Details
                      </Link>
                      {!isSupp && (
                        <button
                          onClick={(e) => handleToggleSave(e, r.slug)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/12 text-xs font-semibold text-[#1E2026] hover:border-[#B57F50] transition-colors"
                          aria-label={saves.has(r.slug) ? 'Unsave restaurant' : 'Save restaurant'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${saves.has(r.slug) ? 'fill-[#B57F50] text-[#96602F]' : 'text-[#6B6862]'}`} />
                          {saves.has(r.slug) ? 'Saved' : 'Save'}
                        </button>
                      )}
                      <InquireButton
                        restaurant={{ name: r.name, slug: r.slug, city: r.city, stateCode: r.stateCode }}
                        source="find"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/12 text-xs font-semibold text-[#1E2026] hover:border-[#B57F50] hover:text-[#96602F] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* "Update results as I move the map" toggle — top-left of the map */}
          {showMap && !dataLoading && (
            <label className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3 py-2 rounded-full bg-white/95 shadow-md border border-black/10 cursor-pointer select-none">
              <span className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={updateOnMapMove}
                  onChange={(e) => {
                    setUpdateOnMapMove(e.target.checked)
                    if (e.target.checked) setShowSearchAreaBtn(false)
                  }}
                />
                <span className="w-9 h-5 rounded-full bg-black/15 peer-checked:bg-[#B57F50] transition-colors" />
                <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </span>
              <span className="text-xs font-semibold text-[#1E2026] whitespace-nowrap">Update as map moves</span>
            </label>
          )}

          {showSearchAreaBtn && !dataLoading && (
            <div className={`absolute left-1/2 -translate-x-1/2 z-[1000] ${mapOnly ? 'bottom-6' : 'top-4'}`}>
              <button
                onClick={handleSearchArea}
                disabled={searchingArea}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F4F0] text-[#1E2026] text-sm font-semibold shadow-lg shadow-black/25 border border-black/10 transition-colors disabled:opacity-70"
              >
                {searchingArea
                  ? <><Loader2 className="w-4 h-4 animate-spin text-[#96602F]" /> Searching…</>
                  : <><Search className="w-4 h-4 text-[#96602F]" /> Search this area</>}
              </button>
            </div>
          )}

          {geoState === 'idle' && !showSearchAreaBtn && !dataLoading && (
            <div className={`absolute left-1/2 -translate-x-1/2 z-[1000] ${mapOnly ? 'bottom-6' : 'top-4'}`}>
              <button
                onClick={requestLocation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold shadow-lg shadow-black/30 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Use my location
              </button>
            </div>
          )}

          {/* Floating list-view toggle (mobile only) — bottom-center pill,
              AllTrails-style, opens the list overlay. Omitted in mapOnly (no list). */}
          {!mapOnly && (
          <button
            onClick={() => setMobileView('list')}
            className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-6 py-3 rounded-full bg-[#B57F50] text-white text-sm font-bold shadow-lg shadow-black/30 active:scale-95 transition-transform"
            aria-label={`Show list of ${displayList.length} ramen spots`}
          >
            <List className="w-5 h-5" /> List
            {displayList.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-white/25 text-white text-[11px] font-bold">
                {displayList.length > 99 ? '99+' : displayList.length}
              </span>
            )}
          </button>
          )}

        </div>


      </div>

      {/* Help modal */}
      {helpOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setHelpOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="How to use the Ramen Map"
        >
          <div ref={helpPanelRef} tabIndex={-1} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto outline-none">
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
                  <p className="text-[#6B6862]">Click any pin on the map to highlight that restaurant in the list. Pan or zoom the map and tap <strong>Search this area</strong> to reload results for the visible region. On mobile, use the List / Map button at the bottom of the screen to switch between map and list view.</p>
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

      <LoginGateModal open={gateOpen} onClose={() => setGateOpen(false)} redirectTo={pathname} />
    </section>
  )
}
