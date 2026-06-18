'use client'

import { useEffect, useRef } from 'react'
import { Star, MapPin } from 'lucide-react'

const restaurants = [
  {
    id: 1,
    name: 'Hajime Ramen',
    city: 'Atlanta, GA',
    broth: 'Tonkotsu',
    rating: 4.8,
    image: '/images/hero-ramen.jpg',
  },
  {
    id: 2,
    name: 'Miso Hot',
    city: 'Atlanta, GA',
    broth: 'Miso',
    rating: 4.6,
    image: '/images/hero-ramen.jpg',
  },
  {
    id: 3,
    name: 'Shoyu Collective',
    city: 'Nashville, TN',
    broth: 'Shoyu',
    rating: 4.7,
    image: '/images/hero-ramen.jpg',
  },
  {
    id: 4,
    name: 'The Broth House',
    city: 'Atlanta, GA',
    broth: 'Spicy',
    rating: 4.5,
    image: '/images/hero-ramen.jpg',
  },
  {
    id: 5,
    name: 'Green Bowl Ramen',
    city: 'Charlotte, NC',
    broth: 'Vegan',
    rating: 4.4,
    image: '/images/hero-ramen.jpg',
  },
  {
    id: 6,
    name: 'Kuro Noodle Bar',
    city: 'Atlanta, GA',
    broth: 'Tonkotsu',
    rating: 4.9,
    image: '/images/hero-ramen.jpg',
  },
]

const brothColors: Record<string, string> = {
  Tonkotsu: 'bg-amber-900/30 text-amber-300 border-amber-800/40',
  Shoyu: 'bg-orange-900/30 text-orange-300 border-orange-800/40',
  Miso: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  Spicy: 'bg-red-900/30 text-red-400 border-red-800/40',
  Vegan: 'bg-green-900/30 text-green-400 border-green-800/40',
}

export default function RecentlyAdded() {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#ffffff] noise-texture" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Fresh Listings</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] text-balance">
            Newly Listed Restaurants
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="fade-up group flex flex-col rounded-xl bg-[#F5F4F0] border border-black/5 overflow-hidden hover:border-[#B57F50]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Photo */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5F4F0] to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#1E2026] text-base leading-snug">{r.name}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-medium ${brothColors[r.broth]}`}>
                    {r.broth}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#6B6862]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B57F50]" />
                    {r.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {r.rating}
                  </span>
                </div>

                <div className="mt-auto pt-2">
                  <button className="w-full py-2.5 rounded-none border border-[#B57F50]/50 text-[#B57F50] text-sm font-medium hover:bg-[#B57F50] hover:text-[#1E2026] transition-all duration-200">
                    View Restaurant
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
