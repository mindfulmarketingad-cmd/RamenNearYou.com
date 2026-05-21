'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setError('Authentication service is unavailable. Please try again later.')
      setGoogleLoading(false)
      return
    }
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError('Authentication service is unavailable. Please try again later.')
      setLoading(false)
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-white border border-black/10 text-[#1E2026] text-sm font-medium hover:bg-[#F5F4F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black/8" />
        <span className="text-xs text-[#9B9490]">or</span>
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
        </div>
        <div>
          <label className="block text-sm text-[#6B6862] mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full px-4 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#B57F50]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-[#6B6862]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#B57F50] hover:text-[#B57F50]/80 transition-colors">
            Create one
          </Link>
        </p>
      </form>
    </div>
  )
}

export default function LoginPage() {
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
          <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Welcome back</h1>
          <p className="text-[#6B6862] text-sm">Sign in to manage your listings</p>
        </div>
        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-8">
          <Suspense fallback={<div className="text-[#6B6862] text-sm text-center">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
