'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

const brothTypes = ['All', 'Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan']

export default function Hero() {
  const [brothType, setBrothType] = useState('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-ramen.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#2F323A]/75" />
      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#77567A]/50 bg-[#77567A]/10 text-[#B0B3BB] text-xs font-medium mb-6 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#77567A] inline-block" />
          Atlanta, GA &mdash; Expanding Soon
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance mb-3">
          Ramen Near Me
        </h1>
        <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#77567A] mb-5 text-balance">
          Find Your Best Local Ramen
        </p>

        {/* Body */}
        <p className="text-[#B0B3BB] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Looking for the best ramen? We&apos;ve curated top-rated ramen restaurants across Atlanta and beyond.
          Search by city, neighborhood, or broth type.
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-3xl mx-auto bg-[#1E2026]">
          {/* Broth type dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 h-full px-4 py-4 text-sm text-white bg-[#1E2026] border-b sm:border-b-0 sm:border-r border-white/10 whitespace-nowrap hover:bg-white/5 transition-colors w-full sm:w-auto justify-between sm:justify-start"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="text-[#B0B3BB] text-xs mr-1">Broth:</span>
              <span>{brothType}</span>
              <ChevronDown className={`w-4 h-4 text-[#B0B3BB] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <ul
                role="listbox"
                className="absolute top-full left-0 mt-1 w-44 bg-[#1E2026] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
              >
                {brothTypes.map((type) => (
                  <li key={type}>
                    <button
                      role="option"
                      aria-selected={brothType === type}
                      onClick={() => { setBrothType(type); setDropdownOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        brothType === type
                          ? 'text-white bg-[#77567A]/20 text-[#77567A]'
                          : 'text-[#B0B3BB] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Text input */}
          <input
            type="text"
            placeholder="City, Neighborhood, or Zip Code"
            className="flex-1 px-5 py-4 bg-[#1E2026] text-white placeholder-[#B0B3BB]/60 text-sm outline-none"
          />

          {/* Submit button */}
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-semibold transition-colors whitespace-nowrap">
            <Search className="w-4 h-4" />
            Find Ramen
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#B0B3BB]/50 text-xs">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#77567A]/60 rounded-full" />
      </div>
    </section>
  )
}
