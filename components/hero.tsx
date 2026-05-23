'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation, Loader2, MapPin } from 'lucide-react'

type Status = 'idle' | 'requesting' | 'locating' | 'error'

export default function Hero() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')

  async function handleFindRamen() {
    if (!navigator.geolocation) {
      router.push('/searchmap')
      return
    }

    setStatus('requesting')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus('locating')
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          const zip = data.postcode
          if (zip) {
            router.push(`/searchmap?zip=${zip}`)
          } else {
            router.push(`/searchmap?lat=${latitude}&lng=${longitude}`)
          }
        } catch {
          router.push(`/searchmap?lat=${latitude}&lng=${longitude}`)
        }
      },
      () => {
        // Permission denied or error — go to map without location
        setStatus('error')
        setTimeout(() => router.push('/searchmap'), 800)
      },
      { timeout: 8000 }
    )
  }

  const isLoading = status === 'requesting' || status === 'locating'

  return (
    <section className="relative z-30 bg-white pb-16 sm:pb-20 pt-28">
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-4">
          Ramen Directory
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E2026] leading-tight mb-5">
          Find Ramen<br />
          <span className="text-[#B57F50]">Near You</span>
        </h1>

        <p className="text-[#4A4D55] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Top-rated ramen restaurants near you — searched by location, city, or broth type.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleFindRamen}
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#B57F50] hover:bg-[#c8934f] active:scale-95 text-white text-lg font-semibold shadow-lg shadow-[#B57F50]/30 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
          {status === 'requesting' && 'Waiting for location…'}
          {status === 'locating'   && 'Finding ramen near you…'}
          {status === 'error'      && 'Redirecting…'}
          {status === 'idle'       && 'Find Ramen Near Me'}
        </button>

        {/* Location permission nudge */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[#9B9490] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#B57F50]" />
          Allow location access for the best results
        </p>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none -mb-px pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 block"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40"
            fill="none"
            stroke="#1E2026"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  )
}
