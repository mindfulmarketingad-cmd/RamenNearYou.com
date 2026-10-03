'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Shared client-side auth check — used anywhere a button needs to know
// whether the visitor is logged in before acting (or before prompting login).
export function useCurrentUser(): { user: User | null; authChecked: boolean } {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setAuthChecked(true); return }
    let settled = false
    const settle = () => { if (!settled) { settled = true; setAuthChecked(true) } }
    supabase.auth.getUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(settle)
    // A hung request (rather than a fast network error) shouldn't leave the
    // gate permanently disabled — fail closed (treated as logged-out) after
    // a few seconds instead of blocking every gated button forever.
    const timeout = setTimeout(settle, 4000)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  return { user, authChecked }
}
