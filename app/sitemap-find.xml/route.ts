import { FIND_PAGES } from '@/components/find-cross-links'
import { getFindCityParams } from '@/lib/find-city'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// Every /find page: the filter/broth/brand/"near me" pages, the per-city
// searchmap pages, and the modifier × city cross product — by far the
// largest single category (~38k of the site's ~56k URLs).
export async function GET() {
  const findFilterPages: SitemapEntry[] = FIND_PAGES.map((p) => ({
    url: `${SITEMAP_BASE_URL}${p.href}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const findCityParamList = getFindCityParams()
  const findCityPages: SitemapEntry[] = findCityParamList.map((p) => ({
    url: `${SITEMAP_BASE_URL}/find/${p.cityState}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const modifierFindPages: SitemapEntry[] = FIND_MODIFIERS.flatMap((m) =>
    findCityParamList.map((p) => ({
      url: `${SITEMAP_BASE_URL}/find/${m.prefix}-${p.cityState}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  const entries: SitemapEntry[] = [
    {
      url: `${SITEMAP_BASE_URL}/find`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...findFilterPages,
    ...findCityPages,
    ...modifierFindPages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
