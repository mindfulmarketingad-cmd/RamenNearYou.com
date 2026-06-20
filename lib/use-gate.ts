'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUsageCount, incrementUsage, FREE_MONTHLY_LIMIT } from '@/lib/usage'

export type GateResult = 'ok' | 'signin' | 'subscribe'

// Shared access gate for members-only features.
//  - Not signed in            → 'signin'  (prompt to create a free account)
//  - Signed in + subscribed   → 'ok'      (unlimited)
//  - Signed in, not subscribed→ 'ok' until FREE_MONTHLY_LIMIT, then 'subscribe'
export function useGate() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setSignedIn(false); return }

    let cancelled = false
    function checkSubscription() {
      fetch('/api/user/subscription-status')
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (!cancelled && d?.isActive) setSubscribed(true) })
        .catch(() => {})
    }

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      const isIn = !!data.user
      setSignedIn(isIn)
      if (isIn) checkSubscription()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session)
      if (session) checkSubscription()
      else setSubscribed(false)
    })
    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  // What would happen if the user acted right now — without consuming a use.
  const evaluate = useCallback((): GateResult => {
    if (signedIn === null) return 'ok' // auth still resolving — don't gate prematurely
    if (signedIn === false) return 'signin'
    if (subscribed) return 'ok'
    return getUsageCount() >= FREE_MONTHLY_LIMIT ? 'subscribe' : 'ok'
  }, [signedIn, subscribed])

  // Spend one free monthly use (no-op for subscribers / signed-out / unresolved).
  const consume = useCallback(() => {
    if (signedIn === true && !subscribed) incrementUsage()
  }, [signedIn, subscribed])

  return { signedIn, subscribed, evaluate, consume }
}
