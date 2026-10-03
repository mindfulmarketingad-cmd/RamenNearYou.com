import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'

export async function PUT(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const { slug, restaurant_name, description, phone, website, menu_link, hours } = body
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const admin = createAdminClient()
  const client = admin ?? supabase

  const { data: claim } = await client
    .from('claims')
    .select('id')
    .eq('restaurant_slug', slug)
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .maybeSingle()

  if (!claim) return NextResponse.json({ error: 'You do not own this listing' }, { status: 403 })

  const { data: existing } = await client
    .from('restaurant_overrides')
    .select('description, phone, website, menu_link, hours')
    .eq('restaurant_slug', slug)
    .maybeSingle()

  const base = ALL.find(r => r.slug === slug)
  const previous: Record<string, string> = {
    description: existing?.description ?? base?.description ?? '',
    phone: existing?.phone ?? base?.phone ?? '',
    website: existing?.website ?? base?.website ?? '',
    menu_link: existing?.menu_link ?? base?.menuLink ?? '',
    hours: JSON.stringify(existing?.hours ?? base?.hours ?? {}),
  }
  const next: Record<string, string> = {
    description: description ?? '',
    phone: phone ?? '',
    website: website ?? '',
    menu_link: menu_link ?? '',
    hours: JSON.stringify(hours ?? {}),
  }

  const pendingEdits: { field: string; old_value: string; new_value: string }[] = []
  for (const f of ['description', 'phone', 'website', 'menu_link', 'hours'] as const) {
    if (previous[f] !== next[f]) {
      pendingEdits.push({ field: f, old_value: previous[f], new_value: next[f] })
    }
  }

  if (pendingEdits.length === 0) return NextResponse.json({ ok: true, pending: 0 })

  const { error: insertErr } = await client
    .from('listing_edit_requests')
    .insert(
      pendingEdits.map(e => ({
        restaurant_slug: slug,
        user_id: user.id,
        type: 'info',
        payload: { ...e, restaurant_name: restaurant_name || slug },
      }))
    )

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  // Notify admin
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const diffHtml = pendingEdits.map(e => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:600">${e.field}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;color:#a00"><del>${escapeHtml(e.old_value).slice(0, 300)}</del></td>
          <td style="padding:8px;border-bottom:1px solid #eee;color:#0a0">${escapeHtml(e.new_value).slice(0, 300)}</td>
        </tr>
      `).join('')
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `🍜 ${restaurant_name || slug} — listing edits pending approval`,
        html: `<h2>Listing edits pending approval</h2>
          <p><strong>Restaurant:</strong> ${restaurant_name || slug}</p>
          <p><strong>Owner:</strong> ${user.email}</p>
          <p>These changes are <strong>pending your approval</strong> at <a href="https://www.ramennearyou.com/admin/listing-edits">Admin → Listing Edits</a>.</p>
          <table style="border-collapse:collapse;width:100%;font-size:13px;margin-top:12px">
            <thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #333">Field</th><th align="left" style="padding:8px;border-bottom:2px solid #333">Current</th><th align="left" style="padding:8px;border-bottom:2px solid #333">Requested</th></tr></thead>
            <tbody>${diffHtml}</tbody>
          </table>`,
      })
    } catch (e) { console.error('Admin email error:', e) }
  }

  return NextResponse.json({ ok: true, pending: pendingEdits.length })
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
