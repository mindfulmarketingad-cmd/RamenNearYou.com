'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const BROTH_OPTIONS = ['Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan', 'Shio', 'Other']

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

export default function ListForm() {
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: 'GA', zip: '',
    phone: '', website: '', description: '', hours: '',
    ownerName: '', ownerEmail: '',
  })
  const [brothTypes, setBrothTypes] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function toggleBroth(type: string) {
    setBrothTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, brothTypes }),
      })
      if (!res.ok) {
        const json = await res.json()
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
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">Submission Received!</h2>
        <p className="text-[#6B6862] leading-relaxed max-w-sm mx-auto">
          Thanks for submitting your restaurant. We&apos;ll review your listing and reach out once it&apos;s approved and live on the directory.
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
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Restaurant details */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <h2 className="font-semibold text-[#1E2026] text-base mb-1">Restaurant Details</h2>

        {status === 'error' && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm text-[#6B6862] mb-1.5">Restaurant Name <span className="text-[#B57F50]">*</span></label>
          <input
            name="name" required value={form.name} onChange={handleChange}
            placeholder="e.g. Hakata Ramen House"
            className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#6B6862] mb-1.5">Street Address <span className="text-[#B57F50]">*</span></label>
          <input
            name="address" required value={form.address} onChange={handleChange}
            placeholder="e.g. 123 Peachtree St NE"
            className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm text-[#6B6862] mb-1.5">City <span className="text-[#B57F50]">*</span></label>
            <input
              name="city" required value={form.city} onChange={handleChange}
              placeholder="Atlanta"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">State <span className="text-[#B57F50]">*</span></label>
            <select
              name="state" required value={form.state} onChange={handleChange}
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none"
            >
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">ZIP Code</label>
            <input
              name="zip" value={form.zip} onChange={handleChange}
              placeholder="30309"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">Phone</label>
            <input
              name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="+1 404-555-0100"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">Website</label>
            <input
              name="website" type="url" value={form.website} onChange={handleChange}
              placeholder="https://yourrestaurant.com"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#6B6862] mb-1.5">Hours</label>
          <input
            name="hours" value={form.hours} onChange={handleChange}
            placeholder="e.g. Mon–Fri 11am–9pm, Sat–Sun 12pm–10pm"
            className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#6B6862] mb-2">Broth Types Served</label>
          <div className="flex flex-wrap gap-2">
            {BROTH_OPTIONS.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleBroth(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  brothTypes.includes(type)
                    ? 'bg-[#B57F50] border-[#B57F50] text-[#1E2026]'
                    : 'border-black/8 text-[#6B6862] hover:border-white/30 hover:text-[#1E2026]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#6B6862] mb-1.5">Description</label>
          <textarea
            name="description" rows={4} value={form.description} onChange={handleChange}
            placeholder="Tell ramen lovers what makes your restaurant special — broth style, signature dishes, atmosphere…"
            className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors resize-none"
          />
        </div>
      </div>

      {/* Owner contact */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <h2 className="font-semibold text-[#1E2026] text-base mb-1">Your Contact Info</h2>
        <p className="text-[#6B6862] text-xs -mt-2">So we can reach you when your listing is approved.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">Your Name</label>
            <input
              name="ownerName" value={form.ownerName} onChange={handleChange}
              placeholder="Jane Smith"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B6862] mb-1.5">Your Email</label>
            <input
              name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange}
              placeholder="owner@yourrestaurant.com"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit for Review'}
      </button>
      <p className="text-center text-xs text-[#6B6862]">
        Listings are free and reviewed within 2–3 business days. We&apos;ll email you when approved.
      </p>
    </form>
  )
}
