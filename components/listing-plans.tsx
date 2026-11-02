'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Crown, ShieldCheck, Star } from 'lucide-react'
import { PAID_TIER_PRICES } from '@/lib/paid-listings'
import { BILLBOARD_PRICE, BILLBOARD_PERIOD } from '@/lib/homepage-billboard'

// Owner pricing table, shared by /claim-your-listing and /featured-listing.
// Checkout is a Stripe Payment Link (no backend). When the page URL carries
// ?restaurant=<slug> (e.g. from a listing's claim link), it is passed to
// Stripe as client_reference_id so the payment names its restaurant; Stripe
// also asks for the restaurant name and city on the checkout page.

const PLANS = [
  {
    key: 'claim',
    name: 'Claim',
    price: 'Free',
    period: '',
    icon: ShieldCheck,
    features: [
      'Verified badge on your listing and the map',
      'Send us new hours, photos, menu or description',
      'Ad-free listing page',
    ],
    cta: { label: 'Claim for free', href: '/claim-your-listing' },
  },
  {
    key: 'featured',
    name: 'Featured',
    price: PAID_TIER_PRICES.featured.price,
    period: PAID_TIER_PRICES.featured.period,
    icon: Star,
    features: [
      'Everything in Claim',
      'Top spot on your city page, labelled “Featured”',
      'Gold pin with a crown on every RamenNearYou map',
      'Featured badge on your listing page',
    ],
    checkoutUrl: PAID_TIER_PRICES.featured.checkoutUrl,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: PAID_TIER_PRICES.premium.price,
    period: PAID_TIER_PRICES.premium.period,
    icon: Crown,
    features: [
      'Everything in Featured',
      'Top spot on your state page',
      'Featured-partner box on your city’s blog ramen guide',
    ],
    checkoutUrl: PAID_TIER_PRICES.premium.checkoutUrl,
  },
] as const

export default function ListingPlans({ showClaim = true, cardBg = 'bg-sunken' }: { showClaim?: boolean; cardBg?: string }) {
  const [ref, setRef] = useState('')
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('restaurant') ?? ''
    if (/^[a-z0-9_-]{1,190}$/i.test(slug)) setRef(slug)
  }, [])
  const withRef = (url: string) => (ref ? `${url}?client_reference_id=${encodeURIComponent(ref)}` : url)
  const plans = showClaim ? PLANS : PLANS.filter(p => p.key !== 'claim')

  return (
    <section aria-labelledby="plans-heading">
      <h2 id="plans-heading" className="font-serif text-2xl font-bold text-ink mb-1">Plans for restaurant owners</h2>
      <p className="text-ink-soft text-sm mb-5">Monthly, cancel anytime. Claiming is always free.</p>
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
              <p className="mb-4">
                <span className="font-serif text-3xl font-bold text-ink">{p.price}</span>
                {p.period && <span className="text-ink-soft text-sm"> / {p.period}</span>}
              </p>
              <ul className="space-y-2 mb-5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink leading-snug">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              {'checkoutUrl' in p ? (
                <a href={withRef(p.checkoutUrl)} className="block text-center py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors">
                  Get {p.name} — {p.price}/mo
                </a>
              ) : (
                <Link href={p.cta.href} className="block text-center py-3 rounded-lg border border-line/15 text-ink text-sm font-semibold hover:border-brand transition-colors">
                  {p.cta.label}
                </Link>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-ink-soft text-xs mt-4 leading-relaxed">
        Add-on: the homepage billboard is {BILLBOARD_PRICE}/{BILLBOARD_PERIOD} on top of any plan —{' '}
        <Link href="/featured-listing#billboard" className="text-brand-ink font-semibold hover:underline">see the billboard</Link>.
        Secure checkout by Stripe. After you pay, we confirm your listing by email and your placement goes live with our next site update.
      </p>
    </section>
  )
}
