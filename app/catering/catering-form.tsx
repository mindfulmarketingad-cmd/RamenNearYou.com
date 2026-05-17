'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

const EVENT_TYPES = ['Corporate Event', 'Wedding', 'Birthday Party', 'Office Lunch', 'Festival / Pop-Up', 'Private Dinner', 'Other']
const GUEST_RANGES = ['Under 25', '25–50', '51–100', '101–250', '250+']

export default function CateringForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    eventDate: '',
    location: '',
    budget: '',
    notes: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const inputClass = 'w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.eventType || !form.guestCount) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#1E2026] rounded-xl border border-white/5 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#77567A]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[#77567A]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Request Received!</h2>
        <p className="text-[#B0B3BB] leading-relaxed">
          We&apos;ll review your event details and connect you with matching ramen caterers. Expect to hear from us within 1 business day at{' '}
          <span className="text-white">{form.email}</span>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1E2026] rounded-xl border border-white/5 p-8 space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Your Name <span className="text-red-400">*</span></label>
          <input value={form.name} onChange={set('name')} placeholder="Full name" required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Email <span className="text-red-400">*</span></label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(404) 555-0100" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Event Location</label>
          <input value={form.location} onChange={set('location')} placeholder="City or venue" className={inputClass} />
        </div>
      </div>

      {/* Event details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Event Type <span className="text-red-400">*</span></label>
          <select value={form.eventType} onChange={set('eventType')} required className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="">Select event type…</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Guest Count <span className="text-red-400">*</span></label>
          <select value={form.guestCount} onChange={set('guestCount')} required className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="">Estimated guests…</option>
            {GUEST_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Event Date</label>
          <input type="date" value={form.eventDate} onChange={set('eventDate')} className={`${inputClass} [color-scheme:dark]`} />
        </div>
        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Budget (optional)</label>
          <input value={form.budget} onChange={set('budget')} placeholder="e.g. $500–$1,000" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Additional Notes</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Any dietary requirements, special requests, or details that will help us match you with the right caterer…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending…' : 'Get Free Quotes'}
      </button>
      <p className="text-center text-xs text-[#B0B3BB]/50">
        No commitment. We&apos;ll match you with caterers and you choose.
      </p>
    </form>
  )
}
