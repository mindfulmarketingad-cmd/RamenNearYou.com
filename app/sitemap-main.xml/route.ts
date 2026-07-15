import { getCities, getRestaurantsByCity, getStates, getTonkotsuCities, getCitiesForBroth } from '@/lib/restaurants'
import { getCityFilterStaticParams } from '@/lib/city-filter-pages'
import { getAllComparisons } from '@/lib/broth-comparisons'
import { SITEMAP_BASE_URL, SITE_LAUNCH, LAST_CONTENT, buildUrlsetXml, xmlResponse, type SitemapEntry } from '@/lib/sitemap-xml'

// Everything that isn't /find, /reviews, /recipes, or /blog: states, cities,
// restaurants, city × filter pages, broth-by-city pages, comparisons, and
// the site's static top-level pages.
// Generated once at build time and served as a static asset.
export const dynamic = 'force-static'

export async function GET() {
  const cities = getCities()
  const states = getStates()

  const statePages: SitemapEntry[] = states.map((s) => ({
    url: `${SITEMAP_BASE_URL}/${s.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const cityPages: SitemapEntry[] = cities.map((c) => ({
    url: `${SITEMAP_BASE_URL}/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const restaurantPages: SitemapEntry[] = cities.flatMap((c) =>
    getRestaurantsByCity(c.citySlug, c.stateSlug).map((r) => ({
      url: `${SITEMAP_BASE_URL}/${c.citySlug}/${c.stateSlug}/${r.slug}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  // City × filter pages (e.g. /atlanta/georgia/tonkotsu-ramen)
  const cityFilterPages: SitemapEntry[] = getCityFilterStaticParams().map((p) => ({
    url: `${SITEMAP_BASE_URL}/${p.city}/${p.state}/${p.restaurant}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Broth-by-city pages (e.g. /tonkotsu/houston/texas, /miso/chicago/illinois)
  const tonkotsuCityPages: SitemapEntry[] = getTonkotsuCities(1).map((c) => ({
    url: `${SITEMAP_BASE_URL}/tonkotsu/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  const misoCityPages: SitemapEntry[] = getCitiesForBroth('Miso', 2).map((c) => ({
    url: `${SITEMAP_BASE_URL}/miso/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  const spicyCityPages: SitemapEntry[] = getCitiesForBroth('Spicy', 2).map((c) => ({
    url: `${SITEMAP_BASE_URL}/spicy/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  const veganCityPages: SitemapEntry[] = getCitiesForBroth('Vegan', 5).map((c) => ({
    url: `${SITEMAP_BASE_URL}/vegan/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Broth-type comparison pages (e.g. /comparisons/tonkotsu-ramen-vs-miso-ramen)
  const comparisonPages: SitemapEntry[] = getAllComparisons().map((c) => ({
    url: `${SITEMAP_BASE_URL}/comparisons/${c.slug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const staticPages: SitemapEntry[] = [
    { url: SITEMAP_BASE_URL, lastModified: LAST_CONTENT, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITEMAP_BASE_URL}/cities`, lastModified: LAST_CONTENT, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITEMAP_BASE_URL}/featured/apply`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/review-cards`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/broth`, lastModified: LAST_CONTENT, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/comparisons`, lastModified: LAST_CONTENT, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/menu/jinya-ramen-bar-menu`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/catering`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/products`, lastModified: LAST_CONTENT, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/collections`, lastModified: LAST_CONTENT, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/collections/ceramic-ramen-bowls`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/collections/ramen-cookers`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/faq`, lastModified: LAST_CONTENT, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/about`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/contact`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/privacy-policy`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/terms-of-service`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/disclaimer`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const entries: SitemapEntry[] = [
    ...staticPages,
    ...comparisonPages,
    ...statePages,
    ...cityPages,
    ...cityFilterPages,
    ...tonkotsuCityPages,
    ...misoCityPages,
    ...spicyCityPages,
    ...veganCityPages,
    ...restaurantPages,
  ]

  return xmlResponse(buildUrlsetXml(entries))
}
