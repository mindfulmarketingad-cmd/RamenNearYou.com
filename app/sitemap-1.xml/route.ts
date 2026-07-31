import { FIND_PAGES } from '@/components/find-cross-links'
import { getFindCityParams } from '@/lib/find-city'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import { getNeighborhoodParams } from '@/lib/neighborhoods'
import { getPhoCityParams } from '@/lib/pho'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// Every /find page: the filter/broth/brand/"near me" pages, the per-city
// searchmap pages, and the modifier × city cross product — ~44.9k URLs on
// its own, big enough that it needs its own sitemap (see /sitemap-2.xml for
// everything else on the site).
//
// Generated once at build time and served as a static asset. Computing this
// on every request took ~19s locally, which is enough to time out both
// Vercel's serverless function and Google Search Console's own fetcher —
// exactly what caused GSC's "Sitemap could not be read" error.
export const dynamic = 'force-static'

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

  // Curated neighborhood pages (/find/ramen-restaurants-{hood}-{state})
  const neighborhoodPages: SitemapEntry[] = getNeighborhoodParams().map((param) => ({
    url: `${SITEMAP_BASE_URL}/find/${param}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Pho city pages (/find/pho-restaurants-{city}-{state})
  const phoCityPages: SitemapEntry[] = getPhoCityParams().map((param) => ({
    url: `${SITEMAP_BASE_URL}/find/${param}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const entries: SitemapEntry[] = [
    {
      url: `${SITEMAP_BASE_URL}/find`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...findFilterPages,
    ...findCityPages,
    ...neighborhoodPages,
    ...phoCityPages,
    ...modifierFindPages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
