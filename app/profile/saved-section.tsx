'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'

interface SavedRestaurant {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  photo: string | null
  rating: number | null
}

export default function SavedSection() {
  const [saved, setSaved] = useState<SavedRestaurant[] | null>(null)

  useEffect(() => {
    fetch('/api/saves/restaurants')
      .then(res => res.json())
      .then(data => setSaved(Array.isArray(data.restaurants) ? data.restaurants : []))
      .catch(() => setSaved([]))
  }, [])

  if (saved === null) return null

  if (saved.length === 0) {
    return (
      <div className="bg-sunken border border-line/8 rounded-xl p-8 text-center">
        <Heart className="w-10 h-10 text-brand-ink/30 mx-auto mb-3" />
        <p className="text-ink text-sm font-medium mb-1">Nothing saved yet</p>
        <p className="text-ink-soft text-xs mb-4">Hit the Save button on any restaurant listing to build your list.</p>
        <Link
          href="/cities"
          className="inline-block px-4 py-2 rounded-none bg-brand text-white text-xs font-medium hover:bg-brand-hi transition-colors"
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
          className="group flex gap-3 bg-sunken rounded-xl border border-line/5 overflow-hidden hover:border-brand/40 transition-all duration-200"
        >
          <div className="relative w-20 h-20 bg-surface overflow-hidden flex-shrink-0">
            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 py-2 pr-3">
            <h3 className="font-semibold text-ink text-sm leading-snug group-hover:text-brand-ink transition-colors line-clamp-1">{r.name}</h3>
            <p className="flex items-center gap-1 text-xs text-ink-soft mt-0.5">
              <MapPin className="w-3 h-3 text-brand-ink flex-shrink-0" />
              {r.city}, {r.stateCode}
            </p>
            {r.rating && (
              <span className="flex items-center gap-1 text-xs text-ink/60 mt-1">
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
