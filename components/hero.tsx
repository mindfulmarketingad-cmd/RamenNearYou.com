'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation, Loader2, MapPin, ArrowLeftRight } from 'lucide-react'
import Image from 'next/image'

type Status = 'idle' | 'requesting' | 'locating' | 'error'

interface Props {
  restaurantCount: number
  cityCount: number
  stateCount: number
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+`
  return n.toLocaleString() + '+'
}

export default function Hero({ restaurantCount, cityCount, stateCount }: Props) {
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
    <section className="relative z-30 h-[400px] sm:h-[440px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-ramen-bowl.jpg"
        alt="A beautiful bowl of ramen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center pt-16">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 drop-shadow-lg">
          Find Ramen Near Me
        </h1>

        {/* Primary CTA */}
        <button
          onClick={handleFindRamen}
          disabled={isLoading}
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] active:scale-95 text-white text-base font-semibold shadow-xl shadow-black/40 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {status === 'requesting' && 'Waiting for location…'}
          {status === 'locating'   && 'Finding ramen near you…'}
          {status === 'error'      && 'Redirecting…'}
          {status === 'idle'       && 'Find Ramen Near Me'}
        </button>

        {/* Secondary CTA — Compare */}
        <Link
          href="/searchmap"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 active:scale-95 text-[#B57F50] text-sm font-semibold shadow-lg shadow-black/20 transition-all duration-200"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Compare Restaurants
        </Link>

        {/* Location nudge */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-white/50 text-xs">
          <MapPin className="w-3 h-3 text-[#e8b97a]" />
          Allow location access for the best results
        </p>

        {/* Stats row */}
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
          {[
            { value: formatCount(restaurantCount), label: 'Restaurants' },
            { value: formatCount(cityCount),       label: 'Cities' },
            { value: stateCount + ' States',       label: '& Growing' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-white leading-none">
                {value}
              </span>
              <span className="text-white/60 text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave separator at bottom — fill matches the section below */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none pointer-events-none" style={{ marginBottom: '-2px' }}>
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 block"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#F5F4F0"
          />
        </svg>
      </div>
    </section>
  )
}
