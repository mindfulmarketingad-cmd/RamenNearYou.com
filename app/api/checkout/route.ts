import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ramennearyou.com'
const PRODUCT_ID = 'prod_UXwa3Bh0tBx1h7'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const { listing_id } = await request.json()
  if (!listing_id) return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 })

  const stripe = new Stripe(stripeKey)

  // Use explicit price ID if set, otherwise look up the active price from the product
  let priceId = process.env.STRIPE_FEATURED_PRICE_ID
  if (!priceId) {
    const prices = await stripe.prices.list({ product: PRODUCT_ID, active: true, limit: 1 })
    if (!prices.data.length) {
      return NextResponse.json({ error: 'No active price found for featured listing product' }, { status: 500 })
    }
    priceId = prices.data[0].id
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${BASE_URL}/featured/success?listing_id=${listing_id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/featured/apply?cancelled=1`,
    customer_email: user.email,
    metadata: {
      listing_id,
      user_id: user.id,
    },
    subscription_data: {
      metadata: {
        listing_id,
        user_id: user.id,
      },
    },
  })

  return NextResponse.json({ url: session.url })
}
