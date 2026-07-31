import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Star, MapPin, Phone, Globe, Navigation, UtensilsCrossed, CalendarCheck,
  Clock, ChevronRight, BadgeCheck, Images,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import AdUnit from '@/components/ad-unit'
import { getPhoBySlug, getAllPhoSlugs, getNearbyPho, getActiveAmenityGroups, phoRestaurants, phoCityParam } from '@/lib/pho'
import { buildPhoSections } from '@/lib/pho-content'
import { getOpenStatus } from '@/lib/hours'
import { jsonLdString } from '@/lib/json-ld'
import { STATE_CODE_TO_SLUG } from '@/lib/state-lookups'
import { createAdminClient } from '@/lib/supabase-admin'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SITE = 'https://www.ramennearyou.com'

export async function generateStaticParams() {
  return getAllPhoSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = getPhoBySlug(slug)
  if (!p) return {}

  const title = `${p.name} — Pho Restaurant in ${p.city}, ${p.stateCode}`
  const rating = p.rating != null ? `Rated ${p.rating.toFixed(1)} stars from ${p.reviewCount.toLocaleString()} reviews. ` : ''
  const description = `${p.name} is a pho restaurant at ${p.street || p.address}, ${p.city}, ${p.stateCode}. ${rating}Hours, menu, photos, directions, and what to order.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/partners/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/partners/${p.slug}`,
      siteName: 'RamenNearYou',
      type: 'website',
      images: p.photo ? [{ url: p.photo }] : undefined,
    },
  }
}

