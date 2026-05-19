import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
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

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .upsert(upsertData, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ profile })
}
