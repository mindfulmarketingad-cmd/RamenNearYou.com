import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const state = searchParams.get('state')

  if (!city || !state) return NextResponse.json({ following: false })

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ following: false })

  const { data } = await supabase
    .from('city_follows')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('city_slug', city)
    .eq('state_slug', state)
    .maybeSingle()

  return NextResponse.json({ following: !!data })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { city, state } = await request.json()
  if (!city || !state) return NextResponse.json({ error: 'Missing city or state' }, { status: 400 })

  const { error } = await supabase
    .from('city_follows')
    .upsert({ user_id: user.id, city_slug: city, state_slug: state })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { city, state } = await request.json()
  if (!city || !state) return NextResponse.json({ error: 'Missing city or state' }, { status: 400 })

  const { error } = await supabase
    .from('city_follows')
    .delete()
    .eq('user_id', user.id)
    .eq('city_slug', city)
    .eq('state_slug', state)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
