'use client'

import { X, Lock } from 'lucide-react'

const STRIPE_SUBSCRIBE_URL = 'https://buy.stripe.com/4gM7sMdmycBa9UGfO6frW07'

interface Props {
  onClose: () => void
}

export default function SubscribeGateModal({ onClose }: Props) {
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

        <div className="w-14 h-14 rounded-full bg-[#B57F50]/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-[#B57F50]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-semibold mb-3">
          14-Day Free Trial
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
          Unlock the full ramen map
        </h2>

        <div className="flex items-end justify-center gap-1.5 mb-1">
          <span className="font-serif text-5xl font-bold text-[#1E2026]">$0</span>
          <span className="text-[#6B6862] text-sm mb-2">today</span>
        </div>

        <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
          Menus, ordering, filters, Best Bowl Finder, heatmap, and your Ramen
          Passport are members-only. Start your <strong>14-day free trial</strong> —
          no cost upfront, then just <strong>$4.99/month</strong>. Cancel anytime.
        </p>

        <div className="flex flex-col gap-2.5">
          <a
            href={STRIPE_SUBSCRIBE_URL}
            className="w-full px-5 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
          >
            Start Free Trial — $0 Today
          </a>
          <a
            href="/auth/login"
            className="w-full px-5 py-3 rounded-none bg-white border border-black/10 text-[#1E2026] hover:border-black/20 text-sm font-semibold transition-colors"
          >
            I already have an account
          </a>
        </div>
      </div>
    </div>
  )
}
