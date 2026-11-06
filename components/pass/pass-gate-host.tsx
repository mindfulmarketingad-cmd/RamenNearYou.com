'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { usePass, closeGate } from '@/lib/ramen-pass'

// Sign-in card for Save and Check in. Ramen Pass is not offered.
export default function PassGateHost() {
  const { gate, session } = usePass()

  useEffect(() => {
    if (!gate) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeGate() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gate])

  if (!gate || gate.kind !== 'signup' || session) return null
  const next = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'
  const title = gate.detail === 'checkin' ? 'Start your ramen passport' : 'Save this spot'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={closeGate} role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-2xl sm:rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <button onClick={closeGate} aria-label="Close" className="absolute right-3 top-3 p-2 text-ink-soft hover:text-ink"><X className="w-5 h-5" /></button>
        <h2 className="font-serif text-xl font-bold text-ink pr-6">{title}</h2>
        <p className="text-ink-mid text-sm mt-2">Create a free account to save spots and check in to the bowls you eat. No password needed.</p>
        <Link href={`/account?next=${encodeURIComponent(next)}`} onClick={closeGate} className="mt-5 block text-center rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hi">
          Create my free account
        </Link>
        <p className="text-xs text-ink-soft text-center mt-3">Already have one? The same button signs you in.</p>
      </div>
    </div>
  )
}
