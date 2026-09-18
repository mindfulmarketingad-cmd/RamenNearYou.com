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
  Tonkotsu:   'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
  Miso:       'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30',
  Shoyu:      'bg-orange-100 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
  Shio:       'bg-sky-100 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
  Tsukemen:   'bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
  Chicken:    'bg-lime-100 dark:bg-lime-500/15 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-500/30',
  'All of them!': 'bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
}

function ProfileCard({ p }: { p: CommunityProfile }) {
  const brothClass = p.favorite_broth ? (BROTH_COLORS[p.favorite_broth] ?? 'bg-brand/15 text-brand-ink border-brand/20') : ''

  return (
    <div className="flex flex-col items-center gap-3 w-44 shrink-0 select-none">
      <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-sunken border border-line/8 shadow-sm">
        {p.avatar_url ? (
          <Image src={p.avatar_url} alt={p.display_name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sunken">
            <User className="w-12 h-12 text-brand-ink/30" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-ink text-sm leading-tight mb-1 line-clamp-1">{p.display_name}</p>
        {p.favorite_broth && (
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${brothClass}`}>
            {p.favorite_broth}
          </span>
        )}
        {p.ramen_count != null && p.ramen_count > 0 && (
          <p className="text-ink-soft text-[10px] mt-1">{p.ramen_count} bowls</p>
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-sunken border-t border-line/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Meet the Community</h2>
          <Link
            href="/auth/login"
            className="flex items-center gap-1 text-sm font-semibold text-brand-ink hover:text-brand-hi transition-colors"
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
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 w-9 h-9 rounded-full bg-surface border border-line/10 shadow-md flex items-center justify-center text-ink hover:bg-sunken transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-44 shrink-0">
                  <div className="w-40 h-40 rounded-2xl bg-page animate-pulse" />
                  <div className="h-3 w-24 rounded bg-page animate-pulse" />
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 w-9 h-9 rounded-full bg-surface border border-line/10 shadow-md flex items-center justify-center text-ink hover:bg-sunken transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-ink-soft mt-6">
          <Link href="/auth/login" className="text-brand-ink hover:underline font-medium">Create your profile</Link>
          {' '}to appear in the community
        </p>
      </div>
    </section>
  )
}
