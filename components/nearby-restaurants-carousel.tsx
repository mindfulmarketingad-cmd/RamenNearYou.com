'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, MapPin, Loader2 } from 'lucide-react'

interface NearbyRestaurant {
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
  priceRange: string
  distanceMiles: number
}

// Broth detection + badge config
const BROTH_KEYWORDS: { label: string; terms: string[]; color: string; tooltip: string }[] = [
  { label: 'Tonkotsu', terms: ['tonkotsu','pork bone broth','hakata ramen','hakata style','jinya ramen','tatsu-ya','tatsuya ramen','ramen tatsu'], color: 'bg-amber-100 text-amber-800 border-amber-200', tooltip: 'Tonkotsu: Rich, creamy pork bone broth simmered for hours' },
  { label: 'Tsukemen', terms: ['tsukemen','dipping ramen','dipping noodle','okiboru'], color: 'bg-indigo-100 text-indigo-800 border-indigo-200', tooltip: 'Tsukemen: Dipping-style ramen — noodles served separately from the broth' },
  { label: 'Miso', terms: ['miso ramen','miso broth','miso soup','miso base','moonlight miso','sapporo ramen','sapporo style','red miso','white miso','miso tare'], color: 'bg-orange-100 text-orange-800 border-orange-200', tooltip: 'Miso: Bold, fermented soybean paste broth — classic Hokkaido style' },
  { label: 'Shoyu', terms: ['shoyu','soy sauce broth','soy broth','tokyo ramen','tokyo style','tokyo-style','shoyu tare','soy-based'], color: 'bg-yellow-100 text-yellow-800 border-yellow-200', tooltip: 'Shoyu: Clear, soy sauce-seasoned broth — the original Tokyo ramen' },
  { label: 'Shio', terms: ['shio','salt broth','shio tare','salt-based ramen','clear broth ramen','shio ramen'], color: 'bg-sky-100 text-sky-800 border-sky-200', tooltip: 'Shio: Light, delicate salt-based broth — the simplest, most refined style' },
  { label: 'Chicken', terms: ['tori paitan','chicken broth','chicken ramen','chicken-based','tori ramen','paitan','kin notori','kin no tori','chicken bone broth','poultry broth'], color: 'bg-lime-100 text-lime-800 border-lime-200', tooltip: 'Tori Paitan: Creamy chicken bone broth — lighter than pork, equally rich' },
]

function detectBroth(r: NearbyRestaurant): { label: string; color: string; tooltip: string } | null {
  const name = r.name.toLowerCase()
  const text = (name + ' ' + (r.description ?? '')).toLowerCase()
  if (name.includes('jinya ramen')) return BROTH_KEYWORDS[0]
  if (name.includes('okiboru')) return BROTH_KEYWORDS[1]
  if (name.includes('kin notori') || name.includes('kin no tori')) return BROTH_KEYWORDS[5]
  if (name.includes('tatsu-ya') || name.includes('ramen tatsu')) return BROTH_KEYWORDS[0]
  if (name.includes('moonlight miso')) return BROTH_KEYWORDS[2]
  const nameWords = name.split(/\s+/)
  if (nameWords.includes('miso')) return BROTH_KEYWORDS[2]
  if (nameWords.includes('sapporo')) return BROTH_KEYWORDS[2]
  for (const b of BROTH_KEYWORDS) {
    if (b.terms.some(t => text.includes(t))) return b
  }
  return null
}

function RestaurantCard({ r }: { r: NearbyRestaurant }) {
  const broth = detectBroth(r)
  return (
    <Link
      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
      className="group flex-shrink-0 w-[280px] sm:w-[300px] bg-white rounded-2xl overflow-hidden border border-black/6 hover:border-[#B57F50]/40 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Photo */}
      <div className="relative w-full h-44 bg-[#F5F4F0] overflow-hidden">
        {r.photo ? (
          <Image
            src={r.photo}
            alt={r.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-[#B57F50]/30" />
          </div>
        )}
        {/* Distance badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#1E2026] shadow-sm">
          {r.distanceMiles < 1 ? 'Under 1 mi' : `${r.distanceMiles.toFixed(1)} mi`}
        </div>
        {r.priceRange && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6B6862] shadow-sm">
            {r.priceRange}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1 mb-1">
          {r.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[#9B9490] text-xs">{r.city}, {r.stateCode}</p>
          {broth && (
            <span
              title={broth.tooltip}
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold cursor-help ${broth.color}`}
            >
              🍜 {broth.label}
            </span>
          )}
        </div>

        {r.rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i <= Math.round(r.rating!)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-[#1E2026]/15'
                  }`}
                />
              ))}
            </div>
            <span className="text-[#1E2026] text-xs font-semibold">{r.rating.toFixed(1)}</span>
            <span className="text-[#9B9490] text-xs">({r.reviewCount.toLocaleString()})</span>
          </div>
        )}

        {r.description && (
          <p className="text-[#6B6862] text-xs leading-relaxed line-clamp-2">{r.description}</p>
        )}
      </div>
    </Link>
  )
}

export default function NearbyRestaurantsCarousel() {
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([])
  const [city, setCity] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'no-location'>('loading')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchNearby(lat: number, lng: number, cityName?: string) {
      try {
        const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&limit=8`)
        const data = await res.json()
        if (data.results?.length > 0) {
          setRestaurants(data.results)
          setCity(cityName ?? data.results[0].city)
          setStatus('ready')
        } else {
          setStatus('no-location')
        }
      } catch {
        setStatus('no-location')
      }
    }

    async function init() {
      // Check if geolocation permission already granted (no prompt)
      if (!navigator.geolocation) { setStatus('no-location'); return }

      try {
        const perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state !== 'granted') { setStatus('no-location'); return }
      } catch {
        // Permissions API not supported — skip silently
        setStatus('no-location')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          let cityName: string | undefined
          try {
            const geo = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const geoData = await geo.json()
            cityName = geoData.city || geoData.locality
          } catch { /* ignore */ }
          fetchNearby(latitude, longitude, cityName)
        },
        () => setStatus('no-location'),
        { timeout: 6000 }
      )
    }

    init()
  }, [])

  function updateScrollButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollButtons)
  }, [restaurants])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  // Don't render anything if no location
  if (status === 'no-location') return null

  if (status === 'loading') {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0]">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[#9B9490] text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Finding ramen near you…
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-1">Near You</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">
              Ramen Near Me
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-black/10 bg-white text-[#1E2026] hover:border-[#B57F50]/40 hover:text-[#B57F50] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-black/10 bg-white text-[#1E2026] hover:border-[#B57F50]/40 hover:text-[#B57F50] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {restaurants.map((r) => (
            <div key={r.slug} style={{ scrollSnapAlign: 'start' }}>
              <RestaurantCard r={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
