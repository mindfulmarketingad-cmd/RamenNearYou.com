import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, eventType, guestCount, eventDate, location, budget, notes } = body

    if (!name || !email || !eventType || !guestCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store in Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      await supabase.from('catering_leads').insert({
        name,
        email,
        phone: phone || null,
        event_type: eventType,
        guest_count: guestCount,
        event_date: eventDate || null,
        location: location || null,
        budget: budget || null,
        notes: notes || null,
        status: 'new',
      })
    }

    // Send email notification if Resend is configured
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'RamenNearYou <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `🍜 New Catering Lead — ${name} (${guestCount} guests)`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9;">
            <div style="background: #77567A; padding: 20px 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Catering Request</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">RamenNearYou.com</p>
            </div>
            <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none;">

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; width: 140px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><a href="mailto:${email}" style="color: #77567A;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><a href="tel:${phone}" style="color: #77567A;">${phone}</a></td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Event Type</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${eventType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Guest Count</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${guestCount}</td>
                </tr>
                ${eventDate ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Event Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${eventDate}</td>
                </tr>` : ''}
                ${location ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Location</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${location}</td>
                </tr>` : ''}
                ${budget ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Budget</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${budget}</td>
                </tr>` : ''}
                ${notes ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; vertical-align: top;">Notes</td>
                  <td style="padding: 10px 0; font-size: 14px;">${notes}</td>
                </tr>` : ''}
              </table>

              <div style="margin-top: 24px; padding: 16px; background: #f5f0f6; border-radius: 6px; border-left: 3px solid #77567A;">
                <p style="margin: 0; font-size: 13px; color: #555;">Reply directly to <a href="mailto:${email}" style="color: #77567A;">${email}</a> to follow up with this lead.</p>
              </div>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Catering lead error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
