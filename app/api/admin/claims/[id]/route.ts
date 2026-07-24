import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { upsertGhlContact } from '@/lib/gohighlevel'
import { getRestaurantBySlug } from '@/lib/restaurants'
import { getReviewSlug } from '@/lib/reviews'

// Tag added when a claim is approved. Matches the pre-built "Claim Request
// Approved" system workflow's "Wait until contact has 'business' tag" gate,
// which hands off to the existing "Premium Upgrade Push" sequence.
const GHL_BUSINESS_TAG = 'business'

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
    .select('restaurant_slug, restaurant_name, restaurant_city, contact_name, contact_email, message')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Revalidate the actual cached path — the previous version used the
  // literal `[city]/[state]` template with only the slug substituted, which
  // never matched any real rendered path and silently did nothing, so a
  // newly-approved claim's Verified badge/ad removal could stay stale for
  // up to the page's full revalidate window (1 hour for the listing page,
  // 24 hours for its reviews page).
  if (claim?.restaurant_slug) {
    const restaurant = getRestaurantBySlug(claim.restaurant_slug)
    if (restaurant) {
      try { revalidatePath(`/${restaurant.citySlug}/${restaurant.stateSlug}/${restaurant.slug}`, 'page') } catch {}
      try { revalidatePath(`/reviews/${getReviewSlug(restaurant)}`, 'page') } catch {}
    }
  }

  // On approval, push the claimant to GoHighLevel tagged "business" — this is
  // what kicks off the Premium Upgrade Offer sequence on the GHL side.
  // Best-effort: never blocks or fails the approval itself if GHL is
  // unreachable/misconfigured.
  if (status === 'approved' && claim?.contact_name && claim?.contact_email) {
    try {
      const [firstName, ...rest] = claim.contact_name.trim().split(/\s+/)
      let restaurantPhone: string | undefined
      try {
        restaurantPhone = claim.message ? JSON.parse(claim.message)?.corrections?.phone || undefined : undefined
      } catch { /* message isn't the corrections JSON shape — ignore */ }

      await upsertGhlContact({
        firstName,
        lastName: rest.join(' ') || undefined,
        email: claim.contact_email.trim(),
        phone: restaurantPhone,
        companyName: claim.restaurant_name ?? undefined,
        city: claim.restaurant_city ?? undefined,
        tags: [GHL_BUSINESS_TAG],
      })
    } catch (err) {
      console.error('GHL claim approval push error:', err)
    }
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
