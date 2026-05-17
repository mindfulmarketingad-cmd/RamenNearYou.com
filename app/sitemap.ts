import { MetadataRoute } from 'next'
import { getCities, getRestaurantsByCity } from '@/lib/restaurants'

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
      priority: 0.6,
    }))
  )

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...cityPages,
    ...restaurantPages,
  ]
}
