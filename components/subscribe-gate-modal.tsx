'use client'

import { X, Sparkles } from 'lucide-react'

interface Props {
  onClose: () => void
}

// Shown to signed-in but unsubscribed users who try to access Ramen Pass features.
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

        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B57F50]/20 to-[#B57F50]/5 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-[#B57F50]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/25 text-[#B57F50] text-xs font-semibold mb-3">
          Ramen Pass
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
          Unlock Ramen Near Me AI
        </h2>

        <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
          Natural language ramen search is a <strong>Ramen Pass</strong> feature.
          Subscribers get AI-powered recommendations, priority listings, and exclusive perks.
        </p>

        <div className="flex flex-col gap-2.5">
          <a
            href="/ramen-pass"
            className="w-full px-5 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
          >
            Get Ramen Pass
          </a>
          <button
            onClick={onClose}
            className="w-full px-5 py-3 rounded-none bg-white border border-black/10 text-[#1E2026] hover:border-black/20 text-sm font-semibold transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
