'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation, Star, Loader2, MapPin } from 'lucide-react'

// A "near me" query can only be answered in the browser, so this block asks for
// geolocation and then ranks against the same slim dataset the map already
// uses (/api/ramen-map — cached, so on the homepage-warmed cache it's free).
// Everything degrades gracefully: if permission is denied or unavailable the
// server-rendered text results below are still the answer.

type Point = {
  name: string; slug: string; citySlug: string; stateSlug: string
  city: string; stateCode: string
  latitude: number | null; longitude: number | null
  rating: number | null; reviewCount: number
  photo?: string; pho?: 1; supp?: 1
}

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NearMeResults({ phoOnly = false }: { phoOnly?: boolean }) {
  const [state, setState] = useState<'idle' | 'locating' | 'loading' | 'ready' | 'denied' | 'error'>('idle')
  const [results, setResults] = useState<Array<Point & { dist: number }>>([])

  async function locate() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setState('error'); return }
    setState('locating')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        setState('loading')
        try {
          const res = await fetch('/api/ramen-map')
          if (!res.ok) throw new Error(String(res.status))
          const data = await res.json()
          const points: Point[] = Array.isArray(data) ? data : (data.points ?? data.data ?? [])
          const { latitude: lat, longitude: lng } = pos.coords
          const ranked = points
            .filter(p => p.latitude != null && p.longitude != null && (!phoOnly || p.pho))
            .map(p => ({ ...p, dist: distanceMiles(lat, lng, p.latitude!, p.longitude!) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 10)
          setResults(ranked)
          setState('ready')
        } catch {
          setState('error')
        }
      },
      err => setState(err.code === err.PERMISSION_DENIED ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  // Ask as soon as the block mounts — the visitor literally typed "near me",
  // so the intent to share location is already explicit.
  useEffect(() => { locate() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const label = phoOnly ? 'pho' : 'ramen'

  return (
    <section className="mb-10 rounded-2xl border border-[#B57F50]/30 bg-gradient-to-br from-[#B57F50]/8 to-[#B57F50]/14 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Navigation className="w-4 h-4 text-[#96602F]" />
        <h2 className="font-serif text-lg font-bold text-[#1E2026]">Closest to you</h2>
      </div>

      {(state === 'idle' || state === 'locating' || state === 'loading') && (
        <p className="flex items-center gap-2 text-sm text-[#6B6862] mt-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#96602F]" />
          {state === 'loading' ? `Finding the ${label} nearest you…` : 'Getting your location…'}
        </p>
      )}

      {state === 'denied' && (
        <div className="mt-2">
          <p className="text-sm text-[#6B6862] mb-3">
            Location is blocked in your browser, so we can&apos;t sort by distance. You can still
            browse everything below, or search by city name instead.
          </p>
          <button
            onClick={locate}
            className="px-4 py-2 rounded-full bg-[#1E2026] hover:bg-black text-white text-xs font-semibold transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {state === 'error' && (
        <p className="text-sm text-[#6B6862] mt-2">
          We couldn&apos;t work out your location. The results below are still sorted by rating.
        </p>
      )}

      {state === 'ready' && results.length === 0 && (
        <p className="text-sm text-[#6B6862] mt-2">No {label} spots found near you.</p>
      )}

      {state === 'ready' && results.length > 0 && (
        <>
          <p className="text-xs text-[#6B6862] mb-4">
            The {results.length} closest {label} spots to where you are right now.
          </p>
          <ol className="space-y-2">
            {results.map((r, i) => (
              <li key={`${r.slug}-${i}`}>
                <Link
                  href={r.pho ? `/partners/${r.slug}` : `/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/8 hover:border-[#B57F50]/50 transition-colors group"
                >
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#B57F50] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">
                      {r.name}
                      {r.pho && <span className="ml-1.5 text-[10px] font-bold uppercase text-[#16a34a]">Pho</span>}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-[#6B6862] mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.city}, {r.stateCode}</span>
                      {r.rating != null && (
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{r.rating.toFixed(1)}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#96602F] tabular-nums">
                    {r.dist < 10 ? r.dist.toFixed(1) : Math.round(r.dist)} mi
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
