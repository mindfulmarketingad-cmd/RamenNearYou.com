// SERVER-ONLY. A single cheap, indexed count query (no rows pulled) — safe
// to call on every unclaimed listing page render since it's just a HEAD
// request against ramennearyou_dashboard's listing_slug index.
import { createAdminClient } from './supabase-admin'
import { ANALYTICS_TABLE } from './analytics'

export async function getListingMonthlyViews(slug: string): Promise<number | null> {
  const admin = createAdminClient()
  if (!admin) return null

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await admin
    .from(ANALYTICS_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('listing_slug', slug)
    .in('event_type', ['listing_view', 'pageview'])
    .gte('created_at', since)

  if (error) return null
  return count ?? 0
}
