'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { getCities, restaurants } from '@/lib/restaurants'

const allCities = getCities()

function getCityPhoto(citySlug: string, stateSlug: string): string | null {
  const cityRestaurants = restaurants
    .filter((r) => r.citySlug === citySlug && r.stateSlug === stateSlug && r.photo)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return cityRestaurants[0]?.photo ?? null
}

export default function BrowseCities() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.fade-up')
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 60)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="cities" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#ffffff] noise-texture" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
<h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] text-balance">
            Find Ramen By City
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCities.map((city) => {
            const featured = city.citySlug === 'atlanta'
            const photo = getCityPhoto(city.citySlug, city.stateSlug)
            return (
              <Link
                key={`${city.citySlug}-${city.stateSlug}`}
                href={`/${city.citySlug}/${city.stateSlug}`}
                className={`fade-up group relative rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${
                  featured
                    ? 'border-[#B57F50] shadow-md shadow-[#B57F50]/10'
                    : 'border-black/5 hover:border-[#B57F50]/50'
                }`}
              >
                {/* Photo */}
                <div className="relative h-36 sm:h-40 bg-[#F5F4F0] overflow-hidden">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`Ramen in ${city.city}, ${city.stateCode}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
                      <MapPin className="w-8 h-8 text-[#96602F]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ECEAE4] via-[#ECEAE4]/30 to-transparent" />
                  {featured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#B57F50]/90 text-[#1E2026] text-xs font-medium backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="bg-[#F5F4F0] px-4 py-3">
                  <p className="font-semibold text-[#1E2026] text-sm leading-tight">{city.city}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[#6B6862] text-xs">{city.stateCode}</p>
                    <p className="text-[#96602F] text-xs font-medium">{city.count} spots</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
