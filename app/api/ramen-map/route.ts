import { NextResponse } from 'next/server'
import { computeMapData } from '@/lib/ramen-discovery'

// Generated once at build time and served as a static, CDN-cacheable asset so
// the 25 MB restaurants dataset never ships in the client JS bundle.
export const dynamic = 'force-static'

export async function GET() {
  const data = await computeMapData()
  return NextResponse.json(data, {
    // Browser/CDN-cache briefly (it's a multi-MB payload fetched by every
    // map page — repeat navigations shouldn't re-download it every time),
    // but keep it short enough that claimed/featured status changes (which
    // admins expect to see reflected quickly) don't get stuck behind a
    // day-old cached response for up to a week via stale-while-revalidate.
    headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600' },
  })
}
