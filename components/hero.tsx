'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation, Loader2, MapPin } from 'lucide-react'
import Image from 'next/image'

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
        setStatus('error')
        setTimeout(() => router.push('/searchmap'), 800)
      },
      { timeout: 8000 }
    )
  }

  const isLoading = status === 'requesting' || status === 'locating'

  return (
    <section className="relative z-30 min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-ramen-bowl.jpg"
        alt="A beautiful bowl of ramen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay — heavier at top (behind navbar) and bottom, lighter in center */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center pt-16">
        <p className="text-[#e8b97a] text-xs font-semibold uppercase tracking-widest mb-4 drop-shadow">
          Ramen Directory
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          Find Ramen Near Me
        </h1>
        <p className="text-white/75 text-lg mb-10 drop-shadow">
          Discover the best ramen restaurants in your city.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleFindRamen}
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#B57F50] hover:bg-[#c8934f] active:scale-95 text-white text-lg font-semibold shadow-xl shadow-black/40 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed"
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

        {/* Location nudge */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-white/50 text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#e8b97a]" />
          Allow location access for the best results
        </p>
      </div>

      {/* Wave separator at bottom */}
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
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  )
}
