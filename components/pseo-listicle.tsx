'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Globe, List as ListIcon, Map as MapIcon, Navigation } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import AdUnitVertical from '@/components/ad-unit-vertical'
import AdUnitInFeed from '@/components/ad-unit-infeed'
import AdUnitHorizontal from '@/components/ad-unit-horizontal'
import AdUnitAutorelaxed from '@/components/ad-unit-autorelaxed'
import AdSlot from '@/components/ad-slot'
import AdAnchorMobile from '@/components/ad-anchor-mobile'
import ProductsCarousel from '@/components/products-carousel'
import { trackEvent } from '@/lib/analytics-client'
import { STATE_CODE_TO_NAME } from '@/lib/state-lookups'

// Reverse-geocoding (Nominatim) returns a full state name — map it back to
// the 2-letter code used everywhere else on the site.
const STATE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_NAME).map(([code, name]) => [name, code])
)

// Items carry location as a display string ("Aurora, CO"); the state filter
// works off the trailing 2-letter code rather than adding a parallel field.
function stateCodeOf(locationLabel?: string | null): string | null {
  if (!locationLabel) return null
  const idx = locationLabel.lastIndexOf(', ')
  if (idx === -1) return null
  const code = locationLabel.slice(idx + 2).trim()
  return /^[A-Z]{2}$/.test(code) ? code : null
}

function stateName(code: string): string {
  return STATE_CODE_TO_NAME[code] ?? code
}

// Ad cadence, tuned per device because the same list reads completely
// differently on each.
//
// On desktop a card is one wide row, so five of them fit inside a viewport and
// an ad every 5th listing lands about once per screen. On mobile the same five
// cards stack into roughly 900px — more than a full screen — so that cadence
// leaves long ad-free runs on the device most of this site's traffic actually
// uses. Mobile therefore breaks every 3 listings, which is about one unit per
// screen there too.
//
// In-list slots rotate in-feed → vertical → square rather than repeating one
// unit: AdSense prices a feed-native unit off a different demand pool than a
// display one, so rotating competes better down a long page than hammering a
// single slot.
//
// Per-page budget against the 11-ad ceiling. Page templates add one in-article
// unit of their own below the list, which is counted here:
//   mobile  — 1 leaderboard + 1 under filters + 6 in-list + 1 multiplex + 1 anchor + 1 template = 11
//   desktop — 1 leaderboard + 1 under filters + 6 in-list + 1 template = 9
const LISTINGS_PER_AD_DESKTOP = 5
const LISTINGS_PER_AD_MOBILE = 3
const IN_LIST_ADS_DESKTOP = 6
const IN_LIST_ADS_MOBILE = 6

// `n` is the 1-based position of this ad in the list, so the rotation stays
// stable regardless of which device cadence produced it.
function InListAd({ n }: { n: number }) {
  const slot = n % 3
  if (slot === 1) return <AdUnitInFeed />
  if (slot === 2) return <AdUnitVertical />
  return <AdUnitHorizontal />
}

export type ListicleTag = { label: string; href?: string }

export type ListicleItem = {
  key: string
  href: string
  photo?: string | null
  name: string
  rating?: number | null
  reviewCount?: number
  /** Internal link to this listing's /reviews/{slug} page, when one exists. */
  reviewHref?: string | null
  locationLabel?: string | null
  /** Internal link to that city's own /find listicle page. */
  cityHref?: string | null
  /** Internal link to that state's listicle page. */
  stateHref?: string | null
  address?: string | null
  /** Google Maps directions/search URL — same link the listing page's "Get
   *  Directions" CTA uses, so clicking the address behaves identically. */
  directionsUrl?: string | null
  phone?: string | null
  website?: string | null
  hoursLabel?: string | null
  hoursOpen?: boolean | null
  description: string
  tags?: ListicleTag[]
  lat?: number | null
  lng?: number | null
  claimHref?: string | null
  isClaimed?: boolean
}

type SortKey = 'rating' | 'reviews' | 'name' | 'distance'

function distanceMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8
  const dLat = (bLat - aLat) * Math.PI / 180
  const dLng = (bLng - aLng) * Math.PI / 180
  const s1 = Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1))
}

