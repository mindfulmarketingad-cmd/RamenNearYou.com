'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Crown, ShieldCheck, Star } from 'lucide-react'
import { CLAIM_PLAN, PAID_TIER_PRICES } from '@/lib/paid-listings'
import { BILLBOARD_PRICE, BILLBOARD_PERIOD } from '@/lib/homepage-billboard'

// Owner pricing. Claim is the subscription. Featured and Premium are
// dashboard add-ons on a claimed listing, not a cheaper way to skip claiming.
// Checkout itself happens after sign-in, from /owner, so the payment is tied
// to that account (client_reference_id = restaurant slug).

const PLANS = [
  {
    key: 'claim',
    name: 'Claim',
    price: CLAIM_PLAN.price,
    period: CLAIM_PLAN.period,
    total: null as string | null,
    icon: ShieldCheck,
    features: [
      'Verified badge on your listing and the map',
      'Owner dashboard with listing analytics',
      'Edit hours, phone, website, menu link and description',
      'Ad-free listing page',
    ],
  },
  {
    key: 'featured',
    name: 'Featured',
    price: PAID_TIER_PRICES.featured.price,
    period: PAID_TIER_PRICES.featured.period,
    total: PAID_TIER_PRICES.featured.withClaim,
    icon: Star,
    features: [
      'Add-on to a claimed listing',
      'Top spot on your city page, labelled “Featured”',
      'Gold pin with a crown on every RamenNearYou map',
      'Featured badge on your listing page',
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: PAID_TIER_PRICES.premium.price,
    period: PAID_TIER_PRICES.premium.period,
    total: PAID_TIER_PRICES.premium.withClaim,
    icon: Crown,
    features: [
      'Everything in Featured',
      'Top spot on your state page',
      'Featured-partner box on your city’s blog ramen guide',
    ],
  },
] as const

export default function ListingPlans({ showClaim = true, cardBg = 'bg-sunken' }: { showClaim?: boolean; cardBg?: string }) {
  const [claimHref, setClaimHref] = useState('/claim-your-listing')
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('restaurant') ?? ''
    if (/^[a-z0-9-]{1,190}$/i.test(slug)) setClaimHref(`/owner?claim=${encodeURIComponent(slug.toLowerCase())}`)
  }, [])
  const plans = showClaim ? PLANS : PLANS.filter(p => p.key !== 'claim')

  return (
    <section aria-labelledby="plans-heading">
      <h2 id="plans-heading" className="font-serif text-2xl font-bold text-ink mb-1">Plans for restaurant owners</h2>
      <p className="text-ink-soft text-sm mb-5">Monthly, cancel anytime. Claim your listing first, then add Featured or Premium from your dashboard.</p>
      <div className={`grid gap-4 ${plans.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {plans.map(p => {
          const Icon = p.icon
          const highlight = p.key === 'featured'
          return (
            <div key={p.key} className={`flex flex-col rounded-2xl border p-5 ${cardBg} ${highlight ? 'border-2 border-amber-400/70' : 'border-line/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-ink">{p.name}</h3>
              </div>
              <p className="mb-1">
                <span className="font-serif text-3xl font-bold text-ink">{p.price}</span>
                <span className="text-ink-soft text-sm"> / {p.period}</span>
              </p>
              <p className="text-xs text-ink-soft mb-4 min-h-[2rem]">
                {p.total ? `${p.total}/month with your claim` : 'Verified owner tools for your listing'}
              </p>
              <ul className="space-y-2 mb-5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink leading-snug">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={claimHref} className="block text-center py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors">
                {p.key === 'claim' ? `Claim — ${p.price}/mo` : 'Claim your listing'}
              </Link>
            </div>
          )
        })}
      </div>
      <p className="text-ink-soft text-xs mt-4 leading-relaxed">
        Add-on: the homepage billboard is {BILLBOARD_PRICE}/{BILLBOARD_PERIOD} on top of a claimed listing —{' '}
        <Link href="/featured-listing#billboard" className="text-brand-ink font-semibold hover:underline">see the billboard</Link>.
        Secure checkout by Stripe. After you pay, the claim is verified and Featured or Premium placement turns on without a wait.
      </p>
    </section>
  )
}
