'use client'

import { useState } from 'react'
import { MapPin, TrendingUp, Pencil } from 'lucide-react'

const BENEFITS = [
  { icon: MapPin, text: 'Premium placement on our searchmap' },
  { icon: TrendingUp, text: 'Maximum Exposure (5,000+ monthly pageviews)' },
  { icon: Pencil, text: 'Update all details on your dedicated page' },
]

export default function PricingToggle({ monthlyLink, annualLink }: { monthlyLink: string; annualLink: string }) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="bg-[#F5F4F0] rounded-2xl border border-black/5 p-8">
      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-1 bg-white rounded-full border border-black/8 p-1 mb-6 max-w-xs mx-auto">
        <button
          onClick={() => setPlan('monthly')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            plan === 'monthly' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPlan('annual')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            plan === 'annual' ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
          }`}
        >
          Annual
        </button>
      </div>

      {plan === 'monthly' ? (
        <>
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-semibold">
              14-Day Free Trial
            </span>
          </div>
          <div className="flex items-end justify-center gap-1.5 mb-1">
            <span className="font-serif text-5xl font-bold text-[#1E2026]">$0</span>
            <span className="text-[#6B6862] text-sm mb-2">today</span>
          </div>
          <p className="text-[#6B6862] text-xs text-center mb-6">Then $19.99/month after your free trial. Cancel anytime.</p>
        </>
      ) : (
        <>
          <div className="flex items-end justify-center gap-1.5 mb-1">
            <span className="font-serif text-5xl font-bold text-[#1E2026]">$250</span>
            <span className="text-[#6B6862] text-sm mb-2">/year</span>
          </div>
          <p className="text-[#6B6862] text-xs text-center mb-6">Billed annually. Cancel anytime.</p>
        </>
      )}

      <ul className="space-y-3 mb-8">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-[#1E2026]">
            <Icon className="w-4 h-4 text-[#96602F] shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      <a
        href={plan === 'monthly' ? monthlyLink : annualLink}
        className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
      >
        {plan === 'monthly' ? 'Start Free Trial — $0 Today' : 'Subscribe — $250/year'}
      </a>

      <p className="text-center text-xs text-[#6B6862] mt-4">
        After subscribing, return to this page to complete your claim.
      </p>
    </div>
  )
}
