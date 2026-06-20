import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getReviewSlug, getReviewRestaurants } from '@/lib/reviews'
import ReviewsIndexClient, { type ReviewIndexItem } from '@/components/reviews-index-client'

export const metadata: Metadata = {
  title: 'Ramen Restaurant Reviews | Taste, Noodle Size, Bowl Size & More',
  description:
    'Browse honest ramen restaurant reviews from across the country — rated on taste, noodle size, bowl size, broth, and value. Find the best ramen near you.',
  alternates: { canonical: 'https://www.ramennearyou.com/reviews' },
}

export default function ReviewsIndexPage() {
  const reviewRestaurants = getReviewRestaurants()
  const items: ReviewIndexItem[] = reviewRestaurants
    .map((r) => ({
      name: r.name,
      reviewSlug: getReviewSlug(r),
      city: r.city,
      stateCode: r.stateCode,
      rating: r.rating,
      reviewCount: r.reviewCount,
    }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-8 pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Reviews</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
              Ramen Restaurant Reviews
            </h1>
            <p className="text-[#6B6862] text-lg max-w-2xl">
              Real reviews for our {reviewRestaurants.length.toLocaleString()} top-rated ramen shops — rated on taste,
              noodle size, bowl size, broth, and value. Pick a restaurant to read what diners are saying.
            </p>
          </div>

          <ReviewsIndexClient items={items} />
        </div>
      </main>
      <Footer />
    </>
  )
}
