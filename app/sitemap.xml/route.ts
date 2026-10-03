import { SITEMAP_BASE_URL, buildSitemapIndexXml, xmlResponse } from '@/lib/sitemap-xml'

// Sitemap index — Google discovers this at the standard /sitemap.xml location
// (see public/robots.txt) and crawls each sitemap below. Split into exactly
// two: /find alone (~44.9k URLs) is too big to combine with anything else,
// so sitemap-1 is /find and sitemap-2 is everything else on the site
// (~16.5k) — both comfortably under Google's 50,000-URL single-sitemap cap.
export const dynamic = 'force-static'

export async function GET() {
  const xml = buildSitemapIndexXml([
    `${SITEMAP_BASE_URL}/sitemap-1.xml`,
    `${SITEMAP_BASE_URL}/sitemap-2.xml`,
  ])
  return xmlResponse(xml)
}
