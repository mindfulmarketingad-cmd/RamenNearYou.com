'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation, Loader2, MapPin, ArrowLeftRight, Search } from 'lucide-react'
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
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

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
          const z = data.postcode
          if (z) {
            router.push(`/searchmap?zip=${z}`)
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

  function handleZipSearch(e: FormEvent) {
    e.preventDefault()
    const clean = zip.trim()
    if (!/^\d{5}$/.test(clean)) {
      setZipError('Enter a valid 5-digit ZIP code')
      return
    }
    setZipError('')
    router.push(`/searchmap?zip=${clean}`)
  }

  const isLoading = status === 'requesting' || status === 'locating'

  return (
    <section className="relative z-30 h-[460px] sm:h-[500px] flex items-center justify-center overflow-hidden">
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

        {/* ZIP search bar */}
        <form onSubmit={handleZipSearch} className="mb-5">
          <div className="flex items-center bg-white rounded-xl shadow-xl shadow-black/30 overflow-hidden max-w-sm mx-auto">
            <MapPin className="w-4 h-4 text-[#B57F50] shrink-0 ml-4" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="Enter ZIP code…"
              value={zip}
              onChange={e => { setZip(e.target.value.replace(/\D/g, '')); setZipError('') }}
              className="flex-1 px-3 py-3.5 text-[#1E2026] text-sm font-medium outline-none bg-transparent placeholder:text-[#9B9490]"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-3.5 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>
          {zipError && (
            <p className="text-red-300 text-xs mt-2">{zipError}</p>
          )}
        </form>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
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
            {status === 'idle'       && 'Use My Location'}
          </button>

          {/* Secondary CTA — Compare */}
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 active:scale-95 text-[#B57F50] text-base font-semibold shadow-lg shadow-black/20 transition-all duration-200"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare Restaurants
          </Link>
        </div>

        {/* Location nudge */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-white/50 text-xs">
          <MapPin className="w-3 h-3 text-[#e8b97a]" />
          Allow location access for the best results
        </p>

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

