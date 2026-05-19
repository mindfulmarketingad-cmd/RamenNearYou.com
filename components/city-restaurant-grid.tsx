'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Star, Navigation, BadgeCheck, Utensils } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

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
          className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-white/20'}`}
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
    amenity: 'bg-white/5 border border-white/10 text-[#B0B3BB]',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

function getBrothType(name: string, description: string): string | null {
  const text = (name + ' ' + description).toLowerCase()
  if (text.includes('tonkotsu')) return 'Tonkotsu'
  if (text.includes('tsukemen')) return 'Tsukemen'
  if (text.includes('miso')) return 'Miso'
  if (text.includes('shoyu')) return 'Shoyu'
  if (text.includes('shio')) return 'Shio'
  return null
}

interface Props {
  restaurants: Restaurant[]
  city: string
  state: string
  verifiedSlugs?: string[]
}

export default function CityRestaurantGrid({ restaurants, city, state, verifiedSlugs = [] }: Props) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000 }
    )
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {restaurants.map((r) => {
        const distanceMiles =
          userPos && r.latitude && r.longitude
            ? haversineMiles(userPos.lat, userPos.lng, r.latitude, r.longitude)
            : null
        const brothType = getBrothType(r.name, r.description)
        const isSpicy = (r.name + ' ' + r.description).toLowerCase().includes('spicy')
        const isVerified = verifiedSlugs.includes(r.slug)

        return (
          <Link
            key={r.slug}
            href={`/${city}/${state}/${r.slug}`}
            className="group flex flex-col sm:flex-row bg-[#1E2026] rounded-xl border border-white/5 hover:border-[#77567A]/50 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 overflow-hidden"
          >
            {/* Photo */}
            <div className="relative w-full sm:w-48 shrink-0 h-44 sm:h-auto bg-[#2F323A]">
              {r.photo ? (
                <Image
                  src={r.photo}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#77567A]/20">
                  <Utensils className="w-10 h-10" />
                </div>
              )}
              {r.priceRange && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
                  {r.priceRange}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-3 min-w-0">

              {/* Name + verified */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-semibold text-white text-lg leading-snug group-hover:text-[#77567A] transition-colors">
                    {r.name}
                  </h2>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold shrink-0">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Stars */}
                {(r.rating || r.reviewCount > 0) && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} />
                    <span className="text-white/50 text-xs">{r.rating?.toFixed(1)} ({r.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-1.5 text-[#B0B3BB] text-xs">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#77567A]" />
                <span>{r.address}</span>
              </div>

              {/* Description */}
              {r.description && (
                <p className="text-[#B0B3BB] text-sm leading-relaxed line-clamp-2">{r.description}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {brothType && <Badge variant="broth">{brothType}</Badge>}
                {isSpicy && <Badge variant="spicy">🌶 Spicy</Badge>}
                {r.amenities.veganOptions && <Badge variant="vegan">🌱 Vegan-Friendly</Badge>}
                {r.amenities.dineIn && <Badge variant="amenity">Dine-in</Badge>}
                {r.amenities.takeout && <Badge variant="amenity">Takeout</Badge>}
                {r.amenities.delivery && <Badge variant="amenity">Delivery</Badge>}
                {r.amenities.outdoorSeating && <Badge variant="amenity">Outdoor Seating</Badge>}
                {r.amenities.acceptsReservations && <Badge variant="amenity">Reservations</Badge>}
                {r.amenities.alcohol && <Badge variant="amenity">Bar</Badge>}
              </div>

              {/* Footer row */}
              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 text-xs text-[#B0B3BB]/60">
                  {r.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {r.phone}
                    </span>
                  )}
                  {distanceMiles !== null && (
                    <span className="flex items-center gap-1 text-[#77567A]">
                      <Navigation className="w-3 h-3" />
                      {distanceMiles.toFixed(1)} mi away
                    </span>
                  )}
                </div>
                <span className="text-[#77567A] text-xs font-semibold group-hover:underline">
                  View listing →
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
