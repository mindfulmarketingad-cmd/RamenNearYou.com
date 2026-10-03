'use client'

import { useEffect, useState } from 'react'
import { Search, CheckCircle2, X } from 'lucide-react'
import { STRIPE_REVIEW_CARD_LINK, PRICE_LABEL } from './config'

const inputClass =
  'w-full px-4 py-3 bg-sunken border border-line/8 rounded-lg text-ink text-sm placeholder-ink-faint outline-none focus:border-brand transition-colors'

type Picked = { slug: string; name: string; city: string; stateCode: string }
type SearchMatch = Picked

export default function ReviewCardOrderForm({ initialPicked = null }: { initialPicked?: Picked | null }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<Picked | null>(initialPicked)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [matches, setMatches] = useState<SearchMatch[]>([])

  // Debounced server-side search — keeps the full restaurant dataset out of
  // the client bundle (see app/claim-your-listing/claim-search.tsx).
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setMatches([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/restaurants/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => setMatches(Array.isArray(data) ? data.slice(0, 50) : []))
        .catch(() => {})
    }, 200)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!picked) return
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/review-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantSlug: picked.slug, buyerName, buyerEmail }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      // Hand off to Stripe once the order is safely recorded.
      if (STRIPE_REVIEW_CARD_LINK) {
        window.location.href = `${STRIPE_REVIEW_CARD_LINK}?prefilled_email=${encodeURIComponent(buyerEmail.trim())}&client_reference_id=${encodeURIComponent(picked.slug)}`
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface rounded-2xl border border-line/8 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Order received!</h2>
        <p className="text-ink-soft leading-relaxed max-w-sm mx-auto">
          {STRIPE_REVIEW_CARD_LINK
            ? 'Redirecting you to secure checkout… Once payment clears, we\'ll email your print-ready review card kit.'
            : `We've recorded your order for ${picked?.name}. We'll email you a secure payment link, and your print-ready kit follows right after payment.`}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-line/8 p-8">
      <div className="text-center mb-6 pb-6 border-b border-line/6">
        <div className="flex items-end justify-center gap-1.5 mb-1">
          <span className="font-serif text-5xl font-bold text-ink">{PRICE_LABEL}</span>
          <span className="text-ink-soft text-sm mb-2">one-time</span>
        </div>
        <p className="text-ink-soft text-xs">Print-ready QR review kit for one restaurant.</p>
      </div>

      {/* Restaurant picker */}
      <p className="text-sm font-semibold text-ink mb-3">Which restaurant is this for?</p>
      {picked ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-sunken border border-brand/40 mb-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{picked.name}</p>
            <p className="text-xs text-ink-soft">{picked.city}, {picked.stateCode}</p>
          </div>
          <button onClick={() => setPicked(null)} aria-label="Change restaurant" className="shrink-0 text-ink-soft hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder="Search by restaurant name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-sunken border border-line/8 text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-brand/50"
            />
          </div>
          {open && query.trim() && (
            <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-surface border border-line/8 rounded-xl shadow-xl">
              {matches.length === 0 ? (
                <div className="p-4 text-sm text-ink-soft">
                  No restaurants found for &ldquo;{query}&rdquo;. Not listed yet?{' '}
                  <a href="/claim-your-listing" className="text-brand-ink font-semibold hover:underline">Add your restaurant first →</a>
                </div>
              ) : (
                matches.map(r => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => { setPicked({ slug: r.slug, name: r.name, city: r.city, stateCode: r.stateCode }); setOpen(false); setQuery('') }}
                    className="block w-full text-left px-4 py-3 hover:bg-sunken transition-colors border-b border-line/5 last:border-b-0"
                  >
                    <div className="text-sm text-ink font-medium">{r.name}</div>
                    <div className="text-xs text-ink-soft">{r.city}, {r.stateCode}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {status === 'error' && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Your name" className={inputClass} />
          <input type="email" required value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="Your email *" className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={!picked || status === 'submitting'}
          className="w-full py-3.5 rounded-none bg-brand hover:bg-brand-hi text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {status === 'submitting' ? 'Placing order…' : `Get My Review Cards — ${PRICE_LABEL}`}
        </button>
        <p className="text-center text-xs text-ink-soft">
          Secure checkout via Stripe. Kit delivered by email after payment.
        </p>
      </form>
    </div>
  )
}
