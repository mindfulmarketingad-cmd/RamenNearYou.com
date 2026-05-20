'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Crown, ChevronRight, Utensils } from 'lucide-react'

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

export default function FeaturedListings() {
  const [listings, setListings] = useState<FeaturedListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/featured')
      .then(r => r.json())
      .then(({ listings }) => setListings(listings ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading || listings.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">Featured Listings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">
              Top Ramen Spots Near You
            </h2>
          </div>
          <Link
            href="/featured/apply"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium rounded-lg transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            Get Featured
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => {
            const href = listing.restaurant_slug
              ? `/${listing.city.toLowerCase().replace(/\s+/g, '-')}/${listing.state_code.toLowerCase()}/${listing.restaurant_slug}`
              : listing.website || '#'
            const isExternal = !listing.restaurant_slug

            return (
              <article
                key={listing.id}
                className="group bg-[#F5F4F0] rounded-2xl overflow-hidden border border-black/5 hover:border-amber-500/30 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-48 bg-[#ffffff] overflow-hidden">
                  {listing.photos[0] ? (
                    <Image
                      src={listing.photos[0]}
                      alt={listing.restaurant_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils className="w-10 h-10 text-[#B57F50]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F5F4F0]/80 to-transparent" />
                  {/* Photo count dots */}
                  {listing.photos.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {listing.photos.slice(0, 5).map((_, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-[#F5F4F0] text-xs font-bold">
                    <Crown className="w-3 h-3" />
                    Featured
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#1E2026] text-base leading-snug mb-1 group-hover:text-amber-400 transition-colors">
                    {listing.restaurant_name}
                  </h3>
                  <p className="flex items-center gap-1 text-[#6B6862] text-xs mb-2">
                    <MapPin className="w-3 h-3 text-[#B57F50] shrink-0" />
                    {listing.city}, {listing.state_code}
                  </p>
                  {listing.description && (
                    <p className="text-[#6B6862] text-xs leading-relaxed line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                  )}
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] text-xs font-medium rounded-lg transition-colors"
                    >
                      Visit Website <ChevronRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] text-xs font-medium rounded-lg transition-colors"
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
