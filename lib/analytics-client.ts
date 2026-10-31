'use client'

// Browser-side analytics. The site is static HTML with no API routes, so
// events go straight into Supabase's REST API with the public anon key —
// the same way pumpkinpatchesnearme.com does it. The table's RLS allows
// anonymous INSERT (supabase/ramennearyou_dashboard_public_insert.sql) and
// its CHECK constraint limits event_type; it holds no PII.
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWxraGhqb3JpYWtqeWVvZ2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjQ3MTMsImV4cCI6MjA5NDU0MDcxM30.gczEiOrXeym_pflc473bp-ct3cuo0_XyRAB0XY9gVPs'
const TABLE = 'ramennearyou_dashboard'

// Listing pages render a hidden marker (components/page-view-tracker.tsx) so
// a pageview there is recorded as a listing_view with the listing attached —
// what the old server route worked out from the path.
function listingContext(): { slug: string; name: string | null; city: string | null } | null {
  const el = document.querySelector<HTMLElement>('[data-rny-listing-slug]')
  if (!el?.dataset.rnyListingSlug) return null
  return { slug: el.dataset.rnyListingSlug, name: el.dataset.rnyListingName ?? null, city: el.dataset.rnyListingCity ?? null }
}

function str(v: string | null | undefined, max: number): string | null {
  const s = v?.trim()
  return s ? s.slice(0, max) : null
}

export function trackEvent(eventType: string, payload: TrackPayload = {}): void {
  if (typeof window === 'undefined') return
  try {
    const listing = listingContext()
    const type = eventType === 'pageview' && listing ? 'listing_view' : eventType
    const body = JSON.stringify({
      event_type: type,
      path: str(payload.path ?? window.location.pathname, 512),
      referrer: str(document.referrer, 512),
      session_id: str(getSessionId(), 100),
      visitor_id: str(getVisitorId(), 100),
      listing_slug: str(payload.listingSlug ?? listing?.slug, 200),
      listing_name: str(payload.listingName ?? listing?.name, 300),
      city: str(payload.city ?? listing?.city, 200),
      query: str(payload.query, 300),
    })

    // keepalive so the request still goes out when the click is navigating
    // the page away (call/directions links especially).
    void fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never throw from analytics.
  }
}
