import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { upsertGhlContact } from '@/lib/gohighlevel'

// GHL tag added on every claim submission. Matches the pre-built
// "Claim Request Approved" system workflow's "Wait until contact has
// 'business' tag" gate, which hands off to the existing "Premium Upgrade
// Push" workflow — set this workflow's trigger to "Tag Added: business".
const GHL_CLAIMED_TAG = 'business'

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

  // Push the claimant to GoHighLevel tagged "business" — this is what
  // kicks off the Premium Upgrade Offer sequence on the GHL side. Best-effort:
  // never blocks or fails the claim itself if GHL is unreachable/misconfigured.
  try {
    const [firstName, ...rest] = contact_name.trim().split(/\s+/)
    let restaurantPhone: string | undefined
    try {
      restaurantPhone = message ? JSON.parse(message)?.corrections?.phone || undefined : undefined
    } catch { /* message isn't the corrections JSON shape — ignore */ }

    await upsertGhlContact({
      firstName,
      lastName: rest.join(' ') || undefined,
      email: contact_email.trim(),
      phone: restaurantPhone,
      companyName: restaurant_name ?? undefined,
      city: restaurant_city ?? undefined,
      tags: [GHL_CLAIMED_TAG],
    })
  } catch (err) {
    console.error('GHL claim push error:', err)
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
