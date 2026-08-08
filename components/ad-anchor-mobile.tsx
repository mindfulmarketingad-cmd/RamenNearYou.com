'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Sticky bottom anchor ad — mobile only.
//
// The highest-RPM mobile format by a wide margin: every other unit on the page
// earns one impression as it scrolls past, while the anchor stays in view for
// the whole session, so it accumulates viewable time no in-content slot can
// match.
//
// Kept inside the Better Ads Standards limits for sticky mobile ads: well under
// 30% of the viewport, dismissible, and held back until the reader has actually
// committed to the page rather than covering the hero on load. Dismissal sticks
// for the session so it never re-appears on the next page.
const DISMISS_KEY = 'rny_anchor_dismissed'
const SHOW_AFTER_PX = 600
const RESERVED_PX = 100

export default function AdAnchorMobile() {
  const [visible, setVisible] = useState(false)
  const pushed = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      // Private mode / storage blocked — just show it.
    }

    const onScroll = () => {
      if (window.scrollY <= SHOW_AFTER_PX) return
      setVisible(true)
      window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Push once, only after the bar is actually in the DOM and has width.
  useEffect(() => {
    if (!visible || pushed.current) return
    pushed.current = true
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script blocked (ad blocker, etc.) — fail silently.
    }
  }, [visible])

  // Reserve room at the bottom of the page so the anchor never sits on top of
  // the footer links or a listing's call/directions buttons.
  useEffect(() => {
    document.body.style.paddingBottom = visible ? `${RESERVED_PX}px` : ''
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [visible])

  if (!visible) return null

  // Portalled to <body>: any ancestor with a transform/filter would otherwise
  // become the containing block and the bar would scroll away instead of
  // sticking. The listicle renders this from deep inside the page tree.
  return createPortal(
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-black/10 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, '1')
          } catch {}
          setVisible(false)
        }}
        aria-label="Close ad"
        className="absolute -top-[26px] right-2 flex items-center justify-center w-7 h-[26px] rounded-t-md bg-white/95 border border-b-0 border-black/10 text-[#6B6862]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="min-h-[50px] flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9332749804326149"
          data-ad-slot="1541306209"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>,
    document.body
  )
}
