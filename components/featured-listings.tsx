import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Crown, ChevronRight, Utensils } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase-admin'

type FeaturedListing = {
  id: string
  restaurant_name: string
  city: string
  state_code: string
  address: string
  phone: string | null
  website: string | null
  description: string | null
  photos: string[]
  restaurant_slug: string | null
}

// Active featured listings, read once at build time — the page is static, so
// a newly activated listing shows up on the next deploy.
async function getFeaturedListings(): Promise<FeaturedListing[]> {
  const admin = createAdminClient()
  if (!admin) return []
  const { data, error } = await admin
    .from('featured_listings')
    .select('*')
    .eq('status', 'active')
    .order('featured_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(8)
  if (error) console.error('[featured-listings] query failed, building without them:', error.message)
  return (data as FeaturedListing[] | null) ?? []
}

export default async function FeaturedListings() {
  const listings = await getFeaturedListings()

  if (listings.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-brand-ink text-xs font-medium uppercase tracking-widest mb-2">Featured Listings</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Top Ramen Spots Near You
            </h2>
          </div>
          <Link
            href="/featured-listing"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-brand/40 text-brand-ink text-sm font-medium rounded-lg hover:bg-brand/5 transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            Get Featured
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => {
            const href = listing.restaurant_slug
              ? `/${listing.city.toLowerCase().replace(/\s+/g, '-')}/${listing.state_code.toLowerCase()}/${listing.restaurant_slug}`
              : listing.website || '#'
            const isExternal = !listing.restaurant_slug

            return (
              <article
                key={listing.id}
                className="bg-sunken rounded-xl overflow-hidden border border-line/5"
              >
                <div className="relative h-48 bg-page">
                  {listing.photos[0] ? (
                    <Image
                      src={listing.photos[0]}
                      alt={listing.restaurant_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-brand-ink/25" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand text-white text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Featured
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-ink text-base leading-snug mb-1">
                    {listing.restaurant_name}
                  </h3>
                  <p className="flex items-center gap-1 text-ink-soft text-xs mb-2">
                    <MapPin className="w-3 h-3 text-brand-ink shrink-0" />
                    {listing.city}, {listing.state_code}
                  </p>
                  {listing.description && (
                    <p className="text-ink-soft text-xs leading-relaxed line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                  )}
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2 border border-brand/30 text-brand-ink text-xs font-medium rounded-lg hover:bg-brand/5 transition-colors"
                    >
                      Visit Website <ChevronRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="flex items-center justify-center gap-1.5 w-full py-2 border border-brand/30 text-brand-ink text-xs font-medium rounded-lg hover:bg-brand/5 transition-colors"
                    >
                      View Listing <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
