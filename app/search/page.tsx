import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Star, ChevronRight, Search } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Ramen Search` : 'Search Ramen Restaurants',
    description: q
      ? `Search results for "${q}" — find top-rated ramen restaurants by name, city, or zip code.`
      : 'Search ramen restaurants by name, city, or zip code. Find ratings, hours, menus, and directions.',
  }
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-white/20'
          }`}
        />
      ))}
    </span>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-[#77567A]/15 text-[#77567A] text-xs font-medium">
      {children}
    </span>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = query ? searchRestaurants(query) : []

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#1E2026] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#B0B3BB] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Search</span>
          </nav>
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Search Results</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            {query ? `Results for "${query}"` : 'Search Restaurants'}
          </h1>
          <p className="text-[#B0B3BB] text-lg">
            {query
              ? results.length > 0
                ? `${results.length} restaurant${results.length === 1 ? '' : 's'} found`
                : 'No restaurants found'
              : 'Enter a search term to find ramen restaurants'}
          </p>
        </div>
      </section>

      {/* Search box */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <form method="get" action="/search" className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B3BB]" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Restaurant name, city, or zip code"
                className="w-full pl-10 pr-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="group flex flex-col bg-[#1E2026] rounded-xl border border-white/5 hover:border-[#77567A] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
                >
                  <div className="relative w-full h-44 bg-[#2F323A] overflow-hidden">
                    {r.photo ? (
                      <Image
                        src={r.photo}
                        alt={r.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#77567A]/30">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    {r.priceRange && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                        {r.priceRange}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div>
                      <h2 className="font-semibold text-white text-base leading-snug group-hover:text-[#77567A] transition-colors line-clamp-1">
                        {r.name}
                      </h2>
                      {(r.rating || r.reviewCount > 0) && (
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={r.rating} />
                          <span className="text-white/60 text-xs">
                            {r.rating?.toFixed(1)} ({r.reviewCount.toLocaleString()} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5 text-[#B0B3BB] text-xs">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#77567A]" />
                      <span className="line-clamp-2">{r.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {r.amenities.dineIn && <Badge>Dine-in</Badge>}
                      {r.amenities.takeout && <Badge>Takeout</Badge>}
                      {r.amenities.delivery && <Badge>Delivery</Badge>}
                      {r.amenities.veganOptions && <Badge>Vegan</Badge>}
                    </div>

                    <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                      {r.phone && (
                        <span className="flex items-center gap-1 text-[#B0B3BB] text-xs">
                          <Phone className="w-3 h-3" />
                          {r.phone}
                        </span>
                      )}
                      <span className="ml-auto text-[#77567A] text-xs font-medium group-hover:underline">
                        View listing →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-[#77567A]/30 mx-auto mb-4" />
              <p className="text-white text-lg font-medium mb-2">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[#B0B3BB] text-sm mb-6">Try searching by restaurant name, city name, or zip code.</p>
              <Link href="/cities" className="px-5 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors">
                Browse All Cities
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}
