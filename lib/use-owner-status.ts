'use client'

import { useEffect, useState } from 'react'
import { useCurrentUser } from './use-current-user'

export interface OwnerStatus {
  isOwner: boolean
  canSelfLink: boolean
}

const NONE: OwnerStatus = { isOwner: false, canSelfLink: false }

// Module-level cache so multiple components on the same page (action row +
// self-link panel) share one /api/owner/listing-status request per slug.
const cache = new Map<string, OwnerStatus>()
const inflight = new Map<string, Promise<OwnerStatus>>()

// Client-side owner/claim relationship for the current visitor. Anonymous
// visitors (the SEO-relevant crowd) never trigger a request — the fetch only
// fires once auth resolves to a logged-in user.
export function useOwnerStatus(slug: string): OwnerStatus {
  const { user, authChecked } = useCurrentUser()
  const [status, setStatus] = useState<OwnerStatus>(() => cache.get(slug) ?? NONE)

  useEffect(() => {
    if (!authChecked || !user) return
    const cached = cache.get(slug)
    if (cached) { setStatus(cached); return }

    let cancelled = false
    let p = inflight.get(slug)
    if (!p) {
      p = fetch(`/api/owner/listing-status?slug=${encodeURIComponent(slug)}`)
        .then((r) => (r.ok ? r.json() : NONE))
        .then((d): OwnerStatus => ({ isOwner: !!d?.isOwner, canSelfLink: !!d?.canSelfLink }))
        .catch(() => NONE)
        .then((s) => { cache.set(slug, s); inflight.delete(slug); return s })
      inflight.set(slug, p)
    }
    p.then((s) => { if (!cancelled) setStatus(s) })
    return () => { cancelled = true }
  }, [authChecked, user, slug])

  return status
}
