import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

async function getAdminClient() {
  const supabase = await createServerClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || data.user?.email !== adminEmail) return null
  // Prefer service-role client; fall back to admin's session (needs RLS policies)
  return { client: createAdminClient() ?? supabase, user: data.user }
}

// PATCH: approve or reject a claim
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminClient()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const { status, admin_note } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data: claim, error } = await auth.client
    .from('claims')
    .update({ status, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('restaurant_slug, restaurant_name, restaurant_city, contact_name, contact_email')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

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
        ? `<h2>Your claim was approved!</h2>
           <p>Hi ${claim.contact_name || 'there'},</p>
           <p>Great news — your ownership claim for <strong>${claim.restaurant_name}</strong> has been verified.</p>
           <p>Sign in and manage your listing from your owner dashboard:</p>
           <p><a href="https://www.ramennearyou.com/owner" style="display:inline-block;padding:12px 20px;background:#0EA5E9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Open Owner Dashboard →</a></p>
           ${admin_note ? `<hr/><p><strong>Note from us:</strong> ${admin_note}</p>` : ''}
           <p style="color:#888;font-size:12px">A blue verified badge now appears on your listing.</p>`
        : `<h2>Claim update</h2>
           <p>Hi ${claim.contact_name || 'there'},</p>
           <p>We reviewed your claim for <strong>${claim.restaurant_name}</strong> and weren't able to verify it at this time.</p>
           ${admin_note ? `<p><strong>Reason:</strong> ${admin_note}</p>` : ''}
           <p>If you believe this was a mistake, please reply to this email.</p>`
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

// PUT: link a claim to a specific owner account by their user_id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminClient()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { owner_user_id } = await request.json()
  if (!owner_user_id) return NextResponse.json({ error: 'Missing owner_user_id' }, { status: 400 })

  const { error } = await auth.client
    .from('claims')
    .update({ user_id: owner_user_id })
    .eq('id', id)
    .eq('status', 'approved')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
