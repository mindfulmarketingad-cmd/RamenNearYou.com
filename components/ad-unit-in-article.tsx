'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Fluid in-article ad — meant to sit inline within body text, used on
// individual restaurant listing pages right after the first paragraph of
// the About section. The loader script is already injected once, site-wide,
// in app/layout.tsx.
export default function AdUnitInArticle() {
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
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-9332749804326149"
      data-ad-slot="4753212343"
    />
  )
}
