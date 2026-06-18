import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { applyContributionReward, hasActiveRamenPass } from '@/lib/rewards'

// Word count of review text, ignoring any HTML tags.
function wordCount(text: string | null | undefined): number {
  if (!text) return 0
  return text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
}

// GET /api/reviews?slug=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ reviews: [] })

  // Try admin client first (bypasses RLS), fall back to anon client
  const client = createAdminClient() ?? (await createClient())

  const { data: reviews } = await client
    .from('reviews')
    .select('*')
    .eq('restaurant_slug', slug)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!reviews?.length) return NextResponse.json({ reviews: [] })

  // Fetch avatar_urls for reviewers
  const userIds = [...new Set(reviews.map(r => r.user_id).filter(Boolean))]
  const { data: profiles } = await client
    .from('user_profiles')
    .select('user_id, avatar_url')
    .in('user_id', userIds)

  const avatarMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.avatar_url]))
  const enriched = reviews.map(r => ({ ...r, avatar_url: avatarMap[r.user_id] ?? null }))

  return NextResponse.json({ reviews: enriched })
}

// POST /api/reviews — submit a review (auth required)
export async function POST(request: Request) {
  const supabase = await createClient()

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

  // Use admin client if available (bypasses RLS), otherwise use authenticated session
  const insertClient = createAdminClient() ?? supabase

  // Prevent duplicate review from same user on same restaurant
  const { data: existing } = await insertClient
    .from('reviews')
    .select('id')
    .eq('restaurant_slug', restaurant_slug)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You already reviewed this restaurant' }, { status: 409 })
  }

  // Count existing reviews BEFORE inserting — drives the first-review bonus.
  const { count: priorReviewCount } = await insertClient
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('restaurant_slug', restaurant_slug)

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'

  const { data, error } = await insertClient
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

  // Ramen Pass contribution credit (members only).
  let reward = null
  if (await hasActiveRamenPass(user.id)) {
    const words = wordCount(reviewBody)
    const hasPhoto = Array.isArray(photos) && photos.length > 0

    if (words >= 50 && hasPhoto) {
      reward = await applyContributionReward(user.id, 5.0, 'review_with_photo', data.id)
    } else if (words >= 50) {
      reward = await applyContributionReward(user.id, 2.0, 'review_only', data.id)
    }

    // First-ever review on this listing earns a bonus (stacks, cap-limited).
    if ((priorReviewCount ?? 0) === 0) {
      await applyContributionReward(user.id, 2.0, 'first_review_bonus', restaurant_slug)
    }
  }

  return NextResponse.json({ review: data, reward })
}

// DELETE /api/reviews?id=...
export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const deleteClient = createAdminClient() ?? supabase
  await deleteClient.from('reviews').delete().eq('id', id).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
