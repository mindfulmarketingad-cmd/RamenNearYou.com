'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'
import { CLAIM_PLAN } from '@/lib/paid-listings'

// The only owner subscription. Checkout happens after sign-in, from /owner,
// so the payment is tied to that account (client_reference_id = restaurant slug).

const FEATURES = [
  'Verified badge and an owner dashboard',
  'Listing analytics: views, calls, and direction taps',
  'Edit hours, phone, website, menu link, and description',
  'Featured placement, labelled Featured / Sponsored',
  'Gold crown pin on the homepage map',
  'Top of your city page and your state page',
]

export default function ListingPlans({ cardBg = 'bg-sunken' }: { showClaim?: boolean; cardBg?: string }) {
  const [claimHref, setClaimHref] = useState('/claim-your-listing')
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('restaurant') ?? ''
    if (/^[a-z0-9-]{1,190}$/i.test(slug)) setClaimHref(`/owner?claim=${encodeURIComponent(slug.toLowerCase())}`)
  }, [])

  return (
    <section aria-labelledby="plans-heading">
      <h2 id="plans-heading" className="font-serif text-2xl font-bold text-ink mb-1">Claim your listing</h2>
      <p className="text-ink-soft text-sm mb-5">One monthly plan. Cancel anytime. Featured placement is included.</p>
      <div className={`max-w-md rounded-2xl border-2 border-amber-400/70 p-5 ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-ink">Claimed listing</h3>
        </div>
        <p className="mb-4">
          <span className="font-serif text-3xl font-bold text-ink">{CLAIM_PLAN.price}</span>
          <span className="text-ink-soft text-sm"> / {CLAIM_PLAN.period}</span>
        </p>
        <ul className="space-y-2 mb-5">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink leading-snug">
              <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
        <Link href={claimHref} className="block text-center py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors">
          Claim — {CLAIM_PLAN.price}/mo
        </Link>
      </div>
      <p className="text-ink-soft text-xs mt-4 leading-relaxed">
        Secure checkout by Stripe. After you pay, the claim is verified and the Featured pin and page placement turn on without a wait.
      </p>
    </section>
  )
}
