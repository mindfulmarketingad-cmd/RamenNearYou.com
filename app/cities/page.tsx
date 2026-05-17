import Link from 'next/link'
import { UtensilsCrossed, ChevronRight } from 'lucide-react'
import { getCities } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Ramen By City — RamenNearYou',
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">Browse Cities</h1>
          <p className="text-[#B0B3BB] text-lg">{cities.length} cities · {cities.reduce((sum, c) => sum + c.count, 0)} restaurants listed</p>
        </div>
      </section>

      {/* City grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => {
              const featured = city.citySlug === 'atlanta'
              return (
                <Link
                  key={`${city.citySlug}-${city.stateSlug}`}
                  href={`/${city.citySlug}/${city.stateSlug}`}
                  className={`group relative flex flex-col gap-3 p-5 rounded-xl bg-[#1E2026] border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${
                    featured
                      ? 'border-[#77567A] shadow-md shadow-[#77567A]/10'
                      : 'border-white/5 hover:border-[#77567A]'
                  }`}
                >
                  {featured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#77567A]/20 text-[#77567A] text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    featured ? 'bg-[#77567A]/20' : 'bg-white/5 group-hover:bg-[#77567A]/10 transition-colors'
                  }`}>
                    <UtensilsCrossed className={`w-5 h-5 ${featured ? 'text-[#77567A]' : 'text-[#B0B3BB] group-hover:text-[#77567A] transition-colors'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">{city.city}</p>
                    <p className="text-[#B0B3BB] text-xs">{city.stateCode}</p>
                  </div>
                  <p className="text-[#77567A] text-xs font-medium">{city.count} Spots</p>
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
