import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Clock, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Find Ramen Near Me | Browse by Filter | RamenNearYou',
  description:
    'Find ramen restaurants near you filtered by what matters — open late, open now, vegan, cheap, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/find' },
}

const FILTERS = [
  {
    href: '/find/ramen-open-late',
    icon: <Clock className="w-5 h-5 text-[#B57F50]" />,
    label: 'Ramen Open Late Near Me',
    description: 'Restaurants open until 10 PM or later',
    emoji: '🌙',
  },
]

export default function FindHubPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Find Ramen Near Me</h1>
        <p className="text-[#6B6862] text-sm mb-8">Browse ramen restaurants filtered by what you need right now.</p>

        <div className="space-y-3">
          {FILTERS.map(f => (
            <Link
              key={f.href}
              href={f.href}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-black/8 hover:border-[#B57F50]/40 hover:bg-[#B57F50]/4 transition-all group"
            >
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1E2026] group-hover:text-[#c8934f] transition-colors">{f.label}</p>
                <p className="text-xs text-[#6B6862]">{f.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1E2026]/20 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
