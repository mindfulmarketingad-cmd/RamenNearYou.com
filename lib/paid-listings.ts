// ── Paid restaurant listings ─────────────────────────────────────────────────
//
// Claim ($49.99/mo), Featured ($29/mo) and Premium ($79/mo) activate from
// Stripe through Postgres (supabase/listing-subscriptions.sql). The browser
// reads current status from listing_placements(); nobody edits this file
// when a customer pays.
//
// PAID_LISTINGS is an optional manual overlay (a comp, or a subscription
// that predates the automatic table). It is unioned with the live rows.
// Cancelling a Stripe subscription drops the live perk without a deploy.
//
//   Claim    ($49.99/mo) — verified badge, owner dashboard, edits, analytics,
//                          ad-free listing page.
//   Featured ($29/mo)    — add-on: top of the city page labelled Featured,
//                          gold crown map pin, Featured badge.
//   Premium  ($79/mo)    — add-on: everything in Featured, plus the top of
//                          the state page and a Featured-partner box on that
//                          city's ramen guide.
//
// Stacked totals: $49.99 claim, $78.99 with Featured, $128.99 with Premium.
// The homepage billboard ($99/mo) is separate: lib/homepage-billboard.ts.

import { BILLBOARD_CHECKOUT_URL } from '@/lib/homepage-billboard'

export type PaidTier = 'featured' | 'premium'

export type PaidListing = {
  /** Restaurant slug, i.e. the last segment of /{city}/{state}/{slug}. */
  slug: string
  tier: PaidTier
  /** YYYY-MM-DD the subscription started — for your records only. */
  since: string
  /** Stripe subscription id (sub_…), so you can match it when it cancels. */
  stripeSubscription?: string
}

export const PAID_LISTINGS: PaidListing[] = [
  // { slug: 'example-ramen', tier: 'featured', since: '2026-11-02', stripeSubscription: 'sub_…' },
]

/** Claimed listing. Stripe price price_1UYsNILlgxXvIOfePjTxwMqP, product prod_Va2SyTAj3XBfep. No trial. */
export const CLAIM_PLAN = {
  price: '$49.99',
  period: 'month',
  checkoutUrl: 'https://buy.stripe.com/5kQaEY3LY7gQ3wi6dwfrW0A',
  priceId: 'price_1UYsNILlgxXvIOfePjTxwMqP',
  productId: 'prod_Va2SyTAj3XBfep',
  paymentLinkId: 'plink_1UYsNULlgxXvIOfeAIQZ8BV5',
} as const

export const PAID_TIER_PRICES = {
  featured: { price: '$29', period: 'month', checkoutUrl: 'https://buy.stripe.com/bJeeVegyKdFe3wi6dwfrW0s', withClaim: '$78.99' },
  premium: { price: '$79', period: 'month', checkoutUrl: 'https://buy.stripe.com/8x2fZi3LY30Aff0bxQfrW0t', withClaim: '$128.99' },
} as const

/** Payment Link for a signed-in owner. client_reference_id is the restaurant slug. */
export function listingCheckoutUrl(
  kind: 'claim' | 'featured' | 'premium' | 'billboard',
  slug: string,
  email?: string | null,
): string {
  const base = kind === 'claim' ? CLAIM_PLAN.checkoutUrl
    : kind === 'featured' ? PAID_TIER_PRICES.featured.checkoutUrl
    : kind === 'premium' ? PAID_TIER_PRICES.premium.checkoutUrl
    : BILLBOARD_CHECKOUT_URL
  const u = new URL(base)
  if (/^[a-z0-9-]{1,200}$/.test(slug)) u.searchParams.set('client_reference_id', slug)
  if (email) u.searchParams.set('prefilled_email', email)
  return u.toString()
}

/** One-time "Support RamenNearYou" tip (customer chooses the amount, $3 min). */
export const SUPPORT_TIP_URL = 'https://donate.stripe.com/bJe14ogyK7gQ8QCdFYfrW0u'

const BY_SLUG = new Map(PAID_LISTINGS.map(l => [l.slug, l.tier]))

export function getPaidTier(slug: string | null | undefined): PaidTier | null {
  return (slug && BY_SLUG.get(slug)) || null
}

/** Featured + Premium — both get the gold pin, badge, ad-free page and city-page top spot. */
export function getFeaturedSlugSet(): Set<string> {
  return new Set(PAID_LISTINGS.map(l => l.slug))
}

export function getPremiumSlugSet(): Set<string> {
  return new Set(PAID_LISTINGS.filter(l => l.tier === 'premium').map(l => l.slug))
}

/** Stable-moves the matching items to the front, keeping everyone else's order. */
export function pinToTop<T>(items: T[], isPinned: (item: T) => boolean): T[] {
  const pinned: T[] = []
  const rest: T[] = []
  for (const it of items) (isPinned(it) ? pinned : rest).push(it)
  return pinned.length ? [...pinned, ...rest] : items
}
