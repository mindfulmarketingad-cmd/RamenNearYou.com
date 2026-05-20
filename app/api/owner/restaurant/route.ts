import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

  // Verify approved claim by this user
  const { data: claim } = await client
    .from('claims')
    .select('id')
    .eq('restaurant_slug', slug)
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .maybeSingle()

  if (!claim) return NextResponse.json({ error: 'You do not own this listing' }, { status: 403 })

  // Get current values (override-first, then static) for diff tracking
  const { data: existing } = await client
    .from('restaurant_overrides')
    .select('description, phone, website, menu_link, hours')
    .eq('restaurant_slug', slug)
    .maybeSingle()

  const base = ALL.find(r => r.slug === slug)
  const previous = {
    description: existing?.description ?? base?.description ?? '',
    phone:       existing?.phone       ?? base?.phone       ?? '',
    website:     existing?.website     ?? base?.website     ?? '',
    menu_link:   existing?.menu_link   ?? base?.menuLink    ?? '',
    hours:       JSON.stringify(existing?.hours ?? base?.hours ?? {}),
  }
  const next = {
    description: description ?? '',
    phone:       phone ?? '',
    website:     website ?? '',
    menu_link:   menu_link ?? '',
    hours:       JSON.stringify(hours ?? {}),
  }

  // Upsert override
  const { error: upsertErr } = await client
    .from('restaurant_overrides')
    .upsert({
      restaurant_slug: slug,
      user_id: user.id,
      description: description || null,
      phone: phone || null,
      website: website || null,
      menu_link: menu_link || null,
      hours: hours && Object.keys(hours).length > 0 ? hours : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'restaurant_slug' })

  if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 })

  // Log changed fields
  const changedFields: { field: string; from: string; to: string }[] = []
  for (const f of ['description', 'phone', 'website', 'menu_link', 'hours'] as const) {
    if (previous[f] !== next[f]) {
      changedFields.push({ field: f, from: previous[f], to: next[f] })
      await client.from('restaurant_edits').insert({
        restaurant_slug: slug,
        user_id: user.id,
        field_name: f,
        old_value: previous[f].slice(0, 4000),
        new_value: next[f].slice(0, 4000),
      })
    }
  }

  // Revalidate the restaurant page
  if (base) {
    try { revalidatePath(`/${base.citySlug}/${base.stateSlug}/${slug}`) } catch {}
  }

  // Notify admin of changes
  if (changedFields.length > 0 && process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const diffHtml = changedFields.map(c => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:600">${c.field}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;color:#a00"><del>${escapeHtml(c.from).slice(0, 300)}</del></td>
          <td style="padding:8px;border-bottom:1px solid #eee;color:#0a0">${escapeHtml(c.to).slice(0, 300)}</td>
        </tr>
      `).join('')

      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: user.email || undefined,
        subject: `🍜 ${restaurant_name || slug} updated by owner`,
        html: `
          <h2>Listing updated</h2>
          <p><strong>Restaurant:</strong> ${restaurant_name || slug}</p>
          <p><strong>Owner:</strong> ${user.email}</p>
          <p><strong>Slug:</strong> ${slug}</p>
          <table style="border-collapse:collapse;width:100%;font-size:13px;margin-top:12px">
            <thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #333">Field</th><th align="left" style="padding:8px;border-bottom:2px solid #333">Before</th><th align="left" style="padding:8px;border-bottom:2px solid #333">After</th></tr></thead>
            <tbody>${diffHtml}</tbody>
          </table>
          <p style="margin-top:16px"><a href="https://www.ramennearyou.com/${base?.citySlug}/${base?.stateSlug}/${slug}">View listing →</a></p>
        `,
      })
    } catch (e) {
      console.error('Owner edit email error:', e)
    }
  }

  return NextResponse.json({ ok: true, changed: changedFields.length })
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
