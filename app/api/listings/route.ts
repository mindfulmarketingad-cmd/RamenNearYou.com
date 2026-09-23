import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'listings', 5, 600_000)
  if (limited) return limited
  const body = await request.json()
  const { name, address, city, state, zip, phone, website, description, brothTypes, hours, ownerName, ownerEmail } = body

  if (!name?.trim() || !address?.trim() || !city?.trim() || !state?.trim()) {
    return NextResponse.json({ error: 'Name, address, city, and state are required.' }, { status: 400 })
  }

  let dbOk = false
  let emailOk = false

  // 1) Best-effort DB insert. Prefer the admin client (bypasses RLS); fall back
  //    to the session client. A DB failure here is non-fatal — the email below
  //    still captures the lead so the submission is never silently lost.
  try {
    const adminClient = createAdminClient()
    const supabase = adminClient ?? await createClient()
    if (supabase) {
      let userId: string | null = null
      try {
        const sessionClient = adminClient ? await createClient() : supabase
        if (sessionClient) {
          const { data: { user } } = await (sessionClient as Awaited<ReturnType<typeof createClient>>).auth.getUser()
          userId = user?.id ?? null
        }
      } catch { /* anonymous submission — no user */ }

      const { error: dbError } = await supabase.from('listings').insert({
        user_id: userId,
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        description: description?.trim() || null,
        broth_types: brothTypes?.length ? brothTypes : null,
        hours: hours?.trim() || null,
        owner_name: ownerName?.trim() || null,
        owner_email: ownerEmail?.trim() || null,
        status: 'pending',
      })
      if (dbError) console.error('Listing insert error:', dbError.message)
      else dbOk = true
    }
  } catch (err) {
    console.error('Listing insert threw:', err)
  }

  // 2) Email notification — the reliable capture channel.
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: ownerEmail || undefined,
        subject: `🍜 New Restaurant Submission — ${name} (${city}, ${state})`,
        html: `
          <h2>New Restaurant Listing Submission</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Restaurant Name</strong></td><td>${name}</td></tr>
            <tr><td><strong>Address</strong></td><td>${address}, ${city}, ${state} ${zip || ''}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
            <tr><td><strong>Website</strong></td><td>${website ? `<a href="${website}">${website}</a>` : '—'}</td></tr>
            <tr><td><strong>Broth Types</strong></td><td>${brothTypes?.join(', ') || '—'}</td></tr>
            <tr><td><strong>Hours</strong></td><td>${hours || '—'}</td></tr>
            <tr><td><strong>Owner Name</strong></td><td>${ownerName || '—'}</td></tr>
            <tr><td><strong>Owner Email</strong></td><td>${ownerEmail || '—'}</td></tr>
          </table>
          ${description ? `<h3>Description</h3><p>${description}</p>` : ''}
          <hr />
          <p style="color:#888;font-size:12px">Saved to the <code>listings</code> table: ${dbOk ? 'yes' : 'NO (DB insert failed — see logs)'}.</p>
        `,
      })
      emailOk = true
    } catch (emailErr) {
      console.error('Listing notification email error:', emailErr)
    }
  }

  // Only fail if the lead was captured nowhere.
  if (!dbOk && !emailOk) {
    return NextResponse.json(
      { error: 'We could not save your submission right now. Please email us directly so we can add your restaurant.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
