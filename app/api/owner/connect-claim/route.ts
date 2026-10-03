import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/owner/connect-claim
// If an approved claim exists for the given slug where contact_email matches
// the signed-in user's email, this links their account (sets user_id = auth.uid()).
// Requires the "Owner email self-link" RLS policy from supabase/admin-rls-policies.sql.
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  // Check that the approved claim's contact_email matches this user's email
  const { data: claim } = await supabase
    .from('claims')
    .select('id, contact_email, user_id')
    .eq('restaurant_slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (!claim) {
    return NextResponse.json({ error: 'No approved claim found for this restaurant.' }, { status: 404 })
  }

  if (claim.contact_email?.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json(
      { error: 'Your account email does not match the email on the approved claim. Contact support if you believe this is an error.' },
      { status: 403 }
    )
  }

  if (claim.user_id === user.id) {
    return NextResponse.json({ ok: true, already_linked: true })
  }

  // Update the claim's user_id to this user (RLS "Owner email self-link" policy allows this)
  const { error } = await supabase
    .from('claims')
    .update({ user_id: user.id })
    .eq('id', claim.id)
    .eq('contact_email', user.email)
    .eq('status', 'approved')

  if (error) {
    return NextResponse.json(
      { error: 'Could not link your account. Make sure you are signed in with the email that was used when the claim was submitted. (' + error.message + ')' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
