'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, SlidersHorizontal, MapPin, Star, Clock, Bookmark, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const features = [
  { icon: SlidersHorizontal, label: 'Bowl Filters', desc: 'Tonkotsu, Spicy Miso, Shoyu, Shio, Tsukemen & more' },
  { icon: Star, label: 'Mood Filters', desc: 'Rich & Creamy, Date Night, Hangover Cure, Late-Night Comfort' },
  { icon: MapPin, label: 'Price Filters', desc: 'Budget picks under $15, Premium spots, Best Value finds' },
  { icon: Clock, label: 'Hours Filters', desc: 'Open Now, Open Late, Past Midnight, Top Rated' },
  { icon: Bookmark, label: 'Save Searches', desc: 'Pin your favorite filter combos for quick access' },
]

export default function PlusPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successBanner, setSuccessBanner] = useState(false)
  const [cancelledBanner, setCancelledBanner] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === '1') setSuccessBanner(true)
    if (params.get('cancelled') === '1') setCancelledBanner(true)
  }, [])

  async function handleSubscribe() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ramen-pass/checkout', { method: 'POST' })
      if (res.status === 401) {
        window.location.href = '/auth/login?redirect=/plus'
        return
      }
      if (res.status === 409) {
        // Already subscribed — send them to the app
        window.location.href = '/?subscribed=1'
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <section className="pt-32 pb-24 px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Success / cancelled banners */}
        {successBanner && (
          <div className="w-full max-w-sm mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium text-center">
            Payment successful — your filters are now unlocked! <Link href="/" className="underline font-bold">Start searching →</Link>
          </div>
        )}
        {cancelledBanner && (
          <div className="w-full max-w-sm mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm text-center">
            No worries — your subscription wasn&apos;t charged.
          </div>
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B57F50]/15 border border-[#B57F50]/30 text-[#96602F] text-xs font-bold uppercase tracking-widest mb-6">
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
            {error && (
              <p className="text-red-500 text-xs text-center mb-3">{error}</p>
            )}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] disabled:opacity-60 text-white text-sm font-bold text-center transition-colors shadow-md shadow-[#B57F50]/25"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up checkout…</>
                : 'Get RamenNearYou+ — $2.99/mo'}
            </button>
            <p className="text-center text-[#6B6862] text-xs mt-3">
              Secure checkout via Stripe · Filters unlock instantly after payment
            </p>
          </div>
        </div>

        {/* Feature breakdown */}
        <div className="mt-16 w-full max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6B6862] mb-6">What you unlock</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-4 bg-white rounded-xl border border-black/8 p-4">
                <div className="w-9 h-9 rounded-lg bg-[#B57F50]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#96602F]" />
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
        <p className="mt-10 text-[#6B6862] text-sm">
          Already subscribed?{' '}
          <Link href="/auth/login" className="text-[#96602F] hover:underline font-medium">
            Sign in to activate
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  )
}
