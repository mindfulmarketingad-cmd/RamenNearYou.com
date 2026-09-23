'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Loader2, Navigation, SlidersHorizontal, Lock, ArrowUpDown, X } from 'lucide-react'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import ListicleCard, { type ListicleCardData } from '@/components/listicle-card'
import ProductsCarousel from '@/components/products-carousel'
import { useFilterGate, FilterGateModals } from '@/components/filter-gate'
import { BOWL_META, MOOD_META, FEATURE_META, MISC_FLAG_BY_KEY } from '@/lib/ramen-taxonomy'

// The homepage's feed: the map on top, then the ramen actually inside the
// radius drawn on it. The two share one position, so what the circle covers
// and what the list shows can never drift apart.

const FEED_LIMIT = 20
const RADIUS_CHOICES = [5, 10, 25, 50] as const
const DEFAULT_RADIUS = 25

// Sorting is free for everyone; the filter chips below are not.
type SortKey = 'closest' | 'rating' | 'reviews'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'closest', label: 'Closest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviews' },
]

// Filter groups, drawn from the same taxonomy the map's filter panel uses, so
// a chip means exactly the same thing in both places. Hours & quality is
// listed first because "Open Now" is what people reach for.
const HOURS_QUALITY_KEYS = [
  'open-now', 'open-late', 'open-midnight', 'open-early',
  'open-weekends', 'top-rated', 'hidden-gems', 'new-ramen',
]
const CUISINE_KEYS = [
  'pho', 'ramen-sushi', 'sushi', 'lo-mein', 'fish-ramen',
  'korean-style', 'japanese-fusion', 'halal', 'gluten-free',
]

const FILTER_GROUPS: { label: string; chips: { key: string; label: string; emoji: string }[] }[] = [
  {
    label: 'Hours & Quality',
    chips: HOURS_QUALITY_KEYS.map((k) => MISC_FLAG_BY_KEY[k]).filter(Boolean),
  },
  { label: 'Bowl', chips: BOWL_META },
  { label: 'Mood', chips: MOOD_META },
  { label: 'Features & Amenities', chips: FEATURE_META },
  {
    label: 'Cuisine & Dietary',
    chips: CUISINE_KEYS.map((k) => MISC_FLAG_BY_KEY[k]).filter(Boolean),
  },
]

const CHIP_LABEL: Record<string, string> = Object.fromEntries(
  FILTER_GROUPS.flatMap((g) => g.chips.map((c) => [c.key, c.label]))
)

interface NearbyResult {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  photo: string
  description: string
  subtypes: string
  priceRange: string
  address: string
  phone: string
  website: string
  googleMapsLink: string
  openNow: boolean | null
  hoursLabel: string | null
  distanceMiles: number
}

