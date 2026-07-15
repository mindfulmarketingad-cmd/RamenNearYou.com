import { SITEMAP_BASE_URL, buildSitemapIndexXml, xmlResponse } from '@/lib/sitemap-xml'

// Sitemap index — Google discovers this at the standard /sitemap.xml location
// (see public/robots.txt) and crawls each category sitemap below. Split by
// category once the combined site passed the 50,000-URL single-sitemap cap.
export const dynamic = 'force-static'

export async function GET() {
  const xml = buildSitemapIndexXml([
    `${SITEMAP_BASE_URL}/sitemap-main.xml`,
    `${SITEMAP_BASE_URL}/sitemap-find.xml`,
    `${SITEMAP_BASE_URL}/sitemap-reviews.xml`,
    `${SITEMAP_BASE_URL}/sitemap-recipes.xml`,
    `${SITEMAP_BASE_URL}/sitemap-blog.xml`,
  ])
  return xmlResponse(xml)
}
