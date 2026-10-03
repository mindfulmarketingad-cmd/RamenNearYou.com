import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { slug, restaurant_name, review_id, review_body, response } = await request.json()
  if (!slug || !review_id || !response?.trim()) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const admin = createAdminClient()
  const client = admin ?? supabase

  const { data: claim } = await client
    .from('claims').select('id')
    .eq('restaurant_slug', slug).eq('user_id', user.id).eq('status', 'approved')
    .maybeSingle()
  if (!claim) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  // Check for existing pending or approved response
  const { data: existing } = await client
    .from('listing_edit_requests')
    .select('id, status')
    .eq('restaurant_slug', slug)
    .eq('type', 'review_response')
    .eq('payload->>review_id', review_id)
    .maybeSingle()
  if (existing) return NextResponse.json({ error: 'A response for this review is already pending or approved' }, { status: 409 })

  const { error } = await client.from('listing_edit_requests').insert({
    restaurant_slug: slug,
    user_id: user.id,
    type: 'review_response',
    payload: { review_id, review_body: review_body || '', response: response.trim(), restaurant_name: restaurant_name || slug },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `💬 ${restaurant_name || slug} — review response pending approval`,
        html: `<h2>Owner review response pending</h2>
          <p><strong>Restaurant:</strong> ${restaurant_name || slug}</p>
          <p><strong>Review:</strong> ${review_body || '(no body)'}</p>
          <p><strong>Owner response:</strong> ${response.trim()}</p>
          <p><a href="https://www.ramennearyou.com/admin/listing-edits">Review at Admin → Listing Edits</a></p>`,
      })
    } catch (e) { console.error(e) }
  }

  return NextResponse.json({ ok: true })
}
