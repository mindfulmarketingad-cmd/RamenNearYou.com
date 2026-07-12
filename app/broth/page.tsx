import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { safePhotoSrc } from '@/lib/photo-guard'
import { MapPin, Star, Utensils } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BrothFilterTabs from '@/components/broth-filter-tabs'
import { restaurants, getBrothTypes, BROTH_TYPES, type BrothType } from '@/lib/restaurants'

const DISPLAY_LIMIT = 300

const brothMeta: Record<BrothType, { label: string; description: string; longDesc: string; color: string; border: string; badge: string }> = {
  Tonkotsu: {
    label: 'Tonkotsu',
    description: 'Rich, creamy pork bone broth',
    longDesc: 'Slow-simmered pork bones create a thick, milky broth with deep umami. Expect a rich, indulgent bowl.',
    color: 'text-amber-700',
    border: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  Shoyu: {
    label: 'Shoyu',
    description: 'Clear, soy-seasoned broth',
    longDesc: 'Soy sauce-based tare in a clear chicken or dashi stock. Light body with complex umami and a savory finish.',
    color: 'text-orange-700',
    border: 'border-orange-200 bg-orange-50',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  Miso: {
    label: 'Miso',
    description: 'Fermented soybean paste broth',
    longDesc: 'Earthy, hearty miso paste blended into stock. Bold, warming, and complex — a Hokkaido classic.',
    color: 'text-yellow-700',
    border: 'border-yellow-200 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  Spicy: {
    label: 'Spicy',
    description: 'Chili heat for bold palates',
    longDesc: 'Chili oil, doubanjiang, or house spice blends bring serious heat. Perfect for those who want fire in every sip.',
    color: 'text-red-700',
    border: 'border-red-200 bg-red-50',
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
  Vegan: {
    label: 'Vegan-Friendly',
    description: 'Plant-based broth options',
    longDesc: 'Kombu, shiitake, and vegetable bases deliver umami without animal products. Great for plant-based diners.',
    color: 'text-green-700',
    border: 'border-green-200 bg-green-50',
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
}

// Pre-compute counts once at build time
const counts: Record<string, number> = { All: restaurants.length }
for (const type of BROTH_TYPES) {
  counts[type] = restaurants.filter(r => getBrothTypes(r).includes(type)).length
}

export default async function BrothPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const selected = (BROTH_TYPES as readonly string[]).includes(type ?? '') ? (type as BrothType) : null

  // Filter server-side, sort by rating, limit to DISPLAY_LIMIT
  const base = selected
    ? restaurants.filter(r => getBrothTypes(r).includes(selected))
    : restaurants

  const filtered = [...base]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, DISPLAY_LIMIT)

  const totalForType = selected ? counts[selected] : counts.All

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Explore</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
          Find Ramen by Broth Type
        </h1>
        <p className="text-[#6B6862] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Every bowl starts with the broth. Find ramen restaurants by the style that suits your taste.
        </p>
        <p className="mt-4 text-sm text-[#6B6862]">
          New to ramen styles?{' '}
          <Link href="/comparisons" className="text-[#96602F] font-medium hover:underline">
            Compare broth types side by side →
          </Link>
        </p>
      </section>

      {/* Broth type info cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BROTH_TYPES.map((type) => {
            const meta = brothMeta[type]
            const isActive = selected === type
            return (
              <Link
                key={type}
                href={isActive ? '/broth' : `/broth?type=${type}`}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  isActive ? meta.border : 'border-black/5 bg-[#F5F4F0] hover:border-black/10'
                }`}
              >
                <p className={`text-base font-semibold mb-1 ${isActive ? meta.color : 'text-[#1E2026]'}`}>
                  {meta.label}
                </p>
                <p className="text-[#6B6862] text-xs leading-snug mb-2">{meta.description}</p>
                <p className={`text-xs font-medium ${isActive ? meta.color : 'text-[#6B6862]/60'}`}>
                  {counts[type].toLocaleString()} restaurant{counts[type] !== 1 ? 's' : ''}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <Suspense>
            <BrothFilterTabs selected={selected} counts={counts} />
          </Suspense>
        </div>
      </section>

      {/* Selected type blurb */}
      {selected && (
        <section className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className={`max-w-7xl mx-auto px-5 py-3 rounded-xl border ${brothMeta[selected].border}`}>
            <p className={`text-sm ${brothMeta[selected].color}`}>{brothMeta[selected].longDesc}</p>
          </div>
        </section>
      )}

      {/* Result count */}
      <section className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#6B6862] text-sm">
            Showing top {filtered.length.toLocaleString()} of {totalForType.toLocaleString()} restaurants
            {selected ? ` with ${brothMeta[selected].label} broth` : ''} — sorted by rating
          </p>
        </div>
      </section>

      {/* Restaurant grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6B6862] text-lg mb-2">No restaurants found for this broth type yet.</p>
              <p className="text-[#6B6862]/50 text-sm">
                Own a restaurant with this broth?{' '}
                <Link href="/list" className="text-[#96602F] hover:underline">List it here.</Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => {
                const types = getBrothTypes(r)
                return (
                  <Link
                    key={r.slug}
                    href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                    className="group flex flex-col bg-[#F5F4F0] rounded-xl border border-black/5 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10"
                  >
                    <div className="relative h-40 bg-[#ffffff] overflow-hidden flex-shrink-0">
                      {safePhotoSrc(r.photo) ? (
                        <Image
                          src={safePhotoSrc(r.photo)!}
                          alt={r.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Utensils className="w-10 h-10 text-[#96602F]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#F5F4F0] via-transparent to-transparent" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <div>
                        <h3 className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#96602F] transition-colors line-clamp-1">
                          {r.name}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-[#6B6862] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#96602F] flex-shrink-0" />
                          {r.city}, {r.stateCode}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        {r.rating ? (
                          <span className="flex items-center gap-1 text-xs text-[#1E2026]/60">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {r.rating.toFixed(1)}
                            <span className="text-[#1E2026]/30">({(r.reviewCount ?? 0).toLocaleString()})</span>
                          </span>
                        ) : <span />}
                        {types.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {types.slice(0, 2).map((t) => (
                              <span key={t} className={`px-2 py-0.5 rounded-full border text-xs font-medium ${brothMeta[t].badge}`}>
                                {brothMeta[t].label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* CTA to searchmap for more */}
          {totalForType > DISPLAY_LIMIT && (
            <div className="mt-10 text-center">
              <p className="text-[#6B6862] text-sm mb-4">
                Showing top {DISPLAY_LIMIT} results. Use the map to find more near you.
              </p>
              <Link
                href="/searchmap"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
              >
                Find Ramen Near Me →
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
