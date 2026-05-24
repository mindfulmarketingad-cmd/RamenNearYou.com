'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Star, Navigation, BadgeCheck, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'
import { isOpenNow } from '@/lib/hours'
import RestaurantImage from '@/components/restaurant-image'

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-[#1E2026]/20'}`}
        />
      ))}
    </span>
  )
}

type BadgeVariant = 'broth' | 'spicy' | 'vegan' | 'amenity'

function Badge({ children, variant }: { children: React.ReactNode; variant: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    broth:   'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300',
    spicy:   'bg-red-500/20 border border-red-400/40 text-red-300',
    vegan:   'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300',
    amenity: 'bg-black/5 border border-black/8 text-[#6B6862]',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

const BROTH_KEYWORDS: { label: string; terms: string[] }[] = [
  {
    label: 'Tonkotsu',
    terms: [
      'tonkotsu', 'pork bone broth', 'hakata ramen', 'hakata style',
      'jinya ramen', 'tatsu-ya', 'tatsuya ramen', 'ramen tatsu',
    ],
  },
  {
    label: 'Tsukemen',
    terms: ['tsukemen', 'dipping ramen', 'dipping noodle', 'okiboru'],
  },
  {
    label: 'Miso',
    terms: [
      'miso ramen', 'miso broth', 'miso soup', 'miso base',
      'moonlight miso', 'sapporo ramen', 'sapporo style',
      'red miso', 'white miso', 'miso tare',
    ],
  },
  {
    label: 'Shoyu',
    terms: [
      'shoyu', 'soy sauce broth', 'soy broth', 'tokyo ramen',
      'tokyo style', 'tokyo-style', 'shoyu tare', 'soy-based',
    ],
  },
  {
    label: 'Shio',
    terms: [
      'shio', 'salt broth', 'shio tare', 'salt-based ramen',
      'clear broth ramen', 'shio ramen',
    ],
  },
  {
    label: 'Chicken',
    terms: [
      'tori paitan', 'chicken broth', 'chicken ramen', 'chicken-based',
      'tori ramen', 'paitan', 'kin notori', 'kin no tori',
      'chicken bone broth', 'poultry broth',
    ],
  },
]

function detectBroth(r: Restaurant): string | null {
  const name = r.name.toLowerCase()
  const text = (name + ' ' + (r.description ?? '') + ' ' + (r.subtypes ?? '')).toLowerCase()

  // Chain-specific overrides by restaurant name substring
  if (name.includes('jinya ramen')) return 'Tonkotsu'
  if (name.includes('okiboru')) return 'Tsukemen'
  if (name.includes('kin notori') || name.includes('kin no tori')) return 'Chicken'
  if (name.includes('tatsu-ya') || name.includes('ramen tatsu')) return 'Tonkotsu'
  if (name.includes('moonlight miso')) return 'Miso'

  // Special: "miso" or "sapporo" standalone in name strongly implies miso ramen
  const nameWords = name.split(/\s+/)
  if (nameWords.includes('miso')) return 'Miso'
  if (nameWords.includes('sapporo')) return 'Miso'

  for (const { label, terms } of BROTH_KEYWORDS) {
    if (terms.some((t) => text.includes(t))) return label
  }
  return null
}

const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$']
const RATING_OPTIONS = [
  { label: '4.5+', value: 4.5 },
  { label: '4.0+', value: 4.0 },
  { label: '3.5+', value: 3.5 },
]
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
        active
          ? 'bg-[#B57F50] border-[#B57F50] text-[#1E2026]'
          : 'bg-black/5 border-black/8 text-[#6B6862] hover:border-black/15 hover:text-[#1E2026]'
      }`}
    >
      {children}
    </button>
  )
}

interface Props {
  restaurants: Restaurant[]
  city: string
  state: string
  verifiedSlugs?: string[]
}

export default function CityRestaurantGrid({ restaurants, city, state, verifiedSlugs = [] }: Props) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [sort, setSort]         = useState<string>('default')
  const [broth, setBroth]       = useState<string | null>(null)
  const [prices, setPrices]     = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [features, setFeatures] = useState<string[]>([])

  const FEATURE_OPTIONS = [
    { label: 'Vegan-Friendly',    key: 'vegan' },
    { label: 'Vegetarian',        key: 'vegetarian' },
    { label: 'Delivery',          key: 'delivery' },
    { label: 'Takeout',           key: 'takeout' },
    { label: 'Dine-in',           key: 'dineIn' },
    { label: 'Outdoor Seating',   key: 'outdoor' },
    { label: 'Reservations',      key: 'reservations' },
    { label: 'Bar',               key: 'bar' },
    { label: 'Parking',           key: 'parking' },
  ]

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000 }
    )
  }, [])

  useEffect(() => {
    if (userPos && sort === 'default') setSort('distance')
  }, [userPos]) // eslint-disable-line react-hooks/exhaustive-deps

  function togglePrice(p: string) {
    setPrices((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }
  function toggleFeature(k: string) {
    setFeatures((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k])
  }

  const activeFilterCount = [
    broth ? 1 : 0,
    prices.length,
    minRating ? 1 : 0,
    features.length,
  ].reduce((a, b) => a + b, 0)

  const filtered = useMemo(() => {
    let list = restaurants.map((r) => ({
      r,
      brothType: detectBroth(r),
      distance: userPos && r.latitude && r.longitude
        ? haversineMiles(userPos.lat, userPos.lng, r.latitude, r.longitude)
        : null,
      openStatus: r.hours ? isOpenNow(r.hours) : null,
    }))

    if (sort === 'openNow') list = list.filter(({ openStatus }) => openStatus === true)

    if (broth) list = list.filter(({ brothType }) => brothType === broth)
    if (prices.length) list = list.filter(({ r }) => prices.includes(r.priceRange))
    if (minRating) list = list.filter(({ r }) => (r.rating ?? 0) >= minRating)
    if (features.includes('vegan'))        list = list.filter(({ r }) => r.amenities.veganOptions)
    if (features.includes('vegetarian'))   list = list.filter(({ r }) => r.amenities.vegetarianOptions)
    if (features.includes('delivery'))     list = list.filter(({ r }) => r.amenities.delivery)
    if (features.includes('takeout'))      list = list.filter(({ r }) => r.amenities.takeout)
    if (features.includes('dineIn'))       list = list.filter(({ r }) => r.amenities.dineIn)
    if (features.includes('outdoor'))      list = list.filter(({ r }) => r.amenities.outdoorSeating)
    if (features.includes('reservations')) list = list.filter(({ r }) => r.amenities.acceptsReservations)
    if (features.includes('bar'))          list = list.filter(({ r }) => r.amenities.alcohol)
    if (features.includes('parking'))      list = list.filter(({ r }) => r.amenities.parking)

    if (sort === 'distance' && userPos) {
      list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    } else if (sort === 'alpha') {
      list.sort((a, b) => a.r.name.localeCompare(b.r.name))
    } else if (sort === 'reviews') {
      list.sort((a, b) => b.r.reviewCount - a.r.reviewCount)
    } else if (sort === 'price') {
      list.sort((a, b) => (a.r.priceRange ?? '').length - (b.r.priceRange ?? '').length)
    } else if (sort === 'veg') {
      list.sort((a, b) => {
        const aVeg = a.r.amenities.veganOptions || a.r.amenities.vegetarianOptions ? 0 : 1
        const bVeg = b.r.amenities.veganOptions || b.r.amenities.vegetarianOptions ? 0 : 1
        return aVeg - bVeg
      })
    } else {
      list.sort((a, b) => (b.r.rating ?? 0) - (a.r.rating ?? 0))
    }

    return list
  }, [restaurants, broth, prices, minRating, features, sort, userPos])

  function clearAll() {
    setBroth(null)
    setPrices([])
    setMinRating(null)
    setFeatures([])
    setSort('default')
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 space-y-3">
        {/* Quick broth filter — always visible */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#6B6862] text-xs font-medium uppercase tracking-wider mr-1">Broth:</span>
          <FilterPill active={broth === null} onClick={() => setBroth(null)}>
            All
          </FilterPill>
          {BROTH_KEYWORDS.map(({ label }) => (
            <FilterPill key={label} active={broth === label} onClick={() => setBroth(broth === label ? null : label)}>
              {label}
            </FilterPill>
          ))}
        </div>

        {/* Top row: sort + toggle */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="default">Default (by rating)</option>
            <option value="alpha">Alphabetical</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price">Price (low→high)</option>
            <option value="veg">Vegan First</option>
            <option value="openNow">Open Now</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeFilterCount > 0
                ? 'bg-[#B57F50]/20 border-[#B57F50]/50 text-[#B57F50]'
                : 'bg-black/5 border-black/8 text-[#6B6862] hover:border-black/15 hover:text-[#1E2026]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-4 space-y-4">
            {/* Broth */}
            <div>
              <p className="text-[#6B6862] text-xs font-medium mb-2">Broth Type</p>
              <div className="flex flex-wrap gap-2">
                {BROTH_KEYWORDS.map(({ label }) => (
                  <FilterPill key={label} active={broth === label} onClick={() => setBroth(broth === label ? null : label)}>
                    {label}
                  </FilterPill>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[#6B6862] text-xs font-medium mb-2">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map((p) => (
                  <FilterPill key={p} active={prices.includes(p)} onClick={() => togglePrice(p)}>
                    {p}
                  </FilterPill>
                ))}
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <p className="text-[#6B6862] text-xs font-medium mb-2">Minimum Rating</p>
              <div className="flex flex-wrap gap-2">
                {RATING_OPTIONS.map(({ label, value }) => (
                  <FilterPill key={label} active={minRating === value} onClick={() => setMinRating(minRating === value ? null : value)}>
                    ⭐ {label}
                  </FilterPill>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-[#6B6862] text-xs font-medium mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {FEATURE_OPTIONS.map(({ label, key }) => (
                  <FilterPill key={key} active={features.includes(key)} onClick={() => toggleFeature(key)}>
                    {label}
                  </FilterPill>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-[#6B6862] hover:text-[#1E2026] transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      {activeFilterCount > 0 && (
        <p className="text-[#6B6862] text-sm mb-4">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} match your filters
          {filtered.length === 0 && (
            <button onClick={clearAll} className="ml-2 text-[#B57F50] hover:underline">Clear filters</button>
          )}
        </p>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map(({ r, brothType, distance, openStatus }) => {
          const isSpicy = (r.name + ' ' + r.description).toLowerCase().includes('spicy')
          const isVerified = verifiedSlugs.includes(r.slug)

          return (
            <Link
              key={r.slug}
              href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
              className="group flex flex-col sm:flex-row bg-[#F5F4F0] rounded-xl border border-black/5 hover:border-[#B57F50]/50 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 overflow-hidden"
            >
              {/* Photo */}
              <div className="relative w-full sm:w-48 shrink-0 h-44 sm:h-auto bg-[#ffffff]">
                <RestaurantImage
                  src={r.photo}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
                {distance !== null && (
                  <span className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 text-[#B57F50] text-xs font-medium backdrop-blur-sm">
                    <Navigation className="w-2.5 h-2.5" />
                    {distance.toFixed(1)} mi
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2 min-w-0">

                {/* Name + verified */}
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-[#1E2026] text-base leading-snug group-hover:text-[#B57F50] transition-colors">
                    {r.name}
                  </p>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold shrink-0">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Rating + type label */}
                {(r.rating || r.reviewCount > 0) && (
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    <span className="font-semibold text-[#B57F50]">{r.rating?.toFixed(1)}</span>
                    <span className="text-[#6B6862]">({r.reviewCount.toLocaleString()})</span>
                    {(r.amenities.veganOptions || r.amenities.vegetarianOptions) && (
                      <>
                        <span className="text-[#6B6862]">•</span>
                        <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                          🌱 {r.amenities.veganOptions ? 'Vegan-Friendly' : 'Vegetarian Options'}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Open status + price */}
                <div className="flex items-center gap-2 text-sm">
                  {openStatus !== null && (
                    <span className={`font-semibold text-xs ${openStatus ? 'text-emerald-600' : 'text-red-500'}`}>
                      {openStatus ? 'Open Now' : 'Closed'}
                    </span>
                  )}
                  {openStatus !== null && r.priceRange && <span className="text-[#6B6862] text-xs">•</span>}
                  {r.priceRange && (
                    <span className="text-xs font-medium text-[#6B6862]">{r.priceRange}</span>
                  )}
                </div>

                {/* Tags as comma-separated bold text */}
                {(() => {
                  const tags: string[] = []
                  if (brothType) tags.push(brothType)
                  if (isSpicy) tags.push('Spicy')
                  if (r.amenities.dineIn) tags.push('Dine-in')
                  if (r.amenities.takeout) tags.push('Take-out')
                  if (r.amenities.delivery) tags.push('Delivery')
                  if (r.amenities.outdoorSeating) tags.push('Outdoor Seating')
                  if (r.amenities.acceptsReservations) tags.push('Reservations')
                  if (r.amenities.alcohol) tags.push('Bar')
                  if (r.amenities.parking) tags.push('Parking')
                  return tags.length > 0 ? (
                    <p className="text-[#1E2026] text-xs font-semibold leading-relaxed">
                      {tags.join(', ')}
                    </p>
                  ) : null
                })()}

                {/* Description */}
                {r.description && (
                  <p className="text-[#6B6862] text-sm leading-relaxed line-clamp-2">{r.description}</p>
                )}

                {/* Phone */}
                {r.phone && (
                  <div className="flex items-center gap-1.5 text-sm text-[#1E2026]/70">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[#6B6862]" />
                    <span>{r.phone}</span>
                  </div>
                )}

                {/* Address */}
                {r.address && (
                  <div className="flex items-center gap-1.5 text-sm text-[#B57F50]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="hover:underline line-clamp-1">{r.address}</span>
                  </div>
                )}

                {/* Footer: Read Reviews + distance */}
                <div className="mt-auto pt-3 flex items-center justify-between gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#B57F50]/40 text-[#B57F50] text-xs font-semibold group-hover:bg-[#B57F50] group-hover:text-white transition-colors">
                    Read Reviews ↗
                  </span>
                  {distance !== null && (
                    <span className="flex items-center gap-1 text-[#6B6862] text-xs">
                      <Navigation className="w-3 h-3" />
                      {distance.toFixed(1)} mi away
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
