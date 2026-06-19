import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Phone, Globe, Star, Clock, ChevronRight,
  ExternalLink, BadgeCheck, ShoppingBag,
  BookOpen, Navigation2, AlertTriangle, Store,
} from 'lucide-react'
import { restaurants, getRestaurant, getRestaurantsByCity, type Restaurant } from '@/lib/restaurants'
import { expandDescription } from '@/lib/expand-description'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SaveButton from '@/components/save-button'
import ShareButton from '@/components/share-button'
import VisitButton from '@/components/visit-button'
import RestaurantCompareButton from '@/components/restaurant-compare-button'
import ReviewSection from '@/components/review-section'
import PhotoSection from '@/components/photo-section'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'
import AuthGatedOutboundLink from '@/components/auth-gated-outbound-link'
import PageViewTracker from '@/components/page-view-tracker'
import LiveWaitTime from '@/components/live-wait-time'
import ProductsCarousel from '@/components/products-carousel'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getFeaturedSlugsForCity } from '@/lib/featured-city'
import CityFilterPage from '@/components/city-filter-page'
import {
  parseFilterSlug,
  getMajorCity,
  getFilterRestaurants,
  getCityFilterStaticParams,
  filterTitle,
  filterDescription,
} from '@/lib/city-filter-pages'

export const dynamicParams = true

export async function generateStaticParams() {
  const restaurantParams = [...restaurants]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5000)
    .map((r) => ({
      city: r.citySlug,
      state: r.stateSlug,
      restaurant: r.slug,
    }))
  // City × filter pages share this route's third segment.
  return [...restaurantParams, ...getCityFilterStaticParams()]
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params

  // City × filter page metadata (e.g. /atlanta/georgia/tonkotsu-ramen)
  const spec = parseFilterSlug(restaurant)
  const cityInfo = spec ? getMajorCity(city, state) : null
  if (spec && cityInfo) {
    const matches = getFilterRestaurants(city, state, spec)
    if (matches.length > 0) {
      const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`
      const title = filterTitle(spec, cityInfo.city, cityInfo.stateCode)
      const description = filterDescription(spec, cityInfo.city, cityInfo.stateCode, matches.length)
      return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url },
      }
    }
  }

  const r = getRestaurant(city, state, restaurant)
  if (!r) return {}
  const url = `https://www.ramennearyou.com/${city}/${state}/${restaurant}`

  const parts: string[] = [`${r.name}.`]
  if (r.address) parts.push(r.address + '.')
  if (r.phone) parts.push(r.phone + '.')
  if (r.rating && r.reviewCount > 0) {
    parts.push(`Rated ${r.rating.toFixed(1)}/5 from ${r.reviewCount.toLocaleString()} reviews.`)
  }
  const metaDesc = parts.join(' ').slice(0, 160)
  const title = `${r.name} - ${r.city}, ${r.state}`

  return {
    title,
    description: metaDesc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: metaDesc,
      url,
      images: r.photo ? [{ url: r.photo, alt: r.name }] : [],
    },
  }
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Yelp-style star rating: large filled stars with half-star support
function StarRating({ rating, size = 'md' }: { rating: number | null; size?: 'sm' | 'md' | 'lg' }) {
  if (!rating) return null
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }
  const cls = sizes[size]
  const full = Math.floor(rating)
  const half = rating - full >= 0.3 && rating - full < 0.8
  const almostFull = rating - full >= 0.8

  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full || (i === full + 1 && almostFull)
        const isHalf = i === full + 1 && half
        return (
          <svg key={i} className={cls} viewBox="0 0 24 24" fill="none">
            {filled ? (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
            ) : isHalf ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={`url(#half-${i})`} stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
              </>
            ) : (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinejoin="round" />
            )}
          </svg>
        )
      })}
    </span>
  )
}

