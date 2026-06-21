import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, SlidersHorizontal, MapPin, Star, Clock, Bookmark } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'RamenNearYou+ — Unlock Filters for $2.99/month',
  description: 'Subscribe to RamenNearYou+ for $2.99/month and unlock advanced filters — search by bowl type, mood, price, and hours to find your perfect ramen.',
  alternates: { canonical: 'https://www.ramennearyou.com/plus' },
}

const STRIPE_URL = 'https://buy.stripe.com/9B6aEYgyK44EaYK45ofrW08'

const features = [
  { icon: SlidersHorizontal, label: 'Bowl Filters', desc: 'Tonkotsu, Spicy Miso, Shoyu, Shio, Tsukemen & more' },
  { icon: Star, label: 'Mood Filters', desc: 'Rich & Creamy, Date Night, Hangover Cure, Late-Night Comfort' },
  { icon: MapPin, label: 'Price Filters', desc: 'Budget picks under $15, Premium spots, Best Value finds' },
  { icon: Clock, label: 'Hours Filters', desc: 'Open Now, Open Late, Past Midnight, Top Rated' },
  { icon: Bookmark, label: 'Save Searches', desc: 'Pin your favorite filter combos for quick access' },
]

export default function PlusPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <section className="pt-32 pb-24 px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B57F50]/15 border border-[#B57F50]/30 text-[#B57F50] text-xs font-bold uppercase tracking-widest mb-6">
          RamenNearYou+
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4 max-w-xl leading-tight">
          Find exactly the ramen you&apos;re craving
        </h1>
        <p className="text-[#6B6862] text-base sm:text-lg max-w-md leading-relaxed mb-10">
          Unlock advanced filters and search 10,000+ ramen restaurants by bowl type, mood, price, and hours — for less than a cup of noodles a month.
        </p>

        {/* Pricing card */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-black/8 overflow-hidden">
          <div className="bg-[#B57F50] px-6 py-5 text-white text-center">
            <p className="text-sm font-semibold opacity-80 mb-1">RamenNearYou+</p>
            <div className="flex items-end justify-center gap-1">
              <span className="font-serif text-5xl font-bold">$2.99</span>
              <span className="text-sm opacity-70 mb-2">/month</span>
            </div>
            <p className="text-xs opacity-70 mt-1">Cancel anytime — no commitment</p>
          </div>

          <div className="px-6 py-5 space-y-3">
            {[
              'Filter by bowl type — 11 styles',
              'Filter by mood — 7 moods',
              'Filter by price range',
              'Filter by hours (open now, late night)',
              'Save your searches',
              'All 50 states covered',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-[#1E2026]">{item}</span>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6">
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold text-center transition-colors shadow-md shadow-[#B57F50]/25"
            >
              Get RamenNearYou+ — $2.99/mo
            </a>
            <p className="text-center text-[#9B9490] text-xs mt-3">
              Secure checkout via Stripe
            </p>
          </div>
        </div>

        {/* Feature breakdown */}
        <div className="mt-16 w-full max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9B9490] mb-6">What you unlock</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-4 bg-white rounded-xl border border-black/8 p-4">
                <div className="w-9 h-9 rounded-lg bg-[#B57F50]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#B57F50]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1E2026]">{label}</p>
                  <p className="text-xs text-[#6B6862] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Already subscribed */}
        <p className="mt-10 text-[#9B9490] text-sm">
          Already subscribed?{' '}
          <Link href="/auth/login" className="text-[#B57F50] hover:underline font-medium">
            Sign in to activate
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  )
}
