import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/owner/listing-edit-requests?slug=...&type=...
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const admin = createAdminClient()
  const client = admin ?? supabase

  let query = client
    .from('listing_edit_requests')
    .select('id, type, payload, status, created_at')
    .eq('restaurant_slug', slug)
    .eq('user_id', user.id)

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ edits: data ?? [] })
}
