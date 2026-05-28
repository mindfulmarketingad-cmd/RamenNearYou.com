'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, BarChart2, Clock, Globe, Search, CheckCircle2 } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'

const BENEFITS = [
  { icon: BadgeCheck, text: 'Verified owner badge on your listing' },
  { icon: Globe, text: 'Update your website, phone, and description' },
  { icon: Clock, text: 'Keep your hours accurate and up to date' },
  { icon: BarChart2, text: 'See weekly page visit analytics' },
]

export default function ClaimSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    return searchRestaurants(query).slice(0, 50)
  }, [query])

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-black/8 p-8">
      {/* Pricing header */}
      <div className="text-center mb-6 pb-6 border-b border-black/6">
        <div className="flex items-end justify-center gap-1.5 mb-1">
          <span className="font-serif text-5xl font-bold text-[#1E2026]">$19.99</span>
          <span className="text-[#6B6862] text-sm mb-2">/month</span>
        </div>
        <p className="text-[#9B9490] text-xs">Cancel anytime. Billed monthly.</p>
      </div>

      {/* Benefits */}
      <ul className="space-y-3 mb-8">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-[#1E2026]">
            <CheckCircle2 className="w-4 h-4 text-[#B57F50] shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      {/* Search */}
      <p className="text-sm font-semibold text-[#1E2026] mb-3">Find your restaurant</p>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E2026]/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search by restaurant name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-sm placeholder-[#9B9490] focus:outline-none focus:border-[#B57F50]/50"
          />
        </div>

        {open && (
          <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#ffffff] border border-black/8 rounded-xl shadow-xl">
            {!query.trim() ? (
              <div className="p-4 text-sm text-[#6B6862]">Type your restaurant name to search…</div>
            ) : matches.length === 0 ? (
              <div className="p-4 text-sm text-[#6B6862]">No restaurants found for &ldquo;{query}&rdquo;</div>
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
        Select your restaurant to continue
      </p>
    </div>
  )
}
