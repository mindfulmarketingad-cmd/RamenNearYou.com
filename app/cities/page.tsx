import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { getCities } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Ramen Restaurants by City & State | Ramen Near You',
  description: 'Find ramen restaurants in cities across every US state. Browse our full directory by city and state.',
}

const ALL_STATES: { name: string; code: string; slug: string }[] = [
  { name: 'Alabama', code: 'AL', slug: 'al' },
  { name: 'Alaska', code: 'AK', slug: 'ak' },
  { name: 'Arizona', code: 'AZ', slug: 'az' },
  { name: 'Arkansas', code: 'AR', slug: 'ar' },
  { name: 'California', code: 'CA', slug: 'ca' },
  { name: 'Colorado', code: 'CO', slug: 'co' },
  { name: 'Connecticut', code: 'CT', slug: 'ct' },
  { name: 'Delaware', code: 'DE', slug: 'de' },
  { name: 'Florida', code: 'FL', slug: 'fl' },
  { name: 'Georgia', code: 'GA', slug: 'ga' },
  { name: 'Hawaii', code: 'HI', slug: 'hi' },
  { name: 'Idaho', code: 'ID', slug: 'id' },
  { name: 'Illinois', code: 'IL', slug: 'il' },
  { name: 'Indiana', code: 'IN', slug: 'in' },
  { name: 'Iowa', code: 'IA', slug: 'ia' },
  { name: 'Kansas', code: 'KS', slug: 'ks' },
  { name: 'Kentucky', code: 'KY', slug: 'ky' },
  { name: 'Louisiana', code: 'LA', slug: 'la' },
  { name: 'Maine', code: 'ME', slug: 'me' },
  { name: 'Maryland', code: 'MD', slug: 'md' },
  { name: 'Massachusetts', code: 'MA', slug: 'ma' },
  { name: 'Michigan', code: 'MI', slug: 'mi' },
  { name: 'Minnesota', code: 'MN', slug: 'mn' },
  { name: 'Mississippi', code: 'MS', slug: 'ms' },
  { name: 'Missouri', code: 'MO', slug: 'mo' },
  { name: 'Montana', code: 'MT', slug: 'mt' },
  { name: 'Nebraska', code: 'NE', slug: 'ne' },
  { name: 'Nevada', code: 'NV', slug: 'nv' },
  { name: 'New Hampshire', code: 'NH', slug: 'nh' },
  { name: 'New Jersey', code: 'NJ', slug: 'nj' },
  { name: 'New Mexico', code: 'NM', slug: 'nm' },
  { name: 'New York', code: 'NY', slug: 'ny' },
  { name: 'North Carolina', code: 'NC', slug: 'nc' },
  { name: 'North Dakota', code: 'ND', slug: 'nd' },
  { name: 'Ohio', code: 'OH', slug: 'oh' },
  { name: 'Oklahoma', code: 'OK', slug: 'ok' },
  { name: 'Oregon', code: 'OR', slug: 'or' },
  { name: 'Pennsylvania', code: 'PA', slug: 'pa' },
  { name: 'Rhode Island', code: 'RI', slug: 'ri' },
  { name: 'South Carolina', code: 'SC', slug: 'sc' },
  { name: 'South Dakota', code: 'SD', slug: 'sd' },
  { name: 'Tennessee', code: 'TN', slug: 'tn' },
  { name: 'Texas', code: 'TX', slug: 'tx' },
  { name: 'Utah', code: 'UT', slug: 'ut' },
  { name: 'Vermont', code: 'VT', slug: 'vt' },
  { name: 'Virginia', code: 'VA', slug: 'va' },
  { name: 'Washington', code: 'WA', slug: 'wa' },
  { name: 'Washington D.C.', code: 'DC', slug: 'dc' },
  { name: 'West Virginia', code: 'WV', slug: 'wv' },
  { name: 'Wisconsin', code: 'WI', slug: 'wi' },
  { name: 'Wyoming', code: 'WY', slug: 'wy' },
]

export default function CitiesPage() {
  const cities = getCities()

  // Group cities by state code
  const byState = new Map<string, typeof cities>()
  for (const city of cities) {
    const existing = byState.get(city.stateCode) ?? []
    existing.push(city)
    byState.set(city.stateCode, existing)
  }
  // Sort cities within each state by count desc
  for (const [, list] of byState) {
    list.sort((a, b) => b.count - a.count)
  }

  const totalCities = cities.length
  const totalRestaurants = cities.reduce((s, c) => s + c.count, 0)
  const liveStates = byState.size

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[#1E2026] border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#B0B3BB] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Browse Cities</span>
          </nav>
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Ramen Directory</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">Find Ramen Near You</h1>
          <p className="text-[#B0B3BB] text-lg">
            {totalRestaurants.toLocaleString()} restaurants across {totalCities} cities in {liveStates} states
          </p>
        </div>
      </section>

      {/* State list */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {ALL_STATES.map((state) => {
            const stateCities = byState.get(state.code)
            const hasData = !!stateCities?.length

            return (
              <div key={state.code}>
                {/* State heading */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-serif text-xl font-bold text-white">{state.name}</h2>
                  <span className="text-[#77567A] text-xs font-semibold uppercase tracking-widest">{state.code}</span>
                  {!hasData && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#B0B3BB] text-xs">
                      Coming soon
                    </span>
                  )}
                </div>

                {hasData ? (
                  <ul className="divide-y divide-white/5 rounded-xl border border-white/5 overflow-hidden">
                    {stateCities.map((city) => (
                      <li key={`${city.citySlug}-${city.stateSlug}`}>
                        <Link
                          href={`/${city.citySlug}/${city.stateSlug}`}
                          className="flex items-center justify-between px-4 py-3 bg-[#1E2026] hover:bg-[#252830] transition-colors group"
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#77567A] shrink-0" />
                            <span className="text-white text-sm font-medium group-hover:text-[#b07db5] transition-colors">
                              {city.city}, {city.stateCode}
                            </span>
                          </span>
                          <span className="text-[#B0B3BB] text-xs shrink-0 ml-4">
                            {city.count} Ramen Restaurant{city.count !== 1 ? 's' : ''}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#B0B3BB]/50 text-sm italic pl-1">
                    No listings yet — check back soon.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}
