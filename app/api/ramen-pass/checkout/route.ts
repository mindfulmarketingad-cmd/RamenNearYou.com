import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ramennearyou.com'

// POST /api/ramen-pass/checkout — start a $9.99/month Ramen Pass subscription.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_RAMEN_PASS_PRICE_ID
  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: 'Ramen Pass billing not configured' }, { status: 500 })
  }

  // Prevent duplicate active subscriptions.
  const admin = createAdminClient()
  if (admin) {
    const { data: existing } = await admin
      .from('ramen_pass_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ error: 'You already have a Ramen Pass.' }, { status: 409 })
    }
  }

  // Capture an optional referral code from the request (set when joining via /join?ref=).
  let referralCode: string | null = null
  try {
    const body = await request.json()
    referralCode = typeof body?.referralCode === 'string' ? body.referralCode : null
  } catch {
    /* no body */
  }

  const stripe = new Stripe(stripeKey)

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/plus?success=1`,
      cancel_url: `${BASE_URL}/plus?cancelled=1`,
      customer_email: user.email,
      metadata: {
        product: 'ramen_pass',
        user_id: user.id,
        referral_code: referralCode ?? '',
      },
      subscription_data: {
        metadata: {
          product: 'ramen_pass',
          user_id: user.id,
          referral_code: referralCode ?? '',
        },
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    console.error('[ramen-pass/checkout]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
