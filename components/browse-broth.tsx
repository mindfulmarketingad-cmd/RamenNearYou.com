'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const brothTypes = [
  {
    slug: 'tonkotsu',
    name: 'Tonkotsu',
    description: 'Rich, creamy pork bone broth simmered for hours',
  },
  {
    slug: 'shoyu',
    name: 'Shoyu',
    description: 'Clear, savory soy sauce-based broth with depth',
  },
  {
    slug: 'miso',
    name: 'Miso',
    description: 'Fermented soybean paste with a hearty, earthy flavor',
  },
  {
    slug: 'spicy',
    name: 'Spicy',
    description: 'Bold heat-forward broths for spice lovers',
  },
  {
    slug: 'vegan',
    name: 'Vegan',
    description: 'Plant-based options with full, satisfying flavor',
  },
]

export default function BrowseBroth() {
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
    <section id="broth" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E2026]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Explore the Bowl</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white text-balance">
            Find Ramen by Broth Type
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brothTypes.map((broth) => (
            <Link
              key={broth.slug}
              href="/broth"
              className="fade-up group flex flex-col gap-3 p-6 rounded-xl bg-[#2F323A] border border-white/5 hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
            >
              <p className="font-semibold text-white">{broth.name}</p>
              <p className="text-[#B0B3BB] text-xs leading-relaxed">{broth.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
