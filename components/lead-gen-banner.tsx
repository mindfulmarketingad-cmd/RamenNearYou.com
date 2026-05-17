'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LeadGenBanner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.fade-up')
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100)
            })
          }
        })
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="catering" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#77567A]" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="fade-up text-white/60 text-xs font-medium uppercase tracking-widest mb-4">Event Catering</p>
        <h2 className="fade-up font-serif text-4xl sm:text-5xl font-bold text-white leading-tight text-balance mb-5">
          Need Ramen Catering<br />for Your Event?
        </h2>
        <p className="fade-up text-white/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Tell us your event details and we&apos;ll match you with the best ramen caterers in your city &mdash; free.
        </p>
        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/catering" className="group flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-[#2F323A] font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg">
            Get Free Quotes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-white/60 text-sm">No commitment. Matched in minutes.</p>
        </div>
      </div>
    </section>
  )
}
