import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'track-click', 120, 60_000)
  if (limited) return limited
  const { restaurantSlug, restaurantName, destination, url } = await request.json()
  if (!restaurantSlug || !destination) return NextResponse.json({ ok: true })

  const client = createAdminClient()
  if (!client) return NextResponse.json({ ok: true })

  // Record into restaurant_visits (event_type='click') — this is what the
  // owner dashboard reads for click analytics. A fresh random token per click
  // means each one is counted (the UNIQUE(slug, token) constraint only dedupes
  // the "visited" toggle, which reuses a stable per-visitor token).
  await client.from('restaurant_visits').insert({
    restaurant_slug: restaurantSlug,
    visitor_token: crypto.randomUUID(),
    event_type: 'click',
    click_target: destination,
  })

  // Also keep the legacy outbound_clicks log (destination + url) for any
  // ad-hoc reporting; harmless if the table is absent.
  await client.from('outbound_clicks').insert({
    restaurant_slug: restaurantSlug,
    restaurant_name: restaurantName,
    destination,
    url,
  })

  return NextResponse.json({ ok: true })
}
