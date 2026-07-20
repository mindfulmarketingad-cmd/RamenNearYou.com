import { NextResponse } from 'next/server'
import { createLeadsClient } from '@/lib/leads-supabase'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    source,
    restaurantName,
    city,
    stateCode,
    partySize,
    reservationDate,
    reservationTime,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    pageUrl,
  } = body

  if (!restaurantName?.trim() || !customerName?.trim()) {
    return NextResponse.json({ error: 'Restaurant and your name are required.' }, { status: 400 })
  }
  if (!customerEmail?.trim() && !customerPhone?.trim()) {
    return NextResponse.json({ error: 'Please provide an email or phone number so the restaurant can reach you.' }, { status: 400 })
  }

  // The site's real name lives in `message` (no dedicated restaurant column
  // on this shared, multi-directory table), with the originating surface and
  // any customer notes appended.
  const messageParts = [`Restaurant: ${restaurantName.trim()}${stateCode ? ` (${city ?? ''}, ${stateCode})` : ''}`]
  if (source) messageParts.push(`via /${source}`)
  if (notes?.trim()) messageParts.push(notes.trim())

  let dbOk = false
  try {
    const leads = createLeadsClient()
    const { error } = await leads.from('leads').insert({
      name: customerName.trim(),
      email: customerEmail?.trim() || null,
      phone: customerPhone?.trim() || null,
      city: city?.trim() || null,
      event_type: 'Restaurant Reservation',
      event_date: reservationDate?.trim() || null,
      guest_count: partySize ? String(partySize) : null,
      best_time_to_call: reservationTime?.trim() || null,
      message: messageParts.join(' — '),
      source: 'ramennearyou.com',
      page_url: pageUrl?.trim() || null,
    })
    if (error) console.error('Lead insert error:', error.message)
    else dbOk = true
  } catch (err) {
    console.error('Lead insert threw:', err)
  }

  // Email notification — best-effort, same reliable-capture pattern used for
  // /api/listings. Only fails the request if the lead was saved nowhere.
  let emailOk = false
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: customerEmail?.trim() || undefined,
        subject: `🍜 New Booking Inquiry — ${restaurantName} (${city ?? ''}${stateCode ? `, ${stateCode}` : ''})`,
        html: `
          <h2>New Booking Inquiry</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Restaurant</strong></td><td>${restaurantName}</td></tr>
            <tr><td><strong>Party size</strong></td><td>${partySize || '—'}</td></tr>
            <tr><td><strong>Date</strong></td><td>${reservationDate || '—'}</td></tr>
            <tr><td><strong>Time</strong></td><td>${reservationTime || '—'}</td></tr>
            <tr><td><strong>Name</strong></td><td>${customerName}</td></tr>
            <tr><td><strong>Email</strong></td><td>${customerEmail || '—'}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${customerPhone || '—'}</td></tr>
          </table>
          ${notes ? `<h3>Notes</h3><p>${notes}</p>` : ''}
          <hr />
          <p style="color:#888;font-size:12px">Saved to the leads table: ${dbOk ? 'yes' : 'NO (DB insert failed — see logs)'}.</p>
        `,
      })
      emailOk = true
    } catch (emailErr) {
      console.error('Inquiry notification email error:', emailErr)
    }
  }

  if (!dbOk && !emailOk) {
    return NextResponse.json(
      { error: 'We could not send your inquiry right now. Please try again in a moment.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
