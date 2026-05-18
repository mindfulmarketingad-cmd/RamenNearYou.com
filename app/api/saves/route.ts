import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ saves: [] })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ saves: [] })

  const { data } = await supabase
    .from('saved_restaurants')
    .select('restaurant_slug')
    .eq('user_id', user.id)

  return NextResponse.json({ saves: (data ?? []).map((r) => r.restaurant_slug) })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  await supabase.from('saved_restaurants').upsert({ user_id: user.id, restaurant_slug: slug })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  await supabase
    .from('saved_restaurants')
    .delete()
    .eq('user_id', user.id)
    .eq('restaurant_slug', slug)

  return NextResponse.json({ ok: true })
}
