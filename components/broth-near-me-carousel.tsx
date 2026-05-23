'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

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

function RestaurantCard({ r }: { r: NearbyRestaurant }) {
  return (
    <Link
      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
      className="group flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl overflow-hidden border border-black/6 hover:border-[#B57F50]/40 shadow-sm hover:shadow-md transition-all duration-200"
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
        {r.priceRange && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6B6862] shadow-sm">
            {r.priceRange}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1 mb-1">
          {r.name}
        </h3>
        <p className="text-[#9B9490] text-xs mb-2">{r.city}, {r.stateCode}</p>
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">{title}</h2>
            <p className="text-[#6B6862] text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
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
        </div>

        {status === 'loading' ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-[260px] sm:w-[280px] h-52 rounded-2xl bg-black/5 animate-pulse" />
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
                <RestaurantCard r={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
