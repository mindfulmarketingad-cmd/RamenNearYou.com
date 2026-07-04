import Link from 'next/link'
import {
  MapPin, Phone, Globe, Star, Clock, ChevronRight, ExternalLink,
  Navigation2, ShoppingBag, BookOpen, Store, QrCode,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMapPaneClient from '@/components/restaurant-map-pane-client'
import ShareButton from '@/components/share-button'
import ListingSaveButton from '@/components/listing-save-button'
import { expandDescription } from '@/lib/expand-description'
import { getReviewSlug } from '@/lib/reviews'
import type { Restaurant } from '@/lib/restaurants'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const full = Math.floor(rating)
  const almostFull = rating - full >= 0.8
  const half = rating - full >= 0.3 && rating - full < 0.8
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full || (i === full + 1 && almostFull)
        const isHalf = i === full + 1 && half
        return (
          <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            {filled ? (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
            ) : isHalf ? (
              <>
                <defs>
                  <linearGradient id={`hs-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#hs-${i})`} stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
              </>
            ) : (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinejoin="round" />
            )}
          </svg>
        )
      })}
    </span>
  )
}

function isOpenNow(hours: Record<string, string[]> | null): boolean {
  if (!hours) return false
  const slots = hours[DOW[new Date().getDay()]]
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
  const cur = new Date().getHours() * 60 + new Date().getMinutes()
  return slots.some(s => { const rr = parseSlot(s); return rr ? cur >= rr[0] && cur < rr[1] : false })
}

function firstUrl(raw?: string | null): string {
  if (!raw) return ''
  const m = raw.match(/https?:\/\/[^\s,]+/)
  return m ? m[0] : ''
}

interface Props {
  r: Restaurant
  city: string
  state: string
  nearby: Restaurant[]
}

