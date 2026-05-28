'use client'

import { useEffect } from 'react'

export default function PageViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Track once per browser session per restaurant slug
    const key = `pv:${slug}`
    if (typeof sessionStorage === 'undefined') return
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {})
  }, [slug])

  return null
}
