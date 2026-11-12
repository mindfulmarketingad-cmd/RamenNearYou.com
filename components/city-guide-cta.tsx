'use client'

import { useState } from 'react'
import { BookOpen, Check, Loader2 } from 'lucide-react'
import { STRIPE_CITY_GUIDE_LINK, CITY_GUIDE_INCLUDES } from '@/lib/city-guide'

interface Props {
  /** "Ketchikan, AK" — drives the headline. Omitted on non-city pages. */
  cityLabel?: string | null
  /** Sent to Stripe as client_reference_id so the order names its city. */
  citySlug?: string | null
}

export default function CityGuideCta({ cityLabel, citySlug }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMsg] = useState('')

  const place = cityLabel?.trim()
  const heading = place ? `The Complete ${place} Ramen Guide` : 'The Complete Ramen City Guide'

  // Straight to Stripe — the site is static, so there's no backend to record
  // the request first. The email is prefilled and the city rides along as
  // client_reference_id so the paid order says which guide to send.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const params = new URLSearchParams({ prefilled_email: email.trim() })
    if (citySlug) params.set('client_reference_id', citySlug)
    window.location.href = `${STRIPE_CITY_GUIDE_LINK}?${params.toString()}`
  }

  return (
    <section className="rounded-2xl border-2 border-brand/40 bg-gradient-to-br from-sunken to-white p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-widest">
          <BookOpen className="w-3 h-3" /> Digital Guide
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-2">{heading}</h2>

      <p className="text-ink-soft text-sm leading-relaxed mb-5">
        A curated PDF you can keep on your phone — everything worth eating
        {place ? ` in ${place}` : ''}, hand-picked and written up by us. Delivered to your
        inbox after checkout.
      </p>

      <ul className="space-y-2 mb-6">
        {CITY_GUIDE_INCLUDES.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
            <Check className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />
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
          className="flex-1 px-4 py-3 rounded-lg border border-line/10 bg-surface text-sm text-ink placeholder-ink-faint outline-none focus:border-brand transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold whitespace-nowrap transition-colors disabled:opacity-60"
        >
          {status === 'sending'
            ? <><Loader2 className="w-4 h-4 animate-spin" /> One sec…</>
            : 'Get the Guide'}
        </button>
      </form>

      {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}

      <p className="text-[11px] text-ink-soft/80 mt-3">
        Secure checkout via Stripe. We&apos;ll email your guide once payment clears.
      </p>
    </section>
  )
}
