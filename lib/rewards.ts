import { createAdminClient } from '@/lib/supabase-admin'
import {
  MONTHLY_CREDIT_CAP,
  REWARD_AMOUNTS,
  ADMIN_APPROVED_TYPES,
  currentBillingPeriod,
  getRank,
  type ContributionType,
} from '@/lib/ramen-pass'
import {
  sendFirstCreditEmail,
  sendCapReachedEmail,
  sendRankUpEmail,
} from '@/lib/ramen-pass-emails'

export interface RewardResult {
  applied: boolean
  capped?: boolean
  amount?: number
  newTotal?: number
  error?: string
}

// Recalculate a user's contribution count + rank, firing a rank-up email on change.
async function bumpContributionsAndRank(userId: string) {
  const admin = createAdminClient()
  if (!admin) return

  const { data: profile } = await admin
    .from('user_profiles')
    .select('total_contributions, ramen_rank, display_name')
    .eq('user_id', userId)
    .maybeSingle()

  const prevCount = profile?.total_contributions ?? 0
  const prevRank = profile?.ramen_rank ?? 'Noobie'
  const newCount = prevCount + 1
  const newRank = getRank(newCount)

  await admin
    .from('user_profiles')
    .update({ total_contributions: newCount, ramen_rank: newRank })
    .eq('user_id', userId)

  if (newRank !== prevRank) {
    sendRankUpEmail(userId, newRank).catch(() => {})
  }
}

/**
 * The single entry point all reward triggers must call.
 * Enforces the $5.00/month hard cap, applying partial credit near the cap.
 * Never insert into contribution_rewards directly — always go through here.
 */
export async function applyContributionReward(
  userId: string,
  amount: number,
  type: ContributionType,
  referenceId?: string | null,
): Promise<RewardResult> {
  const admin = createAdminClient()
  if (!admin) return { applied: false, error: 'DB unavailable' }

  const billingPeriod = currentBillingPeriod()

  // Get or create this period's summary row.
  let { data: summary } = await admin
    .from('monthly_credit_summary')
    .select('total_earned')
    .eq('user_id', userId)
    .eq('billing_period', billingPeriod)
    .maybeSingle()

  if (!summary) {
    await admin
      .from('monthly_credit_summary')
      .insert({ user_id: userId, billing_period: billingPeriod, total_earned: 0 })
    summary = { total_earned: 0 }
  }

  const earned = Number(summary.total_earned) || 0
  if (earned >= MONTHLY_CREDIT_CAP) {
    return { applied: false, capped: true }
  }

  const remainingCap = MONTHLY_CREDIT_CAP - earned
  const actualAmount = Math.min(amount, remainingCap)

  // Was this the user's very first credit ever? (for the welcome-credit email)
  const { count: priorCredits } = await admin
    .from('contribution_rewards')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['approved', 'applied'])

  const { error: insertErr } = await admin.from('contribution_rewards').insert({
    user_id: userId,
    type,
    amount: actualAmount,
    status: 'approved',
    reference_id: referenceId ?? null,
    billing_period: billingPeriod,
    approved_at: new Date().toISOString(),
  })
  if (insertErr) return { applied: false, error: insertErr.message }

  const newTotal = Math.round((earned + actualAmount) * 100) / 100
  const capReached = newTotal >= MONTHLY_CREDIT_CAP

  await admin
    .from('monthly_credit_summary')
    .update({ total_earned: newTotal, cap_reached: capReached })
    .eq('user_id', userId)
    .eq('billing_period', billingPeriod)

  await bumpContributionsAndRank(userId)

  // Fire-and-forget emails.
  if ((priorCredits ?? 0) === 0) sendFirstCreditEmail(userId, actualAmount).catch(() => {})
  if (capReached && earned < MONTHLY_CREDIT_CAP) sendCapReachedEmail(userId).catch(() => {})

  return { applied: true, amount: actualAmount, newTotal }
}

/**
 * For admin-approved contribution types (add_restaurant, update_info): record a
 * pending reward that issues no credit until an admin approves it.
 */
export async function createPendingContribution(
  userId: string,
  type: ContributionType,
  referenceId?: string | null,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const admin = createAdminClient()
  if (!admin) return { ok: false, error: 'DB unavailable' }

  const { data, error } = await admin
    .from('contribution_rewards')
    .insert({
      user_id: userId,
      type,
      amount: REWARD_AMOUNTS[type],
      status: 'pending',
      reference_id: referenceId ?? null,
      billing_period: currentBillingPeriod(),
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

/**
 * Approve a pending contribution: applies cap-limited credit and flips the row
 * to approved (or applied via cap logic). Rejecting never issues credit.
 */
export async function approvePendingContribution(rewardId: string): Promise<RewardResult> {
  const admin = createAdminClient()
  if (!admin) return { applied: false, error: 'DB unavailable' }

  const { data: reward } = await admin
    .from('contribution_rewards')
    .select('id, user_id, type, status, reference_id')
    .eq('id', rewardId)
    .maybeSingle()

  if (!reward) return { applied: false, error: 'Not found' }
  if (reward.status !== 'pending') return { applied: false, error: 'Not pending' }

  // Remove the placeholder pending row, then re-issue through the capped utility
  // so the $5 cap and rank/summary bookkeeping stay correct and centralized.
  await admin.from('contribution_rewards').delete().eq('id', rewardId)

  const type = reward.type as ContributionType
  const result = await applyContributionReward(
    reward.user_id,
    REWARD_AMOUNTS[type],
    type,
    reward.reference_id,
  )
  return result
}

export async function rejectPendingContribution(rewardId: string): Promise<{ ok: boolean }> {
  const admin = createAdminClient()
  if (!admin) return { ok: false }
  await admin
    .from('contribution_rewards')
    .update({ status: 'rejected' })
    .eq('id', rewardId)
    .eq('status', 'pending')
  return { ok: true }
}

export { ADMIN_APPROVED_TYPES }
