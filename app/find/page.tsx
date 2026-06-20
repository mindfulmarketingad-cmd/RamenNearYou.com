import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { FIND_PAGES } from '@/components/find-cross-links'

export const metadata: Metadata = {
  title: 'Find Ramen Near Me | Browse by Filter | RamenNearYou',
  description: 'Find ramen restaurants near you filtered by what matters — open late, open now, tonkotsu, vegan, spicy, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/find' },
}

export default function FindHubPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Find Ramen Near Me</h1>
        <p className="text-[#6B6862] text-sm mb-8">
          Browse ramen restaurants filtered by what you need right now.
        </p>

        <div className="space-y-3">
          {FIND_PAGES.map(f => (
            <Link
              key={f.href}
              href={f.href}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-black/8 hover:border-[#B57F50]/40 hover:bg-[#B57F50]/4 transition-all group"
            >
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#c8934f] transition-colors">
                  {f.label}
                </p>
              </div>
              <svg className="w-4 h-4 text-[#1E2026]/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
