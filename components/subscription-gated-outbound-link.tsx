'use client'

import { ComponentPropsWithoutRef, useState } from 'react'
import { useGate } from '@/lib/use-gate'
import SigninGateModal from '@/components/signin-gate-modal'

interface Props extends ComponentPropsWithoutRef<'a'> {
  url: string
  restaurantSlug: string
  restaurantName: string
  destination: string
}

// Members-only outbound link (Order Now, View Full Menu).
// Routes signed-out users to a free sign-in prompt; signed-in users pass through.
export default function SubscriptionGatedOutboundLink({
  url,
  restaurantSlug,
  restaurantName,
  destination,
  children,
  ...props
}: Props) {
  const { evaluate } = useGate()
  const [showSignin, setShowSignin] = useState(false)

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

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (evaluate() === 'ok') {
      track()
      return // let the anchor open the destination
    }
    e.preventDefault()
    setShowSignin(true)
  }

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
      {showSignin && (
        <SigninGateModal
          onClose={() => setShowSignin(false)}
          redirectTo={typeof window !== 'undefined' ? window.location.pathname : '/'}
        />
      )}
    </>
  )
}
