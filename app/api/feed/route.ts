import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { requireFeedAccess, feedAccessStatus } from '@/lib/feed-access'
import { restaurantsInZip, zip5 } from '@/lib/feed-zips'
import { isOpenNow, getTodayHoursLabel } from '@/lib/hours'
import { matchesAllFilters } from '@/lib/restaurant-filters'
import type { Restaurant } from '@/lib/restaurants'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10
const MAX_PAGE_SIZE = 20

// A member's personal feed: every ramen shop in the ZIPs they follow, served
// a page at a time so the client can scroll it endlessly.
//
// The order is deliberately stable rather than random. A feed that reshuffles
// on every page request would show duplicates across pages and silently skip
// others, which is worse than a fixed order. Rating-then-reviews-then-slug is
// total, so offset paging is consistent for the life of the dataset.
function feedOrder(a: Restaurant, b: Restaurant): number {
  return (
    (b.rating ?? 0) - (a.rating ?? 0) ||
    (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
    a.slug.localeCompare(b.slug)
  )
}

function toPost(r: Restaurant) {
  return {
    slug: r.slug,
    citySlug: r.citySlug,
    stateSlug: r.stateSlug,
    name: r.name,
    city: r.city,
    stateCode: r.stateCode,
    zip: zip5(r.postalCode),
    rating: r.rating,
    reviewCount: r.reviewCount,
    photo: r.photo,
    description: r.description,
    subtypes: r.subtypes,
    priceRange: r.priceRange,
    address: r.address,
    phone: r.phone,
    website: r.website,
    googleMapsLink: r.googleMapsLink,
    openNow: isOpenNow(r.hours),
    hoursLabel: r.hours ? getTodayHoursLabel(r.hours) : null,
  }
}

export async function GET(request: Request) {
  const access = await requireFeedAccess()
  if (!access.ok) {
    return NextResponse.json({ error: access.reason }, { status: feedAccessStatus(access.reason) })
  }

  const { searchParams } = new URL(request.url)
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0') || 0)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? String(PAGE_SIZE)) || PAGE_SIZE, MAX_PAGE_SIZE)
  const filters = (searchParams.get('filters') ?? '')
    .split(',').map((f) => f.trim()).filter(Boolean).slice(0, 30)

  const db = createAdminClient() ?? (await createClient())
  const { data: rows } = await db
    .from('feed_zips')
    .select('zip')
    .eq('user_id', access.userId)

  const zips = (rows ?? []).map((r) => r.zip as string)
  if (zips.length === 0) {
    return NextResponse.json({ posts: [], total: 0, nextOffset: null, zips: [] })
  }

  // De-duplicate: a restaurant can only appear once even if its ZIP is
  // followed twice through different labels.
  const seen = new Set<string>()
  const pool: Restaurant[] = []
  for (const z of zips) {
    for (const r of restaurantsInZip(z)) {
      if (seen.has(r.slug)) continue
      seen.add(r.slug)
      pool.push(r)
    }
  }

  const matching = filters.length > 0
    ? pool.filter((r) => matchesAllFilters(r, filters))
    : pool

  matching.sort(feedOrder)

  const page = matching.slice(offset, offset + limit)
  const nextOffset = offset + page.length < matching.length ? offset + page.length : null

  return NextResponse.json({
    posts: page.map(toPost),
    total: matching.length,
    nextOffset,
    zips,
  })
}
