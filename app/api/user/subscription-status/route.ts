import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { MONTHLY_CREDIT_CAP, currentBillingPeriod } from '@/lib/ramen-pass'

// GET /api/user/subscription-status
// { isActive, status, periodEnd, creditsEarned, creditsCap, capReached }
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient() ?? supabase

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: summary } = await admin
    .from('monthly_credit_summary')
    .select('total_earned, cap_reached')
    .eq('user_id', user.id)
    .eq('billing_period', currentBillingPeriod())
    .maybeSingle()

  const status = sub?.status ?? 'none'
  const isActive = status === 'active' || status === 'trialing'

  return NextResponse.json({
    isActive,
    status,
    periodEnd: sub?.current_period_end ?? null,
    creditsEarned: Number(summary?.total_earned ?? 0),
    creditsCap: MONTHLY_CREDIT_CAP,
    capReached: Boolean(summary?.cap_reached),
  })
}
