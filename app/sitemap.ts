import { MetadataRoute } from 'next'
import { getCities, getRestaurantsByCity, getStates, getTonkotsuCities, getCitiesForBroth } from '@/lib/restaurants'
import { getReviewRestaurants, getReviewSlug } from '@/lib/reviews'
import { getCityFilterStaticParams } from '@/lib/city-filter-pages'
import { blogPosts } from '@/lib/blog-posts'
import { CITY_GUIDE_REDIRECTS } from '@/lib/city-guide-migration'
import { FIND_PAGES } from '@/components/find-cross-links'
import { getFindCityParams } from '@/lib/find-city'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import { getAllComparisons } from '@/lib/broth-comparisons'
import { getAllRecipes } from '@/lib/recipes'

const BASE_URL = 'https://www.ramennearyou.com'

// Static dates prevent Google from seeing unstable lastModified on every deploy
const SITE_LAUNCH   = new Date('2025-01-01')
const LAST_CONTENT  = new Date('2026-05-22')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = getCities()
  const states = getStates()

  const statePages = states.map((s) => ({
    url: `${BASE_URL}/${s.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const cityPages = cities.map((c) => ({
    url: `${BASE_URL}/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const restaurantPages = cities.flatMap((c) =>
    getRestaurantsByCity(c.citySlug, c.stateSlug).map((r) => ({
      url: `${BASE_URL}/${c.citySlug}/${c.stateSlug}/${r.slug}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const blogPostPages = blogPosts
    .filter((post) => !CITY_GUIDE_REDIRECTS[post.slug])
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  // City × filter pages (e.g. /atlanta/georgia/tonkotsu-ramen)
  const cityFilterPages = getCityFilterStaticParams().map((p) => ({
    url: `${BASE_URL}/${p.city}/${p.state}/${p.restaurant}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Broth-by-city pages (e.g. /tonkotsu/houston/texas, /miso/chicago/illinois)
  const tonkotsuCityPages = getTonkotsuCities(1).map((c) => ({
    url: `${BASE_URL}/tonkotsu/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  const misoCityPages = getCitiesForBroth('Miso', 2).map((c) => ({
    url: `${BASE_URL}/miso/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  const spicyCityPages = getCitiesForBroth('Spicy', 2).map((c) => ({
    url: `${BASE_URL}/spicy/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  const veganCityPages = getCitiesForBroth('Vegan', 5).map((c) => ({
    url: `${BASE_URL}/vegan/${c.citySlug}/${c.stateSlug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Individual restaurant review pages (e.g. /reviews/ikedo-japanese-eatery)
  const reviewPages = getReviewRestaurants().map((r) => ({
    url: `${BASE_URL}/reviews/${getReviewSlug(r)}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Broth-type comparison pages (e.g. /comparisons/tonkotsu-ramen-vs-miso-ramen)
  const comparisonPages = getAllComparisons().map((c) => ({
    url: `${BASE_URL}/comparisons/${c.slug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Recipe pages (e.g. /recipes/quick-homemade-ramen)
  const recipePages = getAllRecipes().map((r) => ({
    url: `${BASE_URL}/recipes/${r.slug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // /find filter, broth, brand & "near me" searchmap pages
  const findFilterPages = FIND_PAGES.map((p) => ({
    url: `${BASE_URL}${p.href}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // /find/{city}-{state} city searchmap pages
  const findCityParamList = getFindCityParams()
  const findCityPages = findCityParamList.map((p) => ({
    url: `${BASE_URL}/find/${p.cityState}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // /find/{modifier}-in-{city}-{state} pages (broth, open-late/now, beef) over
  // the same city set — generated from the modifier registry.
  const modifierFindPages = FIND_MODIFIERS.flatMap((m) =>
    findCityParamList.map((p) => ({
      url: `${BASE_URL}/find/${m.prefix}-${p.cityState}`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [
    {
      url: BASE_URL,
      lastModified: LAST_CONTENT,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/find`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/featured/apply`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/review-cards`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/broth`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/comparisons`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/menu/jinya-ramen-bar-menu`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/catering`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/recipes`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/collections/ceramic-ramen-bowls`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/collections/ramen-cookers`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    ...comparisonPages,
    ...recipePages,
    ...findFilterPages,
    ...findCityPages,
    ...modifierFindPages,
    ...blogPostPages,
    ...statePages,
    ...cityPages,
    ...cityFilterPages,
    ...tonkotsuCityPages,
    ...misoCityPages,
    ...spicyCityPages,
    ...veganCityPages,
    ...restaurantPages,
    ...reviewPages,
  ]
}
