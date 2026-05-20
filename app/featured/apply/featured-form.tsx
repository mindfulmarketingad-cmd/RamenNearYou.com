'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Crown, MapPin, Gift, Search } from 'lucide-react'
import { restaurants } from '@/lib/restaurants'

const PAID_TIERS = [
  {
    id: 'city',
    icon: MapPin,
    label: 'City Featured',
    price: '29.99',
    description: 'Get featured at the top of your city\'s ramen listings page.',
    perks: [
      'Top placement on your city page',
      'Featured badge on your listing',
      'Up to 4 photos showcased',
      'Cancel anytime',
    ],
    stripeUrl: 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02',
    highlight: true,
    color: 'border-amber-500/40',
    badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-[#1E2026]',
    iconColor: 'text-amber-400',
  },
  {
    id: 'homepage',
    icon: Crown,
    label: 'Homepage Featured',
    price: '129.99',
    description: 'Maximum visibility — front and center for every visitor nationwide.',
    perks: [
      'Homepage placement — visible to all visitors',
      'Top of search results nationwide',
      'Featured badge on your listing',
      'Up to 8 photos showcased',
      'Priority support',
      'Cancel anytime',
    ],
    stripeUrl: 'https://buy.stripe.com/cNi00k2HUgRqff0gSafrW03',
    highlight: false,
    color: 'border-white/10',
    badgeColor: 'bg-white/5 border-white/10 text-white/60',
    buttonColor: 'bg-white hover:bg-white/90 text-[#1E2026]',
    iconColor: 'text-white/70',
  },
]

function FreeListingCard() {
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
    <div className="relative bg-[#1E2026] rounded-2xl border border-emerald-500/30 p-6 flex flex-col">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium w-fit mb-4">
        <Gift className="w-3.5 h-3.5" />
        Free Listing
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">$0</span>
          <span className="text-[#B0B3BB] text-sm">/ forever</span>
        </div>
        <p className="text-[#B0B3BB] text-sm mt-2 leading-relaxed">
          Already listed? Claim your restaurant to manage your page, update details, and respond to reviews — completely free.
        </p>
      </div>

      <ul className="space-y-2 mb-5 flex-1">
        {[
          'Claim your existing listing',
          'Update hours, photos, and details',
          'Respond to customer reviews',
          'No payment required',
        ].map(perk => (
          <li key={perk} className="flex items-start gap-2 text-sm text-[#B0B3BB]">
            <span className="mt-0.5 font-bold text-emerald-400">✓</span>
            {perk}
          </li>
        ))}
      </ul>

      <div className="relative mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search your restaurant..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#2F323A] border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {open && (
          <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#2F323A] border border-white/10 rounded-lg shadow-xl">
            {matches.length === 0 ? (
              <div className="p-3 text-sm text-white/50">No restaurants match.</div>
            ) : (
              matches.map(r => (
                <Link
                  key={r.slug}
                  href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="block px-3 py-2 hover:bg-emerald-500/10 transition-colors border-b border-white/5 last:border-b-0"
                  onClick={() => setOpen(false)}
                >
                  <div className="text-sm text-white font-medium">{r.name}</div>
                  <div className="text-xs text-white/50">{r.city}, {r.stateCode}</div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <p className="text-white/30 text-xs text-center">Select your restaurant to start your free claim</p>
    </div>
  )
}

function PaidTierCard({ tier }: { tier: typeof PAID_TIERS[number] }) {
  const Icon = tier.icon
  return (
    <div
      className={`relative bg-[#1E2026] rounded-2xl border ${tier.color} p-6 flex flex-col ${
        tier.highlight ? 'ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5' : ''
      }`}
    >
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-[#1E2026] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium w-fit mb-4 ${tier.badgeColor}`}>
        <Icon className={`w-3.5 h-3.5 ${tier.iconColor}`} />
        {tier.label}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">${tier.price}</span>
          <span className="text-[#B0B3BB] text-sm">/ month</span>
        </div>
        <p className="text-[#B0B3BB] text-sm mt-2 leading-relaxed">{tier.description}</p>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.perks.map(perk => (
          <li key={perk} className="flex items-start gap-2 text-sm text-[#B0B3BB]">
            <span className={`mt-0.5 font-bold ${tier.iconColor}`}>✓</span>
            {perk}
          </li>
        ))}
      </ul>

      <a
        href={tier.stripeUrl}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${tier.buttonColor}`}
      >
        <Icon className="w-4 h-4" />
        Get {tier.label}
      </a>
      <p className="text-white/25 text-xs text-center mt-2">Secure payment via Stripe</p>
    </div>
  )
}

export default function FeaturedTiers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FreeListingCard />
      {PAID_TIERS.map(tier => <PaidTierCard key={tier.id} tier={tier} />)}
    </div>
  )
}
