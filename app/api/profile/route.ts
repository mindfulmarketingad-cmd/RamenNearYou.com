import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { applyContributionReward, hasActiveRamenPass } from '@/lib/rewards'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = createAdminClient() ?? supabase

  const { data: profile } = await client
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ profile: profile ?? null })
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { display_name, bio, avatar_url, instagram, tiktok, twitter, favorite_broth, ramen_count } = body

  const upsertData: Record<string, unknown> = { user_id: user.id }

  if (display_name !== undefined) upsertData.display_name = display_name
  if (bio !== undefined) upsertData.bio = bio
  if (avatar_url !== undefined) upsertData.avatar_url = avatar_url
  if (instagram !== undefined) upsertData.instagram = instagram
  if (tiktok !== undefined) upsertData.tiktok = tiktok
  if (twitter !== undefined) upsertData.twitter = twitter
  if (favorite_broth !== undefined) upsertData.favorite_broth = favorite_broth
  if (ramen_count !== undefined) upsertData.ramen_count = ramen_count

  const client = createAdminClient() ?? supabase

  const { data: profile, error } = await client
    .from('user_profiles')
    .upsert(upsertData, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    console.error('Profile upsert error:', error.message)
    return NextResponse.json({ error: 'Failed to save profile.' }, { status: 500 })
  }

  // Profile-complete reward (one-time, members only).
  // Required: display_name, avatar_url, bio (min 20 chars). This codebase's
  // user_profiles has no `city` column, so avatar_url + bio stand in.
  let reward = null
  const isComplete =
    !!profile?.display_name?.trim() &&
    !!profile?.avatar_url?.trim() &&
    (profile?.bio?.trim().length ?? 0) >= 20

  if (isComplete && !profile?.profile_reward_claimed && (await hasActiveRamenPass(user.id))) {
    // Claim the flag atomically first so it can't double-fire on concurrent saves.
    const { data: claimed } = await client
      .from('user_profiles')
      .update({ profile_reward_claimed: true })
      .eq('user_id', user.id)
      .eq('profile_reward_claimed', false)
      .select('user_id')
      .maybeSingle()

    if (claimed) {
      reward = await applyContributionReward(user.id, 1.0, 'profile_complete', user.id)
    }
  }

  return NextResponse.json({ profile, reward })
}
