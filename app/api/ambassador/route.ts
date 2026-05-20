import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, city, instagram, why_apply, experience } = body

  if (!name?.trim() || !email?.trim() || !city?.trim() || !why_apply?.trim() || !experience?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const sessionClient = await createClient()
  let userId: string | null = null
  if (sessionClient) {
    const { data: { user } } = await sessionClient.auth.getUser()
    userId = user?.id ?? null
  }

  const client = createAdminClient() ?? sessionClient
  if (client) {
    const { error } = await client.from('ambassador_applications').insert({
      user_id: userId,
      name: name.trim(),
      email: email.trim(),
      city: city.trim(),
      instagram: instagram?.trim() || null,
      why_apply: why_apply.trim(),
      experience: experience.trim(),
      status: 'pending',
    })
    if (error) {
      console.error('Ambassador insert error:', error.message)
      return NextResponse.json({ error: 'Failed to save your application. Please try again.' }, { status: 500 })
    }
  }

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `🍜 New Ambassador Application — ${name} (${city})`,
        html: `
          <h2>New Ambassador Application</h2>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td><strong>Name</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td><strong>City</strong></td><td>${city}</td></tr>
            <tr><td><strong>Instagram</strong></td><td>${instagram || '—'}</td></tr>
          </table>
          <h3>Why apply?</h3><p style="white-space:pre-wrap">${why_apply}</p>
          <h3>Experience</h3><p style="white-space:pre-wrap">${experience}</p>
          <hr />
          <p style="color:#888;font-size:12px">Review in Supabase → ambassador_applications.</p>
        `,
      })
    } catch (e) {
      console.error('Ambassador email error:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
