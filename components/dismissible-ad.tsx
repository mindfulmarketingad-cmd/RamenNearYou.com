'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Wraps an ad unit in a small labelled bar with a close button.
//
// Two rules shape this. The close button lives on our own chrome *above* the
// ad, never floating over the creative — an X sitting on top of an ad is how
// you get accidental clicks, which AdSense treats as invalid traffic. And the
// bar carries an "Advertisement" label, which is what makes the row read as
// site chrome rather than part of the ad.
//
// Dismissal is per-tab (sessionStorage), so the ad is gone for as long as
// someone is actually browsing but comes back on their next visit.

interface Props {
  children: React.ReactNode
  /** Distinguishes placements so dismissing one doesn't hide the others. */
  storageKey: string
  className?: string
}

export default function DismissibleAd({ children, storageKey, className = '' }: Props) {
  const key = `adDismissed:${storageKey}`
  // Start hidden and reveal after the storage check, so a visitor who already
  // dismissed it never sees it flash back in on the next navigation.
  const [state, setState] = useState<'checking' | 'shown' | 'hidden'>('checking')

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem(key) === '1'
    } catch {
      // Private mode / blocked storage — just show it.
    }
    setState(dismissed ? 'hidden' : 'shown')
  }, [key])

  function dismiss() {
    setState('hidden')
    try {
      sessionStorage.setItem(key, '1')
    } catch {}
  }

  if (state !== 'shown') return null

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 pl-3 pr-1 py-1 border-b border-line/8">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
          Advertisement
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close advertisement"
          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-ink-soft hover:text-ink hover:bg-line/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  )
}
