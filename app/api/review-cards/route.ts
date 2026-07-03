import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { getRestaurantBySlug } from '@/lib/restaurants'

// Records a Google Review Card order before the buyer is sent to Stripe.
// Fulfillment is human-in-the-loop: confirm payment in Stripe, then mark
// fulfilled in /admin/review-cards and send the buyer their print link.
export async function POST(request: Request) {
  const body = await request.json()
  const { restaurantSlug, buyerName, buyerEmail } = body as {
    restaurantSlug?: string; buyerName?: string; buyerEmail?: string
  }

  if (!restaurantSlug?.trim() || !buyerEmail?.trim()) {
    return NextResponse.json({ error: 'Restaurant and email are required.' }, { status: 400 })
  }
  const r = getRestaurantBySlug(restaurantSlug.trim())
  if (!r) {
    return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 })
  }

  let dbOk = false
  let emailOk = false

  // 1) Best-effort DB insert (admin client bypasses RLS; anon insert policy is
  //    the fallback). A DB failure is non-fatal — the email still captures it.
  try {
    const db = createAdminClient() ?? await createClient()
    if (db) {
      const { error } = await db.from('review_card_orders').insert({
        restaurant_slug: r.slug,
        restaurant_name: r.name,
        city: r.city,
        state_code: r.stateCode,
        buyer_name: buyerName?.trim() || null,
        buyer_email: buyerEmail.trim(),
        status: 'pending',
      })
      if (error) console.error('Review card order insert error:', error.message)
      else dbOk = true
    }
  } catch (err) {
    console.error('Review card order insert threw:', err)
  }

  // 2) Email notification — the reliable capture channel.
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: buyerEmail,
        subject: `⭐ Review Card order — ${r.name} (${r.city}, ${r.stateCode})`,
        html: `
          <h2>New Google Review Card Order</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Restaurant</strong></td><td>${r.name} — ${r.city}, ${r.stateCode}</td></tr>
            <tr><td><strong>Buyer</strong></td><td>${buyerName || '—'} (${buyerEmail})</td></tr>
            <tr><td><strong>Print page</strong></td><td><a href="https://www.ramennearyou.com/review-cards/print/${r.slug}">/review-cards/print/${r.slug}</a></td></tr>
            <tr><td><strong>Admin queue</strong></td><td><a href="https://www.ramennearyou.com/admin/review-cards">/admin/review-cards</a></td></tr>
          </table>
          <p><strong>Next steps:</strong> confirm the payment in Stripe, then mark the order
          fulfilled and email the buyer their print link.</p>
          <hr />
          <p style="color:#888;font-size:12px">Saved to <code>review_card_orders</code>: ${dbOk ? 'yes' : 'NO (DB insert failed — see logs)'}.</p>
        `,
      })
      emailOk = true
    } catch (emailErr) {
      console.error('Review card order email error:', emailErr)
    }
  }

  if (!dbOk && !emailOk) {
    return NextResponse.json(
      { error: 'We could not record your order right now. Please email hello@ramennearyou.com and we will set you up directly.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
