import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { currentBillingPeriod } from '@/lib/ramen-pass'
import { FREE_MONTHLY_LIMIT } from '@/lib/usage'

export const dynamic = 'force-dynamic'

// GET /api/usage — authoritative gate state for the current visitor.
// { signedIn, subscribed, used, remaining, limit }
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  if (!user) {
    return NextResponse.json({
      signedIn: false, subscribed: false,
      used: 0, remaining: FREE_MONTHLY_LIMIT, limit: FREE_MONTHLY_LIMIT,
    })
  }

  const admin = createAdminClient() ?? supabase

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()
  const subscribed = sub?.status === 'active' || sub?.status === 'trialing'

  const { data: usage } = await admin
    .from('feature_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('billing_period', currentBillingPeriod())
    .maybeSingle()
  const used = Number(usage?.count ?? 0)

  return NextResponse.json({
    signedIn: true,
    subscribed,
    used,
    // Subscribers bypass the limit via the `subscribed` flag; this value is
    // only meaningful for non-subscribers.
    remaining: Math.max(0, FREE_MONTHLY_LIMIT - used),
    limit: FREE_MONTHLY_LIMIT,
  })
}
