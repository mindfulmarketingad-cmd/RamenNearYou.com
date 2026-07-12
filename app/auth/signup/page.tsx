'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleGoogleSignIn() {
    setErrors({})
    setGoogleLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setErrors({ form: 'Authentication service is not configured. Please contact support.' })
      setGoogleLoading(false)
      return
    }
    const callbackUrl = `${window.location.origin}/auth/callback?next=/`
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    })
    if (oauthError) {
      setErrors({ form: oauthError.message })
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = signUpSchema.safeParse({ email, password, confirmPassword })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        setErrors({ form: 'Authentication service is not configured. Please contact support.' })
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setErrors({ form: error.message })
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#B57F50]/20 flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="w-7 h-7 text-[#96602F]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-3">Check your email</h1>
          <p className="text-[#6B6862] leading-relaxed mb-6">
            We&apos;ve sent a confirmation link to <span className="text-[#1E2026]">{email}</span>. Click it to activate your free account — then you&apos;re ready to explore the map, menus, and ordering.
          </p>
          <Link href="/auth/login" className="inline-block px-4 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors">
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#B57F50] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#1E2026]" />
            </div>
            <span className="font-serif text-xl font-bold text-[#1E2026]">RamenNearYou</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Create your account</h1>
          <p className="text-[#6B6862] text-sm">List and manage your ramen restaurant</p>
        </div>
        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-8">
          <div className="space-y-4">
            {errors.form && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-none bg-white border border-black/10 text-[#1E2026] text-sm font-medium hover:bg-[#F5F4F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-black/8" />
              <span className="text-xs text-[#6B6862]">or</span>
              <div className="flex-1 h-px bg-black/8" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#6B6862] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-[#6B6862] mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors"
                />
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm text-[#6B6862] mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full px-4 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
              <p className="text-center text-sm text-[#6B6862]">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#96602F] hover:text-[#96602F]/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
