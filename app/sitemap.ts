import { MetadataRoute } from 'next'
import { getCities, getRestaurantsByCity } from '@/lib/restaurants'
import { blogPosts } from '@/lib/blog-posts'

const BASE_URL = 'https://www.ramennearyou.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities()

  const cityPages = cities.map((c) => ({
    url: `${BASE_URL}/${c.citySlug}/${c.stateSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const restaurantPages = cities.flatMap((c) =>
    getRestaurantsByCity(c.citySlug, c.stateSlug).map((r) => ({
      url: `${BASE_URL}/${c.citySlug}/${c.stateSlug}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const blogPostPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/spicy-ramen-near-me`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/miso-ramen-near-me`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shoyu-ramen-near-me`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/broth`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/catering`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...blogPostPages,
    ...cityPages,
    ...restaurantPages,
  ]
}
