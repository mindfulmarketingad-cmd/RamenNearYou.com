'use client'

import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { supabase } from '@/lib/owner-portal'

// Passwordless sign-in: a magic link plus a 6-digit code fallback (for
// owners whose email app opens links in a different browser), and Google.
export default function SignIn({
  redirectPath, intro, fallbackHref,
  label = 'Your work email',
  placeholder = 'you@yourrestaurant.com',
  hint = 'Using an address at your restaurant’s website domain (e.g. you@yourramen.com) gets you verified instantly.',
}: {
  redirectPath: string; intro?: React.ReactNode; fallbackHref?: string
  label?: string; placeholder?: string; hint?: React.ReactNode
}) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = () => `${window.location.origin}${redirectPath}`

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo(), shouldCreateUser: true },
    })
    setBusy(false)
    if (error) setError(error.message.includes('rate') ? 'Too many emails requested — wait a minute and try again.' : error.message)
    else setSent(true)
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setError('That code didn’t work — check it, or request a new email.')
  }

  async function google() {
    setError(null)
    const { error } = await supabase().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })
    if (error) setError(error.message)
  }

  return (
    <div className="bg-surface border border-line/8 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
      {intro}
      {!sent ? (
        <form onSubmit={send} className="space-y-3">
          <label className="block text-sm font-semibold text-ink" htmlFor="owner-email">{label}</label>
          <input
            id="owner-email" type="email" required autoComplete="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder={placeholder}
            className="w-full rounded-xl border border-line/15 bg-page px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          {hint && <p className="text-xs text-ink-soft">{hint}</p>}
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hi disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Email me a sign-in link
          </button>
          <div className="relative py-2 text-center text-xs text-ink-soft"><span className="bg-surface px-2">or</span></div>
          <button type="button" onClick={google} className="w-full rounded-xl border border-line/15 px-4 py-3 font-semibold text-ink hover:bg-sunken">
            Continue with Google
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-ink"><strong>Check your inbox.</strong> We sent a sign-in link to <strong>{email}</strong>. Click it, or type the 6-digit code from the email here:</p>
          <input
            inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" value={code}
            onChange={e => setCode(e.target.value)} placeholder="123456"
            className="w-full rounded-xl border border-line/15 bg-page px-4 py-3 text-center text-lg tracking-[0.3em] text-ink"
          />
          <button disabled={busy || code.trim().length < 6} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hi disabled:opacity-60">
            {busy ? 'Checking…' : 'Verify code'}
          </button>
          <button type="button" onClick={() => { setSent(false); setCode('') }} className="w-full text-sm text-ink-soft underline">
            Use a different email
          </button>
          {fallbackHref && (
            <p className="text-xs text-ink-soft text-center">
              No email after a few minutes? Check spam, or <a href={fallbackHref} className="underline">claim by email instead</a>.
            </p>
          )}
        </form>
      )}
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  )
}
