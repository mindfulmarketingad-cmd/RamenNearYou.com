import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/photos?slug=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ photos: [] })

  const client = createAdminClient() ?? (await createClient())
  if (!client) return NextResponse.json({ photos: [] })

  const { data } = await client
    .from('restaurant_photos')
    .select('*')
    .eq('restaurant_slug', slug)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ photos: data ?? [] })
}

// POST /api/photos — submit photos (auth required)
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { restaurant_slug, urls } = body

  if (!restaurant_slug || !urls?.length) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (urls.length > 8) {
    return NextResponse.json({ error: 'Max 8 photos' }, { status: 400 })
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
  const insertClient = createAdminClient() ?? supabase

  const rows = urls.map((url: string) => ({
    restaurant_slug,
    user_id: user.id,
    user_display_name: displayName,
    url,
  }))

  const { data, error } = await insertClient
    .from('restaurant_photos')
    .insert(rows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photos: data })
}

// DELETE /api/photos?id=...
export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const deleteClient = createAdminClient() ?? supabase
  await deleteClient.from('restaurant_photos').delete().eq('id', id).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
