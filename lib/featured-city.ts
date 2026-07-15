import { createAdminClient } from './supabase-admin'

// Maps "citySlug:stateSlug" to an ordered list of featured restaurant slugs.
// Featured restaurants appear first on the city find page with a gold pin and badge.
// This hand-placed list is a fallback for house/demo listings that predate the
// paid Stripe flow below — new featured placements should come through
// /featured/apply instead of editing this file.
const featuredCityListings: Record<string, string[]> = {
  'port-washington:new-york': ['ikedo-ramen'],
}

export function getFeaturedSlugsForCity(citySlug: string, stateSlug: string): string[] {
  return featuredCityListings[`${citySlug}:${stateSlug}`] ?? []
}

// Flat set of every featured restaurant slug — merges the hardcoded fallback
// above with every `featured_listings` row an owner has an *active* paid
// Stripe subscription for. This is what makes /featured/apply self-serve: a
// successful checkout (handled by the Stripe webhook) is enough to put a gold
// pin on the map — no code change or redeploy required.
//
// Cached in-process for a few minutes so per-request routes (e.g. AI search)
// don't hit the DB on every call; the ramen-map API route is separately
// force-static/ISR-cached, so this mainly bounds cold-start query volume.
const CACHE_TTL_MS = 5 * 60 * 1000
let _cache: { slugs: Set<string>; expiresAt: number } | null = null

export async function getAllFeaturedSlugs(): Promise<Set<string>> {
  if (_cache && _cache.expiresAt > Date.now()) return _cache.slugs

  const slugs = new Set(Object.values(featuredCityListings).flat())

  const admin = createAdminClient()
  if (admin) {
    const { data, error } = await admin
      .from('featured_listings')
      .select('restaurant_slug')
      .eq('status', 'active')
    if (!error && data) {
      for (const row of data) {
        if (row.restaurant_slug) slugs.add(row.restaurant_slug)
      }
    }
  }

  _cache = { slugs, expiresAt: Date.now() + CACHE_TTL_MS }
  return slugs
}
