import Link from 'next/link'
import {
  MapPin, Phone, Globe, Star, Clock, ChevronRight, ExternalLink,
  ShoppingBag, BookOpen, QrCode, BadgeCheck,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMapPaneClient from '@/components/restaurant-map-pane-client'
import ShareButton from '@/components/share-button'
import ListingActionRow from '@/components/listing-action-row'
import PageViewTracker from '@/components/page-view-tracker'
import SelfLinkPanel from '@/components/self-link-panel'
import OpenNowBadge from '@/components/open-now-badge'
import AdUnitAutorelaxed from '@/components/ad-unit-autorelaxed'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import AdUnitInFeed from '@/components/ad-unit-infeed'
import { expandDescription } from '@/lib/expand-description'
import { getReviewSlug, hasReviewPage, generateReviews, generateReviewSummary } from '@/lib/reviews'
import { jsonLdString } from '@/lib/json-ld'
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

function firstUrl(raw: unknown): string {
  if (!raw) return ''
  // Some scraped restaurants store this as an array of {name, url} objects
  // instead of a plain string — guard so those don't crash the page.
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (entry && typeof entry === 'object' && typeof (entry as { url?: unknown }).url === 'string') {
        return (entry as { url: string }).url
      }
      if (typeof entry === 'string') return entry
    }
    return ''
  }
  if (typeof raw !== 'string') return ''
  const m = raw.match(/https?:\/\/[^\s,]+/)
  return m ? m[0] : ''
}

