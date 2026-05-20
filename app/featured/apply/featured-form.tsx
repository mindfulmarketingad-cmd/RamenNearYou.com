'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Crown, MapPin, Gift, Search, Check, Minus } from 'lucide-react'
import { restaurants } from '@/lib/restaurants'

const TIERS = [
  {
    id: 'free',
    icon: Gift,
    label: 'Free Listing',
    price: '$0',
    period: 'forever',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    iconColor: 'text-emerald-400',
    headerBg: 'bg-emerald-500/5',
    checkColor: 'text-emerald-400',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    stripeUrl: null,
  },
  {
    id: 'city',
    icon: MapPin,
    label: 'City Featured',
    price: '$29.99',
    period: 'per month',
    highlight: true,
    badge: 'Most Popular',
    badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    iconColor: 'text-amber-400',
    headerBg: 'bg-amber-500/10',
    checkColor: 'text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-[#F5F4F0]',
    stripeUrl: 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02',
  },
  {
    id: 'homepage',
    icon: Crown,
    label: 'Homepage Featured',
    price: '$129.99',
    period: 'per month',
    badgeColor: 'bg-black/5 border-black/8 text-[#1E2026]/60',
    iconColor: 'text-[#1E2026]/70',
    headerBg: 'bg-black/5',
    checkColor: 'text-[#1E2026]/80',
    buttonColor: 'bg-white hover:bg-white/90 text-[#F5F4F0]',
    stripeUrl: 'https://buy.stripe.com/cNi00k2HUgRqff0gSafrW03',
  },
]

type FeatureValue = boolean | string

const FEATURES: { label: string; values: [FeatureValue, FeatureValue, FeatureValue] }[] = [
  { label: 'Listed on RamenNearYou.com',     values: [true, true, true] },
  { label: 'Claim & manage your listing',    values: [true, true, true] },
  { label: 'Update hours & details',         values: [true, true, true] },
  { label: 'Respond to customer reviews',    values: [true, true, true] },
  { label: 'Featured badge on listing',      values: [false, true, true] },
  { label: 'City page top placement',        values: [false, true, true] },
  { label: 'Photos showcased',               values: [false, 'Up to 4', 'Up to 8'] },
  { label: 'Homepage placement',             values: [false, false, true] },
]

function FeatureCell({ value, checkColor }: { value: FeatureValue; checkColor: string }) {
  if (value === false) return <Minus className="w-4 h-4 text-[#1E2026]/15 mx-auto" />
  if (value === true) return <Check className={`w-4 h-4 ${checkColor} mx-auto`} strokeWidth={2.5} />
  return <span className={`text-xs font-medium ${checkColor}`}>{value}</span>
}

function RestaurantSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return restaurants.slice(0, 50)
    return restaurants
      .filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.stateCode.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1E2026]/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search your restaurant…"
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#ffffff] border border-black/8 text-[#1E2026] text-xs placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
        />
      </div>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#ffffff] border border-black/8 rounded-lg shadow-xl">
          {matches.length === 0 ? (
            <div className="p-3 text-xs text-[#1E2026]/50">No restaurants match.</div>
          ) : (
            matches.map(r => (
              <Link
                key={r.slug}
                href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                className="block px-3 py-2 hover:bg-emerald-500/10 transition-colors border-b border-black/5 last:border-b-0"
                onClick={() => setOpen(false)}
              >
                <div className="text-xs text-[#1E2026] font-medium">{r.name}</div>
                <div className="text-[10px] text-[#1E2026]/50">{r.city}, {r.stateCode}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function FeaturedTiers() {
  return (
    <div className="rounded-2xl border border-black/8 overflow-hidden bg-[#F5F4F0]">
      {/* Tier header columns */}
      <div className="grid grid-cols-4">
        {/* Empty top-left cell */}
        <div className="p-5 border-b border-black/8 border-r" />

        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          const isLast = i === TIERS.length - 1
          return (
            <div
              key={tier.id}
              className={`${tier.headerBg} px-5 pb-5 border-b border-black/8 text-center ${tier.badge ? 'pt-3' : 'pt-5'} ${!isLast ? 'border-r border-black/8' : ''} ${tier.highlight ? 'ring-inset ring-1 ring-amber-500/30' : ''}`}
            >
              {tier.badge && (
                <div className="flex justify-center mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[#F5F4F0] text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {tier.badge}
                  </span>
                </div>
              )}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium mb-3 ${tier.badgeColor}`}>
                <Icon className={`w-3 h-3 ${tier.iconColor}`} />
                {tier.label}
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-[#1E2026]">{tier.price}</span>
              </div>
              <div className="text-[#1E2026]/40 text-xs mt-0.5">{tier.period}</div>
            </div>
          )
        })}
      </div>

      {/* Feature rows */}
      {FEATURES.map((feature, fi) => (
        <div key={feature.label} className={`grid grid-cols-4 ${fi % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
          <div className="px-5 py-3 border-r border-black/8 flex items-center">
            <span className="text-sm text-[#6B6862]">{feature.label}</span>
          </div>
          {TIERS.map((tier, ti) => {
            const isLast = ti === TIERS.length - 1
            return (
              <div
                key={tier.id}
                className={`px-5 py-3 flex items-center justify-center ${!isLast ? 'border-r border-black/8' : ''} ${tier.highlight ? 'bg-amber-500/[0.03]' : ''}`}
              >
                <FeatureCell value={feature.values[ti]} checkColor={tier.checkColor} />
              </div>
            )
          })}
        </div>
      ))}

      {/* CTA row */}
      <div className="grid grid-cols-4 border-t border-black/8">
        <div className="p-5 border-r border-black/8 flex items-center">
          <span className="text-xs text-[#1E2026]/30">Get started today</span>
        </div>
        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          const isLast = i === TIERS.length - 1
          return (
            <div
              key={tier.id}
              className={`p-4 flex flex-col gap-2 ${!isLast ? 'border-r border-black/8' : ''} ${tier.highlight ? 'bg-amber-500/[0.03]' : ''}`}
            >
              {tier.id === 'free' ? (
                <>
                  <RestaurantSearch />
                  <p className="text-[#1E2026]/25 text-[10px] text-center">Select your restaurant to claim</p>
                </>
              ) : (
                <>
                  <a
                    href={tier.stripeUrl!}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${tier.buttonColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    Get {tier.label}
                  </a>
                  <p className="text-[#1E2026]/25 text-[10px] text-center">Secure payment via Stripe</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
