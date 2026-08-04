'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Vertical display ad. The loader script is already injected once,
// site-wide, in app/layout.tsx.
export default function AdUnitVertical() {
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
      data-ad-slot="5282024480"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
