import { NextResponse } from 'next/server'
import { restaurants } from '@/lib/restaurants'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()
  const exclude = searchParams.get('exclude') ?? ''

  const results = (
    q.length < 2
      ? restaurants.filter(r => r.slug !== exclude).slice(0, 40)
      : restaurants
          .filter(r => {
            if (r.slug === exclude) return false
            const text = `${r.name} ${r.city} ${r.stateCode} ${r.state}`.toLowerCase()
            return text.includes(q)
          })
          .slice(0, 60)
  ).map(r => ({
    slug: r.slug,
    name: r.name,
    city: r.city,
    stateCode: r.stateCode,
    rating: r.rating,
    reviewCount: r.reviewCount,
    priceRange: r.priceRange,
    citySlug: r.citySlug,
    stateSlug: r.stateSlug,
    photo: r.photo,
  }))

  return NextResponse.json(results)
}
