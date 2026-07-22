'use client'

import { useState } from 'react'
import { Crown, Check } from 'lucide-react'

// One plan, two ways to pay — swap in the real Stripe Payment Link URLs once
// created (Stripe Dashboard → Payment Links → recurring price). Falls back to
// a pre-filled mailto so the button is never a dead link before that's done.
const STRIPE_MONTHLY_LINK = ''
const STRIPE_YEARLY_LINK = ''

const FALLBACK_MAILTO = (plan: string) =>
  `mailto:hello@ramennearyou.com?subject=${encodeURIComponent(`Featured Listing — ${plan}`)}`

const FEATURES = [
  'Stand-out crown icon on the search map',
  'Top (#1) position on the homepage restaurant list',
  'Verified badge on your listing',
  'Cancel anytime',
]

type Billing = 'monthly' | 'yearly'

export default function PlanToggle() {
  const [billing, setBilling] = useState<Billing>('monthly')

  const price = billing === 'monthly' ? '$19.99' : '$250'
  const period = billing === 'monthly' ? '/ month' : '/ year'
  const checkoutUrl = billing === 'monthly'
    ? (STRIPE_MONTHLY_LINK || FALLBACK_MAILTO('Monthly'))
    : (STRIPE_YEARLY_LINK || FALLBACK_MAILTO('Yearly'))

  return (
    <div className="max-w-md mx-auto">
      {/* Monthly / Yearly toggle */}
      <div className="flex items-center justify-center mb-6">
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

      {/* Plan card */}
      <div className="rounded-2xl border-2 border-amber-400/60 bg-[#F5F4F0] overflow-hidden">
        <div className="bg-amber-500/10 px-6 py-4 text-center border-b border-amber-400/30">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-[#1E2026] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Crown className="w-3 h-3" /> Featured
          </div>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="font-serif text-4xl font-bold text-[#1E2026]">{price}</span>
            <span className="text-[#6B6862] text-sm">{period}</span>
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-[#1E2026]">
                <Check className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>

          <a
            href={checkoutUrl}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
          >
            <Crown className="w-4 h-4" />
            Get Featured — {price}{period}
          </a>
          <p className="text-center text-[#1E2026]/30 text-xs mt-3">Secure payment via Stripe · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
