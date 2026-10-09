import { NextResponse } from 'next/server'
import { computeMapData } from '@/lib/ramen-discovery'

// Written once at build time as a static file (/data/ramen-map.json) so the
// 25 MB restaurants dataset never ships in the client JS bundle. Cache
// headers for it live in vercel.json.
export const dynamic = 'force-static'

export async function GET() {
  const data = await computeMapData()
  return NextResponse.json(data)
}
