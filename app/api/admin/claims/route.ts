import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'

async function getAdminUser() {
  const supabase = await createServerClient()
  if (!supabase) return { user: null, supabase: null }
  const { data } = await supabase.auth.getUser()
  return { user: data.user, supabase }
}

// POST /api/admin/claims — manually register a verified claim for a restaurant
export async function POST(request: Request) {
  const { user, supabase } = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { restaurant_slug } = body

  if (!restaurant_slug) {
    return NextResponse.json({ error: 'restaurant_slug required' }, { status: 400 })
  }

  const restaurant = ALL.find(r => r.slug === restaurant_slug)
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found in directory' }, { status: 404 })
  }

  // Prefer admin client (bypasses RLS), fall back to authenticated session client
  const client = createAdminClient() ?? supabase!

  // Check if a claim already exists for this slug
  const { data: existing } = await client
    .from('claims')
    .select('id, status, restaurant_name, contact_name, contact_email')
    .eq('restaurant_slug', restaurant_slug)
    .maybeSingle()

  if (existing) {
    // Patch any missing fields so the admin UI renders them properly
    const updates: Record<string, string> = {}
    if (!existing.restaurant_name) updates.restaurant_name = restaurant.name
    if (!existing.contact_name) updates.contact_name = 'Owner'
    if (!existing.contact_email) updates.contact_email = 'unknown@ramennearyou.com'

    if (Object.keys(updates).length > 0) {
      const { error } = await client
        .from('claims')
        .update(updates)
        .eq('id', existing.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, action: 'updated', id: existing.id })
    }
    return NextResponse.json({ ok: true, action: 'already_complete', id: existing.id })
  }

  // No existing claim — insert a manual approved claim
  const { data, error } = await client
    .from('claims')
    .insert({
      restaurant_slug,
      restaurant_name: restaurant.name,
      restaurant_city: restaurant.city ?? '',
      contact_name: 'Admin (Manual)',
      contact_email: adminEmail,
      message: JSON.stringify({ role: 'admin', note: 'Manually registered by admin' }),
      status: 'approved',
      admin_note: 'Manually registered via admin panel',
      user_id: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, action: 'inserted', id: data.id })
}
