import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const state = searchParams.get('state')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    if (city && state) return NextResponse.json({ following: false })
    return NextResponse.json({ follows: [] })
  }

  const client = createAdminClient() ?? supabase

  if (city && state) {
    const { data } = await client
      .from('city_follows')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('city_slug', city)
      .eq('state_slug', state)
      .maybeSingle()
    return NextResponse.json({ following: !!data })
  }

  const { data } = await client
    .from('city_follows')
    .select('city_slug, state_slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ follows: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { city, state } = await request.json()
  if (!city || !state) return NextResponse.json({ error: 'Missing city or state' }, { status: 400 })

  const client = createAdminClient() ?? supabase
  const { error } = await client
    .from('city_follows')
    .upsert(
      { user_id: user.id, city_slug: city, state_slug: state },
      { onConflict: 'user_id,city_slug,state_slug', ignoreDuplicates: true }
    )

  if (error) {
    console.error('City follow error:', error.message)
    return NextResponse.json({ error: 'Failed to follow city.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { city, state } = await request.json()
  if (!city || !state) return NextResponse.json({ error: 'Missing city or state' }, { status: 400 })

  const client = createAdminClient() ?? supabase
  const { error } = await client
    .from('city_follows')
    .delete()
    .eq('user_id', user.id)
    .eq('city_slug', city)
    .eq('state_slug', state)

  if (error) {
    console.error('City unfollow error:', error.message)
    return NextResponse.json({ error: 'Failed to unfollow.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
