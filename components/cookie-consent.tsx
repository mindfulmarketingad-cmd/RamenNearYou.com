'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent')
    if (!stored) {
      setVisible(true)
    } else if (stored === 'accepted') {
      grantConsent()
    }
  }, [])

  function grantConsent() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
    }
  }

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'accepted')
    grantConsent()
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-[#1E2026] border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-[#B0B3BB] text-sm leading-relaxed max-w-2xl">
          We use cookies to analyze site traffic and display personalized ads via{' '}
          <strong className="text-white">Google Analytics</strong> and{' '}
          <strong className="text-white">Google AdSense</strong>. By clicking &ldquo;Accept All,&rdquo; you consent to our
          use of cookies.{' '}
          <Link href="/privacy-policy" className="text-[#B57F50] hover:underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg border border-white/10 text-[#B0B3BB] hover:text-white text-sm font-medium transition-colors hover:border-white/20"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
