import { Suspense } from 'react'
import { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CompareSearchClient, { type PreloadedRestaurant } from '@/components/compare-search-client'

export const metadata: Metadata = {
  title: 'Compare Ramen Restaurants | RamenNearYou',
  description:
    'Pick any two ramen restaurants and get a full side-by-side breakdown of ratings, hours, price, amenities, and more.',
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>
}) {
  const { a } = await searchParams
  const found = a ? restaurants.find(r => r.slug === a) ?? null : null

  const restaurantA: PreloadedRestaurant = found
    ? {
        slug: found.slug,
        name: found.name,
        city: found.city,
        stateCode: found.stateCode,
        rating: found.rating,
        priceRange: found.priceRange ?? '',
        photo: found.photo ?? '',
        address: found.address ?? '',
      }
    : null

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">
              Compare
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
              Compare Ramen Restaurants
            </h1>
            <p className="text-[#6B6862] text-base max-w-xl mx-auto">
              Pick two restaurants to see a full side-by-side breakdown — ratings, hours, amenities, and every detail we have.
            </p>
          </div>

          {/* Search UI */}
          <Suspense>
            <CompareSearchClient restaurantA={restaurantA} />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  )
}
