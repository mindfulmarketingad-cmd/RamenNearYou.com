'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

// Shared "sign in to continue" prompt shown when a logged-out visitor clicks
// a gated action (Directions, Website, Call, Save, Claim, etc.) on a
// restaurant listing or searchmap card.
export default function LoginGateModal({
  open,
  onClose,
  redirectTo,
}: {
  open: boolean
  onClose: () => void
  redirectTo: string
}) {
  const router = useRouter()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in required"
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1 text-[#9B9490] hover:text-[#1E2026] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-2">Sign in to continue</h2>
        <p className="text-sm text-[#6B6862] mb-5">
          Create a free account or sign in to get directions, call, save restaurants, and more.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`)}
            className="w-full px-4 py-2.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-full text-[#6B6862] text-sm font-medium hover:bg-black/5 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
