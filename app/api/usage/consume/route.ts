import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { currentBillingPeriod } from '@/lib/ramen-pass'
import { FREE_MONTHLY_LIMIT } from '@/lib/usage'

export const dynamic = 'force-dynamic'

// POST /api/usage/consume — atomically spend one free monthly use.
// The authenticated user id comes from the session cookie (can't be forged)
// and the count is incremented in Postgres, so it can't be reset client-side.
//   { allowed: true,  reason: 'subscribed' }              — unlimited
//   { allowed: true,  reason: 'ok', used, remaining }      — spent one use
//   { allowed: false, reason: 'subscribe' }                — out of free uses
//   401 { allowed: false, reason: 'signin' }               — not signed in
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  if (!user) {
    return NextResponse.json({ allowed: false, reason: 'signin' }, { status: 401 })
  }

  const admin = createAdminClient() ?? supabase

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()
  if (sub?.status === 'active' || sub?.status === 'trialing') {
    return NextResponse.json({ allowed: true, reason: 'subscribed' })
  }

  const { data, error } = await admin.rpc('consume_feature_usage', {
    p_user_id: user.id,
    p_period: currentBillingPeriod(),
    p_limit: FREE_MONTHLY_LIMIT,
  })

  // Fail open on infrastructure errors so a DB hiccup never blocks a legit user.
  if (error) return NextResponse.json({ allowed: true, reason: 'error' })

  const newCount = Number(data)
  if (newCount === -1) {
    return NextResponse.json({ allowed: false, reason: 'subscribe' })
  }

  return NextResponse.json({
    allowed: true,
    reason: 'ok',
    used: newCount,
    remaining: Math.max(0, FREE_MONTHLY_LIMIT - newCount),
  })
}
