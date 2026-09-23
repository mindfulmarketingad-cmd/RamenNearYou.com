'use client'

import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'a'> {
  url: string
  restaurantSlug: string
  restaurantName: string
  destination: string
}

// Outbound link (Order Now, View Full Menu) — tracks the click, no auth gate.
export default function SubscriptionGatedOutboundLink({
  url,
  restaurantSlug,
  restaurantName,
  destination,
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
