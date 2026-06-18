import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import {
  MONTHLY_CREDIT_CAP,
  currentBillingPeriod,
  getRank,
  generateReferralCode,
} from '@/lib/ramen-pass'

// GET /api/ramen-pass/me — full dashboard payload for the signed-in user.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 })

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

  const { data: rewards } = await admin
    .from('contribution_rewards')
    .select('id, type, amount, status, billing_period, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  let { data: profile } = await admin
    .from('user_profiles')
    .select('display_name, total_contributions, ramen_rank, referral_code')
    .eq('user_id', user.id)
    .maybeSingle()

  // Lazily mint a referral code if the user doesn't have one yet.
  if (profile && !profile.referral_code) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateReferralCode()
      const { error } = await admin
        .from('user_profiles')
        .update({ referral_code: code })
        .eq('user_id', user.id)
      if (!error) {
        profile = { ...profile, referral_code: code }
        break
      }
    }
  }

  const contributions = profile?.total_contributions ?? 0
  const status = sub?.status ?? 'none'

  return NextResponse.json({
    subscription: {
      status,
      isActive: status === 'active' || status === 'trialing',
      periodEnd: sub?.current_period_end ?? null,
    },
    credits: {
      earned: Number(summary?.total_earned ?? 0),
      cap: MONTHLY_CREDIT_CAP,
      capReached: Boolean(summary?.cap_reached),
    },
    rank: {
      current: profile?.ramen_rank ?? getRank(contributions),
      contributions,
    },
    referralCode: profile?.referral_code ?? null,
    rewards: rewards ?? [],
  })
}
