import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Star, ExternalLink, MapPin, Store, QrCode } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { restaurants } from '@/lib/restaurants'
import {
  getRestaurantByReviewSlug,
  getReviewSlug,
  getReviewRestaurants,
  hasReviewPage,
  generateReviews,
  googleReviewsUrl,
} from '@/lib/reviews'
import RestaurantReviewsClient from '@/components/restaurant-reviews-client'

interface Props {
  params: Promise<{ restaurant: string }>
}

// Only the 400 generated pages exist; everything else 404s.
export const dynamicParams = false

export async function generateStaticParams() {
  return getReviewRestaurants().map((r) => ({ restaurant: getReviewSlug(r) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { restaurant: slug } = await params
  const r = getRestaurantByReviewSlug(slug)
  if (!r) return {}
  const title = `${r.name} Reviews | Taste, Noodle Size, Bowl Size and More`
  const url = `https://www.ramennearyou.com/reviews/${slug}`
  return {
    title,
    description: `Read reviews of ${r.name} in ${r.city}, ${r.stateCode} — rated on taste, noodle size, bowl size, broth, and value. See ratings and read diner feedback.`,
    alternates: { canonical: url },
    openGraph: { title, url, images: r.photo ? [{ url: r.photo, alt: r.name }] : [] },
  }
}

function RatingBars({ dist, total }: { dist: Record<string, number>; total: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((score) => {
        const count = dist[String(score)] ?? 0
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={score} className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-0.5 w-10 shrink-0 text-[#6B6862]">
              {score} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            </span>
            <span className="flex-1 h-2 rounded-full bg-black/8 overflow-hidden">
              <span className="block h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
            </span>
            <span className="w-12 shrink-0 text-right text-[#9B9490]">{count.toLocaleString()}</span>
          </div>
        )
      })}
    </div>
  )
}

export default async function RestaurantReviewsPage({ params }: Props) {
  const { restaurant: slug } = await params
  const r = getRestaurantByReviewSlug(slug)
  if (!r || !hasReviewPage(slug)) notFound()

  const reviews = generateReviews(r)
  const url = `https://www.ramennearyou.com/reviews/${slug}`
  const listingUrl = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
  const dist = r.reviewsPerScore ?? { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  const distTotal = Object.values(dist).reduce((a, b) => a + b, 0)

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    servesCuisine: 'Ramen',
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.street,
      addressLocality: r.city,
      addressRegion: r.stateCode,
      postalCode: r.postalCode,
      addressCountry: 'US',
    },
    ...(r.latitude != null && r.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude } }
      : {}),
    ...(r.rating != null
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: r.rating,
            reviewCount: r.reviewCount ?? 0,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    review: reviews.map((rev) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rev.author },
      datePublished: rev.date,
      reviewRating: { '@type': 'Rating', ratingValue: rev.rating, bestRating: 5, worstRating: 1 },
      reviewBody: rev.body,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://www.ramennearyou.com/reviews' },
      { '@type': 'ListItem', position: 3, name: `${r.name} Reviews`, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-8 pt-2 flex-wrap">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/reviews" className="hover:text-[#1E2026] transition-colors">Reviews</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{r.name}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] leading-tight mb-2">
              {r.name} Reviews | Taste, Noodle Size, Bowl Size and More
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-[#6B6862]">
              <MapPin className="w-4 h-4 text-[#B57F50]" />
              {r.address}
            </p>
          </header>

          {/* Rating summary card */}
          <section className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center">
              {/* Score */}
              <div className="text-center sm:border-r sm:border-black/5 sm:pr-8">
                <p className="text-5xl font-bold text-[#1E2026] leading-none mb-2">
                  {r.rating != null ? r.rating.toFixed(1) : '—'}
                </p>
                <span className="flex items-center justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        r.rating != null && i <= Math.round(r.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#1E2026]/15'
                      }`}
                    />
                  ))}
                </span>
                <p className="text-xs text-[#9B9490]">{(r.reviewCount ?? 0).toLocaleString()} Google reviews</p>
              </div>

              {/* Distribution bars */}
              <div>
                <RatingBars dist={dist} total={distTotal || (r.reviewCount ?? 0)} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-7 pt-6 border-t border-black/5">
              <a
                href={googleReviewsUrl(r)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
              >
                Read Google Reviews
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={listingUrl}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none bg-[#1E2026] hover:bg-[#33363d] text-white text-sm font-semibold transition-colors"
              >
                View Full Listing
              </Link>
            </div>
          </section>

          {/* Owner CTAs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link
              href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
              className="flex items-center gap-3 rounded-xl border border-black/8 bg-white p-4 hover:border-[#B57F50]/40 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#1E2026]/8 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-[#1E2026]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#1E2026]">Own This Business?</span>
                <span className="block text-xs text-[#6B6862]">Claim and manage the {r.name} listing</span>
              </span>
            </Link>
            <Link
              href={`/review-cards?restaurant=${encodeURIComponent(r.slug)}`}
              className="flex items-center gap-3 rounded-xl border border-[#B57F50]/25 bg-[#B57F50]/8 p-4 hover:bg-[#B57F50]/14 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#B57F50]/15 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-[#B57F50]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#1E2026]">Want More Reviews?</span>
                <span className="block text-xs text-[#6B6862]">Get a QR review card for your tables</span>
              </span>
            </Link>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-5">What Diners Are Saying</h2>
            <RestaurantReviewsClient reviews={reviews} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
