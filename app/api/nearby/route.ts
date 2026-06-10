import { NextRequest, NextResponse } from 'next/server'
import { restaurants, getBrothTypes } from '@/lib/restaurants'

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function matchesBroth(r: (typeof restaurants)[number], broth: string): boolean {
  const b = broth.toLowerCase()
  if (b === 'vegetarian') return !!r.amenities.vegetarianOptions
  if (b === 'korean') return r.subtypes?.toLowerCase().includes('korean') ?? false
  if (b === 'japanese') return r.subtypes?.toLowerCase().includes('japanese') ?? false
  const types = getBrothTypes(r).map(t => t.toLowerCase())
  return types.includes(b)
}

function matchesDining(r: (typeof restaurants)[number], dining: string): boolean {
  if (!dining) return true
  if (dining === 'dinein') return !!r.amenities.dineIn
  if (dining === 'takeout') return !!r.amenities.takeout
  if (dining === 'delivery') return !!r.amenities.delivery
  return true
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '8'), 20)
  const broth = searchParams.get('broth') ?? ''
  const dining = searchParams.get('dining') ?? ''
  const radius = Math.min(parseFloat(searchParams.get('radius') ?? '50') || 50, 50)

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const nearby = restaurants
    .filter((r) => r.latitude != null && r.longitude != null && r.businessStatus === 'OPERATIONAL')
    .filter((r) => !broth || matchesBroth(r, broth))
    .filter((r) => matchesDining(r, dining))
    .map((r) => ({
      slug: r.slug,
      citySlug: r.citySlug,
      stateSlug: r.stateSlug,
      name: r.name,
      city: r.city,
      stateCode: r.stateCode,
      rating: r.rating,
      reviewCount: r.reviewCount,
      photo: r.photo,
      description: r.description,
      subtypes: r.subtypes,
      priceRange: r.priceRange,
      dineIn: !!r.amenities.dineIn,
      takeout: !!r.amenities.takeout,
      delivery: !!r.amenities.delivery,
      distanceMiles: haversine(lat, lng, r.latitude!, r.longitude!),
    }))
    .filter((r) => r.distanceMiles <= radius)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit)

  return NextResponse.json({ results: nearby })
}
