import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/is-admin'

export const dynamic = 'force-dynamic'

// GET /api/usage — auth + subscription state for the current visitor.
// { signedIn, subscribed }
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  if (!user) {
    return NextResponse.json({ signedIn: false, subscribed: false })
  }

  // Check Ramen Pass subscription status
  let subscribed = false
  const admin = createAdminClient()
  if (admin) {
    const { data: sub } = await admin
      .from('ramen_pass_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()
    subscribed = sub?.status === 'active' || sub?.status === 'trialing'
  }

  const isAdmin = isAdminEmail(user.email)

  return NextResponse.json({ signedIn: true, subscribed, isAdmin })
}
