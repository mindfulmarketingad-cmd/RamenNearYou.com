import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/reviews?slug=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ reviews: [] })

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ reviews: [] })

  const { data } = await admin
    .from('reviews')
    .select('*')
    .eq('restaurant_slug', slug)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ reviews: data ?? [] })
}

// POST /api/reviews — submit a review (auth required)
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { restaurant_slug, rating, body: reviewBody, photos } = body

  if (!restaurant_slug || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
  }
  if (photos && photos.length > 5) {
    return NextResponse.json({ error: 'Max 5 photos per review' }, { status: 400 })
  }

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  // Prevent duplicate review from same user on same restaurant
  const { data: existing } = await admin
    .from('reviews')
    .select('id')
    .eq('restaurant_slug', restaurant_slug)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You already reviewed this restaurant' }, { status: 409 })
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'

  const { data, error } = await admin
    .from('reviews')
    .insert({
      restaurant_slug,
      user_id: user.id,
      user_display_name: displayName,
      rating,
      body: reviewBody || null,
      photos: photos || [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ review: data })
}

// DELETE /api/reviews?id=...
export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  await admin.from('reviews').delete().eq('id', id).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
