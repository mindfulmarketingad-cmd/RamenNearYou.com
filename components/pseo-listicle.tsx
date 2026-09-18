'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { List as ListIcon, Map as MapIcon, Navigation } from 'lucide-react'
import ListicleCard from '@/components/listicle-card'
import ProductsCarousel from '@/components/products-carousel'
import AdSquare from '@/components/ad-square'
import AdVertical from '@/components/ad-vertical'
import AdInFeed from '@/components/ad-infeed'
import CityGuideCta from '@/components/city-guide-cta'
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
  /** "Ketchikan, AK" — when set, the city-guide CTA is personalised to it.
   *  Left unset on pages that aren't about one city (state, nationwide). */
  guideCityLabel?: string | null
  guideCitySlug?: string | null
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
  guideCityLabel,
  guideCitySlug,
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
      <div className="bg-sunken px-4 sm:px-6 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft mb-4">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-brand-ink transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-ink">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">{title}</h1>
              <p className="text-ink-soft text-sm leading-relaxed max-w-2xl">{subtitle}</p>
            </div>
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar: count + List/Map */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm text-ink-soft">
            {filtered.length} {filtered.length === 1 ? noun : nounPlural} on this page
          </p>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-sunken border border-line/10 shrink-0">
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'list' ? 'bg-brand text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              aria-pressed={view === 'map'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'map' ? 'bg-brand text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>

        {view === 'list' && (
          <>
            {/* Search + filter + sort bar */}
            <div className="bg-raised border border-line/8 rounded-xl p-3 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder ?? `Search by name or town...`}
                aria-label="Search"
                className="w-full px-3 py-2 mb-2.5 rounded-lg border border-line/10 bg-surface text-sm text-ink placeholder-ink-faint outline-none focus:border-brand"
              />
              <div className="flex flex-wrap items-center gap-2">
                {stateOptions.length > 1 && (
                  <select
                    value={stateFilter}
                    onChange={(e) => { setStateFilter(e.target.value); setCityFilter('all') }}
                    aria-label="State"
                    className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
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
                    className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
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
                    className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
                  >
                    <option value="all">{filterLabel}: All</option>
                    {attractionOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                )}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort"
                  className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
                >
                  {resolvedSortOptions.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
                  {userLoc && <option value="distance">Sort: Nearest</option>}
                </select>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs font-semibold text-ink hover:border-line/25 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleDistance}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs font-semibold text-ink hover:border-line/25 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Show distance from me
                </button>
                {userLoc && (
                  <span className="flex items-center px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {userLocLabel || 'Locating…'}
                  </span>
                )}
                <a
                  href="https://amzn.to/4h3lyIL"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap bg-brand text-white hover:bg-brand-hi transition-colors ml-auto"
                >
                  Shop Ramen Products
                </a>
              </div>
              {geoError && <p className="text-red-500 text-xs mt-2">{geoError}</p>}
            </div>

            <div className="mb-4 min-h-[250px]">
              <AdSquare />
            </div>

            <p className="text-xs text-ink-soft mb-4">{filtered.length} {filtered.length === 1 ? noun : nounPlural}</p>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-sm text-ink-soft">
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
                // Two more breaks further down, spaced clear of the product
                // carousel and each other — long listicles scroll for a
                // while, so one ad slot isn't enough to keep it in view.
                const inFeedAdAt = Math.min(6, pagedRest.length)
                const adAt = Math.min(9, pagedRest.length)
                return (
                <Fragment key={it.key}>
                <ListicleCard item={it} rank={i + 1} distanceLabel={distanceLabel(it)} noun={noun} />
                {i + 1 === productCarouselAt && (
                  <div className="my-3">
                    <ProductsCarousel variant="inline" />
                  </div>
                )}
                {i + 1 === inFeedAdAt && inFeedAdAt !== productCarouselAt && (
                  <div className="my-3">
                    <AdInFeed />
                  </div>
                )}
                {i + 1 === adAt && adAt !== inFeedAdAt && (
                  <div className="my-3 min-h-[600px] max-w-xs mx-auto">
                    <AdVertical />
                  </div>
                )}
                </Fragment>
                )
              })}
            </div>

            {pagedRest.length > 0 && (
              <div className="mt-6">
                <CityGuideCta cityLabel={guideCityLabel} citySlug={guideCitySlug} />
              </div>
            )}

            {pagedRest.length > 0 && (
              <div className="mt-6 min-h-[250px]">
                <AdSquare />
              </div>
            )}

            {remaining > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setVisibleCount(v => v + (pageSize ?? 50))}
                  className="px-6 py-3 rounded-full bg-surface border border-line/12 text-sm font-semibold text-ink hover:border-brand/50 transition-colors"
                >
                  Show more ({remaining.toLocaleString()} more)
                </button>
              </div>
            )}

          </>
        )}

        {view === 'map' && <div className="rounded-2xl overflow-hidden border border-line/8">{mapSlot}</div>}
      </div>
    </div>
  )
}
