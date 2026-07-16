import { NextResponse } from 'next/server'
import { computeMapData } from '@/lib/ramen-discovery'

// Generated once at build time and served as a static, CDN-cacheable asset so
// the 25 MB restaurants dataset never ships in the client JS bundle.
export const dynamic = 'force-static'

export async function GET() {
  const data = await computeMapData()
  return NextResponse.json(data, {
    // Browser-cache for a day (it's a multi-MB payload fetched by every map
    // page — repeat navigations shouldn't re-download it), CDN for a day,
    // serve stale for a week while revalidating.
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
  })
}
