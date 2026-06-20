'use client'

import { useState, useEffect, useCallback } from 'react'
import { FREE_MONTHLY_LIMIT } from '@/lib/usage'

export type GateResult = 'ok' | 'signin' | 'subscribe'

// Shared access gate for members-only features. The authoritative count lives
// server-side (see /api/usage + supabase/feature_usage.sql) so it can't be
// reset by clearing browser storage. This hook caches the server state for a
// synchronous evaluate(), and consume() spends a use atomically on the server.
//  - Not signed in            → 'signin'  (prompt to create a free account)
//  - Signed in + subscribed   → 'ok'      (unlimited)
//  - Signed in, not subscribed→ 'ok' until FREE_MONTHLY_LIMIT, then 'subscribe'
export function useGate() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [remaining, setRemaining] = useState(FREE_MONTHLY_LIMIT)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/usage', { cache: 'no-store' })
      if (!res.ok) { setSignedIn(false); return }
      const d = await res.json()
      setSignedIn(!!d.signedIn)
      setSubscribed(!!d.subscribed)
      setRemaining(typeof d.remaining === 'number' ? d.remaining : FREE_MONTHLY_LIMIT)
    } catch {
      setSignedIn(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // What would happen if the user acted right now — without consuming a use.
  const evaluate = useCallback((): GateResult => {
    if (signedIn === null) return 'ok' // auth still resolving — don't gate prematurely
    if (signedIn === false) return 'signin'
    if (subscribed) return 'ok'
    return remaining <= 0 ? 'subscribe' : 'ok'
  }, [signedIn, subscribed, remaining])

  // Spend one free monthly use. Optimistically decrements the cached count and
  // reconciles with the server's atomic result (no-op for subscribers/guests).
  const consume = useCallback(() => {
    if (signedIn !== true || subscribed) return
    setRemaining(r => Math.max(0, r - 1))
    fetch('/api/usage/consume', { method: 'POST' })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d) return
        if (d.reason === 'subscribed') { setSubscribed(true); return }
        if (typeof d.remaining === 'number') setRemaining(d.remaining)
      })
      .catch(() => {})
  }, [signedIn, subscribed])

  return { signedIn, subscribed, remaining, evaluate, consume, refresh }
}
