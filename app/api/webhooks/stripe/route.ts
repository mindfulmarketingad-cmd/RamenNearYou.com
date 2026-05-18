import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listing_id = session.metadata?.listing_id
    if (!listing_id) return NextResponse.json({ ok: true })

    await admin
      .from('featured_listings')
      .update({
        status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listing_id)
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription
    const listing_id = sub.metadata?.listing_id
    if (!listing_id) return NextResponse.json({ ok: true })

    await admin
      .from('featured_listings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', listing_id)
  }

  return NextResponse.json({ ok: true })
}
