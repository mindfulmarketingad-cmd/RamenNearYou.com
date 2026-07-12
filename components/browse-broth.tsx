'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const brothTypes = [
  {
    href: '/tonkotsu-ramen-near-me',
    name: 'Tonkotsu',
    description: 'Rich, creamy pork bone broth simmered for hours',
  },
  {
    href: '/shoyu-ramen-near-me',
    name: 'Shoyu',
    description: 'Clear, savory soy sauce-based broth with depth',
  },
  {
    href: '/miso-ramen-near-me',
    name: 'Miso',
    description: 'Fermented soybean paste with a hearty, earthy flavor',
  },
  {
    href: '/shio-ramen-near-me',
    name: 'Shio',
    description: 'Light, clear salt-based broth — delicate and clean',
  },
  {
    href: '/spicy-ramen-near-me',
    name: 'Spicy',
    description: 'Bold heat-forward broths for spice lovers',
  },
  {
    href: '/vegan-ramen-near-me',
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
    <section id="broth" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Explore the Bowl</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] text-balance">
            Find Ramen by Broth Type
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brothTypes.map((broth) => (
            <Link
              key={broth.href}
              href={broth.href}
              className="fade-up group flex flex-col gap-3 p-6 rounded-xl bg-[#ffffff] border border-black/5 hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
            >
              <p className="font-semibold text-[#1E2026]">{broth.name}</p>
              <p className="text-[#6B6862] text-xs leading-relaxed">{broth.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
