import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Phone, Globe, Star, Clock, ChevronRight,
  Utensils, ExternalLink, Crown, BadgeCheck
} from 'lucide-react'
import { getRestaurant, getRestaurantsByCity, getCities, type Restaurant } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SaveButton from '@/components/save-button'
import ShareButton from '@/components/share-button'
import VisitButton from '@/components/visit-button'
import ReviewSection from '@/components/review-section'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'
import OutboundLink from '@/components/outbound-link'
import { createClient } from '@/lib/supabase/server'

export const dynamicParams = true
export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  const r = getRestaurant(city, state, restaurant)
  if (!r) return {}
  const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`
  return {
    title: `${r.name} — Ramen in ${r.city}, ${r.stateCode}`,
    description: r.description
      ? `${r.description.slice(0, 140)}…`
      : `${r.name} is a ramen restaurant in ${r.city}, ${r.stateCode}.${r.rating ? ` Rated ${r.rating}/5` : ''} ${r.reviewCount > 0 ? `with ${r.reviewCount.toLocaleString()} reviews.` : ''}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${r.name} — Ramen in ${r.city}, ${r.stateCode}`,
      description: r.description || `Top-rated ramen in ${r.city}, ${r.stateCode}.`,
      url,
      images: r.photo ? [{ url: r.photo, alt: r.name }] : [],
    },
  }
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function StarRating({ rating, size = 'md' }: { rating: number | null; size?: 'sm' | 'md' }) {
  if (!rating) return null
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`${cls} ${i <= full ? 'text-amber-400 fill-amber-400' : i === full+1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-[#1E2026]/20'}`} />
      ))}
    </span>
  )
}

function AmenityBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-[#B57F50]/15 text-[#B57F50]' : 'bg-black/5 text-[#6B6862]/50 line-through'}`}>
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#B57F50]' : 'bg-white/20'}`} />
      {label}
    </div>
  )
}

