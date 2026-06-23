import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

// Identify ourselves per the Nominatim usage policy.
const USER_AGENT = 'RamenNearYou/1.0 (+https://www.ramennearyou.com)'

type Boundary = {
  geojson: unknown
  bbox: [number, number, number, number] | null
  displayName: string | null
}

// Fetch a city's administrative boundary polygon from OpenStreetMap/Nominatim.
// Tries a structured city/state query first, then a free-text fallback.
async function fetchFromNominatim(city: string, state: string): Promise<Boundary | null> {
  const base = 'https://nominatim.openstreetmap.org/search'
  const common =
    'format=jsonv2&polygon_geojson=1&polygon_threshold=0.002&limit=1&countrycodes=us&addressdetails=0'
  const urls = [
    `${base}?${common}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`,
    `${base}?${common}&q=${encodeURIComponent(`${city}, ${state}, USA`)}`,
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      })
      if (!res.ok) continue
      const arr = await res.json()
      const hit = Array.isArray(arr) ? arr[0] : null
      const g = hit?.geojson
      if (g && (g.type === 'Polygon' || g.type === 'MultiPolygon')) {
        // Nominatim boundingbox is [south, north, west, east] (strings).
        const bb = hit.boundingbox
        const bbox: [number, number, number, number] | null =
          Array.isArray(bb) && bb.length === 4
            ? [parseFloat(bb[0]), parseFloat(bb[2]), parseFloat(bb[1]), parseFloat(bb[3])]
            : null
        return { geojson: g, bbox, displayName: hit.display_name ?? null }
      }
    } catch {
      // try the next URL
    }
  }
  return null
}

// GET /api/city-boundary?city=Kennesaw&state=Georgia&key=kennesaw:georgia
// Returns { geojson, bbox } for the city outline, or { geojson: null } if none.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = (searchParams.get('city') || '').trim()
  const state = (searchParams.get('state') || '').trim()
  if (!city || !state) {
    return NextResponse.json({ error: 'city and state are required' }, { status: 400 })
  }
  const key = (searchParams.get('key') || `${city}:${state}`).toLowerCase()

  const admin = createAdminClient()

  // 1. Cache hit → return immediately.
  if (admin) {
    const { data } = await admin
      .from('city_boundaries')
      .select('geojson, bbox')
      .eq('key', key)
      .maybeSingle()
    if (data?.geojson) {
      return NextResponse.json(
        { geojson: data.geojson, bbox: data.bbox ?? null, cached: true },
        { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } },
      )
    }
  }

  // 2. Cache miss → fetch live from Nominatim.
  const result = await fetchFromNominatim(city, state)
  if (!result) {
    // No boundary found — short cache so a later OSM update can fill it in.
    return NextResponse.json({ geojson: null }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  // 3. Best-effort cache write (never block the response on it).
  if (admin) {
    await admin
      .from('city_boundaries')
      .upsert({
        key,
        geojson: result.geojson,
        bbox: result.bbox,
        display_name: result.displayName,
      })
      .then(
        () => {},
        () => {},
      )
  }

  return NextResponse.json(
    { geojson: result.geojson, bbox: result.bbox, cached: false },
    { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } },
  )
}
