'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { restaurants } from '@/lib/restaurants'

interface ListFormProps {
  userId: string
}

export default function ListForm({ userId }: ListFormProps) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: 'GA',
    phone: '',
    website: '',
    description: '',
  })
  const [error, setError] = useState<{ message: string; claimSlug?: string; claimCity?: string; claimState?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const nameLower = form.name.trim().toLowerCase()
    const cityLower = form.city.trim().toLowerCase()

    // Check static restaurant data for duplicates
    const staticMatch = restaurants.find(
      r => r.name.toLowerCase() === nameLower && r.city.toLowerCase() === cityLower
    )
    if (staticMatch) {
      setError({
        message: 'This restaurant is already listed — you can claim it instead.',
        claimSlug: staticMatch.slug,
        claimCity: staticMatch.citySlug,
        claimState: staticMatch.stateSlug,
      })
      setLoading(false)
      return
    }

    // Check Supabase listings table for duplicates
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('listings')
      .select('id')
      .ilike('name', form.name.trim())
      .ilike('city', form.city.trim())
      .limit(1)

    if (existing && existing.length > 0) {
      setError({ message: 'A listing for this restaurant has already been submitted.' })
      setLoading(false)
      return
    }

    // Insert new listing
    const { error: insertError } = await supabase.from('listings').insert({
      user_id: userId,
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
      status: 'pending',
    })

    if (insertError) {
      setError({ message: insertError.message })
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
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Listing Submitted!</h2>
        <p className="text-[#B0B3BB] leading-relaxed">
          Your restaurant has been submitted for review. We&apos;ll reach out once it&apos;s approved and live on the directory.
        </p>
        <Link href="/" className="inline-block mt-6 px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1E2026] rounded-xl border border-white/5 p-8 space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error.message}
          {error.claimSlug && (
            <span>
              {' '}
              <Link
                href={`/${error.claimCity}/${error.claimState}/${error.claimSlug}`}
                className="underline hover:text-red-300 transition-colors"
              >
                View the listing
              </Link>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-[#B0B3BB] mb-1.5">Restaurant Name <span className="text-red-400">*</span></label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Hakata Ramen House"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-[#B0B3BB] mb-1.5">Street Address <span className="text-red-400">*</span></label>
          <input
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 123 Main St"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#B0B3BB] mb-1.5">City <span className="text-red-400">*</span></label>
          <input
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Atlanta"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#B0B3BB] mb-1.5">State <span className="text-red-400">*</span></label>
          <input
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            placeholder="e.g. GA"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#B0B3BB] mb-1.5">Phone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. +1 404-555-0100"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#B0B3BB] mb-1.5">Website</label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://yourrestaurant.com"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-[#B0B3BB] mb-1.5">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Tell ramen lovers what makes your restaurant special…"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : 'Submit Listing'}
      </button>
      <p className="text-center text-xs text-[#B0B3BB]">
        Listings are free and reviewed within 2–3 business days.
      </p>
    </form>
  )
}
