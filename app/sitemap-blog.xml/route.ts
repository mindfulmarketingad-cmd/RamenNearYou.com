import { blogPosts } from '@/lib/blog-posts'
import { CITY_GUIDE_REDIRECTS } from '@/lib/city-guide-migration'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// The /blog hub plus every blog post (excludes posts that just permanent-redirect
// to a city guide page).
// Generated once at build time and served as a static asset.
export const dynamic = 'force-static'

export async function GET() {
  const blogPostPages: SitemapEntry[] = blogPosts
    .filter((post) => !CITY_GUIDE_REDIRECTS[post.slug])
    .map((post) => ({
      url: `${SITEMAP_BASE_URL}/blog/${post.slug}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

  const entries: SitemapEntry[] = [
    {
      url: `${SITEMAP_BASE_URL}/blog`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogPostPages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
