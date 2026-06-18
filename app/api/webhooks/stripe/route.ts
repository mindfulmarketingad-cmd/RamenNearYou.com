import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import { applyContributionReward } from '@/lib/rewards'
import { applyMonthlyCreditForUser } from '@/lib/apply-monthly-credit'
import { sendWelcomeEmail, sendPaymentFailedEmail } from '@/lib/ramen-pass-emails'

export const runtime = 'nodejs'

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>

function periodISO(sub: Stripe.Subscription, key: 'current_period_start' | 'current_period_end') {
  const v = (sub as unknown as Record<string, number | undefined>)[key]
  return typeof v === 'number' ? new Date(v * 1000).toISOString() : null
}

// Record a referral (if a valid code was passed at checkout) so the reward can
// fire on the referred user's first paid invoice.
async function recordReferral(admin: AdminClient, code: string, referredUserId: string) {
  if (!code) return
  const { data: referrer } = await admin
    .from('user_profiles')
    .select('user_id')
    .eq('referral_code', code)
    .maybeSingle()
  if (!referrer || referrer.user_id === referredUserId) return

  const { data: existing } = await admin
    .from('referrals')
    .select('id')
    .eq('referred_user_id', referredUserId)
    .maybeSingle()
  if (existing) return

  await admin.from('referrals').insert({
    referrer_user_id: referrer.user_id,
    referred_user_id: referredUserId,
    referral_code: code,
    reward_issued: false,
  })
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey)
  const body = await request.text()
  const sig = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // ─── Checkout completed (featured listings + claim subscriptions) ──────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listing_id = session.metadata?.listing_id
    const restaurantSlug = session.client_reference_id
    const product = session.metadata?.product

    if (product === 'ramen_pass') {
      // Ramen Pass is handled via customer.subscription.created below.
    } else if (listing_id) {
      await admin
        .from('featured_listings')
        .update({
          status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listing_id)
    } else if (restaurantSlug) {
      await admin
        .from('claim_subscriptions')
        .upsert(
          {
            restaurant_slug: restaurantSlug,
            customer_email: session.customer_email ?? '',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
          },
          { onConflict: 'restaurant_slug,customer_email' },
        )
    }
  }

  // ─── Ramen Pass subscription created ───────────────────────────────────────
  if (event.type === 'customer.subscription.created') {
    const sub = event.data.object as Stripe.Subscription
    if (sub.metadata?.product === 'ramen_pass') {
      const userId = sub.metadata.user_id
      if (userId) {
        await admin.from('ramen_pass_subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: sub.customer as string,
            stripe_subscription_id: sub.id,
            status: sub.status,
            current_period_start: periodISO(sub, 'current_period_start'),
            current_period_end: periodISO(sub, 'current_period_end'),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )
        await recordReferral(admin, sub.metadata.referral_code ?? '', userId)
        sendWelcomeEmail(userId).catch(() => {})
      }
    }
  }

  // ─── Subscription updated ──────────────────────────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    if (sub.metadata?.product === 'ramen_pass') {
      await admin
        .from('ramen_pass_subscriptions')
        .update({
          status: sub.status,
          current_period_start: periodISO(sub, 'current_period_start'),
          current_period_end: periodISO(sub, 'current_period_end'),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)
    }
  }

  // ─── Subscription deleted / paused ─────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription

    if (sub.metadata?.product === 'ramen_pass') {
      await admin
        .from('ramen_pass_subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id)
    } else if (sub.metadata?.listing_id) {
      await admin
        .from('featured_listings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', sub.metadata.listing_id)
    } else {
      await admin
        .from('claim_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id)
    }
  }

  // ─── Invoice paid ──────────────────────────────────────────────────────────
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = (invoice as unknown as { subscription?: string }).subscription
    if (subId) {
      const { data: sub } = await admin
        .from('ramen_pass_subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subId)
        .maybeSingle()

      if (sub?.user_id) {
        // On each renewal, apply the prior period's earned credit.
        if (invoice.billing_reason === 'subscription_cycle') {
          await applyMonthlyCreditForUser(stripe, sub.user_id)
        }

        // On the first successful charge, fire the referrer's reward (once).
        if (invoice.billing_reason === 'subscription_create') {
          const { data: referral } = await admin
            .from('referrals')
            .select('id, referrer_user_id, reward_issued')
            .eq('referred_user_id', sub.user_id)
            .eq('reward_issued', false)
            .maybeSingle()

          if (referral?.referrer_user_id) {
            await applyContributionReward(referral.referrer_user_id, 2.0, 'referral', sub.user_id)
            await admin.from('referrals').update({ reward_issued: true }).eq('id', referral.id)
          }
        }
      }
    }
  }

  // ─── Payment failed ────────────────────────────────────────────────────────
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = (invoice as unknown as { subscription?: string }).subscription
    if (subId) {
      const { data: sub } = await admin
        .from('ramen_pass_subscriptions')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subId)
        .select('user_id')
        .maybeSingle()
      if (sub?.user_id) sendPaymentFailedEmail(sub.user_id).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}
