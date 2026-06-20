'use client'

import { ComponentPropsWithoutRef, useState } from 'react'
import { useGate } from '@/lib/use-gate'
import SubscribeGateModal from '@/components/subscribe-gate-modal'
import SigninGateModal from '@/components/signin-gate-modal'

interface Props extends ComponentPropsWithoutRef<'a'> {
  url: string
  restaurantSlug: string
  restaurantName: string
  destination: string
}

// Members-only outbound link (Order Now, View Full Menu). Routes signed-out
// users to a free sign-in, meters signed-in non-subscribers (3/month), and
// lets subscribers through unlimited. Each successful click spends one use.
export default function SubscriptionGatedOutboundLink({
  url,
  restaurantSlug,
  restaurantName,
  destination,
  children,
  ...props
}: Props) {
  const { evaluate, consume } = useGate()
  const [gate, setGate] = useState<null | 'signin' | 'subscribe'>(null)

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
    const result = evaluate()
    if (result === 'ok') {
      consume()
      track()
      return // let the anchor open the destination
    }
    e.preventDefault()
    setGate(result)
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
      {gate === 'signin' && (
        <SigninGateModal
          onClose={() => setGate(null)}
          redirectTo={typeof window !== 'undefined' ? window.location.pathname : '/'}
        />
      )}
      {gate === 'subscribe' && <SubscribeGateModal onClose={() => setGate(null)} />}
    </>
  )
}
