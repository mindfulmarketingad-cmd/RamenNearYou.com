'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Gift, Search, Check } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'
import { restaurants } from '@/lib/restaurants'

const PERKS = [
  'Claim your existing listing',
  'Update hours, photos, and details',
  'Respond to customer reviews',
  'No payment required',
]

export default function ClaimSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    if (!query.trim()) return restaurants.slice(0, 50)
    return searchRestaurants(query).slice(0, 50)
  }, [query])

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-black/8 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="font-semibold text-[#1E2026]">Free Listing</p>
          <p className="text-[#6B6862] text-sm">$0 / forever</p>
        </div>
      </div>

      {/* Perks */}
      <ul className="space-y-2.5 mb-7">
        {PERKS.map(perk => (
          <li key={perk} className="flex items-center gap-2.5 text-sm text-[#6B6862]">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
            {perk}
          </li>
        ))}
      </ul>

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E2026]/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search your restaurant..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-sm placeholder-[#9B9490] focus:outline-none focus:border-[#B57F50]/50"
          />
        </div>

        {open && (
          <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#ffffff] border border-black/8 rounded-xl shadow-xl">
            {matches.length === 0 ? (
              <div className="p-4 text-sm text-[#6B6862]">No restaurants match.</div>
            ) : (
              matches.map(r => (
                <Link
                  key={r.slug}
                  href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="block px-4 py-3 hover:bg-[#F5F4F0] transition-colors border-b border-black/5 last:border-b-0"
                  onClick={() => setOpen(false)}
                >
                  <div className="text-sm text-[#1E2026] font-medium">{r.name}</div>
                  <div className="text-xs text-[#6B6862]">{r.city}, {r.stateCode}</div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <p className="text-[#6B6862]/50 text-xs text-center mt-3">
        Select your restaurant to start your free claim
      </p>
    </div>
  )
}
