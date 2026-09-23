import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { checkRateLimit } from '@/lib/rate-limit'

// POST /api/track-view — record an automatic page view for a restaurant
export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'track-view', 120, 60_000)
  if (limited) return limited
  try {
    const { slug } = await request.json()
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 })

    const client = createAdminClient()
    if (!client) return NextResponse.json({ ok: true })

    await client
      .from('restaurant_visits')
      .insert({ restaurant_slug: slug, visitor_token: crypto.randomUUID(), event_type: 'view' })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
