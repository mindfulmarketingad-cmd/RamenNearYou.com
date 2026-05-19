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

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: user.email ?? undefined,
        subject: `⭐ New Featured Listing Application — ${restaurant_name} (${city}, ${state_code})`,
        html: `
          <h2>New Featured Listing Application</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Restaurant</strong></td><td>${restaurant_name}</td></tr>
            <tr><td><strong>Location</strong></td><td>${address}, ${city}, ${state_code}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
            <tr><td><strong>Website</strong></td><td>${website ? `<a href="${website}">${website}</a>` : '—'}</td></tr>
            <tr><td><strong>Submitted by</strong></td><td>${user.email}</td></tr>
            <tr><td><strong>Photos</strong></td><td>${photos?.length ?? 0}</td></tr>
          </table>
          ${description ? `<h3>Description</h3><p style="white-space:pre-wrap">${description}</p>` : ''}
          <hr />
          <p style="color:#888;font-size:12px">Review in Supabase → featured_listings.</p>
        `,
      })
    } catch (e) {
      console.error('Featured email error:', e)
    }
  }

  return NextResponse.json({ listing: data })
}
