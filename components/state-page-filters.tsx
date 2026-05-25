'use client'

import { useState, useMemo } from 'react'
import type { Restaurant } from '@/lib/restaurants'

const BROTH_KEYWORDS = [
  { label: 'Tonkotsu', color: '#E8D4C8' },
  { label: 'Tsukemen', color: '#F5E6D3' },
  { label: 'Miso', color: '#D4A574' },
  { label: 'Shoyu', color: '#8B7355' },
  { label: 'Shio', color: '#C9B8A8' },
  { label: 'Chicken', color: '#F4E4D1' },
]

export default function StatePageFilters({ restaurants }: { restaurants: Restaurant[] }) {
  const [broth, setBroth] = useState<string | null>(null)
  const [vegan, setVegan] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const [korean, setKorean] = useState(false)
  const [japanese, setJapanese] = useState(false)

  const activeFilterCount = [
    broth ? 1 : 0,
    vegan ? 1 : 0,
    spicy ? 1 : 0,
    korean ? 1 : 0,
    japanese ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants]
    if (broth) list = list.filter(({ brothType }) => brothType === broth)
    if (vegan) list = list.filter((r) => r.amenities.veganOptions)
    if (spicy) list = list.filter((r) => (r.name + ' ' + r.description).toLowerCase().includes('spicy'))
    if (korean) list = list.filter((r) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('korean'))
    if (japanese) list = list.filter((r) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('japanese'))
    return list
  }, [restaurants, broth, vegan, spicy, korean, japanese])

  function clearAll() {
    setBroth(null)
    setVegan(false)
    setSpicy(false)
    setKorean(false)
    setJapanese(false)
  }

  return (
    <div className="space-y-4">
      {/* Broth type filters */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#6B6862] mb-3">Broth Type</p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setBroth(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              broth === null
                ? 'bg-[#1E2026] text-white'
                : 'bg-[#F5F4F0] text-[#1E2026] border border-black/10 hover:border-black/20'
            }`}
          >
            All
          </button>
          {BROTH_KEYWORDS.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => setBroth(broth === label ? null : label)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                broth === label
                  ? 'ring-2 ring-offset-2 ring-[#1E2026]'
                  : ''
              }`}
              style={{
                backgroundColor: broth === label ? color : color,
                opacity: broth === label ? 1 : 0.7,
                color: '#1E2026',
                border: broth === label ? '2px solid #1E2026' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary & cuisine filters */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#6B6862] mb-3">Filters</p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setVegan(!vegan)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              vegan
                ? 'ring-2 ring-offset-2 ring-[#1E2026]'
                : ''
            }`}
            style={{
              backgroundColor: '#90EE90',
              opacity: vegan ? 1 : 0.7,
              color: '#1E2026',
              border: vegan ? '2px solid #1E2026' : 'none',
            }}
          >
            Vegan
          </button>
          <button
            onClick={() => setSpicy(!spicy)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              spicy
                ? 'ring-2 ring-offset-2 ring-[#1E2026]'
                : ''
            }`}
            style={{
              backgroundColor: '#FF6B6B',
              opacity: spicy ? 1 : 0.7,
              color: '#FFFFFF',
              border: spicy ? '2px solid #1E2026' : 'none',
            }}
          >
            Spicy
          </button>
          <button
            onClick={() => setKorean(!korean)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              korean
                ? 'ring-2 ring-offset-2 ring-[#1E2026]'
                : ''
            }`}
            style={{
              backgroundColor: '#FFD700',
              opacity: korean ? 1 : 0.7,
              color: '#1E2026',
              border: korean ? '2px solid #1E2026' : 'none',
            }}
          >
            Korean
          </button>
          <button
            onClick={() => setJapanese(!japanese)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              japanese
                ? 'ring-2 ring-offset-2 ring-[#1E2026]'
                : ''
            }`}
            style={{
              backgroundColor: '#87CEEB',
              opacity: japanese ? 1 : 0.7,
              color: '#1E2026',
              border: japanese ? '2px solid #1E2026' : 'none',
            }}
          >
            Japanese
          </button>
        </div>
      </div>

      {/* Active filters and count */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-black/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B6862]">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
            </span>
            <button
              onClick={clearAll}
              className="text-xs font-medium text-[#B57F50] hover:text-[#1E2026] transition-colors underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