// Unicode stars with a width-clipped overlay rather than five inline SVGs.
// On a listicle rendering hundreds of cards, five lucide <svg> elements per
// card accounted for ~30% of the prerendered HTML — this is the same visual
// at roughly a hundredth of the bytes.
function StarRating({ rating }: { rating: number | null | undefined }) {
  if (rating == null) return null
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  return (
    <span
      className="relative inline-block leading-none text-[13px] tracking-[0.05em] select-none"
      aria-hidden="true"
    >
      <span className="text-[#1E2026]/15">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-amber-400 whitespace-nowrap"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}

// Renders "City, ST" with each half linking to that city's/state's own
// listicle page when we have the href for it; falls back to plain text
// (never guesses a slug from the display label).
function LocationLabel({ label, cityHref, stateHref }: { label: string; cityHref?: string | null; stateHref?: string | null }) {
  const commaIdx = label.lastIndexOf(', ')
  if (commaIdx === -1) return <>{label}</>
  const city = label.slice(0, commaIdx)
  const state = label.slice(commaIdx + 2)
  return (
    <span className="truncate">
      {cityHref ? <Link href={cityHref} className="hover:text-[#96602F] hover:underline">{city}</Link> : city}
      {', '}
      {stateHref ? <Link href={stateHref} className="hover:text-[#96602F] hover:underline">{state}</Link> : state}
    </span>
  )
}

interface Props {
  breadcrumb: { label: string; href?: string }[]
  title: string
  subtitle: string
  items: ListicleItem[]
  noun: string
  nounPlural: string
  searchPlaceholder?: string
  filterLabel?: string
  sortOptions?: { value: SortKey; label: string }[]
  initialSort?: SortKey
  primaryCtaLabel?: string
  mapSlot: React.ReactNode
  headerExtra?: React.ReactNode
  /** When set, items farther than this are dropped once the visitor's
   *  location is known (via "Show distance from me") — used by the
   *  /find/ramen-near-me-within-N-mi pages. Meaningless before that, since
   *  there's no server-side location to filter by. */
  maxDistanceMiles?: number
  /** When set, only this many ranked items render initially, with a
   *  "Show more" button revealing another batch at a time — for pages
   *  listing thousands of items (e.g. /partners). */
  pageSize?: number
}

export default function PseoListicle({
  breadcrumb,
  title,
  subtitle,
  items,
  noun,
  nounPlural,
  searchPlaceholder,
  filterLabel = 'Attraction',
  sortOptions,
  initialSort = 'rating',
  primaryCtaLabel = 'View details',
  mapSlot,
  headerExtra,
  maxDistanceMiles,
  pageSize,
}: Props) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [query, setQuery] = useState('')
  const [attraction, setAttraction] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>(initialSort)
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [userLocLabel, setUserLocLabel] = useState('')
  const [geoError, setGeoError] = useState('')
  const [visibleCount, setVisibleCount] = useState(pageSize ?? Infinity)

  useEffect(() => {
    setVisibleCount(pageSize ?? Infinity)
  }, [query, attraction, stateFilter, cityFilter, sort, userLoc, pageSize])

  // Debounced so a search reports once the visitor stops typing rather than
  // once per keystroke.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) return
    const t = setTimeout(() => trackEvent('search', { query: q }), 700)
    return () => clearTimeout(t)
  }, [query])

  const attractionOptions = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) for (const t of it.tags ?? []) set.add(t.label)
    return Array.from(set).sort()
  }, [items])

  // Both filters are derived from the items themselves, so neither dropdown
  // ever lists an option with zero results. They only render when there's
  // more than one value, so a single-city page shows neither and a
  // nationwide page shows both. City options narrow to the picked state.
  const stateOptions = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      const code = stateCodeOf(it.locationLabel)
      if (code) set.add(code)
    }
    return Array.from(set).sort((a, b) => stateName(a).localeCompare(stateName(b)))
  }, [items])

  const cityOptions = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      if (!it.locationLabel) continue
      if (stateFilter !== 'all' && stateCodeOf(it.locationLabel) !== stateFilter) continue
      set.add(it.locationLabel)
    }
    return Array.from(set).sort()
  }, [items, stateFilter])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter(it => {
      if (attraction !== 'all' && !(it.tags ?? []).some(t => t.label === attraction)) return false
      if (stateFilter !== 'all' && stateCodeOf(it.locationLabel) !== stateFilter) return false
      if (cityFilter !== 'all' && it.locationLabel !== cityFilter) return false
      if (maxDistanceMiles != null && userLoc) {
        if (it.lat == null || it.lng == null) return false
        if (distanceMiles(userLoc.lat, userLoc.lng, it.lat, it.lng) > maxDistanceMiles) return false
      }
      if (!q) return true
      return it.name.toLowerCase().includes(q) || (it.locationLabel ?? '').toLowerCase().includes(q)
    })
    list = [...list].sort((a, b) => {
      if (sort === 'distance' && userLoc) {
        const da = a.lat != null && a.lng != null ? distanceMiles(userLoc.lat, userLoc.lng, a.lat, a.lng) : Infinity
        const db = b.lat != null && b.lng != null ? distanceMiles(userLoc.lat, userLoc.lng, b.lat, b.lng) : Infinity
        return da - db
      }
      if (sort === 'reviews') return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
      if (sort === 'name') return a.name.localeCompare(b.name)
      return (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
    })
    return list
  }, [items, query, attraction, stateFilter, cityFilter, sort, userLoc, maxDistanceMiles])

  function handleReset() {
    setQuery('')
    setAttraction('all')
    setStateFilter('all')
    setCityFilter('all')
    setSort(initialSort)
    setUserLoc(null)
    setUserLocLabel('')
    setGeoError('')
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const json = await res.json()
      const addr = json?.address ?? {}
      const cityName: string = addr.city || addr.town || addr.village || addr.hamlet || addr.county || ''
      const stateCode = STATE_NAME_TO_CODE[addr.state ?? ''] ?? ''
      if (cityName && stateCode) setUserLocLabel(`${cityName}, ${stateCode}`)
    } catch {
      // Silent — the distance filter/sort still works without the label.
    }
  }

  function handleDistance() {
    if (!navigator.geolocation) {
      setGeoError('Location isn’t available in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLoc(loc)
        setSort('distance')
        setGeoError('')
        reverseGeocode(loc.lat, loc.lng)
      },
      () => setGeoError('Couldn’t get your location — check your browser permissions.'),
    )
  }

  function distanceLabel(it: ListicleItem): string | null {
    if (!userLoc || it.lat == null || it.lng == null) return null
    const mi = distanceMiles(userLoc.lat, userLoc.lng, it.lat, it.lng)
    return `${mi < 10 ? mi.toFixed(1) : Math.round(mi)} mi away`
  }

  const rest = view === 'list' ? filtered : []
  const pagedRest = rest.slice(0, visibleCount)
  const remaining = rest.length - pagedRest.length

  const resolvedSortOptions: { value: SortKey; label: string }[] = sortOptions ?? [
    { value: 'rating', label: 'Top rated' },
    { value: 'reviews', label: 'Most reviewed' },
    { value: 'name', label: 'Name (A–Z)' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="bg-[#F5F0EA] px-4 sm:px-6 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-4">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-[#96602F] transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-[#1E2026]">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">{title}</h1>
              <p className="text-[#6B6862] text-sm leading-relaxed max-w-2xl">{subtitle}</p>
            </div>
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        </div>
      </div>

      {/* Leaderboard directly under the H1 — the only slot guaranteed to be
          in the first viewport on every listicle, so it carries the page's
          best viewability. */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        <div className="min-h-[100px]">
          <AdUnitHorizontal />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar: count + List/Map */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm text-[#6B6862]">
            {filtered.length} {filtered.length === 1 ? noun : nounPlural} on this page
          </p>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#F5F4F0] border border-black/10 shrink-0">
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'list' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              aria-pressed={view === 'map'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'map' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>

        {view === 'list' && (
          <>
            {/* Search + filter + sort bar */}
            <div className="bg-[#FAFAF9] border border-black/8 rounded-xl p-3 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder ?? `Search by name or town...`}
                aria-label="Search"
                className="w-full px-3 py-2 mb-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#1E2026] placeholder-[#9B9490] outline-none focus:border-[#B57F50]"
              />
              <div className="flex flex-wrap items-center gap-2">
                {stateOptions.length > 1 && (
                  <select
                    value={stateFilter}
                    onChange={(e) => { setStateFilter(e.target.value); setCityFilter('all') }}
                    aria-label="State"
                    className="px-3 py-2 rounded-lg border border-black/10 bg-white text-xs text-[#1E2026] outline-none focus:border-[#B57F50]"
                  >
                    <option value="all">State: All</option>
                    {stateOptions.map(s => <option key={s} value={s}>{stateName(s)}</option>)}
                  </select>
                )}
                {cityOptions.length > 1 && (
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    aria-label="City"
                    className="px-3 py-2 rounded-lg border border-black/10 bg-white text-xs text-[#1E2026] outline-none focus:border-[#B57F50]"
                  >
                    <option value="all">City: All</option>
                    {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
                {attractionOptions.length > 0 && (
                  <select
                    value={attraction}
                    onChange={(e) => setAttraction(e.target.value)}
                    aria-label={filterLabel}
                    className="px-3 py-2 rounded-lg border border-black/10 bg-white text-xs text-[#1E2026] outline-none focus:border-[#B57F50]"
                  >
                    <option value="all">{filterLabel}: All</option>
                    {attractionOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                )}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort"
                  className="px-3 py-2 rounded-lg border border-black/10 bg-white text-xs text-[#1E2026] outline-none focus:border-[#B57F50]"
                >
                  {resolvedSortOptions.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
                  {userLoc && <option value="distance">Sort: Nearest</option>}
                </select>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 rounded-lg border border-black/10 bg-white text-xs font-semibold text-[#1E2026] hover:border-black/25 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleDistance}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/10 bg-white text-xs font-semibold text-[#1E2026] hover:border-black/25 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Show distance from me
                </button>
                {userLoc && (
                  <span className="flex items-center px-3 py-2 rounded-lg border border-black/10 bg-white text-xs font-bold text-emerald-600">
                    {userLocLabel || 'Locating…'}
                  </span>
                )}
              </div>
              {geoError && <p className="text-red-500 text-xs mt-2">{geoError}</p>}
            </div>

            <div className="mb-4 min-h-[250px]">
              <AdUnitVertical />
            </div>

            <p className="text-xs text-[#6B6862] mb-4">{filtered.length} {filtered.length === 1 ? noun : nounPlural}</p>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-sm text-[#6B6862]">
                No {nounPlural} match your search. Try a different name or town.
              </div>
            )}

            {/* Ranked list */}
            <div className="space-y-3">
              {pagedRest.map((it, i) => {
                // Shop-our-picks drops in once, a few listings down rather
                // than at the very top — it reads as a natural break in the
                // feed instead of a paywall-style interruption before anyone
                // has seen a real result.
                const productCarouselAt = Math.min(3, pagedRest.length)
                return (
                <Fragment key={it.key}>
                <div className="bg-white border border-black/8 rounded-xl p-4 flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B57F50] text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#F5F4F0]">
                    <RestaurantImage src={it.photo} alt={it.name} fill className="object-cover" sizes="64px" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-sm text-[#1E2026] leading-tight">
                      <Link href={it.href} className="hover:text-[#96602F] transition-colors">
                        {it.name}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {it.rating != null && (
                        it.reviewHref ? (
                          <Link
                            href={it.reviewHref}
                            className="flex items-center gap-2 group/rating"
                            onClick={() => trackEvent('review_click', { listingSlug: it.key, listingName: it.name, city: it.locationLabel ?? undefined })}
                          >
                            <StarRating rating={it.rating} />
                            <span className="text-xs font-semibold text-[#1E2026] group-hover/rating:text-[#96602F] transition-colors">{it.rating.toFixed(1)}</span>
                            {!!it.reviewCount && (
                              <span className="text-xs text-[#6B6862] group-hover/rating:text-[#96602F] group-hover/rating:underline transition-colors">
                                {it.reviewCount.toLocaleString()} reviews
                              </span>
                            )}
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2">
                            <StarRating rating={it.rating} />
                            <span className="text-xs font-semibold text-[#1E2026]">{it.rating.toFixed(1)}</span>
                            {!!it.reviewCount && <span className="text-xs text-[#6B6862]">{it.reviewCount.toLocaleString()} reviews</span>}
                          </span>
                        )
                      )}
                      {it.locationLabel && (
                        <span className="flex items-center gap-1 text-xs text-[#6B6862]">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <LocationLabel label={it.locationLabel} cityHref={it.cityHref} stateHref={it.stateHref} />
                        </span>
                      )}
                      {distanceLabel(it) && (
                        <span className="text-xs font-semibold text-emerald-600">{distanceLabel(it)}</span>
                      )}
                    </div>
                    {it.address && (
                      it.directionsUrl ? (
                        <a
                          href={it.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent('directions_click', { listingSlug: it.key, listingName: it.name, city: it.locationLabel ?? undefined })}
                          className="block text-xs text-[#6B6862] hover:text-[#96602F] hover:underline mt-1"
                        >
                          {it.address}
                        </a>
                      ) : (
                        <p className="text-xs text-[#6B6862] mt-1">{it.address}</p>
                      )
                    )}
                    {(it.phone || it.website) && (
                      <div className="flex items-center gap-3 mt-1">
                        {it.phone && (
                          <a
                            href={`tel:${it.phone}`}
                            className="flex items-center gap-1 text-xs text-[#96602F] hover:underline"
                            onClick={() => trackEvent('call_click', { listingSlug: it.key, listingName: it.name, city: it.locationLabel ?? undefined })}
                          >
                            <Phone className="w-3 h-3" />{it.phone}
                          </a>
                        )}
                        {it.website && (
                          <a href={it.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#96602F] hover:underline">
                            <Globe className="w-3 h-3" />Visit website
                          </a>
                        )}
                      </div>
                    )}
                    {it.hoursLabel && (
                      <p className={`text-xs mt-1 font-medium ${it.hoursOpen ? 'text-emerald-600' : 'text-[#9B9490]'}`}>
                        {it.hoursLabel}
                      </p>
                    )}
                    <p className="text-xs text-[#1E2026] mt-1.5 leading-relaxed">{it.description}</p>
                    {!!it.tags?.length && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {it.tags.map(t => (
                          t.href ? (
                            <Link
                              key={t.label}
                              href={t.href}
                              className="px-2 py-0.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[10px] font-medium text-[#6B6862] hover:border-[#B57F50]/50 hover:text-[#96602F] transition-colors"
                            >
                              {t.label}
                            </Link>
                          ) : (
                            <span key={t.label} className="px-2 py-0.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[10px] font-medium text-[#6B6862]">
                              {t.label}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                    {it.claimHref && !it.isClaimed && (
                      <Link href={it.claimHref} className="inline-block mt-2 text-xs font-semibold text-[#96602F] hover:underline">
                        Is this your {noun}? Claim it →
                      </Link>
                    )}
                  </div>
                </div>
                {/* Two cadences render side by side; AdSlot mounts only the
                    one matching the viewport, so exactly one ad appears here. */}
                {(i + 1) % LISTINGS_PER_AD_MOBILE === 0 &&
                  (i + 1) / LISTINGS_PER_AD_MOBILE <= IN_LIST_ADS_MOBILE && (
                    <AdSlot only="mobile" className="my-3" minHeight={250}>
                      <InListAd n={(i + 1) / LISTINGS_PER_AD_MOBILE} />
                    </AdSlot>
                  )}
                {(i + 1) % LISTINGS_PER_AD_DESKTOP === 0 &&
                  (i + 1) / LISTINGS_PER_AD_DESKTOP <= IN_LIST_ADS_DESKTOP && (
                    <AdSlot only="desktop" className="my-3" minHeight={100}>
                      <InListAd n={(i + 1) / LISTINGS_PER_AD_DESKTOP} />
                    </AdSlot>
                  )}
                {i + 1 === productCarouselAt && (
                  <div className="my-3">
                    <ProductsCarousel variant="inline" />
                  </div>
                )}
                </Fragment>
                )
              })}
            </div>

            {/* Multiplex grid closing out the list — mobile only. A native
                grid of related items converts far better than another display
                banner at the point where the reader has run out of listings,
                and it is the one format that reliably fills at the very bottom
                of a long page. */}
            {remaining > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setVisibleCount(v => v + (pageSize ?? 50))}
                  className="px-6 py-3 rounded-full bg-white border border-black/12 text-sm font-semibold text-[#1E2026] hover:border-[#B57F50]/50 transition-colors"
                >
                  Show more ({remaining.toLocaleString()} more)
                </button>
              </div>
            )}

            {/* Sits below Show more, not above it, so nothing competes with
                the control the reader is aiming for. */}
            {pagedRest.length > 0 && (
              <AdSlot only="mobile" className="mt-6" minHeight={250}>
                <AdUnitAutorelaxed />
              </AdSlot>
            )}
          </>
        )}

        {view === 'map' && <div className="rounded-2xl overflow-hidden border border-black/8">{mapSlot}</div>}
      </div>

      <AdAnchorMobile />
    </div>
  )
}
