// ── Paid restaurant listings (Featured / Premium) ────────────────────────────
//
// The single source of truth for which restaurants pay for placement. The
// site is a static export with no functions, so there is no Stripe webhook:
// after a payment clears, add (or remove) a row here and redeploy. The build
// reads this file everywhere a paid perk shows up:
//
//   Featured ($29/mo) — moved to the top of its city page with a "Featured"
//                       label, gold pin + crown on every map, Featured badge
//                       and an ad-free listing page.
//   Premium  ($79/mo) — everything in Featured, plus the top of its state page
//                       and a labelled "Featured partner" box on that city's
//                       blog ramen guide.
//
// The homepage billboard ($99/mo add-on) is separate: lib/homepage-billboard.ts.
// Step-by-step activation: docs/monetization.md.

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

export const PAID_TIER_PRICES = {
  featured: { price: '$29', period: 'month', checkoutUrl: 'https://buy.stripe.com/bJeeVegyKdFe3wi6dwfrW0s' },
  premium: { price: '$79', period: 'month', checkoutUrl: 'https://buy.stripe.com/8x2fZi3LY30Aff0bxQfrW0t' },
} as const

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
