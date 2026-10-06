'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, CheckCircle2 } from 'lucide-react'
import { searchRestaurants } from '@/lib/restaurant-search-client'
import { claimMailto, sendViaMail } from '@/lib/mailto'

interface SearchMatch {
  slug: string
  name: string
  city: string
  stateCode: string
  citySlug: string
  stateSlug: string
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

const inputClass =
  'w-full px-4 py-3 bg-sunken border border-line/8 rounded-lg text-ink text-sm placeholder-ink-faint outline-none focus:border-brand transition-colors'

export default function ClaimSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [manual, setManual] = useState(false)

  const [form, setForm] = useState({
    name: '', address: '', city: '', state: 'GA', zip: '',
    phone: '', website: '', ownerName: '', ownerEmail: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [matches, setMatches] = useState<SearchMatch[]>([])

  // Debounced search over the static map data (lib/restaurant-search-client).
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setMatches([])
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      searchRestaurants(trimmed).then((res) => { if (!cancelled) setMatches(res.slice(0, 50)) })
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // No backend: the new listing opens in the owner's mail app, filled in.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendViaMail(`New listing: ${form.name} (${form.city}, ${form.state})`, [
      ['Restaurant', form.name], ['Address', form.address], ['City', form.city], ['State', form.state],
      ['ZIP', form.zip], ['Phone', form.phone], ['Website', form.website],
      ['Owner name', form.ownerName], ['Owner email', form.ownerEmail],
    ], 'Please add my restaurant to RamenNearYou and mark me as the owner.')
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="bg-surface rounded-2xl border border-line/8 p-8 sm:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Almost done</h2>
        <p className="text-ink-soft leading-relaxed max-w-sm mx-auto mb-6">
          Your email app should open with{' '}
          {form.name.trim() ? <strong>{form.name.trim()}</strong> : 'your restaurant'}&apos;s details filled in —
          hit send there, and we&apos;ll add it to the directory and reply with next steps to claim it.
        </p>

        <Link href="/" className="inline-block text-sm text-ink-soft hover:text-ink transition-colors">
          Maybe later — back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-line/8 p-8">
      {!manual ? (
        <>
          {/* Search — the very first action on the page */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-bold text-ink">Start here — find your restaurant 👇</p>
          </div>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                placeholder="Search by restaurant name..."
                aria-label="Search by restaurant name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-sunken border border-line/8 text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-brand/50"
              />
            </div>

            {open && (
              <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-surface border border-line/8 rounded-xl shadow-xl">
                {!query.trim() ? (
                  <div className="p-4 text-sm text-ink-soft">Type your restaurant name to search…</div>
                ) : matches.length === 0 ? (
                  <div className="p-4 text-sm text-ink-soft">
                    No restaurants found for &ldquo;{query}&rdquo;.
                    <button onClick={() => setManual(true)} className="block mt-2 text-brand-ink font-semibold hover:underline">
                      Add it manually →
                    </button>
                  </div>
                ) : (
                  matches.map(r => (
                    <a
                      key={r.slug}
                      href={claimMailto(r.name, r.city, r.stateCode)}
                      className="block px-4 py-3 hover:bg-sunken transition-colors border-b border-line/5 last:border-b-0"
                      onClick={() => setOpen(false)}
                    >
                      <div className="text-sm text-ink font-medium">{r.name}</div>
                      <div className="text-xs text-ink-soft">{r.city}, {r.stateCode}</div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          <p className="text-center text-sm text-ink-soft mt-4">
            Can&apos;t find your restaurant?{' '}
            <button onClick={() => setManual(true)} className="text-brand-ink font-semibold hover:underline">
              Add it manually
            </button>
          </p>
        </>
      ) : (
        <>
          {/* Manual entry */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-ink">Add your restaurant</p>
            <button onClick={() => setManual(false)} className="text-xs text-ink-soft hover:text-ink">
              ← Back to search
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {status === 'error' && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            <input name="name" required aria-label="Restaurant name" value={form.name} onChange={handleChange} placeholder="Restaurant name *" className={inputClass} />
            <input name="address" required aria-label="Street address" value={form.address} onChange={handleChange} placeholder="Street address *" className={inputClass} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <input name="city" required aria-label="City" value={form.city} onChange={handleChange} placeholder="City *" className={`${inputClass} col-span-2 sm:col-span-1`} />
              <select name="state" required aria-label="State" value={form.state} onChange={handleChange} className={`${inputClass} appearance-none`}>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input name="zip" aria-label="ZIP code" value={form.zip} onChange={handleChange} placeholder="ZIP" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="phone" type="tel" aria-label="Phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
              <input name="website" type="url" aria-label="Website" value={form.website} onChange={handleChange} placeholder="Website" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="ownerName" aria-label="Your name" value={form.ownerName} onChange={handleChange} placeholder="Your name" className={inputClass} />
              <input name="ownerEmail" type="email" required aria-label="Your email" value={form.ownerEmail} onChange={handleChange} placeholder="Your email *" className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 rounded-none bg-brand hover:bg-brand-hi text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Restaurant'}
            </button>
            <p className="text-center text-xs text-ink-soft">
              We&apos;ll add your restaurant and reply with next steps to claim it.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
