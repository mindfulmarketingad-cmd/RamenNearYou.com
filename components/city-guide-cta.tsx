'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BookOpen, Check, Loader2, TrendingUp } from 'lucide-react'
import { STRIPE_CITY_GUIDE_LINK, CITY_GUIDE_INCLUDES } from '@/lib/city-guide'

// Below this, the real number reads as "nobody wants this" rather than social
// proof — so the line stays hidden until it's genuinely persuasive.
const SOCIAL_PROOF_MIN = 25

interface Props {
  /** "Ketchikan, AK" — drives the headline. Omitted on non-city pages. */
  cityLabel?: string | null
  /** Recorded with the request so the guide gets built for the right city. */
  citySlug?: string | null
}

export default function CityGuideCta({ cityLabel, citySlug }: Props) {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [recentCount, setRecentCount] = useState(0)

  useEffect(() => {
    const qs = citySlug ? `?citySlug=${encodeURIComponent(citySlug)}` : ''
    fetch(`/api/city-guide/count${qs}`)
      .then(res => res.json())
      .then(data => setRecentCount(typeof data.count === 'number' ? data.count : 0))
      .catch(() => {})
  }, [citySlug])

  const place = cityLabel?.trim()
  const heading = place ? `The Complete ${place} Ramen Guide` : 'The Complete Ramen City Guide'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/city-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          citySlug: citySlug ?? null,
          cityLabel: place ?? null,
          sourcePath: pathname ?? null,
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Something went wrong. Please try again.')
      }
      // Email is captured either way; Stripe collects the payment. The city
      // rides along as client_reference_id so the paid order can be matched
      // back to the row we just wrote.
      const params = new URLSearchParams({ prefilled_email: email.trim() })
      if (citySlug) params.set('client_reference_id', citySlug)
      window.location.href = `${STRIPE_CITY_GUIDE_LINK}?${params.toString()}`
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="rounded-2xl border-2 border-[#B57F50]/40 bg-gradient-to-br from-[#F5F0EA] to-white p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B57F50] text-white text-[10px] font-bold uppercase tracking-widest">
          <BookOpen className="w-3 h-3" /> Digital Guide
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">{heading}</h2>

      {recentCount >= SOCIAL_PROOF_MIN && (
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          {recentCount.toLocaleString()} downloaded in the last 30 days
        </p>
      )}
      <p className="text-[#6B6862] text-sm leading-relaxed mb-5">
        A curated PDF you can keep on your phone — everything worth eating
        {place ? ` in ${place}` : ''}, hand-picked and written up by us. Delivered to your
        inbox after checkout.
      </p>

      <ul className="space-y-2 mb-6">
        {CITY_GUIDE_INCLUDES.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[#1E2026]">
            <Check className="w-4 h-4 text-[#96602F] shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Your email"
          className="flex-1 px-4 py-3 rounded-lg border border-black/10 bg-white text-sm text-[#1E2026] placeholder-[#9B9490] outline-none focus:border-[#B57F50] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold whitespace-nowrap transition-colors disabled:opacity-60"
        >
          {status === 'sending'
            ? <><Loader2 className="w-4 h-4 animate-spin" /> One sec…</>
            : 'Get the Guide'}
        </button>
      </form>

      {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}

      <p className="text-[11px] text-[#6B6862]/80 mt-3">
        Secure checkout via Stripe. We&apos;ll email your guide once payment clears.
      </p>
    </section>
  )
}
