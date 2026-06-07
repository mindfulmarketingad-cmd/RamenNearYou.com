'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'
import Image from 'next/image'

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
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

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

