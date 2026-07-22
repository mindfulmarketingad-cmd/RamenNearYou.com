import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    restaurant_slug,
    restaurant_name,
    restaurant_city,
    contact_name,
    contact_email,
    message,
  } = body

  if (!restaurant_slug || !contact_name?.trim() || !contact_email?.trim()) {
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
    const { error } = await client.from('claims').insert({
      user_id: userId,
      restaurant_slug,
      restaurant_name: restaurant_name ?? null,
      restaurant_city: restaurant_city ?? null,
      contact_name: contact_name.trim(),
      contact_email: contact_email.trim(),
      message: message ?? null,
      status: 'pending',
    })
    if (error) {
      console.error('Claim insert error:', error.message)
      const friendly =
        error.code === '23505'
          ? 'This listing has already been claimed.'
          : 'Failed to save your claim. Please try again.'
      return NextResponse.json({ error: friendly }, { status: 500 })
    }
  }

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: contact_email,
        subject: `🍜 New Listing Claim — ${restaurant_name ?? restaurant_slug}`,
        html: `
          <h2>New Restaurant Claim</h2>
          <p><strong>Restaurant:</strong> ${restaurant_name ?? restaurant_slug} (${restaurant_city ?? '—'})</p>
          <p><strong>Slug:</strong> ${restaurant_slug}</p>
          <p><strong>Submitted by:</strong> ${contact_name} &lt;<a href="mailto:${contact_email}">${contact_email}</a>&gt;</p>
          <hr />
          <p><strong>Details:</strong></p>
          <pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px">${message ?? ''}</pre>
          <p style="color:#888;font-size:12px">Review and approve in Supabase → claims table.</p>
        `,
      })
    } catch (e) {
      console.error('Claim email error:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
