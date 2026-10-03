import { createAdminClient } from './supabase-admin'

// Hand-placed fallback for house/demo listings that predate full claims-flow
// testing — same pattern as featuredCityListings in featured-city.ts. New
// verified slugs should come through a real approved claims row instead of
// editing this list.
const verifiedFallbackSlugs = new Set<string>(['ikedo-ramen', 'momonoki'])

// Flat set of every restaurant slug with an approved claim — used to mark
// listings "Claimed" (e.g. on the /partners directory table) without a
// per-request Supabase round trip for the whole nationwide dataset.
//
// Cached in-process for a few minutes, same pattern as getAllFeaturedSlugs()
// in featured-city.ts — the /api/ramen-map route itself is separately
// force-static/ISR-cached, so this mainly bounds cold-start query volume.
const CACHE_TTL_MS = 5 * 60 * 1000
let _cache: { slugs: Set<string>; expiresAt: number } | null = null

export async function getAllVerifiedSlugs(): Promise<Set<string>> {
  if (_cache && _cache.expiresAt > Date.now()) return _cache.slugs

  const slugs = new Set<string>(verifiedFallbackSlugs)
  const admin = createAdminClient()
  if (admin) {
    const { data, error } = await admin
      .from('claims')
      .select('restaurant_slug')
      .eq('status', 'approved')
    if (!error && data) {
      for (const row of data) {
        if (row.restaurant_slug) slugs.add(row.restaurant_slug)
      }
    }
  }

  _cache = { slugs, expiresAt: Date.now() + CACHE_TTL_MS }
  return slugs
}
