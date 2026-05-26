'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import CardSaveButton from '@/components/card-save-button'

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

interface Props {
  brothType: string
  title: string
  description: string
}

const BROTH_BADGE: Record<string, { color: string; tooltip: string }> = {
  Tonkotsu:  { color: 'bg-amber-100 text-amber-800 border-amber-200',   tooltip: 'Tonkotsu: Rich, creamy pork bone broth simmered for hours' },
  Tsukemen:  { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', tooltip: 'Tsukemen: Dipping-style ramen — noodles served separately from the broth' },
  Miso:      { color: 'bg-orange-100 text-orange-800 border-orange-200', tooltip: 'Miso: Bold, fermented soybean paste broth — classic Hokkaido style' },
  Shoyu:     { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', tooltip: 'Shoyu: Clear, soy sauce-seasoned broth — the original Tokyo ramen' },
  Shio:      { color: 'bg-sky-100 text-sky-800 border-sky-200',          tooltip: 'Shio: Light, delicate salt-based broth — the simplest, most refined style' },
  Chicken:   { color: 'bg-lime-100 text-lime-800 border-lime-200',       tooltip: 'Tori Paitan: Creamy chicken bone broth — lighter than pork, equally rich' },
  Spicy:     { color: 'bg-red-100 text-red-800 border-red-200',          tooltip: 'Spicy: Heat-forward broth — tantanmen, volcano ramen, or chili-spiked styles' },
}

function RestaurantCard({ r, brothType }: { r: NearbyRestaurant; brothType: string }) {
  const badge = BROTH_BADGE[brothType]
  return (
    <Link
      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
      className="group flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-full h-40 bg-[#F5F4F0] overflow-hidden">
        {r.photo ? (
          <Image
            src={r.photo}
            alt={r.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="280px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-[#B57F50]/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#1E2026] shadow-sm">
          {r.distanceMiles < 1 ? 'Under 1 mi' : `${r.distanceMiles.toFixed(1)} mi`}
        </div>
        {/* Save button */}
        <CardSaveButton slug={r.slug} restaurantName={r.name} />
        {r.priceRange && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6B6862] shadow-sm">
            {r.priceRange}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1 mb-1">
          {r.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[#9B9490] text-xs">{r.city}, {r.stateCode}</p>
        </div>
        {r.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= Math.round(r.rating!) ? 'text-amber-400 fill-amber-400' : 'text-[#1E2026]/15'}`}
                />
              ))}
            </div>
            <span className="text-[#1E2026] text-xs font-semibold">{r.rating.toFixed(1)}</span>
            <span className="text-[#9B9490] text-xs">({r.reviewCount.toLocaleString()})</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function BrothNearMeCarousel({ brothType, title, description }: Props) {
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'hidden'>('loading')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      if (!navigator.geolocation) { setStatus('hidden'); return }
      try {
        const perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state !== 'granted') { setStatus('hidden'); return }
      } catch {
        setStatus('hidden'); return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          try {
            const res = await fetch(
              `/api/nearby?lat=${latitude}&lng=${longitude}&broth=${encodeURIComponent(brothType)}&limit=8`
            )
            const data = await res.json()
            if (data.results?.length > 0) {
              setRestaurants(data.results)
              setStatus('ready')
            } else {
              setStatus('hidden')
            }
          } catch {
            setStatus('hidden')
          }
        },
        () => setStatus('hidden'),
        { timeout: 6000 }
      )
    }
    init()
  }, [brothType])

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
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
  }

  if (status === 'hidden') return null

  return (
    <section className="broth-carousel-section py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="broth-carousel-title font-serif text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
            <p className="broth-carousel-desc text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="broth-carousel-btn p-2 rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="broth-carousel-btn p-2 rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {status === 'loading' ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="broth-carousel-skeleton flex-shrink-0 w-[260px] sm:w-[280px] h-52 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {restaurants.map((r) => (
              <div key={r.slug} style={{ scrollSnapAlign: 'start' }}>
                <RestaurantCard r={r} brothType={brothType} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