export default async function PhoPartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getPhoBySlug(slug)
  if (!p) notFound()

  const stateSlug = STATE_CODE_TO_SLUG[p.stateCode]
  const sections = buildPhoSections(p)
  const nearby = getNearbyPho(p, 8)
  const amenityGroups = getActiveAmenityGroups(p)
  const openStatus = p.hours ? getOpenStatus(p.hours) : null
  const sameCityCount = phoRestaurants.filter(o => o.citySlug === p.citySlug && o.stateCode === p.stateCode).length

  // Claimed-on-RamenNearYou status, same claims-table lookup the ramen
  // listing page uses. Distinct from p.verified, which just reflects whether
  // the business's own Google profile is verified — nearly every active
  // Google listing has that, so it can't gate the claim CTA.
  let isClaimed = false
  const admin = createAdminClient()
  if (admin) {
    const { data: claim } = await admin
      .from('claims')
      .select('id')
      .eq('restaurant_slug', p.slug)
      .eq('status', 'approved')
      .limit(1)
      .maybeSingle()
    isClaimed = !!claim
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address || `${p.name} ${p.city} ${p.stateCode}`)}${p.placeId ? `&destination_place_id=${p.placeId}` : ''}`
  const photosUrl = p.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${p.placeId}`
    : p.googleMapsLink

  const rps = p.reviewsPerScore
  const rpsTotal = rps ? Object.values(rps).reduce((a, b) => a + b, 0) : 0

  // Restaurant schema — only fields we genuinely have are emitted.
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: p.name,
    servesCuisine: 'Vietnamese',
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.street || undefined,
      addressLocality: p.city,
      addressRegion: p.stateCode,
      postalCode: p.postalCode || undefined,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude },
    url: `${SITE}/partners/${p.slug}`,
  }
  if (p.phone) schema.telephone = p.phone
  if (p.website) schema.sameAs = [p.website]
  if (p.photo) schema.image = p.photo
  if (p.description) schema.description = p.description
  if (p.menuLink) schema.hasMenu = p.menuLink
  if (p.rating != null && p.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }
  if (p.hours) {
    const spec = DAYS.flatMap(day => {
      const slots = p.hours![day]
      if (!slots || slots.some(s => /closed/i.test(s))) return []
      return slots.map(s => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${day}`, description: s }))
    })
    if (spec.length) schema.openingHoursSpecification = spec
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Partners', item: `${SITE}/partners` },
      { '@type': 'ListItem', position: 3, name: p.name, item: `${SITE}/partners/${p.slug}` },
    ],
  }

  const actions: Array<{ href: string; label: string; Icon: typeof MapPin; primary?: boolean }> = [
    { href: directionsUrl, label: 'Directions', Icon: Navigation, primary: true },
  ]
  if (p.phone) actions.push({ href: `tel:${p.phone.replace(/[^\d+]/g, '')}`, label: 'Call', Icon: Phone })
  if (p.website) actions.push({ href: p.website, label: 'Website', Icon: Globe })
  if (p.menuLink) actions.push({ href: p.menuLink, label: 'Menu', Icon: UtensilsCrossed })
  if (p.orderLinks) actions.push({ href: p.orderLinks, label: 'Order Online', Icon: UtensilsCrossed })
  if (p.reservationLinks) actions.push({ href: p.reservationLinks, label: 'Reserve', Icon: CalendarCheck })
  if (photosUrl) actions.push({ href: photosUrl, label: 'Photos', Icon: Images })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema) }} />
      <main className="min-h-screen bg-[#F5F4F0]">
        <Navbar />

        <div className="pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:items-start">
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-5">
                <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/partners" className="hover:text-[#96602F] transition-colors">Partners</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#1E2026]">{p.name}</span>
              </nav>

              {/* Hero */}
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-warm mb-6">
                <div className="relative w-full h-56 sm:h-72 bg-[#ECEAE4]">
                  <RestaurantImage src={p.photo} alt={`${p.name} — pho restaurant in ${p.city}, ${p.stateCode}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 700px" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16a34a] text-white text-[11px] font-bold uppercase tracking-wide shadow">
                    🍲 Pho
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">{p.name}</h1>
                    {p.verified && (
                      <span title="Verified on Google" className="mt-1.5">
                        <BadgeCheck className="w-5 h-5 text-[#2563eb]" />
                      </span>
                    )}
                  </div>

                  <p className="flex items-center gap-1.5 text-[#6B6862] text-sm mb-3">
                    <MapPin className="w-4 h-4 text-[#96602F] shrink-0" />
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#96602F] hover:underline">
                      {p.address || `${p.street}, ${p.city}, ${p.stateCode}`}
                    </a>
                  </p>

                  <div className="flex items-center gap-3 flex-wrap text-sm mb-5">
                    {p.rating != null && (
                      <span className="flex items-center gap-1 font-semibold text-[#1E2026]">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {p.rating.toFixed(1)}
                        <span className="text-[#6B6862] font-normal">({p.reviewCount.toLocaleString()} reviews)</span>
                      </span>
                    )}
                    {openStatus && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          openStatus.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : openStatus.status === 'closing-soon'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {openStatus.status === 'open'
                          ? `Open · closes ${openStatus.closesAt}`
                          : openStatus.status === 'closing-soon'
                            ? `Closing soon · ${openStatus.closesAt}`
                            : 'Closed now'}
                      </span>
                    )}
                    {p.type && <span className="text-[#6B6862]">{p.type}</span>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {actions.map(({ href, label, Icon, primary }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('tel:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          primary
                            ? 'bg-[#1E2026] hover:bg-black text-white'
                            : 'bg-[#F5F4F0] hover:bg-[#ECEAE4] text-[#1E2026] border border-black/8'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6"><AdUnitInArticle /></div>

              {/* Hours + rating breakdown */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {p.hours && (
                  <div className="bg-white rounded-2xl border border-black/5 p-6">
                    <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-3">Hours</h2>
                    <table className="w-full text-sm">
                      <tbody>
                        {DAYS.map(day => {
                          const slots = p.hours![day]
                          const closed = !slots || slots.some(s => /closed/i.test(s))
                          return (
                            <tr key={day} className="border-b border-black/5 last:border-0">
                              <th scope="row" className="text-left py-1.5 font-medium text-[#1E2026] w-28">{day}</th>
                              <td className={`py-1.5 text-right ${closed ? 'text-[#6B6862]' : 'text-[#1E2026]'}`}>
                                {closed ? 'Closed' : slots!.join(', ')}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    {p.typicalTimeSpent && (
                      <p className="text-xs text-[#6B6862] mt-3">{p.typicalTimeSpent}</p>
                    )}
                  </div>
                )}

                {rps && rpsTotal > 0 && (
                  <div className="bg-white rounded-2xl border border-black/5 p-6">
                    <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-3">Rating Breakdown</h2>
                    <div className="space-y-1.5">
                      {['5', '4', '3', '2', '1'].map(star => {
                        const n = rps[star] ?? 0
                        const w = rpsTotal > 0 ? (n / rpsTotal) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-6 text-[#6B6862] tabular-nums">{star}★</span>
                            <div className="flex-1 h-2 rounded-full bg-[#ECEAE4] overflow-hidden">
                              <div className="h-full rounded-full bg-[#B57F50]" style={{ width: `${w}%` }} />
                            </div>
                            <span className="w-16 text-right text-[#6B6862] tabular-nums">{n.toLocaleString()}</span>
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-[#6B6862] mt-3">
                      Based on {rpsTotal.toLocaleString()} rated Google reviews.
                    </p>
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
                <div className="h-64">
                  <RestaurantMiniMapClient
                    lat={p.latitude}
                    lng={p.longitude}
                    name={p.name}
                    address={p.address}
                    directionsUrl={directionsUrl}
                  />
                </div>
              </div>

              {/* Amenities */}
              {amenityGroups.length > 0 && (
                <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-6">
                  <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">Features &amp; Amenities</h2>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    {amenityGroups.map(g => (
                      <div key={g.group}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#96602F] mb-2">{g.group}</p>
                        <ul className="space-y-1">
                          {g.items.map(i => (
                            <li key={i.key} className="flex items-start gap-2 text-sm text-[#1E2026]">
                              <span className="text-[#16a34a] mt-0.5 shrink-0">✓</span>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#6B6862] mt-5">
                    Amenities come from this restaurant&apos;s Google Business Profile. Only attributes the
                    business actually lists are shown — nothing is assumed.
                  </p>
                </div>
              )}

              {/* Own this business? — same claim-value strip as ramen listings,
                  linked through the shared /claim/{city}/{state}/{slug} flow. */}
              {!isClaimed && (
                <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-6">
                  <div className="rounded-xl border border-[#B57F50]/30 bg-gradient-to-br from-[#B57F50]/8 to-[#B57F50]/14 p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#96602F]" />
                      <p className="text-sm font-bold text-[#1E2026]">Own {p.name}?</p>
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
                      href={`/claim/${p.citySlug}/${stateSlug ?? p.stateCode.toLowerCase()}/${p.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
                    >
                      Claim This Listing — Free
                    </Link>
                  </div>
                </div>
              )}

              {/* Long-form editorial */}
              <article className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-6">
                {sections.map((s, i) => (
                  <section key={s.id} id={s.id} className={i > 0 ? 'mt-8' : ''}>
                    <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">{s.heading}</h2>
                    {s.paragraphs.map((html, j) => (
                      <p
                        key={j}
                        className="text-[#3F3D39] text-[15px] leading-relaxed mb-3.5"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    ))}
                    {i === 1 && <div className="my-6"><AdUnitInArticle /></div>}
                  </section>
                ))}
              </article>

              {/* Nearby pho */}
              {nearby.length > 0 && (
                <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-6">
                  <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">More Pho Near {p.city}</h2>
                  <p className="text-[#6B6862] text-sm mb-5">
                    Other pho restaurants within about 40 miles, closest first.
                  </p>
                  <div className="space-y-3">
                    {nearby.map(o => (
                      <Link
                        key={o.slug}
                        href={`/partners/${o.slug}`}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF9] border border-black/8 hover:border-[#B57F50]/40 transition-colors group"
                      >
                        <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ECEAE4]">
                          <RestaurantImage src={o.photo} alt={o.name} fill className="object-cover" sizes="56px" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">{o.name}</p>
                          <p className="text-xs text-[#6B6862] mt-0.5 truncate">{o.city}, {o.stateCode} · {o.distanceMiles.toFixed(1)} mi</p>
                          {o.rating != null && (
                            <span className="flex items-center gap-0.5 text-xs text-[#6B6862] mt-1">
                              <Star className="w-3 h-3 fill-[#B57F50] text-[#96602F]" />
                              {o.rating.toFixed(1)}
                              {o.reviewCount > 0 && <span> ({o.reviewCount.toLocaleString()})</span>}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-links */}
              <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">Keep Exploring</h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Link href="/partners" className="text-[#96602F] hover:underline">All partner restaurants</Link>
                  <Link href={`/find/${phoCityParam(p.citySlug, p.stateCode)}`} className="text-[#96602F] hover:underline">
                    Pho in {p.city}, {p.stateCode}
                  </Link>
                  <Link href="/find/pho-restaurants" className="text-[#96602F] hover:underline">All pho restaurants</Link>
                  <Link href="/find" className="text-[#96602F] hover:underline">Search map</Link>
                  <Link href={`/find/${p.citySlug}-${p.stateCode.toLowerCase()}`} className="text-[#96602F] hover:underline">
                    Ramen in {p.city}, {p.stateCode}
                  </Link>
                  {stateSlug && (
                    <Link href={`/${stateSlug}`} className="text-[#96602F] hover:underline">
                      Ramen in {p.state}
                    </Link>
                  )}
                  <Link href="/blog/is-ramen-healthier-than-pasta" className="text-[#96602F] hover:underline">Is ramen healthier than pasta?</Link>
                  <Link href="/blog/what-are-the-healthiest-noodles-you-can-eat" className="text-[#96602F] hover:underline">Healthiest noodles</Link>
                </div>
                {sameCityCount > 1 && (
                  <p className="text-[#6B6862] text-sm mt-4">
                    We list {sameCityCount} pho restaurants in {p.city}. Browse them all on the{' '}
                    <Link href="/partners" className="text-[#96602F] hover:underline">partners directory</Link>.
                  </p>
                )}
              </div>
            </div>

            {/* Side rail */}
            <aside className="hidden lg:block sticky top-24 w-[300px] shrink-0 space-y-6 self-start">
              <div className="min-h-[250px]"><AdUnit /></div>
              <div className="min-h-[600px]"><AdUnit /></div>
            </aside>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