function isOpenNow(hours: Record<string, string[]> | null): boolean {
  if (!hours) return false
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const now = new Date()
  const slots = hours[days[now.getDay()]]
  if (!slots || slots[0] === 'Closed') return false

  function parseSlot(slot: string): [number, number] | null {
    const m = slot.match(/^(\d+(?::\d+)?)\s*(AM|PM)?\s*-\s*(\d+(?::\d+)?)\s*(AM|PM)$/i)
    if (!m) return null
    const [, sStr, sMer, eStr, eMer] = m
    function p(t: string, mer: string | undefined): number {
      const [h, mi] = t.split(':')
      let hh = parseInt(h); const mm = mi ? parseInt(mi) : 0
      const mer2 = mer?.toUpperCase()
      if (mer2 === 'PM' && hh !== 12) hh += 12
      else if (mer2 === 'AM' && hh === 12) hh = 0
      return hh * 60 + mm
    }
    const end = p(eStr, eMer)
    let sm = sMer
    if (!sm) { const sh = parseInt(sStr); sm = sh < 6 && Math.floor(end / 60) >= 12 ? 'PM' : 'AM' }
    return [p(sStr, sm), end]
  }

  const cur = now.getHours() * 60 + now.getMinutes()
  return slots.some(s => { const r = parseSlot(s); return r ? cur >= r[0] && cur < r[1] : false })
}

function getTodayHours(hours: Record<string, string[]> | null): string | null {
  if (!hours) return null
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const slots = hours[days[new Date().getDay()]]
  if (!slots) return null
  if (slots[0] === 'Closed') return 'Closed today'
  return slots.join(' · ')
}

const SCHEMA_DAY: Record<string, string> = {
  Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
  Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday',
}

