'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import { restaurants } from '@/lib/restaurants'
import { getSavedSlugs } from '@/lib/saves'
import RestaurantImage from '@/components/restaurant-image'

export default function SavedSection() {
  const [slugs, setSlugs] = useState<string[] | null>(null)

  useEffect(() => {
    setSlugs(getSavedSlugs())
    function onStorage(e: StorageEvent) {
      if (e.key === 'ramennearyou:saves') setSlugs(getSavedSlugs())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const saved = useMemo(
    () => (slugs ?? []).flatMap(slug => {
      const r = restaurants.find(x => x.slug === slug)
      return r ? [r] : []
    }),
    [slugs]
  )

  if (slugs === null) return null

  if (saved.length === 0) {
    return (
      <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-8 text-center">
        <Heart className="w-10 h-10 text-[#B57F50]/30 mx-auto mb-3" />
        <p className="text-[#1E2026] text-sm font-medium mb-1">Nothing saved yet</p>
        <p className="text-[#6B6862] text-xs mb-4">Hit the Save button on any restaurant listing to build your list.</p>
        <Link
          href="/cities"
          className="inline-block px-4 py-2 rounded-lg bg-[#B57F50] text-white text-xs font-medium hover:bg-[#c8934f] transition-colors"
        >
          Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {saved.map((r) => (
        <Link
          key={r.slug}
          href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
          className="group flex gap-3 bg-[#F5F4F0] rounded-xl border border-black/5 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200"
        >
          <div className="relative w-20 h-20 bg-[#ffffff] overflow-hidden flex-shrink-0">
            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 py-2 pr-3">
            <h3 className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">{r.name}</h3>
            <p className="flex items-center gap-1 text-xs text-[#6B6862] mt-0.5">
              <MapPin className="w-3 h-3 text-[#B57F50] flex-shrink-0" />
              {r.city}, {r.stateCode}
            </p>
            {r.rating && (
              <span className="flex items-center gap-1 text-xs text-[#1E2026]/60 mt-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {r.rating.toFixed(1)}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
