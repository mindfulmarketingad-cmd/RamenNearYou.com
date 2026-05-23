import { NextRequest, NextResponse } from 'next/server'
import { restaurants } from '@/lib/restaurants'

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '8'), 20)

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const nearby = restaurants
    .filter((r) => r.latitude != null && r.longitude != null && r.businessStatus === 'OPERATIONAL')
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
      priceRange: r.priceRange,
      distanceMiles: haversine(lat, lng, r.latitude!, r.longitude!),
    }))
    .filter((r) => r.distanceMiles <= 50)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit)

  return NextResponse.json({ results: nearby })
}
