'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Fluid in-feed ad — meant to sit between rows in a feed/list, styled by
// AdSense to blend with the surrounding row. The loader script is already
// injected once, site-wide, in app/layout.tsx.
export default function AdInFeed() {
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
      data-ad-format="fluid"
      data-ad-layout-key="-6q+e9+15-2u+4y"
      data-ad-client="ca-pub-9332749804326149"
      data-ad-slot="9687485965"
    />
  )
}
