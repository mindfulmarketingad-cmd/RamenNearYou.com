'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const inputClass =
  'w-full px-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white text-sm outline-none focus:border-[#77567A] transition-colors'

export default function AmbassadorPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [whyApply, setWhyApply] = useState('')
  const [experience, setExperience] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/ambassador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, instagram, why_apply: whyApply, experience }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2F323A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Become a City Ambassador
            </h1>
            <p className="text-[#B0B3BB] text-base leading-relaxed">
              Represent your city&apos;s ramen scene. Help us surface the best bowls, write reviews,
              and grow the RamenNearYou community.
            </p>
          </div>

          {user === undefined ? (
            <div className="text-center text-[#B0B3BB] text-sm py-12">Loading&hellip;</div>
          ) : user === null ? (
            <div className="bg-[#1E2026] border border-white/10 rounded-xl p-8 text-center">
              <p className="text-[#B0B3BB] mb-4">You need to be signed in to apply.</p>
              <Link
                href="/auth/login?redirectTo=/ambassador"
                className="inline-block px-6 py-3 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors"
              >
                Sign in to apply
              </Link>
            </div>
          ) : submitted ? (
            <div className="bg-[#1E2026] border border-[#77567A]/30 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#77567A]/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#77567A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-bold text-white mb-2">Application received!</h2>
              <p className="text-[#B0B3BB] text-sm">
                We&apos;ll review it and get back to you within 3&ndash;5 business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#1E2026] border border-white/10 rounded-xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-sm font-medium">Your City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Los Angeles, CA"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-sm font-medium">
                    Instagram Handle{' '}
                    <span className="text-[#B0B3BB] font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BB] text-sm select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="yourhandle"
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">
                  Why do you want to be an ambassador?
                </label>
                <textarea
                  required
                  rows={4}
                  value={whyApply}
                  onChange={(e) => setWhyApply(e.target.value)}
                  placeholder="Tell us what drives your passion for ramen and your local community..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Describe your ramen experience</label>
                <textarea
                  required
                  rows={4}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="How long have you been eating ramen? Do you have favorites in your city? Have you written reviews before?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
