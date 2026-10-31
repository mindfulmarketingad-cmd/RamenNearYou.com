'use client'

import { useEffect, useState } from 'react'
import { isOpenNow } from '@/lib/hours'

// Client-side open/closed indicator. The listing page is statically cached
// (ISR), so a server-computed "Open now" could be up to an hour stale —
// computing it in the browser keeps it accurate to the minute. Renders
// nothing until mounted so the static HTML never carries a wrong state.
export default function OpenNowBadge({
  hours,
  variant,
}: {
  hours: Record<string, string[]> | null | undefined
  variant: 'inline' | 'pill'
}) {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const compute = () => setOpen(isOpenNow(hours ?? null) === true)
    compute()
    const t = setInterval(compute, 60_000)
    return () => clearInterval(t)
  }, [hours])

  if (open == null) return null

  if (variant === 'pill') {
    return (
      <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${open ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'}`}>
        {open ? 'Open' : 'Closed'}
      </span>
    )
  }
  return (
    <span className={`font-semibold ${open ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
      · {open ? 'Open now' : 'Closed'}
    </span>
  )
}
