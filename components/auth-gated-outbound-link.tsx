'use client'

import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props extends ComponentPropsWithoutRef<'a'> {
  restaurantSlug: string
  restaurantName: string
  destination: 'website' | 'directions' | 'menu' | 'order' | 'featured'
  url: string
}

// Behaves like OutboundLink, but requires the visitor to be signed in.
// Signed-in users open the destination in a new tab (and the click is tracked).
// Signed-out users are redirected to the sign-in page with a redirectTo back here.
export default function AuthGatedOutboundLink({
  restaurantSlug,
  restaurantName,
  destination,
  url,
  children,
  ...props
}: Props) {
  const router = useRouter()
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  function goToSignIn() {
    const redirectTo = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'
    router.push(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Signed in: let the real anchor open the new tab (no popup-blocker issues).
    if (signedIn === true) {
      track()
      return
    }

    e.preventDefault()

    // Auth state not resolved yet — check synchronously before deciding.
    let isAuthed = signedIn
    if (isAuthed === null) {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      isAuthed = !!session
      setSignedIn(isAuthed)
    }

    if (isAuthed) {
      track()
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      goToSignIn()
    }
  }

  return (
    <a
      href={signedIn === false ? '/auth/login' : url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={signedIn === false ? 'Sign in to continue' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}
