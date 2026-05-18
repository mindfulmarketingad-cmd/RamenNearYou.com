'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Star, Navigation, BadgeCheck } from 'lucide-react'
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

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'broth' | 'spicy' | 'vegan' }) {
  const styles = {
    default: 'bg-[#77567A]/15 text-[#77567A]',
    broth: 'bg-blue-500/10 text-blue-300',
    spicy: 'bg-red-500/10 text-red-400',
    vegan: 'bg-green-500/10 text-green-400',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((r) => {
        const distanceMiles =
          userPos && r.latitude && r.longitude
            ? haversineMiles(userPos.lat, userPos.lng, r.latitude, r.longitude)
            : null

        return (
          <Link
            key={r.slug}
            href={`/${city}/${state}/${r.slug}`}
            className="group flex flex-col bg-[#1E2026] rounded-xl border border-white/5 hover:border-[#77567A] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
          >
            {/* Photo */}
            <div className="relative w-full h-44 bg-[#2F323A] overflow-hidden">
              {r.photo ? (
                <Image
                  src={r.photo}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#77567A]/30">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              {r.priceRange && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                  {r.priceRange}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-white text-base leading-snug group-hover:text-[#77567A] transition-colors line-clamp-1">
                    {r.name}
                  </h2>
                  {verifiedSlugs.includes(r.slug) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold shrink-0">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                {(r.rating || r.reviewCount > 0) && (
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={r.rating} />
                    <span className="text-white/60 text-xs">{r.rating?.toFixed(1)} ({r.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-1.5 text-[#B0B3BB] text-xs">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#77567A]" />
                <span className="line-clamp-2">{r.address}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {(() => {
                  const brothType = getBrothType(r.name, r.description)
                  const isSpicy = (r.name + ' ' + r.description).toLowerCase().includes('spicy')
                  return (
                    <>
                      {brothType && <Badge variant="broth">{brothType}</Badge>}
                      {isSpicy && <Badge variant="spicy">Spicy</Badge>}
                      {r.amenities.veganOptions && <Badge variant="vegan">Vegan-Friendly</Badge>}
                      {r.amenities.dineIn && <Badge>Dine-in</Badge>}
                      {r.amenities.takeout && <Badge>Takeout</Badge>}
                      {r.amenities.delivery && <Badge>Delivery</Badge>}
                      {r.amenities.outdoorSeating && <Badge>Outdoor Seating</Badge>}
                      {r.amenities.acceptsReservations && <Badge>Reservations</Badge>}
                    </>
                  )
                })()}
              </div>

              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                {r.phone ? (
                  <span className="flex items-center gap-1 text-[#B0B3BB] text-xs">
                    <Phone className="w-3 h-3" />
                    {r.phone}
                  </span>
                ) : <span />}
                <div className="flex items-center gap-2 ml-auto">
                  {distanceMiles !== null && (
                    <span className="flex items-center gap-1 text-[#B0B3BB] text-xs">
                      <Navigation className="w-3 h-3 text-[#77567A]" />
                      {distanceMiles.toFixed(1)} mi
                    </span>
                  )}
                  <span className="text-[#77567A] text-xs font-medium group-hover:underline">
                    View listing →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
