import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Star, ExternalLink, MapPin, QrCode, Check, X, Image as ImageIcon } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createAdminClient } from '@/lib/supabase-admin'
import {
  getRestaurantByReviewSlug,
  getReviewSlug,
  getReviewRestaurants,
  getRelatedReviewRestaurants,
  hasReviewPage,
  generateReviews,
  generateReviewSummary,
  googleReviewsUrl,
  googlePhotosUrl,
} from '@/lib/reviews'
import { jsonLdString } from '@/lib/json-ld'
import { resolveFindCity } from '@/lib/find-city'
import RestaurantReviewsClient from '@/components/restaurant-reviews-client'
import OwnerCtaCard from '@/components/owner-cta-card'
import AdUnit from '@/components/ad-unit'
import AdUnitInFeed from '@/components/ad-unit-infeed'

interface Props {
  params: Promise<{ restaurant: string }>
}

// ISR: ~7.9k review pages render on demand and cache at the CDN (pre-building
// all of them would balloon the build). Unknown slugs still 404 via the
// hasReviewPage() check in the page body. Per-visitor owner state lives in
// the client-side OwnerCtaCard so nothing here reads cookies.
// Hand-placed verified overrides — confirmed claimed outside the DB-driven
// claims flow, so the badge/ad-removal don't depend on that lookup at all.
const MANUALLY_VERIFIED_SLUGS = new Set(['momonoki', 'ikedo-ramen'])

export const dynamicParams = true
export const revalidate = 86400

