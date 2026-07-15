'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Fluid in-feed ad — meant to sit between listing/card items in a feed,
// styled by AdSense to blend with the surrounding row. The loader script is
// already injected once, site-wide, in app/layout.tsx.
export default function AdUnitInFeed() {
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
      data-ad-layout-key="-gz-1s+2v-2t+7s"
      data-ad-client="ca-pub-9332749804326149"
      data-ad-slot="4093503269"
    />
  )
}