function parseSlotTime(raw: string): string | null {
  const m = raw.trim().match(/^(\d+)(?::(\d+))?\s*(AM|PM)$/i)
  if (!m) return null
  let h = parseInt(m[1])
  const min = parseInt(m[2] ?? '0')
  const mer = m[3].toUpperCase()
  if (mer === 'PM' && h !== 12) h += 12
  if (mer === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function parseHourSlot(slot: string): { opens: string; closes: string } | null {
  // Handles "11:30AM-3PM", "5PM-9PM", "5-9PM"
  const m = slot.match(/^(\d+(?::\d+)?\s*(?:AM|PM)?)\s*-\s*(\d+(?::\d+)?\s*(?:AM|PM))$/i)
  if (!m) return null
  const [, startRaw, endRaw] = m
  const closes = parseSlotTime(endRaw)
  if (!closes) return null
  // If start has no AM/PM, inherit from end
  const startWithMer = /AM|PM/i.test(startRaw) ? startRaw : startRaw + endRaw.match(/(AM|PM)/i)?.[1]
  const opens = parseSlotTime(startWithMer ?? startRaw)
  if (!opens) return null
  return { opens, closes }
}

function buildOpeningHours(hours: Record<string, string[]>) {
  const specs: Record<string, unknown>[] = []
  for (const [day, slots] of Object.entries(hours)) {
    const dayName = SCHEMA_DAY[day]
    if (!dayName || !slots || slots[0] === 'Closed') continue
    for (const slot of slots) {
      const parsed = parseHourSlot(slot)
      if (parsed) {
        specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${dayName}`, opens: parsed.opens, closes: parsed.closes })
      }
    }
  }
  return specs.length > 0 ? specs : undefined
}

export default async function RestaurantPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params

  // City × filter page (e.g. /atlanta/georgia/tonkotsu-ramen). Only major
  // cities get these; anything else falls through to restaurant lookup.
  const spec = parseFilterSlug(restaurant)
  const cityInfo = spec ? getMajorCity(city, state) : null
  if (spec && cityInfo) {
    const matches = getFilterRestaurants(city, state, spec)
    if (matches.length > 0) {
      return <CityFilterPage spec={spec} cityInfo={cityInfo} restaurants={matches} />
    }
    notFound()
  }

  const original = getRestaurant(city, state, restaurant)
  if (!original) notFound()
  const r = { ...original } as Restaurant

  const nearbyRestaurants = getRestaurantsByCity(city, state)
    .filter((n) => n.slug !== r.slug)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4)

  const featuredSlugsForCity = getFeaturedSlugsForCity(r.citySlug, r.stateSlug)
  const isFeatured = featuredSlugsForCity.includes(r.slug)

  const supabase = await createClient()
  let isVerified = false
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
  }

  const totalReviews = r.reviewsPerScore ? Object.values(r.reviewsPerScore).reduce((a, b) => a + Number(b), 0) : 0

  type CommunityReview = {
    id: string; user_display_name: string; rating: number; body: string | null; created_at: string
  }
  let communityReviews: CommunityReview[] = []
  try {
    const reviewClient = createAdminClient() ?? supabase
    if (reviewClient) {
      const { data: reviewRows } = await reviewClient
        .from('reviews')
        .select('id, user_display_name, rating, body, created_at')
        .eq('restaurant_slug', r.slug)
        .order('created_at', { ascending: false })
        .limit(10)
      communityReviews = reviewRows ?? []
    }
  } catch { /* non-critical */ }

  let aggregateRating: Record<string, unknown> | null = null
  if (r.rating && r.reviewCount > 0 && communityReviews.length > 0) {
    const commSum = communityReviews.reduce((s, rv) => s + rv.rating, 0)
    const totalCount = r.reviewCount + communityReviews.length
    const blendedRating = ((r.rating * r.reviewCount) + commSum) / totalCount
    aggregateRating = { '@type': 'AggregateRating', ratingValue: blendedRating.toFixed(1), reviewCount: totalCount, bestRating: '5', worstRating: '1' }
  } else if (r.rating && r.reviewCount > 0) {
    aggregateRating = { '@type': 'AggregateRating', ratingValue: r.rating.toFixed(1), reviewCount: r.reviewCount, bestRating: '5', worstRating: '1' }
  } else if (communityReviews.length > 0) {
    const commSum = communityReviews.reduce((s, rv) => s + rv.rating, 0)
    aggregateRating = { '@type': 'AggregateRating', ratingValue: (commSum / communityReviews.length).toFixed(1), reviewCount: communityReviews.length, bestRating: '5', worstRating: '1' }
  }

  const reviewSchemaItems = communityReviews
    .filter(rv => rv.body?.trim())
    .map(rv => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rv.user_display_name || 'Anonymous' },
      reviewRating: { '@type': 'Rating', ratingValue: String(rv.rating), bestRating: '5', worstRating: '1' },
      datePublished: rv.created_at.slice(0, 10),
      reviewBody: rv.body,
    }))

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
    ...(r.latitude != null && r.longitude != null && {
      geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude },
    }),
    ...(r.phone && { telephone: r.phone }),
    ...(r.website && { sameAs: r.website }),
    ...(r.photo && { image: r.photo }),
    ...(r.priceRange && { priceRange: r.priceRange }),
    ...(aggregateRating && { aggregateRating }),
    ...(reviewSchemaItems.length > 0 && { review: reviewSchemaItems }),
    ...(r.hours && Object.keys(r.hours).length > 0 && {
      openingHoursSpecification: buildOpeningHours(r.hours),
    }),
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

  const openNow = isOpenNow(r.hours)
  const todayHours = getTodayHours(r.hours)
  const orderUrl = r.orderLinks?.trim() || r.website?.trim() || null
  const menuUrl = r.menuLink?.trim() || r.website?.trim() || null
  const brothTypes = r.subtypes ? r.subtypes.split(',').slice(0, 3).map(s => s.trim()).filter(Boolean) : []

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <PageViewTracker slug={r.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* ── HERO ── tall photo with gradient overlay, info overlaid at bottom */}
      <div className="relative w-full h-72 sm:h-[420px] bg-[#1E2026] mt-16">
        <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="100vw" priority />
        {/* Heavy gradient bottom-to-top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Overlaid content at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 pt-12">
          <div className="max-w-7xl mx-auto">
            {/* Status + price + broth tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {r.businessStatus === 'OPERATIONAL' && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${openNow ? 'bg-emerald-500/90 text-white' : 'bg-red-500/80 text-white'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${openNow ? 'bg-white' : 'bg-white'}`} />
                  {openNow ? 'Open Now' : 'Closed'}
                  {todayHours && <span className="ml-1 font-normal opacity-80">· {todayHours}</span>}
                </span>
              )}
              {r.priceRange && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm border border-white/20">{r.priceRange}</span>
              )}
              {brothTypes.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#B57F50]/80 text-white text-xs backdrop-blur-sm border border-[#B57F50]/40">{t}</span>
              ))}
              {(isFeatured || isVerified) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-400" />Verified
                </span>
              )}
            </div>

            {/* Restaurant name */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg mb-3">
              {r.name}
            </h1>

            {/* Rating row */}
            {(r.rating || r.reviewCount > 0) && (
              <div className="flex items-center gap-3">
                <span className="font-bold text-2xl text-white leading-none">{r.rating?.toFixed(1) ?? '—'}</span>
                <StarRating rating={r.rating} size="md" />
                <span className="text-white/70 text-sm">
                  ({(r.reviewCount ?? 0).toLocaleString()} {r.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#9B9490] py-4 flex-wrap">
          <Link href="/" className="hover:text-[#B57F50] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${state}`} className="hover:text-[#B57F50] transition-colors">{r.state}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${city}/${state}`} className="hover:text-[#B57F50] transition-colors">{r.city}, {r.stateCode}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E2026]">{r.name}</span>
        </nav>

        {/* ── 5-col grid: 3 main + 2 sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-16">

          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* CTA Card */}
            <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
              <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-4">Visit or Order</h2>
              <div className="flex flex-col gap-2.5">

                {/* Uber Eats (specific slugs only) */}
                {['chef-mak-noodle-house', 'the-bento-bowl', 'kumo-sushi-ramen', 'crave-noodles'].includes(r.slug) && (
                  <a
                    href="https://ubereats.com/feed?promoCode=eats-davidf17016ue"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex w-full items-center justify-center gap-3 px-4 py-2.5 rounded-none bg-[#1a1f2e] hover:bg-[#252b3b] text-white transition-colors"
                  >
                    <div className="flex flex-col leading-tight">
                      <span className="text-white text-[11px] font-normal">Uber</span>
                      <span className="text-[#06C167] text-[11px] font-bold">Eats</span>
                    </div>
                    <span className="text-white text-sm font-bold">Order Food</span>
                  </a>
                )}

                {/* Order Now */}
                {orderUrl && (
                  <AuthGatedOutboundLink
                    url={orderUrl}
                    restaurantSlug={r.slug}
                    restaurantName={r.name}
                    destination="website"
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Now
                  </AuthGatedOutboundLink>
                )}

                {/* View Full Menu */}
                {menuUrl && (
                  <AuthGatedOutboundLink
                    url={menuUrl}
                    restaurantSlug={r.slug}
                    restaurantName={r.name}
                    destination="menu"
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-white border-2 border-[#B57F50] text-[#B57F50] hover:bg-[#B57F50]/8 text-sm font-bold transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Full Menu
                  </AuthGatedOutboundLink>
                )}

                {/* Get Directions — plain anchor, no auth gate */}
                {r.googleMapsLink && (
                  <a
                    href={r.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#F5F4F0] hover:bg-[#eae9e5] text-[#1E2026] text-sm font-medium transition-colors border border-black/8"
                  >
                    <Navigation2 className="w-4 h-4 text-[#B57F50]" />
                    Get Directions
                  </a>
                )}

                {/* Read Google Reviews — plain anchor, no auth gate */}
                {r.placeId && (
                  <a
                    href={`https://search.google.com/local/reviews?placeid=${r.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#F5F4F0] hover:bg-[#eae9e5] text-[#1E2026] text-sm font-medium transition-colors border border-black/8"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Read Google Reviews
                    <ExternalLink className="w-3.5 h-3.5 text-[#9B9490]" />
                  </a>
                )}

                {/* Share + Compare row */}
                <div className="flex items-center gap-2 pt-1">
                  <ShareButton title={r.name} url={`https://www.ramennearyou.com/${city}/${state}/${restaurant}`} />
                  <RestaurantCompareButton restaurant={r} />
                </div>
              </div>
            </div>

            {/* About */}
            {(() => {
              const about = expandDescription(r)
              if (!about) return null
              const paras = about.split('\n\n').filter(Boolean)
              return (
                <section className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
                  <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">About {r.name}</h2>
                  <div className="space-y-3">
                    {paras.map((p, i) => (
                      <p key={i} className="text-[#4B4845] leading-relaxed text-[15px]">{p}</p>
                    ))}
                  </div>
                </section>
              )
            })()}

            {/* At a Glance */}
            <section className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">At a Glance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Live wait time */}
                <div>
                  <p className="text-xs font-semibold text-[#9B9490] uppercase tracking-widest mb-2">Current Wait</p>
                  <LiveWaitTime hours={r.hours} />
                </div>

                {/* Health score */}
                <div>
                  <p className="text-xs font-semibold text-[#9B9490] uppercase tracking-widest mb-2">Health Score</p>
                  <div className="flex items-start gap-3 rounded-xl border border-black/8 bg-[#F5F4F0] p-4">
                    <AlertTriangle className="w-5 h-5 text-[#9B9490] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#6B6862]">Not yet available</p>
                      <p className="text-[11px] text-[#9B9490] mt-0.5 leading-snug">
                        Check your local health department for inspection records
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-[#9B9490] uppercase tracking-widest mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { active: r.amenities.dineIn,            label: '🍜 Dine-in' },
                      { active: r.amenities.takeout,           label: '🥡 Takeout' },
                      { active: r.amenities.delivery,          label: '🛵 Delivery' },
                      { active: r.amenities.outdoorSeating,    label: '🌿 Outdoor Seating' },
                      { active: r.amenities.alcohol,           label: '🍺 Alcohol' },
                      { active: r.amenities.veganOptions,      label: '🌱 Vegan Options' },
                      { active: r.amenities.vegetarianOptions, label: '🥦 Vegetarian' },
                      { active: r.amenities.acceptsReservations, label: '📅 Reservations' },
                      { active: r.amenities.wheelchairAccessible, label: '♿ Accessible' },
                      { active: r.amenities.familyFriendly,   label: '👨‍👩‍👧 Family Friendly' },
                      { active: r.amenities.parking,           label: '🅿️ Parking' },
                      { active: r.amenities.creditCards,       label: '💳 Credit Cards' },
                    ].filter(a => a.active).map(a => (
                      <span key={a.label} className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-xs font-medium">
                        {a.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Rating breakdown */}
            {totalReviews > 0 && (
              <section className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">Rating Breakdown</h2>
                <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <p className="font-bold text-5xl text-[#1E2026] leading-none">{r.rating?.toFixed(1)}</p>
                      <StarRating rating={r.rating} size="md" />
                      <p className="text-xs text-[#9B9490] mt-1">{(r.reviewCount ?? 0).toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((score) => {
                        const count = Number(r.reviewsPerScore?.[String(score)] ?? 0)
                        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                        return (
                          <div key={score} className="flex items-center gap-2.5">
                            <span className="text-[#6B6862] text-xs w-3 text-right shrink-0">{score}</span>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-black/5">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[#9B9490] text-xs w-8 shrink-0">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {r.placeId && (
                    <a
                      href={`https://search.google.com/local/reviews?placeid=${r.placeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white border border-black/8 text-[#1E2026] text-sm font-medium hover:border-[#B57F50]/40 transition-colors"
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Read all reviews on Google
                      <ExternalLink className="w-3 h-3 text-[#9B9490]" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Community reviews */}
            <ReviewSection restaurantSlug={r.slug} restaurantName={r.name} />

            {/* Community photos */}
            <PhotoSection restaurantSlug={r.slug} restaurantName={r.name} />

          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Claim This Business — premium gold card for non-owners */}
            {!isOwner && (
              <div className="rounded-2xl bg-gradient-to-br from-[#B57F50] to-[#9a6b42] p-6 shadow-lg">
                <Store className="w-8 h-8 text-white mb-4" />
                <h3 className="font-serif text-lg font-bold text-white mb-2">Is this your restaurant?</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  Claim your free listing to update your hours, photos, and menu — and start attracting more customers.
                </p>
                <ul className="space-y-1.5 mb-5">
                  {['Edit hours, photos & menu', 'Respond to reviews', 'Get discovered by more customers'].map(benefit => (
                    <li key={benefit} className="flex items-center gap-2 text-white/90 text-sm">
                      <span className="text-white font-bold">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/claim/${city}/${state}/${restaurant}`}
                  className="flex w-full items-center justify-center px-4 py-3 rounded-none bg-white text-[#9a6b42] font-bold text-sm hover:bg-white/90 transition-colors"
                >
                  Claim This Listing →
                </Link>
              </div>
            )}

            {/* Owner manage panel */}
            {isOwner && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-sky-500" />
                  <p className="font-bold text-[#1E2026] text-sm">You own this listing</p>
                </div>
                <p className="text-[#6B6862] text-xs leading-relaxed">Update your description, hours, phone, website and menu link.</p>
                <Link href={`/owner/${r.slug}`} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors">
                  Manage Listing
                </Link>
              </div>
            )}

            {/* Contact & Info card */}
            <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-black/5">
                <p className="font-bold text-[#1E2026] text-sm">Contact & Info</p>
              </div>
              <div className="px-5 py-4 space-y-3.5">
                {r.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#B57F50] mt-0.5 shrink-0" />
                    <span className="text-[#4B4845] leading-snug">
                      {(() => {
                        const addr = r.address
                        const cityIdx = addr.indexOf(r.city)
                        const stateIdx = cityIdx > -1 ? addr.indexOf(r.stateCode, cityIdx + r.city.length) : -1
                        if (cityIdx === -1) return addr
                        const street = addr.slice(0, cityIdx)
                        const sep = stateIdx > -1 ? addr.slice(cityIdx + r.city.length, stateIdx) : ''
                        const after = stateIdx > -1 ? addr.slice(stateIdx + r.stateCode.length) : ''
                        return (
                          <>
                            {street}
                            <Link href={`/${city}/${state}`} className="text-[#B57F50] hover:underline">{r.city}</Link>
                            {sep}
                            {stateIdx > -1 && <Link href={`/${state}`} className="text-[#B57F50] hover:underline">{r.stateCode}</Link>}
                            {after}
                          </>
                        )
                      })()}
                    </span>
                  </div>
                )}
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#B57F50] transition-colors">
                    <Phone className="w-4 h-4 text-[#B57F50] shrink-0" />
                    {r.phone}
                  </a>
                )}
                {r.website && (
                  <AuthGatedOutboundLink url={r.website} restaurantSlug={r.slug} restaurantName={r.name} destination="website" className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#B57F50] transition-colors">
                    <Globe className="w-4 h-4 text-[#B57F50] shrink-0" />
                    <span className="truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 text-[#9B9490]" />
                  </AuthGatedOutboundLink>
                )}
              </div>

              {/* Hours */}
              {r.hours && Object.keys(r.hours).length > 0 && (
                <div className="px-5 py-4 border-t border-black/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-[#B57F50] shrink-0" />
                    <span className="text-sm font-bold text-[#1E2026]">Hours</span>
                    {r.businessStatus === 'OPERATIONAL' && (
                      <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${openNow ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                        {openNow ? 'Open' : 'Closed'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {DAY_ORDER.map((day) => {
                      const slots = r.hours?.[day]
                      const isToday = day === ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]
                      return (
                        <div key={day} className={`flex justify-between gap-2 text-xs py-0.5 rounded px-1 ${isToday ? 'bg-[#B57F50]/8 -mx-1' : ''}`}>
                          <span className={`font-semibold w-24 shrink-0 ${isToday ? 'text-[#B57F50]' : 'text-[#1E2026]'}`}>{day}</span>
                          <span className={`text-right ${!slots || slots[0] === 'Closed' ? 'text-red-400' : isToday ? 'text-[#B57F50]' : 'text-[#6B6862]'}`}>
                            {!slots || slots[0] === 'Closed' ? 'Closed' : slots.join(' · ')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mini map */}
            {r.latitude && r.longitude && (
              <RestaurantMiniMapClient
                lat={r.latitude}
                lng={r.longitude}
                name={r.name}
                address={r.address}
                directionsUrl={r.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}`}
              />
            )}

          </div>
        </div>
      </div>

      {/* Nearby restaurants */}
      {nearbyRestaurants.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-2">More in {r.city}</p>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">Nearby Ramen Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearbyRestaurants.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${city}/${state}/${n.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-black/8 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-36 bg-[#F5F4F0] overflow-hidden shrink-0">
                    <RestaurantImage src={n.photo} alt={n.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {n.priceRange && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium">{n.priceRange}</span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1">{n.name}</p>
                    {n.rating && (
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={n.rating} size="sm" />
                        <span className="text-[#6B6862] text-xs font-medium">{n.rating.toFixed(1)}</span>
                        <span className="text-[#9B9490] text-xs">({(n.reviewCount ?? 0).toLocaleString()})</span>
                      </div>
                    )}
                    {n.address && <p className="text-[#9B9490] text-xs line-clamp-1">{n.address}</p>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <Link href={`/${city}/${state}`} className="text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors">
                See all ramen in {r.city}, {r.stateCode} →
              </Link>
              <Link href={`/${state}`} className="text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors">
                Browse all ramen in {r.state} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <ProductsCarousel />
      <Footer />
    </main>
  )
}
