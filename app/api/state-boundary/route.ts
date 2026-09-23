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

// Fetch a US state's administrative boundary polygon from OpenStreetMap/Nominatim.
// A coarser polygon_threshold than the city lookup keeps a whole-state outline
// (which can otherwise be a very large polygon, e.g. coastal states) a
// reasonable size while still tracing the real state line.
async function fetchFromNominatim(state: string): Promise<Boundary | null> {
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&polygon_threshold=0.01` +
    `&limit=1&countrycodes=us&addressdetails=0&featureType=state&state=${encodeURIComponent(state)}`

  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' } })
    if (!res.ok) return null
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
    // fall through
  }
  return null
}

// GET /api/state-boundary?state=North Carolina&key=north-carolina
// Returns { geojson, bbox } for the state outline, or { geojson: null } if none.
// Shares the city_boundaries cache table (key prefixed "state:") rather than a
// dedicated table, since the schema (key/geojson/bbox/display_name) is generic.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const state = (searchParams.get('state') || '').trim()
  if (!state) {
    return NextResponse.json({ error: 'state is required' }, { status: 400 })
  }
  const stateSlug = (searchParams.get('key') || state).toLowerCase()
  const key = `state:${stateSlug}`

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
  const result = await fetchFromNominatim(state)
  if (!result) {
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
