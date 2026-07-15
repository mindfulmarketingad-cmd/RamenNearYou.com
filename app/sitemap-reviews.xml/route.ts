import { getReviewRestaurants, getReviewSlug } from '@/lib/reviews'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// The /reviews hub plus one page per restaurant (~7,900 URLs).
export async function GET() {
  const reviewPages: SitemapEntry[] = getReviewRestaurants().map((r) => ({
    url: `${SITEMAP_BASE_URL}/reviews/${getReviewSlug(r)}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const entries: SitemapEntry[] = [
    {
      url: `${SITEMAP_BASE_URL}/reviews`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...reviewPages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
