import { getFeaturedSlugSet } from './paid-listings'

// Manual overlay only (lib/paid-listings.ts). Live Featured and Premium
// subscriptions are read in the browser from listing_placements(); a new
// subscriber does not wait on this file or a deploy. See docs/monetization.md.

export async function getAllFeaturedSlugs(): Promise<Set<string>> {
  return getFeaturedSlugSet()
}
