'use client'

import { Crown } from 'lucide-react'

const STRIPE_URL = 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02'

export default function FeaturedApplyForm() {
  return (
    <div className="bg-[#1E2026] rounded-2xl border border-white/5 p-6 sm:p-8 space-y-6">
      <div className="space-y-4">
        <h2 className="text-white font-semibold">Ready to get started?</h2>
        <p className="text-[#B0B3BB] text-sm leading-relaxed">
          Click below to complete your payment securely via Stripe. After checkout, email us at{' '}
          <a href="mailto:hello@ramennearyou.com" className="text-amber-400 hover:underline">
            hello@ramennearyou.com
          </a>{' '}
          with your restaurant name, address, photos, and description and we&apos;ll get your featured listing live within 24 hours.
        </p>
      </div>

      <div className="pt-2 border-t border-white/5">
        <a
          href={STRIPE_URL}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-[#1E2026] font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5" /> Get Featured — $29.99/mo
        </a>
        <p className="text-white/30 text-xs text-center mt-3">
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