export async function generateStaticParams() {
  // Pre-render only the most-reviewed pages; the long tail builds on demand.
  return getReviewRestaurants().slice(0, 50).map((r) => ({ restaurant: getReviewSlug(r) }))
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
            <span className="w-12 shrink-0 text-right text-[#6B6862]">{count.toLocaleString()}</span>
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

  // Link out to this restaurant's own city search-map page. resolveFindCity()
  // tells us whether that /find page actually renders (vs. 404ing on an
  // unrecognized city), so we never emit a dead internal link.
  const findCityState = `${r.citySlug}-${r.stateCode.toLowerCase()}`
  const findCity = resolveFindCity(findCityState)
  const findUrl = findCity?.known ? `/find/${findCityState}` : null

  // Tapping the address opens Google Maps directions to the restaurant.
  // The /dir/ endpoint (not /search/) means Google fills in the visitor's own
  // location as the origin and goes straight to navigation. place_id pins it to
  // the exact business when we have one, instead of geocoding the address text.
  const photosUrl = googlePhotosUrl(r)

  const destinationQuery = [r.address, r.city, r.stateCode].filter(Boolean).join(', ')
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}` +
    (r.placeId ? `&destination_place_id=${encodeURIComponent(r.placeId)}` : '')
  const dist = r.reviewsPerScore ?? { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  const distTotal = Object.values(dist).reduce((a, b) => a + b, 0)
  const related = getRelatedReviewRestaurants(r, 12)
  const { paragraph: summaryParagraph, pros, cons } = generateReviewSummary(r, reviews)
  const rowCount = Math.max(pros.length, cons.length)

  // Claim/verification status — per-restaurant (admin client, no cookies),
  // so it caches with the page. Whether the current visitor OWNS the claim
  // is resolved client-side in OwnerCtaCard.
  let isVerified = MANUALLY_VERIFIED_SLUGS.has(r.slug)
  const admin = createAdminClient()
  if (!isVerified && admin) {
    const { data: claim } = await admin
      .from('claims')
      .select('id')
      .eq('restaurant_slug', r.slug)
      .eq('status', 'approved')
      .limit(1)
      .maybeSingle()
    isVerified = !!claim
  }

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema) }} />
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

            <div className="mb-4">
              <AdUnitInFeed />
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#6B6862] hover:text-[#96602F] hover:underline transition-colors"
              title={`Get directions to ${r.name}`}
            >
              <MapPin className="w-4 h-4 text-[#96602F] shrink-0" />
              {r.address}
            </a>
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
                <p className="text-xs text-[#6B6862]">{(r.reviewCount ?? 0).toLocaleString()} Google reviews</p>
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
              <a
                href={photosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none border border-[#B57F50] text-[#96602F] hover:bg-[#B57F50]/10 text-sm font-semibold transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                View Photos
              </a>
              <Link
                href={listingUrl}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none bg-[#1E2026] hover:bg-[#33363d] text-white text-sm font-semibold transition-colors"
              >
                View Full Listing
              </Link>
            </div>
          </section>

          {/* Review summary */}
          <section className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-8">
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">Review Summary</h2>
            <p className="text-[#4B4845] text-sm leading-relaxed mb-8">{summaryParagraph}</p>

            <h3 className="text-sm font-bold text-[#1E2026] mb-3">Pros &amp; Cons</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-bold text-emerald-600 pb-2 pr-4 border-b border-black/8">Pros</th>
                    <th className="text-left font-bold text-red-500 pb-2 border-b border-black/8">Cons</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rowCount }).map((_, i) => (
                    <tr key={i} className="border-b border-black/5 last:border-b-0">
                      <td className="align-top py-2.5 pr-4 text-[#1E2026]">
                        {pros[i] && (
                          <span className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {pros[i]}
                          </span>
                        )}
                      </td>
                      <td className="align-top py-2.5 text-[#1E2026]">
                        {cons[i] && (
                          <span className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            {cons[i]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Owner CTAs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <OwnerCtaCard
              slug={r.slug}
              citySlug={r.citySlug}
              stateSlug={r.stateSlug}
              restaurantName={r.name}
              isVerified={isVerified}
            />
            <Link
              href={`/review-cards?restaurant=${encodeURIComponent(r.slug)}`}
              className="flex items-center gap-3 rounded-xl border border-[#B57F50]/25 bg-[#B57F50]/8 p-4 hover:bg-[#B57F50]/14 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#B57F50]/15 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-[#96602F]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#1E2026]">Want More Reviews?</span>
                <span className="block text-xs text-[#6B6862]">Get a QR review card for your tables</span>
              </span>
            </Link>
          </section>

          {/* Reviews */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-5">What Diners Are Saying</h2>
            <RestaurantReviewsClient reviews={reviews} />
          </section>

          <div className="mb-10">
            <AdUnit />
          </div>

          {/* More reviews — keeps every review page linked to others */}
          {related.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">
                More Ramen Reviews Near {r.city}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((other) => (
                  <Link
                    key={other.slug + other.citySlug}
                    href={`/reviews/${getReviewSlug(other)}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-black/5 hover:border-[#B57F50]/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E2026] truncate">{other.name}</p>
                      <p className="text-xs text-[#6B6862] truncate">{other.city}, {other.stateCode}</p>
                    </div>
                    {other.rating != null && (
                      <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#1E2026]">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {other.rating.toFixed(1)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link href="/reviews" className="text-sm text-[#96602F] font-medium hover:underline">
                  Browse all restaurant reviews →
                </Link>
                {/* Review pages should feed the listing pages too, not only
                    other review pages. */}
                <Link href={`/${r.citySlug}/${r.stateSlug}`} className="text-sm text-[#96602F] font-medium hover:underline">
                  All ramen listings in {r.city}, {r.stateCode} →
                </Link>
              </div>
            </section>
          )}

          {/* Straight into this restaurant's own city search map */}
          {findUrl && (
            <Link
              href={findUrl}
              className="group flex items-center gap-3 mt-8 rounded-xl border border-[#B57F50]/25 bg-[#F5F4F0] p-4 hover:border-[#B57F50]/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#B57F50]/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#96602F]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#1E2026] group-hover:text-[#96602F] transition-colors">
                  See every ramen spot in {findCity?.cityName ?? r.city}, {r.stateCode} on the map
                </span>
                <span className="block text-xs text-[#6B6862]">
                  Filter by broth, price, and hours — and find what&apos;s open right now near you.
                </span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#96602F] shrink-0 ml-auto" />
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
