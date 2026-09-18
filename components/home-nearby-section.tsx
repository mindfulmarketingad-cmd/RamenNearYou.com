'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Loader2, Navigation, SlidersHorizontal } from 'lucide-react'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import ListicleCard, { type ListicleCardData } from '@/components/listicle-card'
import AdInFeed from '@/components/ad-infeed'
import ProductsCarousel from '@/components/products-carousel'

// The homepage's feed: the map on top, then the ramen actually inside the
// radius drawn on it. The two share one position, so what the circle covers
// and what the list shows can never drift apart.

const FEED_LIMIT = 20
const RADIUS_CHOICES = [5, 10, 25, 50] as const
const DEFAULT_RADIUS = 25

interface NearbyResult {
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
  subtypes: string
  priceRange: string
  address: string
  phone: string
  website: string
  googleMapsLink: string
  openNow: boolean | null
  hoursLabel: string | null
  distanceMiles: number
}

function toCard(r: NearbyResult): ListicleCardData {
  const tags = (r.subtypes ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((label) => ({ label }))

  return {
    key: r.slug,
    href: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    photo: r.photo,
    name: r.name,
    rating: r.rating,
    reviewCount: r.reviewCount,
    locationLabel: `${r.city}, ${r.stateCode}`,
    cityHref: `/${r.citySlug}/${r.stateSlug}`,
    address: r.address,
    directionsUrl:
      r.googleMapsLink ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`,
    phone: r.phone,
    website: r.website,
    hoursLabel: r.openNow === null ? r.hoursLabel : r.openNow ? 'Open now' : 'Closed',
    hoursOpen: r.openNow,
    description: r.description || `Ramen in ${r.city}, ${r.stateCode}.`,
    tags: r.priceRange ? [{ label: r.priceRange }, ...tags].slice(0, 3) : tags,
  }
}

export default function HomeNearbySection() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS)
  const [results, setResults] = useState<NearbyResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loadedOnce, setLoadedOnce] = useState(false)

  // Stable identity so HomeMapHero's effect doesn't re-fire every render.
  const handlePos = useCallback((p: { lat: number; lng: number } | null) => {
    setPos((prev) => (prev && p && prev.lat === p.lat && prev.lng === p.lng ? prev : p))
  }, [])

  useEffect(() => {
    if (!pos) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/nearby?lat=${pos.lat}&lng=${pos.lng}&radius=${radius}&limit=${FEED_LIMIT}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setResults(Array.isArray(d.results) ? d.results : [])
        setLoadedOnce(true)
      })
      .catch(() => { if (!cancelled) setLoadedOnce(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pos, radius])

  const feed = (
    <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Feed header — says plainly what's being listed and over what area,
              so the list and the circle on the map read as one thing. */}
          <div className="flex items-end justify-between gap-3 flex-wrap mb-4">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] leading-tight">
                Ramen near you
              </h2>
              <p className="text-sm text-[#6B6862] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {pos
                  ? `The ${results.length} closest ${results.length === 1 ? 'spot' : 'spots'} inside the ${radius}-mile circle on the map`
                  : 'Share your location to see the closest bowls first'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B6862]" aria-hidden="true" />
              <span className="sr-only" id="radius-label">Search radius</span>
              <div role="group" aria-labelledby="radius-label" className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#F5F4F0] border border-black/10">
                {RADIUS_CHOICES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRadius(m)}
                    aria-pressed={radius === m}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      radius === m ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
                    }`}
                  >
                    {m} mi
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Waiting on location. The map above has its own "use my location"
              control, so this is a status line rather than a second prompt. */}
          {!pos && (
            <div className="rounded-xl border border-dashed border-black/12 bg-[#FAFAF9] px-4 py-10 text-center">
              <Navigation className="w-5 h-5 text-[#B57F50] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1E2026]">Waiting for your location</p>
              <p className="text-xs text-[#6B6862] mt-1 max-w-sm mx-auto leading-relaxed">
                Allow location access, or search a city or ZIP on the map above, and this feed fills
                with the ramen closest to you.
              </p>
              <Link
                href="/find/ramen-near-me"
                className="inline-block mt-4 text-xs font-semibold text-[#96602F] hover:underline"
              >
                Or browse every ramen spot →
              </Link>
            </div>
          )}

          {pos && loading && !loadedOnce && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B6862]">
              <Loader2 className="w-4 h-4 animate-spin" /> Finding ramen near you…
            </div>
          )}

          {pos && loadedOnce && results.length === 0 && (
            <div className="rounded-xl border border-dashed border-black/12 bg-[#FAFAF9] px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#1E2026]">No ramen within {radius} miles</p>
              <p className="text-xs text-[#6B6862] mt-1">Try a wider radius, or browse by city.</p>
              <Link href="/cities" className="inline-block mt-4 text-xs font-semibold text-[#96602F] hover:underline">
                Browse ramen by city →
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <div className={`space-y-2.5 transition-opacity ${loading ? 'opacity-60' : ''}`}>
              {results.map((r, i) => (
                <div key={r.slug}>
                  <ListicleCard
                    item={toCard(r)}
                    rank={i + 1}
                    distanceLabel={`${r.distanceMiles.toFixed(1)} mi`}
                  />
                  {/* Same in-feed break rhythm as the /find listicles. */}
                  {i === 4 && <div className="my-3"><ProductsCarousel variant="inline" /></div>}
                  {i === 11 && <div className="my-3"><AdInFeed /></div>}
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="flex justify-center mt-6">
              <Link
                href="/find/ramen-near-me"
                className="px-6 py-3 rounded-full bg-white border border-black/12 text-sm font-semibold text-[#1E2026] hover:border-[#B57F50]/50 transition-colors"
              >
                See more ramen near you →
              </Link>
            </div>
          )}
        </div>
    </section>
  )

  return (
    <ErrorBoundary
      fallback={
        <section className="pt-16 bg-[#F5F4F0]">
          <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#B57F50] border-t-transparent animate-spin" />
          </div>
        </section>
      }
    >
      <HomeMapHero
        introAnimation
        autoLocate
        radiusMiles={radius}
        onUserPosChange={handlePos}
        feedSlot={feed}
      />
    </ErrorBoundary>
  )
}
