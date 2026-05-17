'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { getCities } from '@/lib/restaurants'

const allCities = getCities()

export default function BrowseCities() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.fade-up')
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80)
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
    <section id="cities" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2F323A] noise-texture" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Nationwide Directory</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white text-balance">
            Find Ramen By City
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCities.map((city) => {
            const featured = city.citySlug === 'atlanta'
            return (
              <Link
                key={`${city.citySlug}-${city.stateSlug}`}
                href={`/${city.citySlug}/${city.stateSlug}`}
                className={`fade-up group relative flex flex-col gap-3 p-5 rounded-xl bg-[#1E2026] border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${
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
  )
}
