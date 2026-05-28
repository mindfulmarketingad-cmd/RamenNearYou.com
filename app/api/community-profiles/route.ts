import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/community-profiles — fetch public profiles for the homepage carousel
export async function GET() {
  const client = createAdminClient()
  if (!client) return NextResponse.json({ profiles: [] })

  const { data } = await client
    .from('user_profiles')
    .select('display_name, avatar_url, bio, favorite_broth, ramen_count, instagram')
    .not('display_name', 'is', null)
    .neq('display_name', '')
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ profiles: data ?? [] })
}
