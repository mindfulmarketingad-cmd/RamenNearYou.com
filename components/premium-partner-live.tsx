'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadPlacements } from '@/lib/live-placements'

export type PartnerCard = { slug: string; name: string; href: string; detail: string }

// Adds Premium subscriptions that were not in the build. The initial list
// is the manual PAID_LISTINGS overlay, rendered by the server component.
export default function PremiumPartnerLive({
  citySlug,
  stateSlug,
  cityLabel,
  initial,
}: {
  citySlug: string
  stateSlug: string
  cityLabel: string
  initial: PartnerCard[]
}) {
  const [partners, setPartners] = useState(initial)

  useEffect(() => {
    let cancelled = false
    const prefix = `/${citySlug}/${stateSlug}/`
    loadPlacements().then(feed => {
      if (cancelled) return
      const extra: PartnerCard[] = []
      for (const row of feed.live) {
        if (row.tier !== 'premium' || feed.lapsed.has(row.slug) || !row.path?.startsWith(prefix)) continue
        extra.push({
          slug: row.slug,
          name: row.name || row.slug,
          href: row.path,
          detail: [row.city, row.state_code].filter(Boolean).join(', '),
        })
      }
      if (!extra.length) return
      setPartners(prev => {
        const seen = new Set(prev.map(p => p.slug))
        return [...prev, ...extra.filter(p => !seen.has(p.slug))]
      })
    }).catch(() => {})
    return () => { cancelled = true }
  }, [citySlug, stateSlug])

  if (partners.length === 0) return null
  return (
    <aside className="my-8 rounded-2xl border-2 border-amber-400/50 bg-amber-50/60 dark:bg-amber-500/10 p-5 sm:p-6">
      <p className="text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-3">
        Featured partner in {cityLabel} · Sponsored
      </p>
      <ul className="space-y-3">
        {partners.map(r => (
          <li key={r.slug}>
            <Link href={r.href} className="font-serif text-lg font-bold text-ink hover:text-brand-ink">
              {r.name}
            </Link>
            {r.detail && <p className="text-ink-soft text-sm">{r.detail}</p>}
          </li>
        ))}
      </ul>
    </aside>
  )
}
