import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { applyAllMonthlyCredits } from '@/lib/apply-monthly-credit'

export const runtime = 'nodejs'

// GET /api/cron/apply-monthly-credit
// Run on the 1st of each month (Vercel Cron). Applies the prior period's earned
// credit to every user's Stripe balance. Protected by CRON_SECRET.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const stripe = new Stripe(stripeKey)
  const processed = await applyAllMonthlyCredits(stripe)

  return NextResponse.json({ ok: true, processed })
}
