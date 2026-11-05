'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Check, Lock } from 'lucide-react'
import { usePass, closeGate, FREE_SAVE_LIMIT, PASS_PRICES, PASS_TRIAL_DAYS } from '@/lib/ramen-pass'

// The one sign-up / upgrade card for the whole site. It only ever opens
// because the visitor *did* something (saved a 6th spot, tapped an advanced
// filter, tried to check in signed-out) — never on arrival.
export default function PassGateHost() {
  const { gate, session } = usePass()

  useEffect(() => {
    if (!gate) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeGate() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gate])

  if (!gate) return null
  const next = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'
  const signup = gate.kind === 'signup' && !session

  const title = signup
    ? gate.detail === 'checkin' ? 'Start your ramen passport' : 'Save this spot'
    : gate.kind === 'save-limit' ? `You’ve saved ${FREE_SAVE_LIMIT} spots — nice taste.`
    : gate.kind === 'filter' ? 'That filter is part of the Ramen Pass'
    : 'Unlock this with the Ramen Pass'

  const body = signup
    ? 'Create a free account to save spots, check in to the bowls you eat and earn badges. No password needed.'
    : gate.kind === 'save-limit'
      ? 'Free accounts keep 5 saves. The Ramen Pass makes them unlimited and turns them into lists and trip plans.'
      : 'Filter by broth, vegan, open now or late and spice level — plus unlimited saves, trip lists, member deals and no ads.'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={closeGate} role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-2xl sm:rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <button onClick={closeGate} aria-label="Close" className="absolute right-3 top-3 p-2 text-ink-soft hover:text-ink"><X className="w-5 h-5" /></button>
        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand-ink flex items-center justify-center mb-3"><Lock className="w-5 h-5" /></div>
        <h2 className="font-serif text-xl font-bold text-ink pr-6">{title}</h2>
        <p className="text-ink-mid text-sm mt-2">{body}</p>
        {signup ? (
          <>
            <Link href={`/account?next=${encodeURIComponent(next)}`} onClick={closeGate} className="mt-5 block text-center rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hi">
              Create my free account
            </Link>
            <p className="text-xs text-ink-soft text-center mt-3">Already have one? The same button signs you in.</p>
          </>
        ) : (
          <>
            <ul className="mt-4 space-y-1.5 text-sm text-ink">
              {['Unlimited saves, lists & trip planner', 'All filters: broth, vegan, open late, spice', 'Member deals at claimed shops', 'Ad-free browsing'].map(t => (
                <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link href="/account?plan=monthly" onClick={closeGate} className="text-center rounded-xl border border-line/15 px-3 py-3 font-semibold text-ink hover:bg-sunken">
                {PASS_PRICES.monthly.label}<span className="text-xs font-normal text-ink-soft">/mo</span>
              </Link>
              <Link href="/account?plan=yearly" onClick={closeGate} className="text-center rounded-xl bg-brand px-3 py-3 font-semibold text-white hover:bg-brand-hi">
                {PASS_PRICES.yearly.label}<span className="text-xs font-normal opacity-80">/yr</span>
              </Link>
            </div>
            <p className="text-xs text-ink-soft text-center mt-3">{PASS_TRIAL_DAYS}-day free trial · cancel anytime · <Link href="/ramen-pass" onClick={closeGate} className="underline">What’s included</Link></p>
          </>
        )}
      </div>
    </div>
  )
}
