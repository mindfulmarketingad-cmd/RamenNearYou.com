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

  for (const { label, terms } of BROTH_KEYWORDS) {
    if (terms.some(term => text.includes(term))) return label
  }
  return null
}

const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$']
const RATING_OPTIONS = [
  { label: '4.5+', value: 4.5 },
  { label: '4.0+', value: 4 },
  { label: '3.5+', value: 3.5 },
]
const FEATURE_OPTIONS = [
  { label: 'Vegan', key: 'vegan' },
  { label: 'Vegetarian', key: 'vegetarian' },
  { label: 'Delivery', key: 'delivery' },
  { label: 'Takeout', key: 'takeout' },
  { label: 'Dine In', key: 'dineIn' },
  { label: 'Outdoor', key: 'outdoor' },
  { label: 'Reservations', key: 'reservations' },
  { label: 'Bar', key: 'bar' },
  { label: 'Parking', key: 'parking' },
]

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? 'bg-[#B57F50] border-[#B57F50] text-white'
          : 'bg-white border-black/10 text-[#1E2026] hover:border-[#B57F50]/50 hover:text-[#B57F50]'
      }`}
    >
      {children}
    </button>
  )
}

export default function StateRestaurantGrid({ restaurants }: { restaurants: Restaurant[] }) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter state
  const [sort, setSort]         = useState<string>('default')
  const [broth, setBroth]       = useState<string | null>(null)
  const [prices, setPrices]     = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  const [vegan, setVegan] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const [korean, setKorean] = useState(false)
  const [japanese, setJapanese] = useState(false)

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      )
    }
  }, [])

  const activeFilterCount = [
    broth ? 1 : 0,
    prices.length,
    minRating ? 1 : 0,
    features.length,
    vegan ? 1 : 0,
    spicy ? 1 : 0,
    korean ? 1 : 0,
    japanese ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  function togglePrice(p: string) {
    setPrices(prices.includes(p) ? prices.filter(x => x !== p) : [...prices, p])
  }

  function toggleFeature(key: string) {
    setFeatures(features.includes(key) ? features.filter(x => x !== key) : [...features, key])
  }

  function clearAll() {
    setBroth(null)
    setPrices([])
    setMinRating(null)
    setFeatures([])
    setVegan(false)
    setSpicy(false)
    setKorean(false)
    setJapanese(false)
    setSort('default')
  }

  // Filter and sort
  const filtered = useMemo(() => {
    let list = restaurants.map(r => ({
      r,
      brothType: detectBroth(r),
      distance: userPos ? haversineMiles(userPos.lat, userPos.lng, r.lat, r.lng) : Infinity,
    }))

    if (broth) list = list.filter(({ brothType }) => brothType === broth)
    if (vegan) list = list.filter(({ r }) => r.amenities.veganOptions)
    if (spicy) list = list.filter(({ r }) => (r.name + ' ' + r.description).toLowerCase().includes('spicy'))
    if (korean) list = list.filter(({ r }) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('korean'))
    if (japanese) list = list.filter(({ r }) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('japanese'))
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

    // Sort
    if (sort === 'alpha') list.sort((a, b) => a.r.name.localeCompare(b.r.name))
    else if (sort === 'rating') list.sort((a, b) => (b.r.rating ?? 0) - (a.r.rating ?? 0))
    else if (sort === 'reviews') list.sort((a, b) => (b.r.reviewCount ?? 0) - (a.r.reviewCount ?? 0))
    else if (sort === 'price') list.sort((a, b) => a.r.priceRange.localeCompare(b.r.priceRange))
    else if (sort === 'veg') list.sort((a, b) => (b.r.amenities.veganOptions ? 1 : 0) - (a.r.amenities.veganOptions ? 1 : 0))
    else if (sort === 'openNow') list.sort((a, b) => (isOpenNow(b.r.hours) ? 1 : 0) - (isOpenNow(a.r.hours) ? 1 : 0))
    else if (sort === 'distance') list.sort((a, b) => a.distance - b.distance)
    else list.sort((a, b) => (b.r.rating ?? 0) - (a.r.rating ?? 0))

    return list
  }, [restaurants, broth, prices, minRating, features, sort, userPos, vegan, spicy, korean, japanese])

  return (
    <div className="space-y-4">
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

          {/* Dietary & Taste */}
          <div>
            <p className="text-[#6B6862] text-xs font-medium mb-2">Dietary & Taste</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill active={vegan} onClick={() => setVegan(!vegan)}>
                Vegan
              </FilterPill>
              <FilterPill active={spicy} onClick={() => setSpicy(!spicy)}>
                Spicy
              </FilterPill>
              <FilterPill active={korean} onClick={() => setKorean(!korean)}>
                Korean
              </FilterPill>
              <FilterPill active={japanese} onClick={() => setJapanese(!japanese)}>
                Japanese
              </FilterPill>
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

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="w-full text-center text-xs text-[#6B6862] hover:text-[#B57F50] py-2 font-medium border-t border-black/5 pt-3"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(({ r }) => (
          <Link
            key={r.id}
            href={`/${r.city.replaceAll(' ', '-').toLowerCase()}/${r.state.toLowerCase()}/${r.slug}`}
            className="group bg-white border border-black/8 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <RestaurantImage src={r.image} alt={r.name} />
            <div className="p-4 space-y-3">
              <div>
                <p className="font-medium text-[#1E2026] text-sm group-hover:text-[#B57F50] transition-colors line-clamp-1">
                  {r.name}
                </p>
                <p className="text-xs text-[#6B6862] line-clamp-1 mt-0.5">{r.subtypes}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={r.rating} />
                  {r.reviewCount && <span className="text-xs text-[#6B6862]">({r.reviewCount})</span>}
                </div>
                {r.priceRange && <span className="text-xs font-medium text-[#6B6862]">{r.priceRange}</span>}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#6B6862]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{r.neighborhood}</span>
              </div>

              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 text-xs text-[#6B6862] hover:text-[#B57F50] transition-colors" onClick={(e) => e.preventDefault()}>
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{r.phone}</span>
                </a>
              )}

              {isOpenNow(r.hours) && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  Open Now
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {detectBroth(r) && <Badge variant="broth">{detectBroth(r)}</Badge>}
                {r.amenities.veganOptions && <Badge variant="vegan">Vegan</Badge>}
                {(r.name + ' ' + r.description).toLowerCase().includes('spicy') && <Badge variant="spicy">Spicy</Badge>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#6B6862] text-sm">No restaurants found matching your filters.</p>
          <button onClick={clearAll} className="text-[#B57F50] text-sm font-medium mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
