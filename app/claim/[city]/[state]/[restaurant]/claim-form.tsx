'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, User, CheckCircle, Building2, ShieldCheck, Pencil } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

interface ClaimFormProps {
  userEmail: string
  userDisplayName: string
  restaurant: Restaurant
}

function fieldClass() {
  return 'w-full px-4 py-3 bg-surface border border-line/8 rounded-lg text-ink placeholder-ink-faint/60 text-sm outline-none focus:border-brand transition-colors'
}

export default function ClaimForm({ userEmail, userDisplayName, restaurant }: ClaimFormProps) {
  // One-click path only works once we already have a name to submit — Google
  // sign-in gives us that most of the time. Without one (e.g. email/password
  // accounts with no name set), fall straight into the editable form since
  // there's a required field only the visitor can fill in.
  const [mode, setMode] = useState<'confirm' | 'edit'>(userDisplayName.trim() ? 'confirm' : 'edit')

  const [businessName, setBusinessName] = useState(restaurant.name)
  const [phone, setPhone] = useState(restaurant.phone || '')
  const [contact, setContact] = useState({
    name: userDisplayName,
    email: userEmail,
  })
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submitClaim(name: string, email: string, name_: string, phone_: string) {
    setError('')
    setLoading(true)

    const message = JSON.stringify({
      role: 'Owner',
      corrections: { name: name_, phone: phone_ },
    })

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_slug: restaurant.slug,
          restaurant_name: name_,
          restaurant_city: restaurant.city,
          contact_name: name.trim(),
          contact_email: email.trim(),
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

  // One-click submit — everything is already known (restaurant name/phone on
  // file, name/email from the signed-in Google account), so a single button
  // press is the entire claim flow.
  function handleOneClickClaim() {
    submitClaim(userDisplayName, userEmail, restaurant.name, restaurant.phone || '')
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmed) {
      setError('Please confirm you are the owner or authorized representative.')
      return
    }
    if (!contact.name.trim()) {
      setError('Please enter your name.')
      return
    }
    await submitClaim(contact.name, contact.email, businessName, phone)
  }

  if (success) {
    const claimedName = mode === 'confirm' ? restaurant.name : businessName
    const claimedEmail = mode === 'confirm' ? userEmail : contact.email
    return (
      <div className="bg-sunken rounded-xl border border-line/5 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-brand-ink" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Claim Submitted!</h2>
        <p className="text-ink-soft leading-relaxed">
          Your claim for <span className="text-ink">{claimedName}</span> is under review.
          We&apos;ll be in touch at <span className="text-ink">{claimedEmail}</span> within 2–3 business days.
        </p>
        <Link
          href={`/${restaurant.citySlug}/${restaurant.stateSlug}/${restaurant.slug}`}
          className="inline-block mt-6 px-4 py-2.5 rounded-none bg-brand text-white text-sm font-medium hover:bg-brand/80 transition-colors"
        >
          Back to Listing
        </Link>
      </div>
    )
  }

  // ── One-click confirm screen ──
  if (mode === 'confirm') {
    return (
      <div className="space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-sunken rounded-xl border border-line/5 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-ink" />
            <h2 className="font-serif text-lg font-bold text-ink">Confirm Your Claim</h2>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-xs text-ink-soft uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Business
            </span>
            <span className="text-sm font-medium text-ink text-right">{restaurant.name}</span>
          </div>
          <div className="flex items-center justify-between gap-3 py-1 border-t border-line/5 pt-3">
            <span className="text-xs text-ink-soft uppercase tracking-wide flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Claiming as
            </span>
            <span className="text-sm font-medium text-ink text-right">{userDisplayName}</span>
          </div>
          <div className="flex items-center justify-between gap-3 py-1 border-t border-line/5 pt-3">
            <span className="text-xs text-ink-soft uppercase tracking-wide">Email</span>
            <span className="text-sm font-medium text-ink text-right">{userEmail}</span>
          </div>
        </div>

        <p className="text-xs text-ink-soft/70 leading-relaxed">
          By clicking below, you confirm you are the owner or an authorized representative of{' '}
          <strong className="text-ink/80">{restaurant.name}</strong> and that the information above is accurate.
        </p>

        <button
          type="button"
          onClick={handleOneClickClaim}
          disabled={loading}
          className="w-full px-4 py-3.5 rounded-none bg-brand text-white text-sm font-semibold hover:bg-brand-hi transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting claim…' : 'Complete My Claim'}
        </button>

        <button
          type="button"
          onClick={() => setMode('edit')}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors"
        >
          <Pencil className="w-3 h-3" /> Business phone wrong, or claiming under a different name? Edit details
        </button>

        <p className="text-center text-xs text-ink-soft/50">
          Claims are reviewed within 2–3 business days. One claim per restaurant is accepted.
        </p>
      </div>
    )
  }

  // ── Editable fallback form (no derivable name, or the visitor chose to edit) ──
  return (
    <form onSubmit={handleEditSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-sunken rounded-xl border border-line/5 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-brand-ink" />
          <h2 className="font-serif text-lg font-bold text-ink">Claim This Listing</h2>
        </div>
        <p className="text-ink-soft text-xs leading-relaxed">
          Just a few details so we can verify you&apos;re the owner or authorized representative.
        </p>

        <div>
          <label className="block text-xs text-ink-soft mb-1.5 uppercase tracking-wide">
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
          <label className="block text-xs text-ink-soft mb-1.5 uppercase tracking-wide">
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
          <label className="block text-xs text-ink-soft mb-1.5 uppercase tracking-wide">Your Full Name <span className="text-red-400">*</span></label>
          <input
            value={contact.name}
            onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            required
            className={fieldClass()}
          />
        </div>

        <div>
          <label className="block text-xs text-ink-soft mb-1.5 uppercase tracking-wide">Your Email <span className="text-red-400">*</span></label>
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
            confirmed ? 'bg-brand border-brand' : 'border-line/12 group-hover:border-brand/50'
          }`}>
            {confirmed && (
              <svg className="w-3 h-3 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-ink-soft leading-relaxed">
          I confirm that I am the owner or authorized representative of{' '}
          <strong className="text-ink">{businessName}</strong> and that the information I&apos;ve provided is accurate.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !confirmed}
        className="w-full px-4 py-3 rounded-none bg-brand text-white text-sm font-semibold hover:bg-brand-hi transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting claim…' : 'Submit Claim'}
      </button>

      {userDisplayName.trim() && (
        <button
          type="button"
          onClick={() => setMode('confirm')}
          className="w-full text-xs text-ink-soft hover:text-ink transition-colors"
        >
          ← Back to one-click claim
        </button>
      )}

      <p className="text-center text-xs text-ink-soft/50">
        Claims are reviewed within 2–3 business days. One claim per restaurant is accepted.
      </p>
    </form>
  )
}
