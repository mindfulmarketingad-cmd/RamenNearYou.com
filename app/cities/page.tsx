import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronRight } from 'lucide-react'
import { getCities, restaurants } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

function getCityPhoto(citySlug: string, stateSlug: string): string | null {
  return restaurants
    .filter((r) => r.citySlug === citySlug && r.stateSlug === stateSlug && r.photo)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]?.photo ?? null
}

export const metadata: Metadata = {
  title: 'Find Ramen Near You',
  description: 'Find ramen restaurants in cities across Georgia and beyond. Browse our full directory by city.',
}

export default function CitiesPage() {
  const cities = getCities()

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#1E2026] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#B0B3BB] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Browse Cities</span>
          </nav>
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">Find Ramen Near You</h1>
          <p className="text-[#B0B3BB] text-lg">{cities.length} cities · {cities.reduce((sum, c) => sum + c.count, 0)} restaurants listed</p>
        </div>
      </section>

      {/* City grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => {
              const featured = city.citySlug === 'atlanta'
              const photo = getCityPhoto(city.citySlug, city.stateSlug)
              return (
                <Link
                  key={`${city.citySlug}-${city.stateSlug}`}
                  href={`/${city.citySlug}/${city.stateSlug}`}
                  className={`group relative rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${
                    featured
                      ? 'border-[#77567A] shadow-md shadow-[#77567A]/10'
                      : 'border-white/5 hover:border-[#77567A]/50'
                  }`}
                >
                  {/* Photo */}
                  <div className="relative h-36 sm:h-40 bg-[#1E2026] overflow-hidden">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={`Ramen in ${city.city}, ${city.stateCode}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-[#77567A]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c22] via-[#1a1c22]/30 to-transparent" />
                    {featured && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#77567A]/90 text-white text-xs font-medium backdrop-blur-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="bg-[#1E2026] px-4 py-3">
                    <p className="font-semibold text-white text-sm leading-tight">{city.city}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[#B0B3BB] text-xs">{city.stateCode}</p>
                      <p className="text-[#77567A] text-xs font-medium">{city.count} spots</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
