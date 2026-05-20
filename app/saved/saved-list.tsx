'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Star, Loader2 } from 'lucide-react'
import { restaurants } from '@/lib/restaurants'
import { getSavedSlugs } from '@/lib/saves'
import RestaurantImage from '@/components/restaurant-image'

export default function SavedList() {
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

  if (slugs === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#B57F50] animate-spin" />
      </div>
    )
  }

  if (saved.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="w-12 h-12 text-[#B57F50]/30 mx-auto mb-4" />
        <p className="text-white text-lg font-medium mb-2">Nothing saved yet</p>
        <p className="text-[#B0B3BB] text-sm mb-6">
          Hit the Save button on any restaurant listing to build your list.
        </p>
        <Link
          href="/cities"
          className="px-5 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
        >
          Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {saved.map((r) => (
        <Link
          key={r.slug}
          href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
          className="group flex flex-col bg-[#1E2026] rounded-xl border border-white/5 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
        >
          <div className="relative h-44 bg-[#2F323A] overflow-hidden flex-shrink-0">
            <RestaurantImage
              src={r.photo}
              alt={r.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2026] via-transparent to-transparent" />
          </div>
          <div className="p-4 flex flex-col flex-1 gap-2">
            <div>
              <h2 className="font-semibold text-white text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">
                {r.name}
              </h2>
              <p className="flex items-center gap-1 text-xs text-[#B0B3BB] mt-0.5">
                <MapPin className="w-3 h-3 text-[#B57F50] flex-shrink-0" />
                {r.city}, {r.stateCode}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              {r.rating ? (
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {r.rating.toFixed(1)}
                  <span className="text-white/30">({r.reviewCount.toLocaleString()})</span>
                </span>
              ) : <span />}
              <span className="text-[#B57F50] text-xs font-medium group-hover:underline">View →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
