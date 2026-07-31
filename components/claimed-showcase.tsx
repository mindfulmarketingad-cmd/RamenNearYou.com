import Link from 'next/link'
import RestaurantImage from '@/components/restaurant-image'
import {
  BadgeCheck, MapPin, Star, ChevronRight,
  Utensils, Bike, ShoppingBag, Leaf, Users, Wine, Accessibility, ParkingCircle, Sun,
} from 'lucide-react'
import { getRestaurantBySlug, type Restaurant } from '@/lib/restaurants'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'
import { priceRangeLabel } from '@/lib/ramen-taxonomy'

// Real amenity flags -> a small line-icon each, reusing the restaurant's own
// `amenities` data (nothing fabricated) so the row only ever shows what the
// listing actually offers.
const AMENITY_ICONS: { key: keyof Restaurant['amenities']; label: string; Icon: typeof Utensils }[] = [
  { key: 'dineIn', label: 'Dine-in', Icon: Utensils },
  { key: 'delivery', label: 'Delivery', Icon: Bike },
  { key: 'takeout', label: 'Takeout', Icon: ShoppingBag },
  { key: 'vegetarianOptions', label: 'Vegetarian Options', Icon: Leaf },
  { key: 'familyFriendly', label: 'Family-Friendly', Icon: Users },
  { key: 'alcohol', label: 'Full Bar', Icon: Wine },
  { key: 'outdoorSeating', label: 'Outdoor Seating', Icon: Sun },
  { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', Icon: Accessibility },
  { key: 'parking', label: 'Parking', Icon: ParkingCircle },
]

// Homepage showcase for claimed/verified listings — pulled live from whatever
// restaurants actually have an approved claim (getAllVerifiedSlugs), so it
// stays correct as more owners claim their listing instead of needing another
// code change. Renders nothing if no restaurant is currently claimed.
export default async function ClaimedShowcase() {
  const verifiedSlugs = await getAllVerifiedSlugs()
  const restaurants = [...verifiedSlugs]
    .map((slug) => getRestaurantBySlug(slug))
    .filter((r): r is Restaurant => r != null)

  if (restaurants.length === 0) return null

  return (
    <section className="bg-[#F5F4F0] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">Verified &amp; Claimed</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">
            Restaurants Owned by Real People
          </h2>
          {/* Small wave-style underline flourish, echoing the "authority
              publication" feel used elsewhere on the site. */}
          <svg width="88" height="12" viewBox="0 0 88 12" fill="none" className="mx-auto mt-3" aria-hidden="true">
            <path d="M2 8c6-8 12-8 18 0s12 8 18 0 12-8 18 0 12 8 18 0" stroke="#B57F50" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[#6B6862] text-sm max-w-xl mx-auto mt-4">
            These owners claimed their free listing to keep their hours, photos, and details accurate —
            look for the verified badge on any restaurant page.
          </p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-warm-lg">
          {restaurants.map((r, i) => {
            const href = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
            const priceLabel = priceRangeLabel(r.priceRange)
            const activeAmenities = AMENITY_ICONS.filter(({ key }) => r.amenities?.[key])

            const photo = (
              <div className="relative w-full h-64 sm:h-full min-h-[280px] bg-[#ECEAE4]">
                <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            )

            const details = (
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">{r.name}</h3>
                  <span title="Verified owner" className="shrink-0">
                    <BadgeCheck className="w-5 h-5 text-[#2563eb]" />
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-[#6B6862] text-xs font-semibold uppercase tracking-widest mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#96602F]" />
                  {r.city}, {r.stateCode}
                </p>

                {(r.rating != null || priceLabel) && (
                  <div className="flex items-center gap-3 mb-4 text-sm text-[#1E2026]">
                    {r.rating != null && (
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {r.rating.toFixed(1)}
                        <span className="text-[#6B6862] font-normal">({r.reviewCount.toLocaleString()})</span>
                      </span>
                    )}
                    {priceLabel && <span className="text-[#6B6862]">{priceLabel}</span>}
                  </div>
                )}

                {activeAmenities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    {activeAmenities.slice(0, 6).map(({ key, label, Icon }) => (
                      <span key={key} title={label} className="w-9 h-9 rounded-full bg-[#B57F50]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#96602F]" />
                      </span>
                    ))}
                  </div>
                )}

                {r.description && (
                  <p className="text-[#6B6862] text-sm leading-relaxed mb-6">{r.description}</p>
                )}

                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 self-start px-5 py-2.5 rounded-none bg-[#1E2026] hover:bg-black text-white text-sm font-semibold transition-colors"
                >
                  View Listing <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )

            return (
              <div key={r.slug} className="grid grid-cols-1 sm:grid-cols-2">
                {/* Checkerboard: even rows show photo first, odd rows flip it
                    to the other side via order utilities (desktop only —
                    mobile always stacks photo above details). */}
                <div className={i % 2 === 1 ? 'sm:order-2' : ''}>{photo}</div>
                <div className={i % 2 === 1 ? 'sm:order-1' : ''}>{details}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
