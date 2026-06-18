'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Utensils, Search, X, LocateFixed } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'

export interface GridRestaurant {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  address: string
  rating: number | null
  reviewCount: number
  photo: string
  priceRange: string
  latitude: number | null
  longitude: number | null
}

interface Props {
  restaurants: GridRestaurant[]
  brothType: string
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const RADIUS_MILES = 50

export default function BrothRestaurantGrid({ restaurants, brothType }: Props) {
  const [zip, setZip] = useState('')
  const [origin, setOrigin] = useState<{ lat: number; lng: number; label: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function geocodeZip(value: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&postalcode=${encodeURIComponent(value)}`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setOrigin({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: value })
      } else {
        setError('We couldn’t find that ZIP code. Try another.')
      }
    } catch {
      setError('Something went wrong looking up that ZIP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = zip.trim()
    if (/^\d{5}$/.test(clean)) geocodeZip(clean)
    else setError('Please enter a valid 5-digit ZIP code.')
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Location is not available in this browser.')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'your location' })
        setLoading(false)
      },
      () => {
        setError('We couldn’t access your location. Enter a ZIP instead.')
        setLoading(false)
      }
    )
  }

  function clearFilter() {
    setOrigin(null)
    setZip('')
    setError('')
  }

  const visible = useMemo(() => {
    if (!origin) return restaurants
    return restaurants
      .filter((r) => r.latitude != null && r.longitude != null)
      .map((r) => ({ ...r, distance: haversine(origin.lat, origin.lng, r.latitude!, r.longitude!) }))
      .filter((r) => r.distance <= RADIUS_MILES)
      .sort((a, b) => a.distance - b.distance)
  }, [origin, restaurants])

  return (
    <div className="max-w-7xl mx-auto">
      {/* ZIP filter bar */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
          <input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Enter your ZIP code"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-black/10 bg-white text-[#1E2026] text-sm focus:outline-none focus:border-[#B57F50] focus:ring-1 focus:ring-[#B57F50]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Find Nearby'}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-none border border-black/10 bg-white text-[#1E2026] text-sm font-medium hover:border-[#B57F50] transition-colors disabled:opacity-60"
        >
          <LocateFixed className="w-4 h-4 text-[#B57F50]" />
          Use my location
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex items-center justify-between mb-6">
        <p className="text-[#6B6862] text-sm">
          {origin ? (
            <>
              {visible.length} {brothType.toLowerCase()} ramen {visible.length === 1 ? 'spot' : 'spots'} within{' '}
              {RADIUS_MILES} miles of {origin.label}
            </>
          ) : (
            <>{restaurants.length} ramen restaurants found</>
          )}
        </p>
        {origin && (
          <button
            onClick={clearFilter}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#B57F50] hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-black/5">
          <p className="text-[#1E2026] font-semibold mb-1">No {brothType.toLowerCase()} ramen within {RADIUS_MILES} miles</p>
          <p className="text-[#6B6862] text-sm mb-4">Try a different ZIP code or clear the filter to see all locations.</p>
          <button onClick={clearFilter} className="px-4 py-2 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors">
            Show all locations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
              className="group flex flex-col bg-[#ffffff] rounded-xl border border-black/5 hover:border-[#B57F50]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
            >
              <div className="relative w-full h-44 bg-[#F5F4F0] overflow-hidden">
                <RestaurantImage
                  src={r.photo}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {r.priceRange && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                    {r.priceRange}
                  </span>
                )}
                {'distance' in r && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#B57F50] text-white text-xs font-semibold">
                    {(r as { distance: number }).distance.toFixed(1)} mi
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5 gap-2">
                <h2 className="font-semibold text-[#1E2026] text-base leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">
                  {r.name}
                </h2>
                {(r.rating || r.reviewCount > 0) && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[#1E2026] text-sm font-medium">{r.rating?.toFixed(1)}</span>
                    <span className="text-[#6B6862]/60 text-xs">({(r.reviewCount ?? 0).toLocaleString()} reviews)</span>
                  </div>
                )}
                <div className="flex items-start gap-1.5 text-[#6B6862] text-xs">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#B57F50]" />
                  <span className="line-clamp-1">{r.address}</span>
                </div>
                <div className="mt-auto pt-2 border-t border-black/5 flex justify-between items-center">
                  <span className="text-xs text-[#6B6862]/60">{r.city}, {r.stateCode}</span>
                  <span className="text-[#B57F50] text-xs font-medium group-hover:underline">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
