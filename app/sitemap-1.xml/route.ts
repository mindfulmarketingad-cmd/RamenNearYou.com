import { FIND_PAGES } from '@/components/find-cross-links'
import { getFindCityParams } from '@/lib/find-city'
import { isRetiredPage, getLiveFindModifierParams } from '@/lib/retired-pages'
import { getNeighborhoodParams } from '@/lib/neighborhoods'
import { getPhoCityParams } from '@/lib/pho'
import { isThinFindPage } from '@/lib/thin-pages'
import { SITEMAP_BASE_URL, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// Every /find page: the filter/broth/brand/"near me" pages, the per-city
// searchmap pages, neighborhood and pho pages, and the modifier × city pages
// still built (lib/retired-pages.ts) — see /sitemap-2.xml for everything else
// on the site. Thin pages (lib/thin-pages.ts) are built but noindexed, so
// they're left out here.
//
// Generated once at build time and served as a static asset. Computing this
// on every request took ~19s locally, which is enough to time out both
// Vercel's serverless function and Google Search Console's own fetcher —
// exactly what caused GSC's "Sitemap could not be read" error.
export const dynamic = 'force-static'

export async function GET() {
  // /find/ramen-shop-near-me canonicalizes to /find/ramen-shop, so only the
  // canonical URL is listed.
  const NON_CANONICAL_FIND_PAGES = new Set(['/find/ramen-shop-near-me'])
  const findFilterPages: SitemapEntry[] = FIND_PAGES.filter((p) => !NON_CANONICAL_FIND_PAGES.has(p.href)).map((p) => ({
    url: `${SITEMAP_BASE_URL}${p.href}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const findCityParamList = getFindCityParams().filter((p) => !isRetiredPage(`/find/${p.cityState}`) && !isThinFindPage(p.cityState))
  const findCityPages: SitemapEntry[] = findCityParamList.map((p) => ({
    url: `${SITEMAP_BASE_URL}/find/${p.cityState}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const modifierFindPages: SitemapEntry[] = getLiveFindModifierParams().filter((param) => !isThinFindPage(param)).map((param) => ({
    url: `${SITEMAP_BASE_URL}/find/${param}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Curated neighborhood pages (/find/ramen-restaurants-{hood}-{state})
  const neighborhoodPages: SitemapEntry[] = getNeighborhoodParams().filter((param) => !isRetiredPage(`/find/${param}`) && !isThinFindPage(param)).map((param) => ({
    url: `${SITEMAP_BASE_URL}/find/${param}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Pho city pages (/find/pho-restaurants-{city}-{state})
  const phoCityPages: SitemapEntry[] = getPhoCityParams().filter((param) => !isRetiredPage(`/find/${param}`) && !isThinFindPage(param)).map((param) => ({
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
