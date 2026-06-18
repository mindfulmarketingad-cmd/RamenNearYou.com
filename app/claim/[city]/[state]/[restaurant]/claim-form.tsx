'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Globe, Clock, User, CheckCircle } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ROLES = ['Owner', 'General Manager', 'Authorized Representative', 'Other']

interface ClaimFormProps {
  userEmail: string
  restaurant: Restaurant
}

function fieldClass(hasValue: boolean) {
  return `w-full px-4 py-3 bg-[#ffffff] border rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors ${
    hasValue ? 'border-black/8' : 'border-black/8'
  }`
}

export default function ClaimForm({ userEmail, restaurant }: ClaimFormProps) {
  const initialHours = Object.fromEntries(
    DAY_ORDER.map((day) => {
      const slots = restaurant.hours?.[day]
      return [
        day,
        slots
          ? slots[0] === 'Closed'
            ? 'Closed'
            : slots.join(' · ')
          : '',
      ]
    })
  )

  const [info, setInfo] = useState({
    name: restaurant.name,
    phone: restaurant.phone || '',
    website: restaurant.website || '',
    description: restaurant.description || '',
  })
  const [hours, setHours] = useState<Record<string, string>>(initialHours)
  const [contact, setContact] = useState({
    name: '',
    email: userEmail,
    role: 'Owner',
  })
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function setInfoField(key: keyof typeof info) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInfo((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmed) {
      setError('Please confirm you are the owner or authorized representative.')
      return
    }
    if (!contact.name.trim()) {
      setError('Please enter your name.')
      return
    }
    setError('')
    setLoading(true)

    const message = JSON.stringify({
      role: contact.role,
      corrections: {
        name: info.name,
        phone: info.phone,
        website: info.website,
        description: info.description,
        hours,
      },
    })

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_slug: restaurant.slug,
          restaurant_name: restaurant.name,
          restaurant_city: restaurant.city,
          contact_name: contact.name.trim(),
          contact_email: contact.email.trim(),
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to submit claim.')
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#B57F50]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[#B57F50]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">Claim Submitted!</h2>
        <p className="text-[#6B6862] leading-relaxed">
          Your claim for <span className="text-[#1E2026]">{restaurant.name}</span> is under review.
          We&apos;ll be in touch at <span className="text-[#1E2026]">{contact.email}</span> within 2–3 business days.
        </p>
        <Link
          href={`/${restaurant.citySlug}/${restaurant.stateSlug}/${restaurant.slug}`}
          className="inline-block mt-6 px-4 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors"
        >
          Back to Listing
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Section 1: Restaurant details */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-[#B57F50]" />
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Restaurant Details</h2>
        </div>
        <p className="text-[#6B6862] text-xs leading-relaxed">
          Review the information below and correct anything that&apos;s out of date.
        </p>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Restaurant Name</label>
          <input
            value={info.name}
            onChange={setInfoField('name')}
            required
            className={fieldClass(!!info.name)}
          />
        </div>

        {/* Address is read-only — requires admin verification to change */}
        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Address</label>
          <div className="px-4 py-3 bg-[#ffffff]/40 border border-black/5 rounded-lg text-[#6B6862] text-sm">
            {restaurant.address}
          </div>
          <p className="text-xs text-[#6B6862]/40 mt-1">Address updates are reviewed by our team.</p>
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
            <Phone className="w-3 h-3 inline mr-1" />Phone
          </label>
          <input
            type="tel"
            value={info.phone}
            onChange={setInfoField('phone')}
            placeholder="(404) 555-0123"
            className={fieldClass(!!info.phone)}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
            <Globe className="w-3 h-3 inline mr-1" />Website
          </label>
          <input
            type="url"
            value={info.website}
            onChange={setInfoField('website')}
            placeholder="https://yourrestaurant.com"
            className={fieldClass(!!info.website)}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Description</label>
          <textarea
            rows={3}
            value={info.description}
            onChange={setInfoField('description')}
            placeholder="Tell customers what makes your ramen special…"
            className={`${fieldClass(!!info.description)} resize-none`}
          />
        </div>
      </div>

      {/* Section 2: Hours */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-[#B57F50]" />
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Business Hours</h2>
        </div>
        <p className="text-[#6B6862] text-xs">Use &ldquo;Closed&rdquo; for days you&apos;re not open. Format: 11:00 AM – 10:00 PM</p>

        <div className="space-y-2 pt-1">
          {DAY_ORDER.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-[#6B6862] text-sm w-24 flex-shrink-0">{day}</span>
              <input
                value={hours[day]}
                onChange={(e) => setHours((prev) => ({ ...prev, [day]: e.target.value }))}
                placeholder="e.g. 11:00 AM – 10:00 PM or Closed"
                className="flex-1 px-3 py-2 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/40 text-sm outline-none focus:border-[#B57F50] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Contact info */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-[#B57F50]" />
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Your Information</h2>
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Full Name <span className="text-red-400">*</span></label>
          <input
            value={contact.name}
            onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            required
            className={fieldClass(!!contact.name)}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Email <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
            required
            className={fieldClass(!!contact.email)}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Your Role <span className="text-red-400">*</span></label>
          <select
            value={contact.role}
            onChange={(e) => setContact((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            confirmed ? 'bg-[#B57F50] border-[#B57F50]' : 'border-black/12 group-hover:border-[#B57F50]/50'
          }`}>
            {confirmed && (
              <svg className="w-3 h-3 text-[#1E2026]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-[#6B6862] leading-relaxed">
          I confirm that I am the <strong className="text-[#1E2026]">{contact.role.toLowerCase()}</strong> or authorized representative of{' '}
          <strong className="text-[#1E2026]">{restaurant.name}</strong> and that the information I&apos;ve provided is accurate.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !confirmed}
        className="w-full px-4 py-3 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting claim…' : 'Submit Claim'}
      </button>

      <p className="text-center text-xs text-[#6B6862]/50">
        Claims are reviewed within 2–3 business days. One claim per restaurant is accepted.
      </p>
    </form>
  )
}
