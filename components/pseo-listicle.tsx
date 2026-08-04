'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Phone, Globe, List as ListIcon, Map as MapIcon, Navigation } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'

export type ListicleItem = {
  key: string
  href: string
  photo?: string | null
  name: string
  rating?: number | null
  reviewCount?: number
  locationLabel?: string | null
  address?: string | null
  phone?: string | null
  website?: string | null
  hoursLabel?: string | null
  hoursOpen?: boolean | null
  description: string
  tags?: string[]
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

function StarRating({ rating }: { rating: number | null | undefined }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= full ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50'
              : 'text-[#1E2026]/15'
          }`}
        />
      ))}
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
}: Props) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [query, setQuery] = useState('')
  const [attraction, setAttraction] = useState('all')
  const [sort, setSort] = useState<SortKey>(initialSort)
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState('')

  const attractionOptions = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) for (const t of it.tags ?? []) set.add(t)
    return Array.from(set).sort()
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter(it => {
      if (attraction !== 'all' && !(it.tags ?? []).includes(attraction)) return false
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
  }, [items, query, attraction, sort, userLoc])

  function handleReset() {
    setQuery('')
    setAttraction('all')
    setSort(initialSort)
    setUserLoc(null)
    setGeoError('')
  }

  function handleDistance() {
    if (!navigator.geolocation) {
      setGeoError('Location isn’t available in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSort('distance')
        setGeoError('')
      },
      () => setGeoError('Couldn’t get your location — check your browser permissions.'),
    )
  }

  const spotlight = view === 'list' ? filtered[0] : undefined
  const rest = view === 'list' ? filtered.slice(1) : []

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
              </div>
              {geoError && <p className="text-red-500 text-xs mt-2">{geoError}</p>}
            </div>

            <p className="text-xs text-[#6B6862] mb-4">{filtered.length} {filtered.length === 1 ? noun : nounPlural}</p>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-sm text-[#6B6862]">
                No {nounPlural} match your search. Try a different name or town.
              </div>
            )}

            {/* Spotlight — the top-ranked result gets a bigger, photo-led card */}
            {spotlight && (
              <div className="bg-white border border-black/8 rounded-2xl overflow-hidden mb-4 shadow-sm">
                <div className="sm:flex">
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 bg-[#F5F4F0]">
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold uppercase tracking-widest">
                      Spotlight
                    </span>
                    <RestaurantImage src={spotlight.photo} alt={spotlight.name} fill className="object-cover" sizes="256px" />
                  </div>
                  <div className="p-5 flex-1 min-w-0">
                    <Link href={spotlight.href} className="font-serif text-xl font-bold text-[#1E2026] hover:text-[#96602F] transition-colors">
                      {spotlight.name}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap mt-1.5 mb-2">
                      {spotlight.rating != null && (
                        <>
                          <StarRating rating={spotlight.rating} />
                          <span className="text-sm font-semibold text-[#1E2026]">{spotlight.rating.toFixed(1)}</span>
                          {!!spotlight.reviewCount && <span className="text-xs text-[#6B6862]">{spotlight.reviewCount.toLocaleString()} reviews</span>}
                        </>
                      )}
                      {spotlight.locationLabel && (
                        <span className="flex items-center gap-1 text-xs text-[#6B6862]">
                          <MapPin className="w-3 h-3" />{spotlight.locationLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6B6862] leading-relaxed mb-4">{spotlight.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={spotlight.href}
                        className="px-4 py-2 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
                      >
                        {primaryCtaLabel}
                      </Link>
                      {spotlight.claimHref && !spotlight.isClaimed && (
                        <Link
                          href={spotlight.claimHref}
                          className="px-4 py-2 rounded-lg border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50]/50 transition-colors"
                        >
                          Is this your {noun}? Claim it
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ranked list */}
            <div className="space-y-3">
              {rest.map((it, i) => (
                <div key={it.key} className="bg-white border border-black/8 rounded-xl p-4 flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B57F50] text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#F5F4F0]">
                    <RestaurantImage src={it.photo} alt={it.name} fill className="object-cover" sizes="64px" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={it.href} className="font-bold text-sm text-[#1E2026] hover:text-[#96602F] transition-colors">
                      {it.name}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {it.rating != null && (
                        <>
                          <StarRating rating={it.rating} />
                          <span className="text-xs font-semibold text-[#1E2026]">{it.rating.toFixed(1)}</span>
                          {!!it.reviewCount && <span className="text-xs text-[#6B6862]">{it.reviewCount.toLocaleString()} reviews</span>}
                        </>
                      )}
                      {it.locationLabel && (
                        <span className="flex items-center gap-1 text-xs text-[#6B6862]">
                          <MapPin className="w-3 h-3" />{it.locationLabel}
                        </span>
                      )}
                    </div>
                    {it.address && <p className="text-xs text-[#6B6862] mt-1">{it.address}</p>}
                    {(it.phone || it.website) && (
                      <div className="flex items-center gap-3 mt-1">
                        {it.phone && (
                          <a href={`tel:${it.phone}`} className="flex items-center gap-1 text-xs text-[#96602F] hover:underline">
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
                          <span key={t} className="px-2 py-0.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[10px] font-medium text-[#6B6862]">
                            {t}
                          </span>
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
              ))}
            </div>
          </>
        )}

        {view === 'map' && <div className="rounded-2xl overflow-hidden border border-black/8">{mapSlot}</div>}
      </div>
    </div>
  )
}
