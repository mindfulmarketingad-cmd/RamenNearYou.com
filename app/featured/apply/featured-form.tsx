'use client'

import { Crown, MapPin, Globe } from 'lucide-react'

const TIERS = [
  {
    id: 'city',
    icon: MapPin,
    label: 'City Featured',
    price: '29.99',
    description: 'Get featured at the top of your city\'s ramen listings page.',
    perks: [
      'Top placement on your city page',
      'Featured badge on your listing',
      'Up to 4 photos showcased',
      'Cancel anytime',
    ],
    stripeUrl: 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02',
    highlight: false,
    color: 'border-white/10',
    badgeColor: 'bg-[#77567A]/10 border-[#77567A]/20 text-[#b07db5]',
    buttonColor: 'bg-[#77567A] hover:bg-[#8a6a8d] text-white',
    iconColor: 'text-[#b07db5]',
  },
  {
    id: 'state',
    icon: Globe,
    label: 'State Featured',
    price: '99.99',
    description: 'Reach ramen lovers across your entire state.',
    perks: [
      'Top placement on your state page',
      'Featured on all city pages in your state',
      'Featured badge on your listing',
      'Up to 6 photos showcased',
      'Cancel anytime',
    ],
    stripeUrl: 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02',
    highlight: true,
    color: 'border-amber-500/40',
    badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-[#1E2026]',
    iconColor: 'text-amber-400',
  },
  {
    id: 'homepage',
    icon: Crown,
    label: 'Homepage Featured',
    price: '129.99',
    description: 'Maximum visibility — front and center for every visitor nationwide.',
    perks: [
      'Homepage placement — visible to all visitors',
      'Top of search results nationwide',
      'Featured badge on your listing',
      'Up to 8 photos showcased',
      'Priority support',
      'Cancel anytime',
    ],
    stripeUrl: 'https://buy.stripe.com/fZu6oIbeqbx68QCeK2frW02',
    highlight: false,
    color: 'border-white/10',
    badgeColor: 'bg-white/5 border-white/10 text-white/60',
    buttonColor: 'bg-white hover:bg-white/90 text-[#1E2026]',
    iconColor: 'text-white/70',
  },
]

export default function FeaturedTiers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TIERS.map((tier) => {
        const Icon = tier.icon
        return (
          <div
            key={tier.id}
            className={`relative bg-[#1E2026] rounded-2xl border ${tier.color} p-6 flex flex-col ${
              tier.highlight ? 'ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5' : ''
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-[#1E2026] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium w-fit mb-4 ${tier.badgeColor}`}>
              <Icon className={`w-3.5 h-3.5 ${tier.iconColor}`} />
              {tier.label}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${tier.price}</span>
                <span className="text-[#B0B3BB] text-sm">/ month</span>
              </div>
              <p className="text-[#B0B3BB] text-sm mt-2 leading-relaxed">{tier.description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {tier.perks.map(perk => (
                <li key={perk} className="flex items-start gap-2 text-sm text-[#B0B3BB]">
                  <span className={`mt-0.5 font-bold ${tier.iconColor}`}>✓</span>
                  {perk}
                </li>
              ))}
            </ul>

            <a
              href={tier.stripeUrl}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${tier.buttonColor}`}
            >
              <Icon className="w-4 h-4" />
              Get {tier.label}
            </a>
            <p className="text-white/25 text-xs text-center mt-2">Secure payment via Stripe</p>
          </div>
        )
      })}
    </div>
  )
}
