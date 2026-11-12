'use client'

import { useEffect, useState } from 'react'

// Tier-aware thank-you copy for the Stripe Payment Link redirect
// (/featured/success?tier=featured|premium). Activation is manual — see
// docs/monetization.md — so this never claims the placement is already live.
const COPY: Record<string, { title: string; perks: string }> = {
  featured: {
    title: 'Thanks — your Featured plan is confirmed',
    perks: 'the top spot on your city page (labelled Featured), a gold crown pin on our maps, and a Featured badge on your listing',
  },
  premium: {
    title: 'Thanks — your Premium plan is confirmed',
    perks: 'everything in Featured plus the top of your state page and a featured-partner box on your city’s blog ramen guide',
  },
  billboard: {
    title: 'Thanks — your homepage billboard is confirmed',
    perks: 'the billboard slot at the top of the homepage',
  },
}

export default function FeaturedSuccessCopy() {
  const [tier, setTier] = useState('billboard')
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tier') ?? ''
    if (t in COPY) setTier(t)
  }, [])
  const c = COPY[tier]
  return (
    <>
      <h1 className="font-serif text-4xl font-bold text-ink mb-4">{c.title}</h1>
      <p className="text-ink-soft leading-relaxed mb-4">
        Your plan includes {c.perks}.
      </p>
      <p className="text-ink-soft leading-relaxed mb-8">
        Next, we match your payment to your restaurant, confirm by email, and switch your
        placement on with our next site update. Reply to that email with any photos or
        links you&apos;d like us to use.
      </p>
    </>
  )
}
