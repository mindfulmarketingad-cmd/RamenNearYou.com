'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react'

interface City {
  city: string
  citySlug: string
  count: number
}

export default function StateCityList({
  cities,
  stateSlug,
  stateName,
}: {
  cities: City[]
  stateSlug: string
  stateName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="pt-10 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Browse By City</p>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#1E2026] font-semibold text-lg">Cities in {stateName}</p>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 bg-[#F5F4F0] hover:border-[#B57F50]/40 text-[#6B6862] hover:text-[#96602F] text-xs font-medium transition-colors"
          >
            {open ? (
              <>Hide cities <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Show {cities.length} cities <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {open && (
          <div className="flex flex-wrap gap-3">
            {cities.map((c) => (
              <div key={c.citySlug} className="flex items-stretch rounded-xl overflow-hidden border border-black/5 hover:border-[#B57F50]/40 transition-colors group bg-[#F5F4F0]">
                <Link
                  href={`/${c.citySlug}/${stateSlug}`}
                  className="flex items-center gap-2 px-4 py-2.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#96602F] shrink-0" />
                  <span>
                    <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#96602F] transition-colors">{c.city}</span>
                    <span className="text-[#6B6862]/60 text-xs ml-1.5">{c.count} spot{c.count !== 1 ? 's' : ''}</span>
                  </span>
                </Link>
                <Link
                  href={`/searchmap?city=${c.citySlug}&state=${stateSlug}`}
                  title="View on map"
                  className="flex items-center px-3 border-l border-black/5 text-[#6B6862]/50 hover:text-[#96602F] hover:bg-[#B57F50]/10 transition-colors"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
