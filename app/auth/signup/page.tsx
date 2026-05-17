'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

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
  const [success, setSuccess] = useState(false)

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
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setErrors({ form: error.message })
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#2F323A] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#77567A]/20 flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="w-7 h-7 text-[#77567A]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-[#B0B3BB] leading-relaxed mb-6">
            We&apos;ve sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.
          </p>
          <Link href="/auth/login" className="inline-block px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors">
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#2F323A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#77567A] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-white">RamenNearYou</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-[#B0B3BB] text-sm">List and manage your ramen restaurant</p>
        </div>
        <div className="bg-[#1E2026] rounded-xl border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errors.form}
              </div>
            )}
            <div>
              <label className="block text-sm text-[#B0B3BB] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-[#B0B3BB] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm text-[#B0B3BB] mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-[#77567A] transition-colors"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#77567A]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <p className="text-center text-sm text-[#B0B3BB]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#77567A] hover:text-[#77567A]/80 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
