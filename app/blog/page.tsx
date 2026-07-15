import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import BlogSearch from './blog-search'
import AdUnitInFeed from '@/components/ad-unit-infeed'
import { blogPosts } from '@/lib/blog-posts'
import { CITY_GUIDE_REDIRECTS } from '@/lib/city-guide-migration'

export const metadata: Metadata = {
  title: 'Ramen Blog — Recipes, Tips & Guides',
  description: 'Learn how to make ramen at home, discover broth types, and explore the culture behind the bowl. Recipes, guides, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/blog' },
}

// Canonical category order for the browse view
const CATEGORY_ORDER = [
  'Best Of',
  'City Guides',
  'Late Night',
  'Delivery',
  'Chain Locations',
  'Cooking Guides',
  'Recipes',
  'Cooking Tips',
  'Buying Guides',
  'Health & Nutrition',
  'Ramen 101',
  'Reviews',
  'Restaurant Review',
  'Comparisons',
  'Guides',
  'For Owners',
]

function getGroups() {
  const map = new Map<string, { href: string; label: string }[]>()

  for (const post of blogPosts) {
    if (CITY_GUIDE_REDIRECTS[post.slug]) continue
    const label = post.h1 ?? post.title
    const href = `/blog/${post.slug}`
    const cat = post.category ?? 'General'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push({ href, label })
  }

  // Sort by canonical order, then alphabetically for any unknown categories
  const sorted = [...map.entries()].sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return sorted.map(([heading, pages]) => ({ heading, pages }))
}

export default function BlogPage() {
  const groups = getGroups()

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden mb-6">
          <RestaurantImage src={pickStockPhoto('blog-hub')} alt="A bowl of ramen" fill className="object-cover" sizes="672px" priority />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Ramen Blog</h1>

        <div className="mb-6">
          <AdUnitInFeed />
        </div>

        <p className="text-[#6B6862] text-sm mb-8">
          Recipes, city guides, cooking tips, health guides and everything else about ramen culture.
        </p>

        <BlogSearch groups={groups} />
      </div>
      <Footer />
    </main>
  )
}
