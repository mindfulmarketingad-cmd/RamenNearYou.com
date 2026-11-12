import { createAdminClient } from './supabase-admin'
import { getFeaturedSlugSet } from './paid-listings'

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

  // Paying Featured/Premium restaurants are verified owners by definition, so
  // they get the badge and the ad-free page too.
  const slugs = new Set<string>([...verifiedFallbackSlugs, ...getFeaturedSlugSet()])
  const admin = createAdminClient()
  if (admin) {
    const { data, error } = await admin
      .from('claims')
      .select('restaurant_slug, source')
      .eq('status', 'approved')
    if (!error && data) {
      const stripeSlugs = data.filter(row => row.source === 'stripe').map(row => row.restaurant_slug)
      let livePaid = new Set<string>(stripeSlugs)
      if (stripeSlugs.length) {
        const { data: subs, error: subErr } = await admin
          .from('listing_subscriptions')
          .select('restaurant_slug, status, current_period_end')
          .eq('product', 'claim')
          .in('restaurant_slug', stripeSlugs)
        if (!subErr && subs) {
          const now = Date.now() - 2 * 864e5
          livePaid = new Set(subs.filter(s =>
            (s.status === 'active' || s.status === 'past_due')
            && (!s.current_period_end || new Date(s.current_period_end).getTime() > now)
          ).map(s => s.restaurant_slug))
        }
      }
      for (const row of data) {
        if (!row.restaurant_slug) continue
        if (row.source === 'stripe' && !livePaid.has(row.restaurant_slug)) continue
        slugs.add(row.restaurant_slug)
      }
    } else {
      const fallback = await admin.from('claims').select('restaurant_slug').eq('status', 'approved')
      for (const row of fallback.data ?? []) {
        if (row.restaurant_slug) slugs.add(row.restaurant_slug)
      }
    }
  }

  _cache = { slugs, expiresAt: Date.now() + CACHE_TTL_MS }
  return slugs
}
