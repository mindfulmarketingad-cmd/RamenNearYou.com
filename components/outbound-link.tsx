'use client'

import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'a'> {
  restaurantSlug: string
  restaurantName: string
  destination: 'website' | 'directions' | 'menu' | 'order' | 'featured'
  url: string
}

export default function OutboundLink({ restaurantSlug, restaurantName, destination, url, children, ...props }: Props) {
  function handleClick() {
    // Fire GA4 event if gtag is available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'outbound_click', {
        restaurant_slug: restaurantSlug,
        restaurant_name: restaurantName,
        destination,
        url,
      })
    }

    // Also record in Supabase via API (fire-and-forget)
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
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}
