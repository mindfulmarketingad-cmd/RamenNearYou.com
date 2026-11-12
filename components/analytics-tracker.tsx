'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics-client'

/**
 * Fires a pageview on first paint and on every client-side route change.
 * Mounted once in the root layout. The track route promotes a pageview on a
 * business detail page into a listing_view, so this single hook covers both.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Don't measure the dashboard itself — it would inflate its own numbers.
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return
    trackEvent('pageview', { path: pathname })
  }, [pathname])

  return null
}
