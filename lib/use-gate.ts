'use client'

import { useState, useEffect, useCallback } from 'react'

export type GateResult = 'ok' | 'signin'

// Shared access gate. Checks server-side auth state so it can't be spoofed
// by clearing browser storage.
//  - Not signed in  → 'signin'  (prompt to create a free account)
//  - Signed in      → 'ok'      (full access)
export function useGate() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/usage', { cache: 'no-store' })
      if (!res.ok) { setSignedIn(false); return }
      const d = await res.json()
      setSignedIn(!!d.signedIn)
    } catch {
      setSignedIn(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // What would happen if the user acted right now — without any side effects.
  const evaluate = useCallback((): GateResult => {
    if (signedIn === null) return 'ok' // auth still resolving — don't gate prematurely
    if (signedIn === false) return 'signin'
    return 'ok'
  }, [signedIn])

  return { signedIn, evaluate, refresh }
}