export default async function RestaurantPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  const original = getRestaurant(city, state, restaurant)
  if (!original) notFound()
  const r = { ...original } as Restaurant

  const nearbyRestaurants = getRestaurantsByCity(city, state)
    .filter((n) => n.slug !== r.slug)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4)

  const supabase = await createClient()
  let isVerified = false
  let visitCount = 0
  let isOwner = false
  if (supabase) {
    const { data } = await supabase
      .from('claims')
      .select('id, user_id')
      .eq('restaurant_slug', r.slug)
      .eq('status', 'approved')
      .maybeSingle()
    isVerified = !!data

    if (data?.user_id) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.id === data.user_id) isOwner = true
    }

    const { data: ov } = await supabase
      .from('restaurant_overrides')
      .select('description, phone, website, menu_link, hours')
      .eq('restaurant_slug', r.slug)
      .maybeSingle()
    if (ov) {
      if (ov.description?.trim()) r.description = ov.description
      if (ov.phone?.trim())       r.phone       = ov.phone
      if (ov.website?.trim())     r.website     = ov.website
      if (ov.menu_link?.trim())   r.menuLink    = ov.menu_link
      if (ov.hours && Object.keys(ov.hours).length > 0) r.hours = ov.hours
    }

    const { count } = await supabase
      .from('restaurant_visits')
      .select('id', { count: 'exact', head: true })
      .eq('restaurant_slug', r.slug)
    visitCount = count ?? 0
  }

  const totalReviews = r.reviewsPerScore ? Object.values(r.reviewsPerScore).reduce((a, b) => a + Number(b), 0) : 0

  const restaurantSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    servesCuisine: 'Ramen',
    url: `https://www.ramennearyou.com/${city}/${state}/${restaurant}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.address,
      addressLocality: r.city,
      addressRegion: r.stateCode,
      addressCountry: 'US',
    },
    ...(r.phone && { telephone: r.phone }),
    ...(r.website && { sameAs: r.website }),
    ...(r.photo && { image: r.photo }),
    ...(r.rating && r.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: r.rating.toFixed(1),
        reviewCount: r.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(r.priceRange && { priceRange: r.priceRange }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: `Ramen in ${r.state}`, item: `https://www.ramennearyou.com/${state}` },
      { '@type': 'ListItem', position: 3, name: `${r.city}, ${r.stateCode}`, item: `https://www.ramennearyou.com/${city}/${state}` },
      { '@type': 'ListItem', position: 4, name: r.name, item: `https://www.ramennearyou.com/${city}/${state}/${restaurant}` },
    ],
  }

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Hero photo */}
      <div className="relative w-full h-64 sm:h-80 bg-[#F5F4F0] mt-16">
        <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F4F0] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${state}`} className="hover:text-[#1E2026] transition-colors">
            {r.state}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${city}/${state}`} className="hover:text-[#1E2026] transition-colors">
            {r.city}, {r.stateCode}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E2026]">{r.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Name + meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {r.businessStatus === 'OPERATIONAL' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">Open</span>
                )}
                {r.priceRange && (
                  <span className="px-2 py-0.5 rounded-full bg-black/8 text-[#1E2026]/60 text-xs">{r.priceRange}</span>
                )}
                {r.subtypes && r.subtypes.split(',').slice(0, 2).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#B57F50] text-xs">{s.trim()}</span>
                ))}
              </div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">{r.name}</h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <VisitButton slug={r.slug} restaurantName={r.name} initialCount={visitCount} />
                  <SaveButton slug={r.slug} restaurantName={r.name} />
                  <ShareButton name={r.name} url={`https://www.ramennearyou.com/${city}/${state}/${restaurant}`} />
                </div>
              </div>
              {(r.rating || r.reviewCount > 0) && (
                <div className="flex flex-wrap items-center gap-3">
                  <StarRating rating={r.rating} />
                  <span className="text-[#1E2026] font-semibold">{r.rating?.toFixed(1)}</span>
                  {r.placeId ? (
                    <a
                      href={`https://search.google.com/local/reviews?placeid=${r.placeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6B6862] text-sm hover:text-[#B57F50] transition-colors underline underline-offset-2"
                    >
                      {r.reviewCount.toLocaleString()} Google reviews
                    </a>
                  ) : (
                    <span className="text-[#6B6862] text-sm">({r.reviewCount.toLocaleString()} reviews)</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {r.description && (
              <section>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">About</h2>
                <p className="text-[#6B6862] leading-relaxed">{r.description}</p>
              </section>
            )}

            {/* Hours */}
            {r.hours && Object.keys(r.hours).length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#B57F50]" />
                  Hours
                </h2>
                <div className="bg-[#F5F4F0] rounded-xl border border-black/5 overflow-hidden">
                  {DAY_ORDER.map((day) => {
                    const slots = r.hours?.[day]
                    return (
                      <div key={day} className="flex justify-between items-center px-5 py-3 border-b border-black/5 last:border-0">
                        <span className="text-[#1E2026] text-sm font-medium w-28">{day}</span>
                        <span className="text-[#6B6862] text-sm text-right">
                          {!slots || slots[0] === 'Closed' ? (
                            <span className="text-red-400/70">Closed</span>
                          ) : (
                            slots.join(' · ')
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Amenities */}
            <section>
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">Amenities &amp; Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <AmenityBadge active={r.amenities.dineIn} label="Dine-in" />
                <AmenityBadge active={r.amenities.takeout} label="Takeout" />
                <AmenityBadge active={r.amenities.delivery} label="Delivery" />
                <AmenityBadge active={r.amenities.outdoorSeating} label="Outdoor Seating" />
                <AmenityBadge active={r.amenities.alcohol} label="Alcohol" />
                <AmenityBadge active={r.amenities.veganOptions} label="Vegan Options" />
                <AmenityBadge active={r.amenities.vegetarianOptions} label="Vegetarian" />
                <AmenityBadge active={r.amenities.acceptsReservations} label="Reservations" />
                <AmenityBadge active={r.amenities.wheelchairAccessible} label="Wheelchair Access" />
                <AmenityBadge active={r.amenities.familyFriendly} label="Family Friendly" />
                <AmenityBadge active={r.amenities.parking} label="Parking" />
                <AmenityBadge active={r.amenities.creditCards} label="Credit Cards" />
              </div>
            </section>

            {/* Community reviews */}
            <ReviewSection
              restaurantSlug={r.slug}
              restaurantName={r.name}
            />

            {/* Review breakdown */}
            {totalReviews > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">Rating Breakdown</h2>
                <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-5 space-y-3">
                  {[5,4,3,2,1].map((score) => {
                    const count = Number(r.reviewsPerScore?.[String(score)] ?? 0)
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="text-[#6B6862] text-xs w-4 text-right">{score}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[#6B6862] text-xs w-8">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
              <h3 className="font-semibold text-[#1E2026]">Contact &amp; Location</h3>
              {r.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#B57F50] mt-0.5 shrink-0" />
                  <span className="text-[#6B6862]">{r.address}</span>
                </div>
              )}
              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-3 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors">
                  <Phone className="w-4 h-4 text-[#B57F50] shrink-0" />
                  {r.phone}
                </a>
              )}
              {r.website && (
                <OutboundLink url={r.website} restaurantSlug={r.slug} restaurantName={r.name} destination="website" className="flex items-center gap-3 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors">
                  <Globe className="w-4 h-4 text-[#B57F50] shrink-0" />
                  <span className="truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </OutboundLink>
              )}
              {r.googleMapsLink && (
                <OutboundLink url={r.googleMapsLink} restaurantSlug={r.slug} restaurantName={r.name} destination="directions" className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors">
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </OutboundLink>
              )}
              {r.placeId && (
                <a
                  href={`https://search.google.com/local/reviews?placeid=${r.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-black/8 text-[#6B6862] text-sm font-medium hover:border-[#B57F50]/40 hover:text-[#1E2026] transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Read Google Reviews
                </a>
              )}
              {(r.menuLink || r.website) && (
                <OutboundLink
                  url={r.menuLink || r.website}
                  restaurantSlug={r.slug}
                  restaurantName={r.name}
                  destination="menu"
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#B57F50] text-[#B57F50] text-sm font-medium hover:bg-[#B57F50]/10 transition-colors"
                >
                  <Utensils className="w-4 h-4" />
                  {r.menuLink ? 'View Menu' : 'Visit Website'}
                </OutboundLink>
              )}
            </div>

            {/* Claim listing CTA */}
            {isOwner ? (
              <div className="bg-gradient-to-br from-sky-500/20 to-[#F5F4F0] rounded-xl border border-sky-500/30 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-sky-400" />
                  <h3 className="font-semibold text-[#1E2026]">You own this listing</h3>
                </div>
                <p className="text-[#6B6862] text-sm leading-relaxed">
                  Update your description, hours, phone, website and menu link.
                </p>
                <Link href={`/owner/${r.slug}`} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors">
                  Manage Listing
                </Link>
                <Link href="/featured/apply" className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#F5F4F0] text-sm font-semibold transition-colors">
                  <Crown className="w-4 h-4" />
                  Get Featured
                </Link>
              </div>
            ) : isVerified ? (
              <div className="bg-gradient-to-br from-white/5 to-[#F5F4F0] rounded-xl border border-black/8 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#1E2026]/40" />
                  <h3 className="font-semibold text-[#1E2026]/60">Restaurant Already Claimed</h3>
                </div>
                <p className="text-[#6B6862] text-sm leading-relaxed">
                  This listing has already been claimed by its owner.
                </p>
                <Link href="/featured/apply" className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#F5F4F0] text-sm font-semibold transition-colors">
                  <Crown className="w-4 h-4" />
                  Make This A Featured Listing
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#B57F50]/20 to-[#F5F4F0] rounded-xl border border-[#B57F50]/30 p-6 space-y-3">
                <h3 className="font-semibold text-[#1E2026]">Own this restaurant?</h3>
                <p className="text-[#6B6862] text-sm leading-relaxed">
                  Claim your free listing to add photos, update your hours, and reach more ramen lovers.
                </p>
                <Link href={`/claim/${city}/${state}/${restaurant}`} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors">
                  Claim This Listing
                </Link>
                <Link href="/featured/apply" className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#F5F4F0] text-sm font-semibold transition-colors">
                  <Crown className="w-4 h-4" />
                  Make This A Featured Listing
                </Link>
              </div>
            )}

            {/* Mini map */}
            {r.latitude && r.longitude && (
              <RestaurantMiniMapClient
                lat={r.latitude}
                lng={r.longitude}
                name={r.name}
                address={r.address}
                directionsUrl={
                  r.googleMapsLink ||
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}`
                }
              />
            )}
          </div>
        </div>
      </div>

      {nearbyRestaurants.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">More in {r.city}</p>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">Nearby Ramen Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearbyRestaurants.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${city}/${state}/${n.slug}`}
                  className="group flex flex-col bg-[#F5F4F0] rounded-xl border border-black/5 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="relative h-36 bg-[#ffffff] overflow-hidden flex-shrink-0">
                    <RestaurantImage
                      src={n.photo}
                      alt={n.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F5F4F0] via-transparent to-transparent" />
                    {n.priceRange && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[#1E2026] text-xs font-medium">
                        {n.priceRange}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-1.5">
                    <h3 className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">
                      {n.name}
                    </h3>
                    {n.rating && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[#1E2026]/70 text-xs">{n.rating.toFixed(1)}</span>
                        <span className="text-[#1E2026]/30 text-xs">({n.reviewCount.toLocaleString()})</span>
                      </div>
                    )}
                    {n.address && (
                      <p className="text-[#6B6862]/60 text-xs line-clamp-1">{n.address}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link
                href={`/${city}/${state}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#B57F50] hover:text-[#B57F50]/80 transition-colors font-medium"
              >
                See all ramen in {r.city}, {r.stateCode} →
              </Link>
              <Link
                href={`/${state}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#B57F50] hover:text-[#B57F50]/80 transition-colors font-medium"
              >
                Browse all ramen in {r.state} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
