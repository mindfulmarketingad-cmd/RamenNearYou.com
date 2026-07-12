'use client'

import { X, UtensilsCrossed } from 'lucide-react'

interface Props {
  onClose: () => void
  redirectTo?: string
}

// Shown to signed-out visitors when they try to use a members-only feature
// (searchmap, ordering, full menus). Free account — no payment here.
export default function SigninGateModal({ onClose, redirectTo = '/' }: Props) {
  const next = encodeURIComponent(redirectTo)
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[#6B6862] hover:text-[#1E2026] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-[#B57F50]/10 flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-6 h-6 text-[#96602F]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-semibold mb-3">
          Free Account
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
          Sign in to keep slurping
        </h2>

        <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
          The map, full menus, and ordering are for members. Create a
          <strong> free account</strong> to unlock them — no payment required.
        </p>

        <div className="flex flex-col gap-2.5">
          <a
            href={`/auth/signup?redirectTo=${next}`}
            className="w-full px-5 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
          >
            Create Free Account
          </a>
          <a
            href={`/auth/login?redirectTo=${next}`}
            className="w-full px-5 py-3 rounded-none bg-white border border-black/10 text-[#1E2026] hover:border-black/20 text-sm font-semibold transition-colors"
          >
            I already have an account
          </a>
        </div>
      </div>
    </div>
  )
}
