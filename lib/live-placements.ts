// Live paid placement for a static export. The browser reads
// public.listing_placements() (supabase/listing-subscriptions.sql).
// lib/paid-listings.ts remains a manual overlay on top of that.
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabase/config'
import { getPaidTier, type PaidTier } from '@/lib/paid-listings'

export type LivePlacement = {
  slug: string
  name?: string | null
  city?: string | null
  state_code?: string | null
  path?: string | null
  claim?: boolean
  tier?: PaidTier | null
}

export type PlacementFeed = {
  live: LivePlacement[]
  /** Stripe claims whose subscription has lapsed. Baked-in badges for these slugs should come down. */
  lapsed: Set<string>
}

let pending: Promise<PlacementFeed> | null = null

export function loadPlacements(): Promise<PlacementFeed> {
  if (!pending) {
    pending = fetch(`${SUPABASE_URL}/rest/v1/rpc/listing_placements`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    })
      .then(async r => {
        if (!r.ok) throw new Error('placements')
        const data = await r.json()
        const live = Array.isArray(data?.live) ? (data.live as LivePlacement[]) : []
        const lapsed = new Set<string>(Array.isArray(data?.lapsed) ? data.lapsed.filter((s: unknown) => typeof s === 'string') : [])
        return { live, lapsed }
      })
      .catch(err => {
        pending = null
        throw err
      })
  }
  return pending
}

export function placementBySlug(feed: PlacementFeed): Map<string, LivePlacement> {
  return new Map(feed.live.map(row => [row.slug, row]))
}

/** Manual PAID_LISTINGS overlay and the live tier. Premium beats Featured. */
export function displayTier(slug: string, live: PaidTier | null | undefined): PaidTier | null {
  const manual = getPaidTier(slug)
  if (manual === 'premium' || live === 'premium') return 'premium'
  if (manual === 'featured' || live === 'featured') return 'featured'
  return null
}
