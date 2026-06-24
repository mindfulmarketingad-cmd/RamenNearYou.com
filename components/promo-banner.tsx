'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Site-wide promo bar nudging logged-out visitors to sign up for full map
// access. Fixed to the bottom so it never overlaps the fixed navbar or any
// page's top padding. Hidden once dismissed (persisted) or once signed in.
export default function PromoBanner() {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid SSR/first-paint flash
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setDismissed(localStorage.getItem('promoBannerDismissed') === '1')
    setReady(true)

    const supabase = createClient()
    if (!supabase) { setAuthChecked(true); return }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setAuthChecked(true) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function dismiss() {
    setDismissed(true)
    try { localStorage.setItem('promoBannerDismissed', '1') } catch {}
  }

  if (!ready || !authChecked || dismissed || user) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#1E2026] text-white shadow-[0_-2px_12px_rgba(0,0,0,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3">
        <Link
          href="/auth/login"
          className="group flex items-center gap-2 text-sm sm:text-base font-semibold"
        >
          <span>
            Sign up for <span className="text-[#E0A56A]">full map access</span>
          </span>
          <ArrowRight className="w-4 h-4 text-[#E0A56A] transition-transform group-hover:translate-x-1" />
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 sm:right-5 p-1 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
