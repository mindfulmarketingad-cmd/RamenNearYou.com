'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, BarChart2, Clock, Globe, MapPin, Search, CheckCircle2 } from 'lucide-react'
import { searchRestaurants } from '@/lib/search'

const BENEFITS = [
  { icon: BadgeCheck, text: 'Verified owner badge on your listing' },
  { icon: Globe, text: 'Update your website, phone, and description' },
  { icon: Clock, text: 'Keep your hours accurate and up to date' },
  { icon: BarChart2, text: 'See weekly page visit analytics' },
  { icon: MapPin, text: 'Featured placement on your city page' },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

const inputClass =
  'w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm placeholder-[#9B9490] outline-none focus:border-[#B57F50] transition-colors'

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

  const matches = useMemo(() => {
    if (!query.trim()) return []
    return searchRestaurants(query).slice(0, 50)
  }, [query])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Submission failed')
      }
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-[#ffffff] rounded-2xl border border-black/8 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">Submission Received!</h2>
        <p className="text-[#6B6862] leading-relaxed max-w-sm mx-auto">
          Thanks — we&apos;ll add your restaurant to the directory and email you so you can finish claiming it. This usually takes 2–3 business days.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-black/8 p-8">
      {/* Pricing header */}
      <div className="text-center mb-6 pb-6 border-b border-black/6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-semibold mb-3">
          14-Day Free Trial
        </div>
        <div className="flex items-end justify-center gap-1.5 mb-1">
          <span className="font-serif text-5xl font-bold text-[#1E2026]">$0</span>
          <span className="text-[#6B6862] text-sm mb-2">today</span>
        </div>
        <p className="text-[#9B9490] text-xs">Then $19.99/month after your free trial. Cancel anytime.</p>
      </div>

      {/* Benefits */}
      <ul className="space-y-3 mb-8">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-[#1E2026]">
            <CheckCircle2 className="w-4 h-4 text-[#B57F50] shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      {!manual ? (
        <>
          {/* Search */}
          <p className="text-sm font-semibold text-[#1E2026] mb-3">Find your restaurant</p>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E2026]/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                placeholder="Search by restaurant name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F4F0] border border-black/8 text-[#1E2026] text-sm placeholder-[#9B9490] focus:outline-none focus:border-[#B57F50]/50"
              />
            </div>

            {open && (
              <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#ffffff] border border-black/8 rounded-xl shadow-xl">
                {!query.trim() ? (
                  <div className="p-4 text-sm text-[#6B6862]">Type your restaurant name to search…</div>
                ) : matches.length === 0 ? (
                  <div className="p-4 text-sm text-[#6B6862]">
                    No restaurants found for &ldquo;{query}&rdquo;.
                    <button onClick={() => setManual(true)} className="block mt-2 text-[#B57F50] font-semibold hover:underline">
                      Add it manually →
                    </button>
                  </div>
                ) : (
                  matches.map(r => (
                    <Link
                      key={r.slug}
                      href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                      className="block px-4 py-3 hover:bg-[#F5F4F0] transition-colors border-b border-black/5 last:border-b-0"
                      onClick={() => setOpen(false)}
                    >
                      <div className="text-sm text-[#1E2026] font-medium">{r.name}</div>
                      <div className="text-xs text-[#6B6862]">{r.city}, {r.stateCode}</div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <p className="text-center text-sm text-[#6B6862] mt-4">
            Can&apos;t find your restaurant?{' '}
            <button onClick={() => setManual(true)} className="text-[#B57F50] font-semibold hover:underline">
              Add it manually
            </button>
          </p>
        </>
      ) : (
        <>
          {/* Manual entry */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#1E2026]">Add your restaurant</p>
            <button onClick={() => setManual(false)} className="text-xs text-[#6B6862] hover:text-[#1E2026]">
              ← Back to search
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {status === 'error' && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            <input name="name" required value={form.name} onChange={handleChange} placeholder="Restaurant name *" className={inputClass} />
            <input name="address" required value={form.address} onChange={handleChange} placeholder="Street address *" className={inputClass} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <input name="city" required value={form.city} onChange={handleChange} placeholder="City *" className={`${inputClass} col-span-2 sm:col-span-1`} />
              <select name="state" required value={form.state} onChange={handleChange} className={`${inputClass} appearance-none`}>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
              <input name="website" type="url" value={form.website} onChange={handleChange} placeholder="Website" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Your name" className={inputClass} />
              <input name="ownerEmail" type="email" required value={form.ownerEmail} onChange={handleChange} placeholder="Your email *" className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Restaurant'}
            </button>
            <p className="text-center text-xs text-[#6B6862]">
              We&apos;ll add your restaurant and email you to finish claiming it.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
