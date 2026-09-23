import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

// Captures an email + requested city before the buyer is sent to Stripe.
// Fulfillment is human-in-the-loop: confirm the payment in Stripe, then build
// that city's guide and email it over.
//
// The row is written before checkout on purpose — someone who bails at the
// Stripe page is still a captured lead, separated from buyers by `status`.
export async function POST(request: Request) {
  // Rate limited: sends an admin email per submission.
  const limited = checkRateLimit(request, 'city-guide', 5, 600000)
  if (limited) return limited

  const body = await request.json()
  const { email, citySlug, cityLabel, sourcePath } = body as {
    email?: string; citySlug?: string; cityLabel?: string; sourcePath?: string
  }

  const cleanEmail = email?.trim() ?? ''
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  let dbOk = false
  let emailOk = false

  try {
    const db = createAdminClient() ?? await createClient()
    if (db) {
      const { error } = await db.from('city_guide_orders').insert({
        email: cleanEmail,
        city_slug: citySlug?.trim() || null,
        city_label: cityLabel?.trim() || null,
        source_path: sourcePath?.trim() || null,
        status: 'pending',
      })
      if (error) console.error('City guide order insert error:', error.message)
      else dbOk = true
    }
  } catch (err) {
    console.error('City guide order insert threw:', err)
  }

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: cleanEmail,
        subject: `📘 City guide request — ${cityLabel || 'no city specified'}`,
        html: `
          <h2>New City Guide Request</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Email</strong></td><td>${cleanEmail}</td></tr>
            <tr><td><strong>City</strong></td><td>${cityLabel || '—'}</td></tr>
            <tr><td><strong>From page</strong></td><td>${sourcePath || '—'}</td></tr>
          </table>
          <p><strong>Next steps:</strong> check Stripe for the payment. If it came through,
          build this city's guide and email it to the buyer.</p>
          <hr />
          <p style="color:#888;font-size:12px">Saved to <code>city_guide_orders</code>: ${dbOk ? 'yes' : 'NO (DB insert failed — see logs)'}.</p>
        `,
      })
      emailOk = true
    } catch (emailErr) {
      console.error('City guide order email error:', emailErr)
    }
  }

  if (!dbOk && !emailOk) {
    return NextResponse.json(
      { error: 'We could not save your request right now. Please email hello@ramennearyou.com and we will send your guide directly.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
