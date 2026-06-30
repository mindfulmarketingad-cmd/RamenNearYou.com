'use client'

import { useState } from 'react'
import { BadgeCheck, Loader2 } from 'lucide-react'

interface Props {
  slug: string
  restaurantName: string
}

export default function ConnectAccountPanel({ slug, restaurantName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleConnect() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/owner/connect-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
        // Reload so the page picks up the new isOwner state
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <BadgeCheck className="w-5 h-5 text-emerald-600" />
          <p className="font-bold text-emerald-800 text-sm">Account connected!</p>
        </div>
        <p className="text-emerald-700 text-xs">Reloading your listing…</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-5 h-5 text-sky-500" />
        <p className="font-bold text-[#1E2026] text-sm">Connect your owner account</p>
      </div>
      <p className="text-[#6B6862] text-xs leading-relaxed">
        Your email matches the approved claim for <strong>{restaurantName}</strong>. Connect your account to start editing your listing.
      </p>
      {status === 'error' && (
        <p className="text-red-600 text-xs">{errorMsg}</p>
      )}
      <button
        onClick={handleConnect}
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
      >
        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'loading' ? 'Connecting…' : 'Connect My Account'}
      </button>
    </div>
  )
}