// Google-Maps-style single-restaurant listing: a scrollable details panel on
// the left, a single-pin map on the right. Mirrors the searchmap layout.
export default function RestaurantListingPage({ r, city, state, nearby }: Props) {
  const url = `https://www.ramennearyou.com/${city}/${state}/${r.slug}`
  const openNow = isOpenNow(r.hours)
  const category = (r.subtypes?.split(',')[0] ?? 'Ramen restaurant').trim()
  const menuUrl = r.menuLink?.trim() ?? ''
  const orderUrl = firstUrl(r.orderLinks)
  const directionsUrl = r.googleMapsLink
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`
  const about = expandDescription(r)
  const aboutParas = about ? about.split('\n\n').filter(Boolean) : []
  const reviewSlug = getReviewSlug(r)

  const features = [
    { active: r.amenities?.dineIn, label: '🍜 Dine-in' },
    { active: r.amenities?.takeout, label: '🥡 Takeout' },
    { active: r.amenities?.delivery, label: '🛵 Delivery' },
    { active: r.amenities?.outdoorSeating, label: '🌿 Outdoor Seating' },
    { active: r.amenities?.alcohol, label: '🍺 Alcohol' },
    { active: r.amenities?.veganOptions, label: '🌱 Vegan Options' },
    { active: r.amenities?.vegetarianOptions, label: '🥦 Vegetarian' },
    { active: r.amenities?.acceptsReservations, label: '📅 Reservations' },
    { active: r.amenities?.wheelchairAccessible, label: '♿ Accessible' },
    { active: r.amenities?.familyFriendly, label: '👨‍👩‍👧 Family Friendly' },
    { active: r.amenities?.parking, label: '🅿️ Parking' },
    { active: r.amenities?.creditCards, label: '💳 Credit Cards' },
  ].filter(a => a.active)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.street || undefined,
      addressLocality: r.city,
      addressRegion: r.stateCode,
      postalCode: r.postalCode || undefined,
      addressCountry: 'US',
    },
    url,
    servesCuisine: 'Ramen',
    ...(r.latitude && r.longitude ? { geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude } } : {}),
    ...(r.phone ? { telephone: r.phone } : {}),
    ...(r.priceRange ? { priceRange: r.priceRange } : {}),
    ...(r.website ? { sameAs: r.website } : {}),
    ...(r.rating && r.reviewCount > 0 ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: r.rating.toFixed(1), reviewCount: r.reviewCount, bestRating: '5', worstRating: '1' },
    } : {}),
  }

  const iconBtn = 'flex flex-col items-center gap-1 text-[#B57F50] text-[11px] font-medium'
  const iconCircle = 'w-11 h-11 rounded-full bg-[#B57F50]/10 flex items-center justify-center hover:bg-[#B57F50]/20 transition-colors'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* App-shell split: scrollable details left, single-pin map right */}
        <div className="pt-16 flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)]">

          {/* ── LEFT: scrollable details panel ── */}
          <div className="w-full lg:w-[440px] xl:w-[480px] lg:shrink-0 lg:h-full lg:overflow-y-auto bg-white border-r border-black/8 order-2 lg:order-1">

            {/* Hero photo */}
            <div className="relative h-52 sm:h-60 bg-[#F5F4F0]">
              <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="480px" priority />
            </div>

            <div className="px-5 py-5">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#9B9490] mb-3 flex-wrap">
                <Link href="/" className="hover:text-[#B57F50] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${state}`} className="hover:text-[#B57F50] transition-colors">{r.state}</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${city}/${state}`} className="hover:text-[#B57F50] transition-colors">{r.city}</Link>
              </nav>

              {/* Name + meta */}
              <h1 className="font-serif text-2xl font-bold text-[#1E2026] leading-tight">{r.name}</h1>
              {(r.rating || r.reviewCount > 0) && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="font-bold text-[#1E2026] text-sm">{r.rating?.toFixed(1) ?? '—'}</span>
                  <StarRating rating={r.rating} />
                  <span className="text-[#6B6862] text-sm">({(r.reviewCount ?? 0).toLocaleString()})</span>
                  <Link href={`/reviews/${reviewSlug}`} className="text-xs text-[#B57F50] font-medium hover:underline">
                    Read reviews →
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1.5 text-sm text-[#6B6862] flex-wrap">
                <span>{category}</span>
                {r.priceRange && <><span className="text-[#9B9490]">·</span><span>{r.priceRange}</span></>}
                {r.businessStatus === 'OPERATIONAL' && (
                  <span className={`font-semibold ${openNow ? 'text-emerald-600' : 'text-red-500'}`}>
                    · {openNow ? 'Open now' : 'Closed'}
                  </span>
                )}
              </div>

              {/* Google-Maps-style action row */}
              <div className="flex items-center gap-5 mt-5 pb-5 border-b border-black/8">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={iconBtn}>
                  <span className={iconCircle}><Navigation2 className="w-5 h-5" /></span>
                  Directions
                </a>
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className={iconBtn}>
                    <span className={iconCircle}><Globe className="w-5 h-5" /></span>
                    Website
                  </a>
                )}
                {r.phone && (
                  <a href={`tel:${r.phone}`} className={iconBtn}>
                    <span className={iconCircle}><Phone className="w-5 h-5" /></span>
                    Call
                  </a>
                )}
                <ListingSaveButton slug={r.slug} restaurantName={r.name} />
                <Link href="/claim-your-listing" className={iconBtn}>
                  <span className={iconCircle}><Store className="w-5 h-5" /></span>
                  Claim
                </Link>
              </div>

              {/* Primary CTAs */}
              {(orderUrl || menuUrl) && (
                <div className="flex flex-col gap-2.5 mt-5">
                  {orderUrl && (
                    <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors">
                      <ShoppingBag className="w-4 h-4" /> Order Now
                    </a>
                  )}
                  {menuUrl && (
                    <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-white border-2 border-[#B57F50] text-[#B57F50] hover:bg-[#B57F50]/8 text-sm font-bold transition-colors">
                      <BookOpen className="w-4 h-4" /> View Full Menu
                    </a>
                  )}
                </div>
              )}

              {/* Contact & address */}
              <div className="mt-6 space-y-3.5">
                {r.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#B57F50] mt-0.5 shrink-0" />
                    <span className="text-[#4B4845] leading-snug">{r.address}</span>
                  </div>
                )}
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#B57F50] transition-colors">
                    <Phone className="w-4 h-4 text-[#B57F50] shrink-0" />
                    {r.phone}
                  </a>
                )}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#B57F50] transition-colors">
                    <Globe className="w-4 h-4 text-[#B57F50] shrink-0" />
                    <span className="truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 text-[#9B9490]" />
                  </a>
                )}
              </div>

              {/* Hours */}
              {r.hours && Object.keys(r.hours).length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/8">
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
                      const isToday = day === DOW[new Date().getDay()]
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

              {/* Features */}
              {features.length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <p className="text-sm font-bold text-[#1E2026] mb-3">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {features.map(a => (
                      <span key={a.label} className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-xs font-medium">
                        {a.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {aboutParas.length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <p className="text-sm font-bold text-[#1E2026] mb-3">About {r.name}</p>
                  <div className="space-y-3">
                    {aboutParas.map((p, i) => (
                      <p key={i} className="text-[#4B4845] leading-relaxed text-[13px]">{p}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Want More Reviews? — Google review card CTA */}
              <div className="mt-6 pt-5 border-t border-black/8">
                <Link
                  href={`/review-cards?restaurant=${encodeURIComponent(r.slug)}`}
                  className="flex items-center gap-3 rounded-xl border border-[#B57F50]/25 bg-[#B57F50]/8 px-4 py-3.5 hover:bg-[#B57F50]/14 transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-[#B57F50]/15 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5 text-[#B57F50]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#1E2026]">Want More Reviews?</span>
                    <span className="block text-xs text-[#6B6862]">Get a QR review card for {r.name}&apos;s tables</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#B57F50] shrink-0 ml-auto" />
                </Link>
              </div>

              {/* Share */}
              <div className="mt-6 pt-5 border-t border-black/8 flex items-center gap-3">
                <ShareButton title={r.name} url={url} />
              </div>

              {/* Nearby */}
              {nearby.length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <p className="text-sm font-bold text-[#1E2026] mb-3">More ramen in {r.city}</p>
                  <ul className="space-y-1">
                    {nearby.map((n) => (
                      <li key={n.slug}>
                        <Link href={`/${n.citySlug}/${n.stateSlug}/${n.slug}`} className="flex items-center justify-between gap-2 text-sm text-[#1E2026] hover:text-[#B57F50] py-1.5 transition-colors">
                          <span className="truncate">{n.name}</span>
                          {n.rating && (
                            <span className="flex items-center gap-1 text-xs text-[#6B6862] shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{n.rating.toFixed(1)}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${city}/${state}`} className="inline-block mt-3 text-sm text-[#B57F50] font-medium hover:underline">
                    See all ramen in {r.city}, {r.stateCode} →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: single-pin map ── */}
          <div className="w-full h-72 lg:h-full lg:flex-1 order-1 lg:order-2 relative">
            {r.latitude && r.longitude ? (
              <RestaurantMapPaneClient lat={r.latitude} lng={r.longitude} name={r.name} address={r.address} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0] text-[#9B9490] text-sm">
                Location not available
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
