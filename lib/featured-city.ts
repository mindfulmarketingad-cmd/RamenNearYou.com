import { getFeaturedSlugSet } from './paid-listings'

// Featured restaurants (Featured and Premium tiers) get a gold pin and crown
// on the maps and the top spot on their city page. The list lives in
// lib/paid-listings.ts and is read at build time — the site is a static
// export with no Stripe webhook, so a new subscriber goes live on the next
// deploy after you add their row (see docs/monetization.md).

export async function getAllFeaturedSlugs(): Promise<Set<string>> {
  return getFeaturedSlugSet()
}
