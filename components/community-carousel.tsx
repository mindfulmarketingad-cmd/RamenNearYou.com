'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, User } from 'lucide-react'

interface CommunityProfile {
  display_name: string
  avatar_url?: string
  bio?: string
  favorite_broth?: string
  ramen_count?: number
  instagram?: string
}

const BROTH_COLORS: Record<string, string> = {
  Tonkotsu:   'bg-amber-100 text-amber-800 border-amber-200',
  Miso:       'bg-yellow-100 text-yellow-800 border-yellow-200',
  Shoyu:      'bg-orange-100 text-orange-800 border-orange-200',
  Shio:       'bg-sky-100 text-sky-800 border-sky-200',
  Tsukemen:   'bg-purple-100 text-purple-800 border-purple-200',
  Chicken:    'bg-lime-100 text-lime-800 border-lime-200',
  'All of them!': 'bg-rose-100 text-rose-800 border-rose-200',
}

function ProfileCard({ p }: { p: CommunityProfile }) {
  const brothClass = p.favorite_broth ? (BROTH_COLORS[p.favorite_broth] ?? 'bg-[#B57F50]/15 text-[#B57F50] border-[#B57F50]/20') : ''

  return (
    <div className="flex flex-col items-center gap-3 w-44 shrink-0 select-none">
      <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-[#F5F4F0] border border-black/8 shadow-sm">
        {p.avatar_url ? (
          <Image src={p.avatar_url} alt={p.display_name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
            <User className="w-12 h-12 text-[#B57F50]/30" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#1E2026] text-sm leading-tight mb-1 line-clamp-1">{p.display_name}</p>
        {p.favorite_broth && (
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${brothClass}`}>
            {p.favorite_broth}
          </span>
        )}
        {p.ramen_count != null && p.ramen_count > 0 && (
          <p className="text-[#9B9490] text-[10px] mt-1">{p.ramen_count} bowls</p>
        )}
      </div>
    </div>
  )
}

export default function CommunityCarousel() {
  const [profiles, setProfiles] = useState<CommunityProfile[]>([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  useEffect(() => {
    fetch('/api/community-profiles')
      .then(r => r.json())
      .then(d => setProfiles(d.profiles ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function checkScroll() {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => { el.removeEventListener('scroll', checkScroll); window.removeEventListener('resize', checkScroll) }
  }, [profiles])

  function scroll(dir: 'left' | 'right') {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' })
  }

  if (!loading && profiles.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">Meet the Community</h2>
          <Link
            href="/auth/login"
            className="flex items-center gap-1 text-sm font-semibold text-[#B57F50] hover:text-[#c8934f] transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          {/* Left arrow */}
          {canLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 w-9 h-9 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-[#1E2026] hover:bg-[#F5F4F0] transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-44 shrink-0">
                  <div className="w-40 h-40 rounded-2xl bg-[#E8E6E0] animate-pulse" />
                  <div className="h-3 w-24 rounded bg-[#E8E6E0] animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto pb-2 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {profiles.map((p, i) => (
                <ProfileCard key={i} p={p} />
              ))}
            </div>
          )}

          {/* Right arrow */}
          {canRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 w-9 h-9 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-[#1E2026] hover:bg-[#F5F4F0] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-[#9B9490] mt-6">
          <Link href="/auth/login" className="text-[#B57F50] hover:underline font-medium">Create your profile</Link>
          {' '}to appear in the community
        </p>
      </div>
    </section>
  )
}
