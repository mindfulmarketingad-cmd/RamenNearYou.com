import { getStates } from '@/lib/restaurants'

const BASE_URL = 'https://www.ramennearyou.com'
const LAST_CONTENT = '2026-05-24'

export const dynamic = 'force-static'
export const revalidate = 86400

export function GET() {
  const states = getStates()

  const urls = states
    .map(
      (s) => `  <url>
    <loc>${BASE_URL}/${s.stateSlug}</loc>
    <lastmod>${LAST_CONTENT}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
