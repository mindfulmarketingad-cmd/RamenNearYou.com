import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Phone, Globe, Star, Clock, ChevronRight,
  Utensils, ExternalLink
} from 'lucide-react'
import { getRestaurant, getRestaurantsByCity, getCities, type Restaurant } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export async function generateStaticParams() {
  return getCities().flatMap((c) =>
    getRestaurantsByCity(c.citySlug, c.stateSlug).map((r) => ({
      city: c.citySlug,
      state: c.stateSlug,
      restaurant: r.slug,
    }))
  )
}

export async function generateMetadata({ params }: { params: { city: string; state: string; restaurant: string } }) {
  const r = getRestaurant(params.city, params.state, params.restaurant)
  if (!r) return {}
  return {
    title: `${r.name} — Ramen in ${r.city}, ${r.stateCode} | RamenNearYou`,
    description: r.description || `${r.name} is a ramen restaurant in ${r.city}, ${r.stateCode}. ${r.rating ? `Rated ${r.rating}/5` : ''} with ${r.reviewCount} reviews.`,
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
        <Star key={i} className={`${cls} ${i <= full ? 'text-amber-400 fill-amber-400' : i === full+1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-white/20'}`} />
      ))}
    </span>
  )
}

function AmenityBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-[#77567A]/15 text-[#77567A]' : 'bg-white/5 text-[#B0B3BB]/50 line-through'}`}>
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#77567A]' : 'bg-white/20'}`} />
      {label}
    </div>
  )
}

export default function RestaurantPage({ params }: { params: { city: string; state: string; restaurant: string } }) {
  const r = getRestaurant(params.city, params.state, params.restaurant)
  if (!r) notFound()

  const totalReviews = Object.values(r.reviewsPerScore).reduce((a, b) => a + Number(b), 0)

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      {/* Hero photo */}
      <div className="relative w-full h-64 sm:h-80 bg-[#1E2026] mt-16">
        {r.photo ? (
          <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-16 h-16 text-[#77567A]/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2026] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#B0B3BB] mb-6 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${params.city}/${params.state}`} className="hover:text-white transition-colors">
            {r.city}, {r.stateCode}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{r.name}</span>
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
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">{r.priceRange}</span>
                )}
                {r.subtypes && r.subtypes.split(',').slice(0, 2).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-[#77567A]/15 text-[#77567A] text-xs">{s.trim()}</span>
                ))}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">{r.name}</h1>
              {(r.rating || r.reviewCount > 0) && (
                <div className="flex items-center gap-3">
                  <StarRating rating={r.rating} />
                  <span className="text-white font-semibold">{r.rating?.toFixed(1)}</span>
                  <span className="text-[#B0B3BB] text-sm">({r.reviewCount.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>

            {/* Description */}
            {r.description && (
              <section>
                <h2 className="font-serif text-xl font-bold text-white mb-3">About</h2>
                <p className="text-[#B0B3BB] leading-relaxed">{r.description}</p>
              </section>
            )}

            {/* Hours */}
            {Object.keys(r.hours).length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#77567A]" />
                  Hours
                </h2>
                <div className="bg-[#1E2026] rounded-xl border border-white/5 overflow-hidden">
                  {DAY_ORDER.map((day) => {
                    const slots = r.hours[day]
                    return (
                      <div key={day} className="flex justify-between items-center px-5 py-3 border-b border-white/5 last:border-0">
                        <span className="text-white text-sm font-medium w-28">{day}</span>
                        <span className="text-[#B0B3BB] text-sm text-right">
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
              <h2 className="font-serif text-xl font-bold text-white mb-4">Amenities &amp; Features</h2>
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

            {/* Review breakdown */}
            {totalReviews > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-white mb-4">Rating Breakdown</h2>
                <div className="bg-[#1E2026] rounded-xl border border-white/5 p-5 space-y-3">
                  {[5,4,3,2,1].map((score) => {
                    const count = Number(r.reviewsPerScore[String(score)] ?? 0)
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="text-[#B0B3BB] text-xs w-4 text-right">{score}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[#B0B3BB] text-xs w-8">{count}</span>
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
            <div className="bg-[#1E2026] rounded-xl border border-white/5 p-6 space-y-4">
              <h3 className="font-semibold text-white">Contact &amp; Location</h3>
              {r.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#77567A] mt-0.5 shrink-0" />
                  <span className="text-[#B0B3BB]">{r.address}</span>
                </div>
              )}
              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-3 text-sm text-[#B0B3BB] hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#77567A] shrink-0" />
                  {r.phone}
                </a>
              )}
              {r.website && (
                <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#B0B3BB] hover:text-white transition-colors">
                  <Globe className="w-4 h-4 text-[#77567A] shrink-0" />
                  <span className="truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
              {r.googleMapsLink && (
                <a href={r.googleMapsLink} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors">
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              )}
              {r.menuLink && (
                <a href={r.menuLink} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#77567A] text-[#77567A] text-sm font-medium hover:bg-[#77567A]/10 transition-colors">
                  <Utensils className="w-4 h-4" />
                  View Menu
                </a>
              )}
            </div>

            {/* Claim listing CTA */}
            <div className="bg-gradient-to-br from-[#77567A]/20 to-[#1E2026] rounded-xl border border-[#77567A]/30 p-6 space-y-3">
              <h3 className="font-semibold text-white">Own this restaurant?</h3>
              <p className="text-[#B0B3BB] text-sm leading-relaxed">
                Claim your free listing to add photos, update your hours, and reach more ramen lovers.
              </p>
              <button className="w-full px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors">
                Claim This Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
