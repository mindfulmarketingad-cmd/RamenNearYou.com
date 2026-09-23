'use client'

import { X, UtensilsCrossed } from 'lucide-react'

interface Props {
  onClose: () => void
  redirectTo?: string
  /** Overrides the body copy so the modal names the feature that was clicked. */
  body?: React.ReactNode
}

// Shown to signed-out visitors when they try to use a members-only feature
// (searchmap, ordering, full menus). Free account — no payment here.
export default function SigninGateModal({ onClose, redirectTo = '/', body }: Props) {
  const next = encodeURIComponent(redirectTo)
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl p-7 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink-soft hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-6 h-6 text-brand-ink" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          Free Account
        </div>

        <h2 className="font-serif text-2xl font-bold text-ink mb-2">
          Sign in to keep slurping
        </h2>

        <p className="text-ink-soft text-sm leading-relaxed mb-6">
          {body ?? (
            <>
              The map, full menus, and ordering are for members. Create a
              <strong> free account</strong> to unlock them — no payment required.
            </>
          )}
        </p>

        <div className="flex flex-col gap-2.5">
          <a
            href={`/auth/signup?redirectTo=${next}`}
            className="w-full px-5 py-3 rounded-none bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
          >
            Create Free Account
          </a>
          <a
            href={`/auth/login?redirectTo=${next}`}
            className="w-full px-5 py-3 rounded-none bg-surface border border-line/10 text-ink hover:border-line/20 text-sm font-semibold transition-colors"
          >
            I already have an account
          </a>
        </div>
      </div>
    </div>
  )
}
