'use client'

import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'a'> {
  restaurantSlug: string
  restaurantName: string
  destination: 'website' | 'directions' | 'menu' | 'order' | 'featured'
  url: string
}

// Outbound link (restaurant website, etc.) — tracks the click, no auth gate.
export default function AuthGatedOutboundLink({
  restaurantSlug,
  restaurantName,
  destination,
  url,
  children,
  ...props
}: Props) {
  function track() {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'outbound_click', {
        restaurant_slug: restaurantSlug,
        restaurant_name: restaurantName,
        destination,
        url,
      })
    }
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, restaurantName, destination, url }),
    }).catch(() => {})
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      {...props}
    >
      {children}
    </a>
  )
}
