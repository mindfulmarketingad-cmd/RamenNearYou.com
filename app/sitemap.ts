import { MetadataRoute } from 'next'
import { getCities, getRestaurantsByCity, getStates } from '@/lib/restaurants'
import { blogPosts } from '@/lib/blog-posts'

const BASE_URL = 'https://www.ramennearyou.com'

// Static dates prevent Google from seeing unstable lastModified on every deploy
const SITE_LAUNCH   = new Date('2025-01-01')
const LAST_CONTENT  = new Date('2026-05-22')

export default function sitemap(): MetadataRoute.Sitemap {
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

  const blogPostPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: LAST_CONTENT,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

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
      url: `${BASE_URL}/tonkotsu-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/spicy-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/miso-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shoyu-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vegan-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vegetarian-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/korean-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/japanese-ramen-near-me`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/searchmap`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/featured/apply`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/broth`,
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
      url: `${BASE_URL}/faq`,
      lastModified: LAST_CONTENT,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
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
    ...blogPostPages,
    ...statePages,
    ...cityPages,
    ...restaurantPages,
  ]
}
