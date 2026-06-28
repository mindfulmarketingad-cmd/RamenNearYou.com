import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { restaurants as ALL } from '@/lib/restaurants'

async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()
  if (!supabase) return false
  const { data } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !data.user?.email) return false
  return data.user.email === adminEmail
}

// POST /api/admin/claims — manually register a verified claim for a restaurant
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
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

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Check if a claim already exists for this slug
  const { data: existing } = await supabase
    .from('claims')
    .select('id, status, restaurant_name, contact_name, contact_email')
    .eq('restaurant_slug', restaurant_slug)
    .maybeSingle()

  if (existing) {
    // Update missing fields on the existing record so it shows properly in admin UI
    const updates: Record<string, string> = {}
    if (!existing.restaurant_name) updates.restaurant_name = restaurant.name
    if (!existing.contact_name) updates.contact_name = 'Owner'
    if (!existing.contact_email) updates.contact_email = 'unknown@ramennearyou.com'

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('claims')
        .update(updates)
        .eq('id', existing.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, action: 'updated', id: existing.id })
    }
    return NextResponse.json({ ok: true, action: 'already_complete', id: existing.id })
  }

  // No existing claim — insert a manual approved claim
  const supabaseAdmin = await createServerClient()
  const { data: adminUser } = await supabaseAdmin!.auth.getUser()

  const { data, error } = await supabase
    .from('claims')
    .insert({
      restaurant_slug,
      restaurant_name: restaurant.name,
      restaurant_city: restaurant.city ?? '',
      contact_name: 'Admin (Manual)',
      contact_email: process.env.ADMIN_EMAIL ?? 'admin@ramennearyou.com',
      message: JSON.stringify({ role: 'admin', note: 'Manually registered by admin' }),
      status: 'approved',
      admin_note: 'Manually registered via admin panel',
      user_id: adminUser?.user?.id ?? '00000000-0000-0000-0000-000000000000',
      reviewed_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, action: 'inserted', id: data.id })
}
