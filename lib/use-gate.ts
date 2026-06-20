'use client'

import { useState, useEffect, useCallback } from 'react'

export type GateResult = 'ok' | 'signin' | 'subscribe'

// Shared access gate. Checks server-side auth + subscription state.
//  - Not signed in          → 'signin'    (prompt to create a free account)
//  - Signed in, no sub      → 'subscribe' (prompt to start Ramen Pass trial)
//  - Signed in + subscribed → 'ok'        (full access)
export function useGate() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [subscribed, setSubscribed] = useState<boolean | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/usage', { cache: 'no-store' })
      if (!res.ok) { setSignedIn(false); setSubscribed(false); return }
      const d = await res.json()
      setSignedIn(!!d.signedIn)
      setSubscribed(!!d.subscribed)
    } catch {
      setSignedIn(false)
      setSubscribed(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Basic gate: requires sign-in only (map search, ordering, menus).
  const evaluate = useCallback((): GateResult => {
    if (signedIn === null) return 'ok' // auth still resolving — don't gate prematurely
    if (signedIn === false) return 'signin'
    return 'ok'
  }, [signedIn])

  // Premium gate: requires sign-in AND active Ramen Pass subscription.
  const evaluatePremium = useCallback((): GateResult => {
    if (signedIn === null || subscribed === null) return 'ok' // still resolving
    if (signedIn === false) return 'signin'
    if (subscribed === false) return 'subscribe'
    return 'ok'
  }, [signedIn, subscribed])

  return { signedIn, subscribed, evaluate, evaluatePremium, refresh }
}
