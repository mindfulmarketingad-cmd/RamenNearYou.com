'use client'

import { useState } from 'react'
import { Crown, Check } from 'lucide-react'

type Billing = 'monthly' | 'yearly'

interface Tier {
  id: string
  label: string
  monthlyPrice: string
  yearlyPrice: string
  description: string
  features: string[]
  monthlyLink: string
  yearlyLink: string
  badge?: string
  highlight?: boolean
}

// 3 tiers, 2 ways to pay each. Swap in the real Stripe Payment Link URLs per
// tier/interval once created (Stripe Dashboard → Payment Links → recurring
// price). Falls back to a pre-filled mailto so no button is ever a dead link.
const TIERS: Tier[] = [
  {
    id: 'city',
    label: 'City Feature',
    monthlyPrice: '$19.99',
    yearlyPrice: '$199.99',
    description: 'Get featured on your city’s find page.',
    features: [
      'Stand-out crown icon on your city page',
      'Verified badge on your listing',
    ],
    monthlyLink: '',
    yearlyLink: '',
  },
  {
    id: 'city_state',
    label: 'City + State Feature',
    monthlyPrice: '$39.99',
    yearlyPrice: '$399.99',
    description: 'Get featured on your city page and your state page.',
    features: [
      'Everything in City Feature',
      'Stand-out crown icon on your state page',
    ],
    monthlyLink: '',
    yearlyLink: '',
  },
  {
    id: 'city_state_homepage',
    label: 'City + State + Homepage',
    monthlyPrice: '$59.99',
    yearlyPrice: '$650',
    description: 'Get featured on your city, state, and the homepage.',
    features: [
      'Everything in City + State Feature',
      'Top (#1) position on the homepage restaurant list',
    ],
    monthlyLink: '',
    yearlyLink: '',
    badge: 'Best Value',
    highlight: true,
  },
]

const FALLBACK_MAILTO = (plan: string, billing: Billing) =>
  `mailto:hello@ramennearyou.com?subject=${encodeURIComponent(`Featured Listing — ${plan} (${billing})`)}`

export default function PlanToggle() {
  const [billing, setBilling] = useState<Billing>('monthly')

  return (
    <div>
      {/* Monthly / Yearly toggle — applies to all 3 tiers at once */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex p-1 rounded-full bg-[#F5F4F0] border border-black/8">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              billing === 'monthly' ? 'bg-[#1E2026] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              billing === 'yearly' ? 'bg-[#1E2026] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* 3 tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {TIERS.map((tier) => {
          const price = billing === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice
          const period = billing === 'monthly' ? '/ month' : '/ year'
          const link = billing === 'monthly' ? tier.monthlyLink : tier.yearlyLink
          const checkoutUrl = link || FALLBACK_MAILTO(tier.label, billing)

          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-2xl overflow-hidden bg-[#F5F4F0] ${
                tier.highlight ? 'border-2 border-amber-400/60' : 'border border-black/8'
              }`}
            >
              <div className={`px-5 pb-5 text-center border-b ${tier.highlight ? 'bg-amber-500/10 border-amber-400/30 pt-3' : 'border-black/8 pt-5'}`}>
                {tier.badge && (
                  <div className="flex justify-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[#1E2026] text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Crown className="w-3 h-3" /> {tier.label}
                </div>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="font-serif text-3xl font-bold text-[#1E2026]">{price}</span>
                  <span className="text-[#6B6862] text-xs">{period}</span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <p className="text-[#6B6862] text-xs leading-relaxed mb-4">{tier.description}</p>
                <ul className="space-y-2.5 mb-5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#1E2026]">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={checkoutUrl}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Get Featured
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-[#1E2026]/30 text-xs mt-6">Secure payment via Stripe · Cancel anytime</p>
    </div>
  )
}
