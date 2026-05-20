import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const { restaurantSlug, restaurantName, destination, url } = await request.json()
  if (!restaurantSlug || !destination) return NextResponse.json({ ok: true })

  const client = createAdminClient()
  if (!client) return NextResponse.json({ ok: true })

  await client.from('outbound_clicks').insert({
    restaurant_slug: restaurantSlug,
    restaurant_name: restaurantName,
    destination,
    url,
  })

  return NextResponse.json({ ok: true })
}
