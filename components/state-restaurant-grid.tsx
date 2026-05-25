'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

const FILTER_COLORS: { [key: string]: string } = {
  vegan: '#10B981',      // Emerald
  spicy: '#EF4444',      // Red
  korean: '#6366F1',     // Indigo
  japanese: '#EC4899',   // Pink
}

interface FilterPillProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  color?: string
}

function FilterPill({ active, onClick, children, color }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border-2 ${
        active
          ? `border-current text-white`
          : 'border-transparent text-[#6B6862] bg-white hover:bg-[#F5F4F0]'
      }`}
      style={
        active
          ? {
              backgroundColor: color || '#B57F50',
              borderColor: color || '#B57F50',
              color: 'white',
            }
          : {}
      }
    >
      {children}
    </button>
  )
}

interface RestaurantListProps {
  restaurants: Restaurant[]
  vegan: boolean
  spicy: boolean
  korean: boolean
  japanese: boolean
}

function RestaurantList({ restaurants, vegan, spicy, korean, japanese }: RestaurantListProps) {
  const filtered = useMemo(() => {
    let list = [...restaurants]

    if (vegan) list = list.filter((r) => r.amenities.veganOptions)
    if (spicy) list = list.filter((r) => (r.name + ' ' + r.description).toLowerCase().includes('spicy'))
    if (korean) list = list.filter((r) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('korean'))
    if (japanese) list = list.filter((r) => (r.name + ' ' + r.description + ' ' + r.subtypes).toLowerCase().includes('japanese'))

    return list
  }, [restaurants, vegan, spicy, korean, japanese])

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#6B6862]">No restaurants match your filters</p>
        </div>
      ) : (
        filtered.map((r) => (
          <div
            key={r.slug}
            className="p-4 bg-white rounded-lg border border-black/8 hover:border-black/15 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-[#1E2026] hover:text-[#B57F50] transition-colors cursor-pointer">
                  {r.name}
                </h3>
                <p className="text-sm text-[#6B6862] mt-1">{r.city}, {r.stateCode}</p>
                {r.subtypes && (
                  <p className="text-xs text-[#B57F50] mt-1">{r.subtypes}</p>
                )}
              </div>
              {r.rating && (
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-[#1E2026]">{r.rating}</p>
                  <p className="text-xs text-[#6B6862]">rating</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

interface StateRestaurantGridProps {
  restaurants: Restaurant[]
  state: string
  stateCode: string
}

export default function StateRestaurantGrid({ restaurants, state, stateCode }: StateRestaurantGridProps) {
  const [vegan, setVegan] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const [korean, setKorean] = useState(false)
  const [japanese, setJapanese] = useState(false)

  const activeFilterCount = [vegan ? 1 : 0, spicy ? 1 : 0, korean ? 1 : 0, japanese ? 1 : 0].reduce((a, b) => a + b, 0)

  function clearAll() {
    setVegan(false)
    setSpicy(false)
    setKorean(false)
    setJapanese(false)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4 bg-white p-6 rounded-lg border border-black/8">
        {/* Filter pills row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#6B6862] text-xs font-medium uppercase tracking-wider mr-1">Filters:</span>
          <FilterPill active={vegan} onClick={() => setVegan(!vegan)} color={FILTER_COLORS.vegan}>
            Vegan
          </FilterPill>
          <FilterPill active={spicy} onClick={() => setSpicy(!spicy)} color={FILTER_COLORS.spicy}>
            Spicy
          </FilterPill>
          <FilterPill active={korean} onClick={() => setKorean(!korean)} color={FILTER_COLORS.korean}>
            Korean
          </FilterPill>
          <FilterPill active={japanese} onClick={() => setJapanese(!japanese)} color={FILTER_COLORS.japanese}>
            Japanese
          </FilterPill>
        </div>

        {/* Clear all button */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#6B6862] hover:text-[#1E2026] transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all ({activeFilterCount})
            </button>
          </div>
        )}
      </div>

      {/* Restaurant list */}
      <RestaurantList restaurants={restaurants} vegan={vegan} spicy={spicy} korean={korean} japanese={japanese} />
    </div>
  )
}
