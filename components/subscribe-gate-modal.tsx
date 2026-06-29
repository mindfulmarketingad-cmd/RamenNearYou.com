'use client'

import { X, SlidersHorizontal, Check } from 'lucide-react'

const STRIPE_LINK = 'https://buy.stripe.com/9B6aEYgyK44EaYK45ofrW08'

interface Props {
  onClose: () => void
  featureName?: string
}

export default function SubscribeGateModal({ onClose, featureName = 'Filters' }: Props) {
  function handleSubscribe() {
    window.location.href = STRIPE_LINK
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[#9B9490] hover:text-[#1E2026] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B57F50]/20 to-[#B57F50]/5 flex items-center justify-center mx-auto mb-4">
          <SlidersHorizontal className="w-6 h-6 text-[#B57F50]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/25 text-[#B57F50] text-xs font-semibold mb-3">
          RamenNearYou+ — $2.99/month
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
          Unlock All Filters
        </h2>

        <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
          Filter by bowl type, mood, price, and hours to find exactly the ramen you&apos;re craving — just $2.99/month, cancel anytime.
        </p>

        <ul className="text-left space-y-2 mb-6">
          {[
            'Filter by bowl — Tonkotsu, Spicy Miso, Shoyu & more',
            'Filter by mood — Late-night, Date Night, Quick Lunch',
            'Filter by price — Budget, Premium, Best Value',
            'Filter by hours — Open Now, Open Late, Past Midnight',
            'Just $2.99/month, cancel anytime',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#1E2026]">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleSubscribe}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
          >
            Subscribe — $2.99/month
          </button>
          <button
            onClick={onClose}
            className="w-full px-5 py-3 rounded-xl bg-white border border-black/10 text-[#1E2026] hover:border-black/20 text-sm font-semibold transition-colors"
          >
            Maybe later
          </button>
        </div>

        <p className="text-[#9B9490] text-[11px] mt-3">
          Filters unlock instantly after payment.{' '}
          Already subscribed? <a href="/auth/login" className="underline hover:text-[#1E2026]">Sign in</a>.
        </p>
      </div>
    </div>
  )
}
