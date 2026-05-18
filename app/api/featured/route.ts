import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/featured — public list of active featured listings
export async function GET() {
  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ listings: [] })

  const { data } = await admin
    .from('featured_listings')
    .select('*')
    .eq('status', 'active')
    .order('featured_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(8)

  return NextResponse.json({ listings: data ?? [] })
}

// POST /api/featured — create a pending featured listing application
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { restaurant_name, city, state_code, address, phone, website, description, photos } = body

  if (!restaurant_name || !city || !state_code || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (photos && photos.length > 8) {
    return NextResponse.json({ error: 'Max 8 photos allowed' }, { status: 400 })
  }

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { data, error } = await admin
    .from('featured_listings')
    .insert({
      user_id: user.id,
      restaurant_name,
      city,
      state_code,
      address,
      phone: phone || null,
      website: website || null,
      description: description || null,
      photos: photos || [],
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ listing: data })
}
