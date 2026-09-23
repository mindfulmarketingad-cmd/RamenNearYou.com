'use client'

// Browser-side analytics. Deliberately free of any dataset import so it stays
// tiny — path-to-listing resolution happens server-side in the track route.
//
// Every function here is fire-and-forget and swallows its own errors: an
// analytics failure (blocked storage, offline, ad blocker) must never break
// the page it's measuring.

const SESSION_KEY = 'rny_analytics_session'
const VISITOR_KEY = 'rny_analytics_visitor'

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    // fall through to the Math.random path
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Per-tab id, resets when the tab closes — this is what "sessions" counts. */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = randomId()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

/** Persistent per-browser id — what "unique visitors" counts. Not tied to any
 *  account and never leaves this origin. */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export type TrackPayload = {
  listingSlug?: string
  listingName?: string
  city?: string
  query?: string
  path?: string
}

export function trackEvent(eventType: string, payload: TrackPayload = {}): void {
  if (typeof window === 'undefined') return
  try {
    const body = JSON.stringify({
      eventType,
      path: payload.path ?? window.location.pathname,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      listingSlug: payload.listingSlug ?? null,
      listingName: payload.listingName ?? null,
      city: payload.city ?? null,
      query: payload.query ?? null,
    })

    // keepalive so the request still goes out when the click is navigating
    // the page away (call/directions links especially).
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never throw from analytics.
  }
}
