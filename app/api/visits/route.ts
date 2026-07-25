import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

// POST /api/visits — record that this visitor visited a restaurant
export async function POST(request: Request) {
  const { slug, token } = await request.json()
  if (!slug || !token) {
    return NextResponse.json({ error: 'Missing slug or token' }, { status: 400 })
  }

  const sessionClient = await createClient()
  let userId: string | null = null
  if (sessionClient) {
    const { data: { user } } = await sessionClient.auth.getUser()
    userId = user?.id ?? null
  }

  const client = createAdminClient() ?? sessionClient
  if (!client) return NextResponse.json({ ok: true })

  const { error } = await client
    .from('restaurant_visits')
    .upsert(
      { restaurant_slug: slug, visitor_token: token, user_id: userId, event_type: 'view' },
      { onConflict: 'restaurant_slug,visitor_token', ignoreDuplicates: true }
    )

  if (error) {
    console.error('Visit insert error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// GET /api/visits?slug=... — get visit count for a restaurant
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ count: 0 })

  const client = createAdminClient() ?? await createClient()
  if (!client) return NextResponse.json({ count: 0 })

  const { count } = await client
    .from('restaurant_visits')
    .select('id', { count: 'exact', head: true })
    .eq('restaurant_slug', slug)
    .eq('event_type', 'view')

  return NextResponse.json({ count: count ?? 0 })
}
