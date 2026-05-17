'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Restaurant } from '@/lib/restaurants'

interface ClaimFormProps {
  userId: string
  restaurant: Restaurant
}

export default function ClaimForm({ userId, restaurant }: ClaimFormProps) {
  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('claims').insert({
      user_id: userId,
      restaurant_slug: restaurant.slug,
      restaurant_name: restaurant.name,
      restaurant_city: restaurant.city,
      contact_name: form.contactName.trim(),
      contact_email: form.contactEmail.trim(),
      message: form.message.trim() || null,
      status: 'pending',
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('This listing has already been claimed. If you believe this is an error, please contact us.')
      } else {
        setError(insertError.message)
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-[#1E2026] rounded-xl border border-white/5 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#77567A]/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#77567A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Claim Submitted!</h2>
        <p className="text-[#B0B3BB] leading-relaxed">
          Your claim for <span className="text-white">{restaurant.name}</span> is under review. We&apos;ll be in touch within 2–3 business days.
        </p>
        <Link href={`/${restaurant.citySlug}/${restaurant.stateSlug}/${restaurant.slug}`} className="inline-block mt-6 px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors">
          Back to Listing
        </Link>
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

      <div className="p-4 rounded-lg bg-[#77567A]/10 border border-[#77567A]/20 text-sm text-[#B0B3BB]">
        <p className="font-medium text-white mb-1">Claiming: {restaurant.name}</p>
        <p>{restaurant.address}</p>
      </div>

      <div>
        <label className="block text-sm text-[#B0B3BB] mb-1.5">Your Name <span className="text-red-400">*</span></label>
        <input
          name="contactName"
          required
          value={form.contactName}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-[#B0B3BB] mb-1.5">Contact Email <span className="text-red-400">*</span></label>
        <input
          name="contactEmail"
          type="email"
          required
          value={form.contactEmail}
          onChange={handleChange}
          placeholder="owner@yourrestaurant.com"
          className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-[#B0B3BB] mb-1.5">Message <span className="text-[#B0B3BB]/50">(optional)</span></label>
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us why you're the owner or authorized representative…"
          className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting claim…' : 'Submit Claim'}
      </button>
      <p className="text-center text-xs text-[#B0B3BB]">
        Claims are reviewed within 2–3 business days. Only one claim per restaurant is accepted.
      </p>
    </form>
  )
}
