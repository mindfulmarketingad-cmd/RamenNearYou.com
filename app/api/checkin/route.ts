import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { applyContributionReward, hasActiveRamenPass } from '@/lib/rewards'
import { getRestaurantBySlug } from '@/lib/restaurants'

// Haversine distance in meters.
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

const GEO_RADIUS_METERS = 500
const COOLDOWN_HOURS = 24

// POST /api/checkin  { restaurant_id (slug), method: 'qr' | 'geo', coords? }
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const slug: string | undefined = body.restaurant_id ?? body.restaurant_slug
  const method: 'qr' | 'geo' = body.method === 'geo' ? 'geo' : 'qr'
  const coords: { lat?: number; lng?: number } | undefined = body.coords

  if (!slug) return NextResponse.json({ error: 'Missing restaurant_id' }, { status: 400 })

  const restaurant = getRestaurantBySlug(slug)
  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  // Geolocation fallback: must be within 500m of the restaurant.
  if (method === 'geo') {
    if (
      typeof coords?.lat !== 'number' ||
      typeof coords?.lng !== 'number' ||
      restaurant.latitude == null ||
      restaurant.longitude == null
    ) {
      return NextResponse.json({ error: 'Location unavailable' }, { status: 400 })
    }
    const dist = distanceMeters(coords.lat, coords.lng, restaurant.latitude, restaurant.longitude)
    if (dist > GEO_RADIUS_METERS) {
      return NextResponse.json(
        { error: "You're too far from this restaurant to check in." },
        { status: 400 },
      )
    }
  }

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 })

  // 24-hour cooldown per user per restaurant.
  const cutoff = new Date(Date.now() - COOLDOWN_HOURS * 3600 * 1000).toISOString()
  const { data: recent } = await admin
    .from('ramen_pass_checkins')
    .select('id')
    .eq('user_id', user.id)
    .eq('restaurant_slug', slug)
    .gt('created_at', cutoff)
    .maybeSingle()

  if (recent) {
    return NextResponse.json(
      { error: 'You already checked in here in the last 24 hours.' },
      { status: 429 },
    )
  }

  await admin.from('ramen_pass_checkins').insert({
    user_id: user.id,
    restaurant_slug: slug,
    method,
  })

  // Credit is members-only.
  if (!(await hasActiveRamenPass(user.id))) {
    return NextResponse.json({ success: true, creditApplied: false, requiresPass: true })
  }

  const reward = await applyContributionReward(user.id, 0.5, 'checkin', slug)
  return NextResponse.json({
    success: true,
    creditApplied: reward.applied,
    capped: reward.capped ?? false,
    newTotal: reward.newTotal ?? null,
  })
}
