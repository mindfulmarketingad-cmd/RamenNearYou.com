'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useModalA11y } from '@/lib/use-modal-a11y'

const SESSION_KEY = 'salePopupShown'
const DELAY_MS = 30000
const AFFILIATE_URL = 'https://amzn.to/4h3lyIL'

// Fires once per browser session, 30s after landing on the site — mounted
// globally in the root layout so it applies everywhere. Skipped on the auth
// pages themselves.
export default function SalePopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useModalA11y(open, () => setOpen(false))

  useEffect(() => {
    if (pathname?.startsWith('/auth')) return
    if (typeof window === 'undefined' || sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ramen products sale"
    >
      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-sm bg-surface rounded-2xl shadow-2xl overflow-hidden outline-none text-center">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-10 pb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand-ink text-xs font-bold uppercase tracking-widest mb-4">
            Limited Time
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink mb-2">70% Off All Ramen Products</h2>
          <p className="text-ink-soft text-sm mb-6">Stock up on bowls, chopsticks, and more before the sale ends.</p>

          <a
            href={AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-3 rounded-full bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  )
}
