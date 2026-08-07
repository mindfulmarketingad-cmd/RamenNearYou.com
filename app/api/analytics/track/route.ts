import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { ANALYTICS_TABLE, classifyListingPath, isAnalyticsEvent } from '@/lib/analytics'

export const runtime = 'nodejs'

function str(v: unknown, max = 500): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  if (!s) return null
  return s.slice(0, max)
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !isAnalyticsEvent(body.eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const admin = createAdminClient()
    // No service-role key configured (e.g. a local run) — accept and drop
    // rather than surfacing an error to the page being measured.
    if (!admin) return NextResponse.json({ ok: true, skipped: true })

    const path = str(body.path, 512)
    let eventType = body.eventType

    // Resolve the listing server-side so the client never has to know the
    // dataset, and every event on a detail page is attributed even when the
    // caller didn't pass listing context.
    const classified = path ? classifyListingPath(path) : null

    // A plain pageview on a business detail page is really a listing view —
    // promote it so impressions-per-business are countable without the
    // client having to distinguish page types.
    if (eventType === 'pageview' && classified) eventType = 'listing_view'

    const { error } = await admin.from(ANALYTICS_TABLE).insert({
      event_type: eventType,
      path,
      referrer: str(body.referrer, 512),
      session_id: str(body.sessionId, 100),
      visitor_id: str(body.visitorId, 100),
      listing_slug: str(body.listingSlug, 200) ?? classified?.listingSlug ?? null,
      listing_name: str(body.listingName, 300) ?? classified?.listingName ?? null,
      city: str(body.city, 200) ?? classified?.city ?? null,
      query: str(body.query, 300),
    })

    if (error) {
      console.error('Analytics insert error:', error.message)
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Analytics track threw:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
