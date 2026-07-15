import { getAllRecipes } from '@/lib/recipes'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// The /recipes hub plus every individual recipe page.
export async function GET() {
  const recipePages: SitemapEntry[] = getAllRecipes().map((r) => ({
    url: `${SITEMAP_BASE_URL}/recipes/${r.slug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const entries: SitemapEntry[] = [
    {
      url: `${SITEMAP_BASE_URL}/recipes`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...recipePages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
