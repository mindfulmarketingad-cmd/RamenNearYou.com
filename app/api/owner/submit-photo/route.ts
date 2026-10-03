import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { slug, restaurant_name, urls } = await request.json()
  if (!slug || !urls?.length) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const admin = createAdminClient()
  const client = admin ?? supabase

  const { data: claim } = await client
    .from('claims').select('id')
    .eq('restaurant_slug', slug).eq('user_id', user.id).eq('status', 'approved')
    .maybeSingle()
  if (!claim) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const { error } = await client.from('listing_edit_requests').insert(
    (urls as string[]).map((url: string) => ({
      restaurant_slug: slug,
      user_id: user.id,
      type: 'photo',
      payload: { url, caption: '', restaurant_name: restaurant_name || slug },
    }))
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `📷 ${restaurant_name || slug} — ${urls.length} photo(s) pending approval`,
        html: `<h2>Owner photos pending approval</h2>
          <p><strong>Restaurant:</strong> ${restaurant_name || slug}</p>
          <p><strong>Owner:</strong> ${user.email}</p>
          <p>${urls.length} photo(s) submitted. <a href="https://www.ramennearyou.com/admin/listing-edits">Review at Admin → Listing Edits</a></p>
          ${(urls as string[]).map((u: string) => `<img src="${u}" style="max-width:200px;margin:4px;border-radius:8px" />`).join('')}`,
      })
    } catch (e) { console.error(e) }
  }

  return NextResponse.json({ ok: true, pending: urls.length })
}
