import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ramennearyou.com'

// GET /api/ramen-pass/portal — redirect to the Stripe Customer Portal.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${BASE_URL}/auth/login?redirectTo=/dashboard`)

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const admin = createAdminClient()
  if (!stripeKey || !admin) return NextResponse.redirect(`${BASE_URL}/dashboard`)

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!sub?.stripe_customer_id) return NextResponse.redirect(`${BASE_URL}/dashboard`)

  const stripe = new Stripe(stripeKey)
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${BASE_URL}/dashboard`,
  })

  return NextResponse.redirect(portal.url)
}
