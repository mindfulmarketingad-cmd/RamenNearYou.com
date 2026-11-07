// ── Paid restaurant listings ─────────────────────────────────────────────────
//
// One product: a claimed listing at $49.99/month. Paying includes Featured
// placement, labelled Featured / Sponsored:
//   • a larger gold crown pin on the homepage map (and every other map)
//   • the top of the restaurant's city page
//   • the top of the restaurant's state page
// Postgres turns that on after checkout (supabase/listing-subscriptions.sql).
// The homepage billboard in lib/homepage-billboard.ts is a separate slot and
// is not part of this offer.
//
// PAID_LISTINGS is a manual overlay for demos and comps. It is not a Stripe
// subscription. Live customers are not added here.

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
  // Demo only — not a paying customer. Gold crown pin on the homepage map,
  // and Featured at the top of the Marietta city page and the Georgia state page.
  { slug: 'shibuya-ramen-atlanta', tier: 'featured', since: '2026-11-06' },
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

/** Payment Link for a signed-in owner. client_reference_id is the restaurant slug. */
export function listingCheckoutUrl(slug: string, email?: string | null): string {
  const u = new URL(CLAIM_PLAN.checkoutUrl)
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

/** Claimed / demo listings that are pinned and labelled Featured. */
export function getFeaturedSlugSet(): Set<string> {
  return new Set(PAID_LISTINGS.map(l => l.slug))
}

/** Legacy helper. The $49.99 claim uses Featured, not a separate Premium tier. */
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
