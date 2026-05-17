'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Utensils } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { restaurants, getBrothTypes, BROTH_TYPES, type BrothType } from '@/lib/restaurants'

const brothMeta: Record<BrothType, { label: string; description: string; longDesc: string; color: string; border: string; badge: string }> = {
  Tonkotsu: {
    label: 'Tonkotsu',
    description: 'Rich, creamy pork bone broth',
    longDesc: 'Slow-simmered pork bones create a thick, milky broth with deep umami. Expect a rich, indulgent bowl.',
    color: 'text-amber-300',
    border: 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/60',
    badge: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  },
  Shoyu: {
    label: 'Shoyu',
    description: 'Clear, soy-seasoned broth',
    longDesc: 'Soy sauce-based tare in a clear chicken or dashi stock. Light body with complex umami and a savory finish.',
    color: 'text-orange-300',
    border: 'border-orange-500/30 bg-orange-500/10 hover:border-orange-400/60',
    badge: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
  },
  Miso: {
    label: 'Miso',
    description: 'Fermented soybean paste broth',
    longDesc: 'Earthy, hearty miso paste blended into stock. Bold, warming, and complex — a Hokkaido classic.',
    color: 'text-yellow-300',
    border: 'border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-400/60',
    badge: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  },
  Spicy: {
    label: 'Spicy',
    description: 'Chili heat for bold palates',
    longDesc: 'Chili oil, doubanjiang, or house spice blends bring serious heat. Perfect for those who want fire in every sip.',
    color: 'text-red-400',
    border: 'border-red-500/30 bg-red-500/10 hover:border-red-400/60',
    badge: 'bg-red-900/40 text-red-400 border-red-700/40',
  },
  Vegan: {
    label: 'Vegan-Friendly',
    description: 'Plant-based broth options',
    longDesc: 'Kombu, shiitake, and vegetable bases deliver umami without animal products. Great for plant-based diners.',
    color: 'text-green-400',
    border: 'border-green-500/30 bg-green-500/10 hover:border-green-400/60',
    badge: 'bg-green-900/40 text-green-400 border-green-700/40',
  },
}

export default function BrothPage() {
  const [selected, setSelected] = useState<BrothType | 'All'>('All')

  const tagged = useMemo(
    () => restaurants.map(r => ({ r, types: getBrothTypes(r) })),
    []
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: restaurants.length }
    for (const type of BROTH_TYPES) {
      c[type] = tagged.filter(({ types }) => types.includes(type)).length
    }
    return c
  }, [tagged])

  const filtered = useMemo(() => {
    if (selected === 'All') return tagged
    return tagged.filter(({ types }) => types.includes(selected))
  }, [selected, tagged])

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Explore</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
          Browse by Broth Type
        </h1>
        <p className="text-[#B0B3BB] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Every bowl starts with the broth. Find ramen restaurants by the style that suits your taste.
        </p>
      </section>

      {/* Broth type info cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BROTH_TYPES.map((type) => {
            const meta = brothMeta[type]
            const isActive = selected === type
            return (
              <button
                key={type}
                onClick={() => setSelected(isActive ? 'All' : type)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? `${meta.border} ring-1 ring-inset ring-white/10`
                    : `border-white/5 bg-[#1E2026] hover:border-white/15`
                }`}
              >
                <p className={`text-base font-semibold mb-1 ${isActive ? meta.color : 'text-white'}`}>
                  {meta.label}
                </p>
                <p className="text-[#B0B3BB] text-xs leading-snug mb-2">{meta.description}</p>
                <p className={`text-xs font-medium ${isActive ? meta.color : 'text-[#B0B3BB]/60'}`}>
                  {counts[type]} restaurant{counts[type] !== 1 ? 's' : ''}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelected('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selected === 'All'
                ? 'bg-[#77567A] border-[#77567A] text-white'
                : 'border-white/10 text-[#B0B3BB] hover:border-white/30 hover:text-white'
            }`}
          >
            All ({counts.All})
          </button>
          {BROTH_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelected(selected === type ? 'All' : type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selected === type
                  ? 'bg-[#77567A] border-[#77567A] text-white'
                  : 'border-white/10 text-[#B0B3BB] hover:border-white/30 hover:text-white'
              }`}
            >
              {brothMeta[type].label} ({counts[type]})
            </button>
          ))}
        </div>
      </section>

      {/* Selected type blurb */}
      {selected !== 'All' && (
        <section className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className={`max-w-7xl mx-auto px-5 py-3 rounded-xl border ${brothMeta[selected].border}`}>
            <p className={`text-sm ${brothMeta[selected].color}`}>{brothMeta[selected].longDesc}</p>
          </div>
        </section>
      )}

      {/* Restaurant grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#B0B3BB] text-lg mb-2">No restaurants found for this broth type yet.</p>
              <p className="text-[#B0B3BB]/50 text-sm">
                Own a restaurant with this broth?{' '}
                <Link href="/list" className="text-[#77567A] hover:underline">List it here.</Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(({ r, types }) => (
                <Link
                  key={r.slug}
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="group flex flex-col bg-[#1E2026] rounded-xl border border-white/5 overflow-hidden hover:border-[#77567A]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  {/* Photo */}
                  <div className="relative h-40 bg-[#2F323A] overflow-hidden flex-shrink-0">
                    {r.photo ? (
                      <Image
                        src={r.photo}
                        alt={r.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="w-10 h-10 text-[#77567A]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2026] via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-[#77567A] transition-colors line-clamp-1">
                        {r.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-[#B0B3BB] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#77567A] flex-shrink-0" />
                        {r.city}, {r.stateCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {r.rating ? (
                        <span className="flex items-center gap-1 text-xs text-white/60">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {r.rating.toFixed(1)}
                          <span className="text-white/30">({r.reviewCount.toLocaleString()})</span>
                        </span>
                      ) : <span />}

                      {/* Broth type badges */}
                      {types.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {types.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className={`px-2 py-0.5 rounded-full border text-xs font-medium ${brothMeta[t].badge}`}
                            >
                              {brothMeta[t].label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
