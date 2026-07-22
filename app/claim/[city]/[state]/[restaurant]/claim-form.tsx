'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, User, CheckCircle, Building2 } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

interface ClaimFormProps {
  userEmail: string
  restaurant: Restaurant
}

function fieldClass() {
  return 'w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors'
}

export default function ClaimForm({ userEmail, restaurant }: ClaimFormProps) {
  const [businessName, setBusinessName] = useState(restaurant.name)
  const [phone, setPhone] = useState(restaurant.phone || '')
  const [contact, setContact] = useState({
    name: '',
    email: userEmail,
  })
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
      role: 'Owner',
      corrections: {
        name: businessName,
        phone,
      },
    })

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_slug: restaurant.slug,
          restaurant_name: businessName,
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
          <CheckCircle className="w-7 h-7 text-[#96602F]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">Claim Submitted!</h2>
        <p className="text-[#6B6862] leading-relaxed">
          Your claim for <span className="text-[#1E2026]">{businessName}</span> is under review.
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

      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-[#96602F]" />
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Claim This Listing</h2>
        </div>
        <p className="text-[#6B6862] text-xs leading-relaxed">
          Just a few details so we can verify you&apos;re the owner or authorized representative.
        </p>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
            <Building2 className="w-3 h-3 inline mr-1" />Business Name <span className="text-red-400">*</span>
          </label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className={fieldClass()}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
            <Phone className="w-3 h-3 inline mr-1" />Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(404) 555-0123"
            required
            className={fieldClass()}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Your Full Name <span className="text-red-400">*</span></label>
          <input
            value={contact.name}
            onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            required
            className={fieldClass()}
          />
        </div>

        <div>
          <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Your Email <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
            required
            className={fieldClass()}
          />
        </div>
      </div>

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
          I confirm that I am the owner or authorized representative of{' '}
          <strong className="text-[#1E2026]">{businessName}</strong> and that the information I&apos;ve provided is accurate.
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