function toCard(r: NearbyResult): ListicleCardData {
  const tags = (r.subtypes ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((label) => ({ label }))

  return {
    key: r.slug,
    href: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    photo: r.photo,
    name: r.name,
    rating: r.rating,
    reviewCount: r.reviewCount,
    locationLabel: `${r.city}, ${r.stateCode}`,
    cityHref: `/${r.citySlug}/${r.stateSlug}`,
    address: r.address,
    directionsUrl:
      r.googleMapsLink ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`,
    phone: r.phone,
    website: r.website,
    hoursLabel: r.openNow === null ? r.hoursLabel : r.openNow ? 'Open now' : 'Closed',
    hoursOpen: r.openNow,
    description: r.description || `Ramen in ${r.city}, ${r.stateCode}.`,
    tags: r.priceRange ? [{ label: r.priceRange }, ...tags].slice(0, 3) : tags,
  }
}

export default function HomeNearbySection() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS)
  const [results, setResults] = useState<NearbyResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loadedOnce, setLoadedOnce] = useState(false)
  const [sort, setSort] = useState<SortKey>('closest')
  const [active, setActive] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const gate = useFilterGate()

  // Stable identity so HomeMapHero's effect doesn't re-fire every render.
  const handlePos = useCallback((p: { lat: number; lng: number } | null) => {
    setPos((prev) => (prev && p && prev.lat === p.lat && prev.lng === p.lng ? prev : p))
  }, [])

  // Joined rather than passed as an array so the effect doesn't re-run on
  // every render just because a new array identity was created.
  const filterParam = active.join(',')

  useEffect(() => {
    if (!pos) return
    let cancelled = false
    setLoading(true)
    const qs = new URLSearchParams({
      lat: String(pos.lat),
      lng: String(pos.lng),
      radius: String(radius),
      limit: String(FEED_LIMIT),
      sort,
    })
    if (filterParam) qs.set('filters', filterParam)
    fetch(`/api/nearby?${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setResults(Array.isArray(d.results) ? d.results : [])
        setLoadedOnce(true)
      })
      .catch(() => { if (!cancelled) setLoadedOnce(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pos, radius, sort, filterParam])

  function toggleFilter(key: string) {
    if (!gate.requireAccess()) return
    setActive((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  function openFilters() {
    // Closing is always allowed; opening is what costs a subscription.
    if (showFilters) { setShowFilters(false); return }
    if (!gate.requireAccess()) return
    setShowFilters(true)
  }

  const feed = (
    <section className="bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Feed header — says plainly what's being listed and over what area,
              so the list and the circle on the map read as one thing. */}
          <div className="flex items-end justify-between gap-3 flex-wrap mb-4">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight">
                Ramen near you
              </h2>
              <p className="text-sm text-ink-soft mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {pos
                  ? `${results.length} ${results.length === 1 ? 'spot' : 'spots'} inside the ${radius}-mile circle on the map`
                  : 'Share your location to see the closest bowls first'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ink-soft" aria-hidden="true" />
              <span className="sr-only" id="radius-label">Search radius</span>
              <div role="group" aria-labelledby="radius-label" className="flex items-center gap-0.5 p-0.5 rounded-lg bg-sunken border border-line/10">
                {RADIUS_CHOICES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRadius(m)}
                    aria-pressed={radius === m}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      radius === m ? 'bg-brand text-white' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {m} mi
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort (free) + Filters (RamenNearYou+). */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-soft shrink-0" aria-hidden="true" />
            <span className="sr-only" id="feed-sort-label">Sort results</span>
            <div role="group" aria-labelledby="feed-sort-label" className="flex items-center gap-0.5 p-0.5 rounded-lg bg-sunken border border-line/10">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setSort(o.value)}
                  aria-pressed={sort === o.value}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    sort === o.value ? 'bg-contrast text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openFilters}
              aria-expanded={showFilters}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                showFilters
                  ? 'bg-contrast text-white border-contrast'
                  : 'bg-surface text-ink border-line/12 hover:border-line/30'
              }`}
            >
              {gate.unlocked
                ? <SlidersHorizontal className="w-3.5 h-3.5" />
                : <Lock className="w-3.5 h-3.5 text-brand-ink" />}
              Filters
              {active.length > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold">
                  {active.length}
                </span>
              )}
            </button>

            {!gate.unlocked && (
              <span className="text-[11px] text-ink-soft">
                Filters are part of RamenNearYou+ — $2.99/mo
              </span>
            )}
          </div>

          {/* Active filters stay visible with the panel closed, so it's always
              clear why the list is as short as it is. */}
          {active.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {active.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleFilter(k)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand/12 border border-brand/35 text-[11px] font-semibold text-brand-ink hover:bg-brand/20 transition-colors"
                >
                  {CHIP_LABEL[k] ?? k}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActive([])}
                className="text-[11px] font-semibold text-ink-soft hover:text-ink px-1"
              >
                Clear all
              </button>
            </div>
          )}

          {showFilters && (
            <div className="rounded-xl border border-line/10 bg-raised p-4 mb-4 space-y-4">
              {FILTER_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.chips.map((c) => {
                      const on = active.includes(c.key)
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => toggleFilter(c.key)}
                          aria-pressed={on}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
                            on
                              ? 'bg-contrast text-white border-contrast'
                              : 'bg-surface text-ink-mid border-line/10 hover:border-brand/50'
                          }`}
                        >
                          <span aria-hidden="true">{c.emoji}</span> {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Waiting on location. The map above has its own "use my location"
              control, so this is a status line rather than a second prompt. */}
          {!pos && (
            <div className="rounded-xl border border-dashed border-line/12 bg-raised px-4 py-10 text-center">
              <Navigation className="w-5 h-5 text-brand mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink">Waiting for your location</p>
              <p className="text-xs text-ink-soft mt-1 max-w-sm mx-auto leading-relaxed">
                Allow location access, or search a city or ZIP on the map above, and this feed fills
                with the ramen closest to you.
              </p>
              <Link
                href="/find/best-ramen-near-me"
                className="inline-block mt-4 text-xs font-semibold text-brand-ink hover:underline"
              >
                Or browse every ramen spot →
              </Link>
            </div>
          )}

          {pos && loading && !loadedOnce && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-soft">
              <Loader2 className="w-4 h-4 animate-spin" /> Finding ramen near you…
            </div>
          )}

          {pos && loadedOnce && results.length === 0 && (
            <div className="rounded-xl border border-dashed border-line/12 bg-raised px-4 py-10 text-center">
              <p className="text-sm font-semibold text-ink">
                {active.length > 0
                  ? `No ramen within ${radius} miles matches those filters`
                  : `No ramen within ${radius} miles`}
              </p>
              <p className="text-xs text-ink-soft mt-1">
                {active.length > 0
                  ? 'Try removing a filter or widening the radius.'
                  : 'Try a wider radius, or browse by city.'}
              </p>
              {active.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setActive([])}
                  className="inline-block mt-4 text-xs font-semibold text-brand-ink hover:underline"
                >
                  Clear all filters →
                </button>
              ) : (
                <Link href="/cities" className="inline-block mt-4 text-xs font-semibold text-brand-ink hover:underline">
                  Browse ramen by city →
                </Link>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className={`space-y-2.5 transition-opacity ${loading ? 'opacity-60' : ''}`}>
              {results.map((r, i) => (
                <div key={r.slug}>
                  <ListicleCard
                    item={toCard(r)}
                    rank={i + 1}
                    distanceLabel={`${r.distanceMiles.toFixed(1)} mi`}
                  />
                  {/* Same in-feed break rhythm as the /find listicles. */}
                  {i === 4 && <div className="my-3"><ProductsCarousel variant="inline" /></div>}
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="flex justify-center mt-6">
              <Link
                href="/find/best-ramen-near-me"
                className="px-6 py-3 rounded-full bg-surface border border-line/12 text-sm font-semibold text-ink hover:border-brand/50 transition-colors"
              >
                See more ramen near you →
              </Link>
            </div>
          )}
        </div>
    </section>
  )

  return (
    <>
    <ErrorBoundary
      fallback={
        <section className="pt-16 bg-sunken">
          <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        </section>
      }
    >
      <HomeMapHero
        introAnimation
        autoLocate
        radiusMiles={radius}
        onUserPosChange={handlePos}
        feedSlot={feed}
      />
    </ErrorBoundary>
    <FilterGateModals gate={gate.gate} onClose={() => gate.setGate(null)} redirectTo="/" />
    </>
  )
}
