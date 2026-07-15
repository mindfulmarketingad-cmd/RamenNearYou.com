'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// AdSense loader script is already injected once, site-wide, in app/layout.tsx —
// this only renders the <ins> ad slot and pushes it once mounted.
export default function AdUnit() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script blocked (ad blocker, etc.) — fail silently.
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-9332749804326149"
      data-ad-slot="8261970683"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