// Converts the human-readable hours ("11:30AM-3PM") into schema.org
// OpeningHoursSpecification entries. Unparseable slots are skipped.
function hoursToSchema(hours: Record<string, string[]>): object[] {
  const specs: object[] = []
  for (const [day, slots] of Object.entries(hours)) {
    if (!slots || slots[0] === 'Closed') continue
    for (const slot of slots) {
      if (typeof slot !== 'string') continue
      const m = slot.match(/^(\d+(?::\d+)?)\s*(AM|PM)?\s*-\s*(\d+(?::\d+)?)\s*(AM|PM)$/i)
      if (!m) continue
      const [, sStr, sMer, eStr, eMer] = m
      const toMin = (t: string, mer: string | undefined): number => {
        const [h, mi] = t.split(':')
        let hh = parseInt(h); const mm = mi ? parseInt(mi) : 0
        const mer2 = mer?.toUpperCase()
        if (mer2 === 'PM' && hh !== 12) hh += 12
        else if (mer2 === 'AM' && hh === 12) hh = 0
        return hh * 60 + mm
      }
      const end = toMin(eStr, eMer)
      let sm = sMer
      if (!sm) { const sh = parseInt(sStr); sm = sh < 6 && Math.floor(end / 60) >= 12 ? 'PM' : 'AM' }
      const start = toMin(sStr, sm)
      const fmt = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${day}`,
        opens: fmt(start),
        closes: fmt(end),
      })
    }
  }
  return specs
}

interface Props {
  r: Restaurant
  city: string
  state: string
  nearby: Restaurant[]
  isVerified?: boolean
}

// Google-Maps-style single-restaurant listing: a scrollable details panel on
// the left, a single-pin map on the right. Mirrors the searchmap layout.
// Per-visitor owner state (manage button, self-link panel) resolves
// client-side so this page can be statically cached.
export default function RestaurantListingPage({ r, city, state, nearby, isVerified = false }: Props) {
  const url = `https://www.ramennearyou.com/${city}/${state}/${r.slug}`
  const category = (r.subtypes?.split(',')[0] ?? 'Ramen restaurant').trim()
  const menuUrl = r.menuLink?.trim() ?? ''
  const orderUrl = firstUrl(r.orderLinks)
  const directionsUrl = r.googleMapsLink
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`
  const about = expandDescription(r)
  const aboutParas = about ? about.split('\n\n').filter(Boolean) : []
  const reviewSlug = getReviewSlug(r)

  // Deterministic per-listing review digest — unique editorial copy for this
  // restaurant (same generator the /reviews pages use), so every listing
  // page carries substantive, listing-specific text beyond the raw facts.
  let dinersSay: { paragraph: string; pros: string[]; cons: string[] } | null = null
  if (r.rating && (r.reviewCount ?? 0) > 0) {
    try {
      dinersSay = generateReviewSummary(r, generateReviews(r))
    } catch {
      dinersSay = null
    }
  }

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
    ...(r.photo ? { image: r.photo } : {}),
    ...(r.latitude && r.longitude ? {
      geo: { '@type': 'GeoCoordinates', latitude: r.latitude, longitude: r.longitude },
      hasMap: directionsUrl,
    } : {}),
    ...(r.phone ? { telephone: r.phone } : {}),
    ...(r.priceRange ? { priceRange: r.priceRange } : {}),
    ...(r.website ? { sameAs: r.website } : {}),
    ...(menuUrl ? { menu: menuUrl } : {}),
    ...(r.amenities?.acceptsReservations != null ? { acceptsReservations: !!r.amenities.acceptsReservations } : {}),
    ...(r.hours && Object.keys(r.hours).length > 0 ? { openingHoursSpecification: hoursToSchema(r.hours) } : {}),
    ...(r.rating && r.reviewCount > 0 ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: r.rating.toFixed(1), reviewCount: r.reviewCount, bestRating: '5', worstRating: '1' },
    } : {}),
  }


  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }} />
      {/* Records one page view per browser session for owner analytics */}
      <PageViewTracker slug={r.slug} />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* App-shell split: scrollable details left, single-pin map right */}
        {/* The navbar is fixed (out of flow) — this div's own pt-16 clears
            it, and doesn't need extra height. The promo banner, when shown,
            IS in flow and already pushes this div down via body's own
            padding-top, so the div's height only needs to shrink by that
            banner offset, not by the full --total-header-h (which also
            includes the navbar and would double-count it, leaving a gap at
            the bottom of the map pane). --total-header-h minus the fixed
            navbar height isolates just the banner's contribution. */}
        <div className="pt-16 flex flex-col lg:flex-row lg:h-[calc(100dvh-var(--total-header-h,4rem)+4rem)]">

          {/* ── LEFT: scrollable details panel ── */}
          <div className="w-full lg:w-[440px] xl:w-[480px] lg:shrink-0 lg:h-full lg:overflow-y-auto bg-white border-r border-black/8 order-2 lg:order-1">

            {/* Hero photo */}
            <div className="relative h-52 sm:h-60 bg-[#F5F4F0]">
              <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="480px" priority />
            </div>

            <div className="px-5 py-5">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-3 flex-wrap">
                <Link href="/" className="hover:text-[#96602F] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${state}`} className="hover:text-[#96602F] transition-colors">{r.state}</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${city}/${state}`} className="hover:text-[#96602F] transition-colors">{r.city}</Link>
              </nav>

              {/* Ad-free listing pages are a claim benefit — no ads once verified. */}
              {!isVerified && (
                <div className="mb-3">
                  <AdUnitInFeed />
                </div>
              )}

              {/* Name + meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl font-bold text-[#1E2026] leading-tight">{r.name}</h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-xs font-semibold shrink-0">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              {(r.rating || r.reviewCount > 0) && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="font-bold text-[#1E2026] text-sm">{r.rating?.toFixed(1) ?? '—'}</span>
                  <StarRating rating={r.rating} />
                  <span className="text-[#6B6862] text-sm">({(r.reviewCount ?? 0).toLocaleString()})</span>
                  {hasReviewPage(reviewSlug) && (
                    <Link href={`/reviews/${reviewSlug}`} className="text-xs text-[#96602F] font-medium hover:underline">
                      Read reviews →
                    </Link>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1.5 text-sm text-[#6B6862] flex-wrap">
                <span>{category}</span>
                {r.priceRange && <><span className="text-[#6B6862]">·</span><span>{r.priceRange}</span></>}
                {r.businessStatus === 'OPERATIONAL' && (
                  <OpenNowBadge hours={r.hours} variant="inline" />
                )}
              </div>

              {/* Google-Maps-style action row — scrolls horizontally on narrow
                  screens so all six actions stay reachable without clipping.
                  Directions/Website/Call/Save/Claim require a login (client
                  component so it can check auth state and gate each click). */}
              <ListingActionRow
                slug={r.slug}
                restaurantName={r.name}
                city={city}
                state={state}
                displayCity={r.city}
                stateCode={r.stateCode}
                directionsUrl={directionsUrl}
                website={r.website ?? ''}
                phone={r.phone ?? ''}
                menuUrl={menuUrl}
                isVerified={isVerified}
              />

              {/* Self-link: logged-in user's email matches the approved claim
                  but their account isn't connected to it yet (client-side) */}
              <SelfLinkPanel slug={r.slug} restaurantName={r.name} />

              {/* Primary CTAs */}
              {(orderUrl || menuUrl) && (
                <div className="flex flex-col gap-2.5 mt-5">
                  {orderUrl && (
                    <>
                      {!isVerified && <AdUnitAutorelaxed />}
                      <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Order Now
                      </a>
                    </>
                  )}
                  {menuUrl && (
                    <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-white border-2 border-[#B57F50] text-[#96602F] hover:bg-[#B57F50]/8 text-sm font-bold transition-colors">
                      <BookOpen className="w-4 h-4" /> View Full Menu
                    </a>
                  )}
                </div>
              )}

              {/* Contact & address */}
              <div className="mt-6 space-y-3.5">
                {r.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#96602F] mt-0.5 shrink-0" />
                    <span className="text-[#4B4845] leading-snug">{r.address}</span>
                  </div>
                )}
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#96602F] transition-colors">
                    <Phone className="w-4 h-4 text-[#96602F] shrink-0" />
                    {r.phone}
                  </a>
                )}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#4B4845] hover:text-[#96602F] transition-colors">
                    <Globe className="w-4 h-4 text-[#96602F] shrink-0" />
                    <span className="truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 text-[#6B6862]" />
                  </a>
                )}
              </div>

              {/* Hours */}
              {r.hours && Object.keys(r.hours).length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-[#96602F] shrink-0" />
                    <span className="text-sm font-bold text-[#1E2026]">Hours</span>
                    {r.businessStatus === 'OPERATIONAL' && (
                      <OpenNowBadge hours={r.hours} variant="pill" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {DAY_ORDER.map((day) => {
                      const slots = r.hours?.[day]
                      const isToday = day === DOW[new Date().getDay()]
                      return (
                        <div key={day} className={`flex justify-between gap-2 text-xs py-0.5 rounded px-1 ${isToday ? 'bg-[#B57F50]/8 -mx-1' : ''}`}>
                          <span className={`font-semibold w-24 shrink-0 ${isToday ? 'text-[#96602F]' : 'text-[#1E2026]'}`}>{day}</span>
                          <span className={`text-right ${!slots || slots[0] === 'Closed' ? 'text-red-400' : isToday ? 'text-[#96602F]' : 'text-[#6B6862]'}`}>
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
                      <div key={i}>
                        <p className="text-[#4B4845] leading-relaxed text-[13px]">{p}</p>
                        {i === 0 && !isVerified && <div className="mt-3"><AdUnitInArticle /></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What diners say — per-listing review digest, unique to this
                  restaurant, with a link to the full review page */}
              {dinersSay && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <p className="text-sm font-bold text-[#1E2026] mb-3">What Diners Say</p>
                  <p className="text-[#4B4845] leading-relaxed text-[13px] mb-3">{dinersSay.paragraph}</p>
                  {dinersSay.pros.length > 0 && (
                    <ul className="space-y-1.5 mb-3">
                      {dinersSay.pros.slice(0, 3).map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[13px] text-[#4B4845]">
                          <span className="text-emerald-500 shrink-0 mt-px">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {hasReviewPage(reviewSlug) && (
                    <Link href={`/reviews/${reviewSlug}`} className="text-xs text-[#96602F] font-medium hover:underline">
                      Read the full {r.name} review breakdown →
                    </Link>
                  )}
                </div>
              )}

              {/* Own this business? — claim-value strip on unclaimed listings.
                  Verified listings show the badge instead; this is the
                  owner-facing pitch for everything still unclaimed. */}
              {!isVerified && (
                <div className="mt-6 pt-5 border-t border-black/8">
                  <div className="rounded-xl border border-[#B57F50]/30 bg-gradient-to-br from-[#B57F50]/8 to-[#B57F50]/14 p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#96602F]" />
                      <p className="text-sm font-bold text-[#1E2026]">Own {r.name}?</p>
                    </div>
                    <p className="text-xs text-[#6B6862] leading-relaxed mb-3">
                      This listing hasn&apos;t been claimed yet. Claiming is completely free — create an
                      account, submit your claim, and once our team verifies ownership you&apos;re in control.
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {[
                        '100% free — no card required, just a quick ownership review',
                        'Verified badge on this page and the search map',
                        'Update hours, photos, menu, and description anytime',
                        'Ad-free listing page (no ads on your dedicated listing page)',
                      ].map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-[#1E2026]">
                          <span className="text-[#96602F] shrink-0">✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/claim/${city}/${state}/${r.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
                    >
                      Claim This Listing — Free
                    </Link>
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
                    <QrCode className="w-5 h-5 text-[#96602F]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#1E2026]">Want More Reviews?</span>
                    <span className="block text-xs text-[#6B6862]">Get a QR review card for {r.name}&apos;s tables</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#96602F] shrink-0 ml-auto" />
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
                        <Link href={`/${n.citySlug}/${n.stateSlug}/${n.slug}`} className="flex items-center justify-between gap-2 text-sm text-[#1E2026] hover:text-[#96602F] py-1.5 transition-colors">
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
                  <Link href={`/${city}/${state}`} className="inline-block mt-3 text-sm text-[#96602F] font-medium hover:underline">
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
              <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0] text-[#6B6862] text-sm">
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
