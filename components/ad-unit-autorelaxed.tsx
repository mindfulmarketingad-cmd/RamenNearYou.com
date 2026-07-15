'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// "autorelaxed" multiplex ad — used on individual restaurant listing pages,
// right above the Order Now button. The loader script is already injected
// once, site-wide, in app/layout.tsx.
export default function AdUnitAutorelaxed() {
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
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-9332749804326149"
      data-ad-slot="1523180244"
    />
  )
}
