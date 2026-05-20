import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'

async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()
  if (!supabase) return false
  const { data } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !data.user?.email) return false
  return data.user.email === adminEmail
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, admin_note } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: claim, error } = await supabase
    .from('claims')
    .update({ status, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('restaurant_slug, restaurant_name, restaurant_city, contact_name, contact_email')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Revalidate the restaurant page so the verified badge appears immediately
  if (claim?.restaurant_slug) {
    try { revalidatePath(`/[city]/[state]/${claim.restaurant_slug}`, 'page') } catch {}
  }

  // Email the claimant with the decision
  if (process.env.RESEND_API_KEY && claim?.contact_email) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const approved = status === 'approved'
      const subject = approved
        ? `🎉 Your claim for ${claim.restaurant_name} was approved`
        : `Your claim for ${claim.restaurant_name} — update`

      const html = approved
        ? `
          <h2>Your claim was approved!</h2>
          <p>Hi ${claim.contact_name || 'there'},</p>
          <p>Great news — your ownership claim for <strong>${claim.restaurant_name}</strong> has been verified.</p>
          <p>You can now sign in and manage your listing's content (description, hours, phone, website, menu link) from your owner dashboard:</p>
          <p><a href="https://www.ramennearyou.com/owner" style="display:inline-block;padding:12px 20px;background:#0EA5E9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Open Owner Dashboard →</a></p>
          ${admin_note ? `<hr/><p><strong>Note from us:</strong> ${admin_note}</p>` : ''}
          <p style="color:#888;font-size:12px">A blue verified badge now appears on your restaurant's listing.</p>
        `
        : `
          <h2>Claim update</h2>
          <p>Hi ${claim.contact_name || 'there'},</p>
          <p>We've reviewed your ownership claim for <strong>${claim.restaurant_name}</strong>, and unfortunately we weren't able to verify it at this time.</p>
          ${admin_note ? `<p><strong>Reason:</strong> ${admin_note}</p>` : ''}
          <p>If you have additional documentation or believe this was a mistake, please reply to this email.</p>
        `

      await resend.emails.send({
        from: 'Ramen Near You <notifications@ramennearyou.com>',
        to: claim.contact_email,
        replyTo: process.env.ADMIN_EMAIL || undefined,
        subject,
        html,
      })
    } catch (e) {
      console.error('Claim decision email error:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
