import Link from 'next/link'
import {
  MapPin, Star, ChevronRight, ExternalLink, Navigation2, ShoppingBag, BookOpen, Store,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'
import ShareButton from '@/components/share-button'
import ProductsCarousel from '@/components/products-carousel'
import BrothStyleLinks from '@/components/broth-style-links'
import type { SupplementListing } from '@/lib/places-supplements'

interface Props {
  listing: SupplementListing
  stateName: string
  // Other listings in the same city, for the "Nearby" section.
  nearby: SupplementListing[]
}

function StarRow({ rating, size = 'md' }: { rating: number | null; size?: 'sm' | 'md' }) {
  if (!rating) return null
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const full = Math.round(rating)
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${cls} ${i <= full ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      ))}
    </span>
  )
}

export default function SupplementRestaurantPage({ listing: r, stateName, nearby }: Props) {
  const { city, citySlug, stateCode, stateSlug, slug } = r
  const url = `https://www.ramennearyou.com/${citySlug}/${stateSlug}/${slug}`
  const priceRange = r.priceLevel ? '$'.repeat(r.priceLevel) : ''
  const directionsUrl = r.googleMapsUrl
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${city} ${stateCode}`)}`

  const restaurantSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    servesCuisine: 'Ramen',
    url,
    address: {
      '@type': 'PostalAddress',
      ...(r.address ? { streetAddress: r.address } : {}),
      addressLocality: city,
      addressRegion: stateCode,
      addressCountry: 'US',
    },
    ...(r.latitude != null && r.longitude != null && {
      geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude },
    }),
    ...(r.photo && { image: r.photo }),
    ...(priceRange && { priceRange }),
    ...(r.rating && r.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: r.rating.toFixed(1),
        reviewCount: r.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Ramen in ${stateName}`, item: `https://www.ramennearyou.com/${stateSlug}` },
      { '@type': 'ListItem', position: 3, name: `${city}, ${stateCode}`, item: `https://www.ramennearyou.com/${citySlug}/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: r.name, item: url },
    ],
  }

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-72 sm:h-[420px] bg-[#1E2026] mt-16">
        <RestaurantImage src={r.photo ?? ''} alt={r.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 pt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {priceRange && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm border border-white/20">{priceRange}</span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-[#B57F50]/80 text-white text-xs backdrop-blur-sm border border-[#B57F50]/40">Ramen</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg mb-3">
              {r.name}
            </h1>
            {(r.rating || r.reviewCount > 0) && (
              <div className="flex items-center gap-3">
                <span className="font-bold text-2xl text-white leading-none">{r.rating?.toFixed(1) ?? '—'}</span>
                <StarRow rating={r.rating} />
                <span className="text-white/70 text-sm">
                  ({(r.reviewCount ?? 0).toLocaleString()} {r.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#9B9490] py-4 flex-wrap">
          <Link href="/" className="hover:text-[#B57F50] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${stateSlug}`} className="hover:text-[#B57F50] transition-colors">{stateName}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${citySlug}/${stateSlug}`} className="hover:text-[#B57F50] transition-colors">{city}, {stateCode}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E2026]">{r.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-16">
          {/* MAIN */}
          <div className="lg:col-span-3 space-y-10">
            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
              <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-4">Visit or Order</h2>
              <div className="flex flex-col gap-2.5">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order / View on Google
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-white border-2 border-[#B57F50] text-[#B57F50] hover:bg-[#B57F50]/8 text-sm font-bold transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  View Menu
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#F5F4F0] hover:bg-[#eae9e5] text-[#1E2026] text-sm font-medium transition-colors border border-black/8"
                >
                  <Navigation2 className="w-4 h-4 text-[#B57F50]" />
                  Get Directions
                  <ExternalLink className="w-3.5 h-3.5 text-[#9B9490]" />
                </a>
                <div className="flex items-center gap-2 pt-1">
                  <ShareButton title={r.name} url={url} />
                </div>
              </div>
            </div>

            {/* About */}
            <section className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">About {r.name}</h2>
              <p className="text-[#4B4845] leading-relaxed text-[15px] mb-3">
                {r.name} is a ramen restaurant in {city}, {stateName}
                {r.rating && r.reviewCount > 0
                  ? `, rated ${r.rating.toFixed(1)} out of 5 across ${r.reviewCount.toLocaleString()} Google reviews`
                  : ''}. Browse hours, directions, and reviews, or explore more{' '}
                <Link href={`/${citySlug}/${stateSlug}`} className="text-[#B57F50] hover:underline">ramen restaurants in {city}</Link>.
              </p>
              <p className="text-[#4B4845] leading-relaxed text-[15px]">
                Looking for a specific style? Browse{' '}
                <Link href="/find/tonkotsu-ramen" className="text-[#B57F50] hover:underline">tonkotsu</Link>,{' '}
                <Link href="/find/miso-ramen" className="text-[#B57F50] hover:underline">miso</Link>,{' '}
                <Link href="/find/shoyu-ramen" className="text-[#B57F50] hover:underline">shoyu</Link>, and{' '}
                <Link href="/find/spicy-ramen" className="text-[#B57F50] hover:underline">spicy ramen</Link> near you.
              </p>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#B57F50] to-[#9a6b42] p-6 shadow-lg">
              <Store className="w-8 h-8 text-white mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">Is this your restaurant?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Claim your free listing to add your hours, photos, and menu — and start attracting more customers.
              </p>
              <Link
                href="/claim-your-listing"
                className="flex w-full items-center justify-center px-4 py-3 rounded-none bg-white text-[#9a6b42] font-bold text-sm hover:bg-white/90 transition-colors"
              >
                Claim This Listing →
              </Link>
            </div>

            {/* Contact & info */}
            <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-black/5">
                <p className="font-bold text-[#1E2026] text-sm">Location</p>
              </div>
              <div className="px-5 py-4 space-y-3.5">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#B57F50] mt-0.5 shrink-0" />
                  <span className="text-[#4B4845] leading-snug">
                    {r.address ? `${r.address}` : (
                      <>
                        <Link href={`/${citySlug}/${stateSlug}`} className="text-[#B57F50] hover:underline">{city}</Link>
                        {', '}
                        <Link href={`/${stateSlug}`} className="text-[#B57F50] hover:underline">{stateCode}</Link>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Mini map */}
            {r.latitude && r.longitude && (
              <RestaurantMiniMapClient
                lat={r.latitude}
                lng={r.longitude}
                name={r.name}
                address={r.address ?? `${city}, ${stateCode}`}
                directionsUrl={directionsUrl}
              />
            )}
          </div>
        </div>
      </div>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-2">More in {city}</p>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">Nearby Ramen Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearby.map(n => (
                <Link
                  key={n.slug}
                  href={`/${n.citySlug}/${n.stateSlug}/${n.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-black/8 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-36 bg-[#F5F4F0] overflow-hidden shrink-0">
                    <RestaurantImage src={n.photo ?? ''} alt={n.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">{n.name}</p>
                    {n.rating && (
                      <div className="flex items-center gap-1.5">
                        <StarRow rating={n.rating} size="sm" />
                        <span className="text-[#6B6862] text-xs font-medium">{n.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <Link href={`/${citySlug}/${stateSlug}`} className="text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors">
                See all ramen in {city}, {stateCode} →
              </Link>
              <Link href={`/${stateSlug}`} className="text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors">
                Browse all ramen in {stateName} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <BrothStyleLinks place={r.city} />
      <ProductsCarousel />
      <Footer />
    </main>
  )
}
