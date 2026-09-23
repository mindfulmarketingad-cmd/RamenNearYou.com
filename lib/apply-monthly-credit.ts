import type Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import { previousBillingPeriod } from '@/lib/ramen-pass'
import { sendCreditAppliedEmail } from '@/lib/ramen-pass-emails'

// Posts earned contribution credit to a Stripe customer's balance as a negative
// amount, so Stripe applies it to the next invoice. Idempotent per period.
async function applyForSummaryRow(
  stripe: Stripe,
  row: { id: string; user_id: string; billing_period: string; total_earned: number },
) {
  const admin = createAdminClient()
  if (!admin) return

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', row.user_id)
    .maybeSingle()

  if (!sub?.stripe_customer_id) return

  const amount = Math.round(Number(row.total_earned) * 100)
  if (amount <= 0) return

  await stripe.customers.createBalanceTransaction(sub.stripe_customer_id, {
    amount: -amount, // negative = credit toward next invoice
    currency: 'usd',
    description: `Ramen Pass contribution credit (${row.billing_period})`,
  })

  await admin
    .from('monthly_credit_summary')
    .update({ applied_to_invoice: true, stripe_credit_applied: true })
    .eq('id', row.id)

  // Mark this period's approved rewards as applied.
  await admin
    .from('contribution_rewards')
    .update({ status: 'applied' })
    .eq('user_id', row.user_id)
    .eq('billing_period', row.billing_period)
    .eq('status', 'approved')

  sendCreditAppliedEmail(row.user_id, Number(row.total_earned)).catch(() => {})
}

// Apply a single user's prior-period credit (used from the invoice.paid webhook).
export async function applyMonthlyCreditForUser(stripe: Stripe, userId: string) {
  const admin = createAdminClient()
  if (!admin) return

  const period = previousBillingPeriod()
  const { data: row } = await admin
    .from('monthly_credit_summary')
    .select('id, user_id, billing_period, total_earned, applied_to_invoice')
    .eq('user_id', userId)
    .eq('billing_period', period)
    .eq('applied_to_invoice', false)
    .gt('total_earned', 0)
    .maybeSingle()

  if (row) await applyForSummaryRow(stripe, row)
}

// Apply all users' prior-period credit (used from the monthly cron).
export async function applyAllMonthlyCredits(stripe: Stripe): Promise<number> {
  const admin = createAdminClient()
  if (!admin) return 0

  const period = previousBillingPeriod()
  const { data: rows } = await admin
    .from('monthly_credit_summary')
    .select('id, user_id, billing_period, total_earned, applied_to_invoice')
    .eq('billing_period', period)
    .eq('applied_to_invoice', false)
    .gt('total_earned', 0)

  if (!rows?.length) return 0
  for (const row of rows) {
    await applyForSummaryRow(stripe, row)
  }
  return rows.length
}
