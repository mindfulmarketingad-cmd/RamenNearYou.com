'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X, MapPin, Heart, Navigation, Sparkles } from 'lucide-react'
import { useCurrentUser } from '@/lib/use-current-user'
import { useModalA11y } from '@/lib/use-modal-a11y'

const SESSION_KEY = 'timedLoginPromptShown'
const DELAY_MS = 30000

const BENEFITS = [
  { icon: MapPin, text: 'Full map access — every ramen spot near you, no limits' },
  { icon: Navigation, text: 'Get directions, call, and claim listings in one tap' },
  { icon: Heart, text: 'Save your favorite restaurants and searches to come back to' },
]

// Fires once per browser session, 30s after a logged-out visitor lands on the
// site — mounted globally in the root layout so it applies everywhere, not
// just the searchmap. Skipped on the auth pages themselves.
export default function TimedLoginPrompt() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, authChecked } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const panelRef = useModalA11y(open, () => setOpen(false))

  useEffect(() => {
    if (!authChecked || user) return
    if (pathname?.startsWith('/auth')) return
    if (typeof window === 'undefined' || sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [authChecked, user, pathname])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to unlock more"
    >
      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden outline-none">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-br from-[#1E2026] to-[#3a2f28] px-6 pt-9 pb-7 text-center">
          <div className="w-14 h-14 rounded-full bg-[#B57F50]/20 border border-[#B57F50]/40 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-[#B57F50]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-1.5">Still hungry?</h2>
          <p className="text-white/70 text-sm">Create a free account to unlock the full experience.</p>
        </div>

        <div className="px-6 py-6">
          <ul className="space-y-3 mb-6">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-[#1E2026]">
                <span className="w-8 h-8 rounded-full bg-[#B57F50]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#B57F50]" />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname || '/')}`)}
              className="w-full px-4 py-3 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
            >
              Create Free Account
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full px-4 py-2.5 rounded-full text-[#6B6862] text-sm font-medium hover:bg-black/5 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
