'use client'

import { useEffect, useState } from 'react'
import { MapPin, X } from 'lucide-react'

export default function LocationPrompt() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if already decided
    if (localStorage.getItem('location-prompt-dismissed')) return

    // Check if permission is already granted or denied
    if (!navigator.geolocation) return
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'denied') {
          localStorage.setItem('location-prompt-dismissed', '1')
          return
        }
        // Prompt state — show banner after a short delay
        const t = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(t)
      })
    } else {
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('location-prompt-dismissed', '1')
    setVisible(false)
  }

  function enableLocation() {
    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem('location-prompt-dismissed', '1')
        setVisible(false)
      },
      () => {
        localStorage.setItem('location-prompt-dismissed', '1')
        setVisible(false)
      },
      { timeout: 10000 }
    )
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md bg-[#1E2026] text-white rounded-2xl shadow-2xl border border-white/10 px-5 py-4 flex items-start gap-4 animate-slide-up">
        <div className="shrink-0 w-9 h-9 rounded-full bg-[#B57F50]/20 border border-[#B57F50]/40 flex items-center justify-center mt-0.5">
          <MapPin className="w-4 h-4 text-[#B57F50]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug mb-0.5">Find ramen near you</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Enable location to see the closest ramen spots and sort by distance.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={enableLocation}
              className="px-4 py-1.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors"
            >
              Enable Location
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-lg text-white/50 hover:text-white text-xs transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
