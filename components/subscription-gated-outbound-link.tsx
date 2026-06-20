'use client'

import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SubscribeGateModal from '@/components/subscribe-gate-modal'

interface Props extends ComponentPropsWithoutRef<'a'> {
  url: string
  restaurantSlug: string
  restaurantName: string
  destination: string
}

// Like AuthGatedOutboundLink, but shows the subscription gate modal for
// non-signed-in users instead of redirecting to the sign-in page.
export default function SubscriptionGatedOutboundLink({
  url,
  restaurantSlug,
  restaurantName,
  destination,
  children,
  ...props
}: Props) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [gateOpen, setGateOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setSignedIn(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

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

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    let isAuthed = signedIn
    if (isAuthed === null) {
      const supabase = createClient()
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        isAuthed = !!session
        setSignedIn(isAuthed)
      }
    }

    if (isAuthed) {
      track()
      return // let the real anchor open the URL
    }

    e.preventDefault()
    setGateOpen(true)
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
      {gateOpen && <SubscribeGateModal onClose={() => setGateOpen(false)} />}
    </>
  )
}
