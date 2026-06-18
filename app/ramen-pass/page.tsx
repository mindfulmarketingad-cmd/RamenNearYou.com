import type { Metadata } from 'next'
import { Check, Utensils, Camera, MapPin, Plus, Users, ChevronDown, Trophy, Wallet } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RamenPassCheckoutButton from '@/components/ramen-pass-checkout-button'
import { REWARD_AMOUNTS, RANK_TIERS, RAMEN_PASS_PRICE, MONTHLY_CREDIT_CAP } from '@/lib/ramen-pass'

export const metadata: Metadata = {
  title: 'Ramen Pass — Membership, Pricing & Perks | Ramen Near You',
  description: `Ramen Pass is $${RAMEN_PASS_PRICE}/month and earns you up to $${MONTHLY_CREDIT_CAP.toFixed(0)} back every month. See everything included with your membership.`,
  alternates: { canonical: 'https://www.ramennearyou.com/ramen-pass' },
}

// What's included with the subscription.
const includedFeatures: { title: string; desc: string; icon: React.ElementType }[] = [
  { title: `Up to $${MONTHLY_CREDIT_CAP.toFixed(0)} back every month`, desc: 'Earn credit on your contributions, applied automatically to your next bill.', icon: Wallet },
  { title: 'Earn on every review & photo', desc: `A review with a photo is worth $${REWARD_AMOUNTS.review_with_photo.toFixed(2)} — the fastest way to earn.`, icon: Camera },
  { title: 'Check in wherever you eat', desc: `Scan a QR code or use your location to earn $${REWARD_AMOUNTS.checkin.toFixed(2)} per visit.`, icon: MapPin },
  { title: 'Climb the ramen ranks', desc: 'Level up from Noobie to Ramen Master and appear on city leaderboards.', icon: Trophy },
  { title: 'Refer friends, earn more', desc: `Get $${REWARD_AMOUNTS.referral.toFixed(2)} in credit when a friend joins with your link.`, icon: Users },
  { title: 'Cancel anytime', desc: 'Manage or cancel your membership in one click. No long-term commitment.', icon: Check },
]

const rewardRows: { label: string; amount: number; note: string; icon: React.ElementType }[] = [
  { label: 'Review + Photo', amount: REWARD_AMOUNTS.review_with_photo, note: 'Min 50 words + a food photo', icon: Camera },
  { label: 'Review Only', amount: REWARD_AMOUNTS.review_only, note: 'Min 50 words, no photo', icon: Utensils },
  { label: 'Check-in', amount: REWARD_AMOUNTS.checkin, note: 'QR code or geolocation', icon: MapPin },
  { label: 'Add a Missing Restaurant', amount: REWARD_AMOUNTS.add_restaurant, note: 'Admin approval required', icon: Plus },
  { label: 'Update Outdated Info', amount: REWARD_AMOUNTS.update_info, note: 'Admin approval required', icon: Check },
  { label: 'First Review Bonus', amount: REWARD_AMOUNTS.first_review_bonus, note: 'First-ever review on a listing', icon: Utensils },
  { label: 'Refer a Friend', amount: REWARD_AMOUNTS.referral, note: "On a friend's first payment", icon: Users },
  { label: 'Complete Your Profile', amount: REWARD_AMOUNTS.profile_complete, note: 'One-time reward', icon: Check },
]

const faqs = [
  {
    q: 'What is the monthly credit cap?',
    a: `You can earn up to $${MONTHLY_CREDIT_CAP.toFixed(2)} in credit per billing period. The most a single month of contributions can knock off your bill is $${MONTHLY_CREDIT_CAP.toFixed(2)}, bringing your Ramen Pass to as low as $${(RAMEN_PASS_PRICE - MONTHLY_CREDIT_CAP).toFixed(2)} that cycle.`,
  },
  {
    q: 'How is credit applied to my bill?',
    a: 'Earned credit is applied automatically as account balance to your next invoice through Stripe. There are no codes to enter — it just comes off the top of your next charge.',
  },
  {
    q: 'How does check-in work?',
    a: 'Scan the QR code at a participating restaurant, or tap "Check In" on a restaurant page and allow location access. We verify you\'re within 500 meters. One check-in per restaurant per 24 hours.',
  },
  {
    q: 'Do contributions need to be approved?',
    a: 'Reviews, check-ins, referrals, and profile completion are credited automatically. Adding a new restaurant or suggesting info updates are reviewed by our team before credit is issued.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Manage or cancel your subscription anytime from your dashboard via the Stripe Customer Portal. You keep access through the end of your current billing period.',
  },
]

export default function RamenPassPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F4F0]">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4 sm:px-6 bg-gradient-to-b from-[#1E2026] to-[#2a2d36] text-center">
          <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-3">Ramen Pass</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Eat ramen. Earn it back.
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            Join Ramen Pass and earn up to ${MONTHLY_CREDIT_CAP.toFixed(0)} back every month just by
            contributing to the community — reviews, photos, check-ins, and more.
          </p>
        </section>

        {/* Pricing card + what's included */}
        <section className="py-16 px-4 sm:px-6 -mt-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_1.2fr]">
              {/* Price */}
              <div className="bg-[#B57F50] text-white p-8 flex flex-col justify-center text-center md:text-left">
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Membership</p>
                <div className="flex items-end justify-center md:justify-start gap-1 mb-3">
                  <span className="font-serif text-5xl font-bold">${RAMEN_PASS_PRICE}</span>
                  <span className="text-white/80 text-lg mb-1">/month</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed mb-6">
                  Earn up to <strong>${MONTHLY_CREDIT_CAP.toFixed(2)}</strong> back each month —
                  your net cost can be as low as <strong>${(RAMEN_PASS_PRICE - MONTHLY_CREDIT_CAP).toFixed(2)}</strong>.
                </p>
                <RamenPassCheckoutButton className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1E2026] text-base font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                  Get Ramen Pass
                </RamenPassCheckoutButton>
                <p className="text-white/60 text-xs mt-3 text-center">Cancel anytime · Billed monthly</p>
              </div>

              {/* Included features */}
              <div className="p-8">
                <p className="font-semibold text-[#1E2026] text-sm mb-4">Everything included with your membership:</p>
                <ul className="space-y-4">
                  {includedFeatures.map(f => {
                    const Icon = f.icon
                    return (
                      <li key={f.title} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#B57F50]/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#B57F50]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E2026] text-sm leading-snug">{f.title}</p>
                          <p className="text-[#6B6862] text-xs leading-relaxed">{f.desc}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Rewards table */}
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-2 text-center">Ways to earn credit</h2>
            <p className="text-[#6B6862] text-center mb-10">
              Every approved contribution adds credit — up to ${MONTHLY_CREDIT_CAP.toFixed(2)} per month.
            </p>
            <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
              {rewardRows.map(row => {
                const Icon = row.icon
                return (
                  <div key={row.label} className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="w-10 h-10 rounded-full bg-[#B57F50]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#B57F50]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1E2026] text-sm">{row.label}</p>
                      <p className="text-[#9B9490] text-xs">{row.note}</p>
                    </div>
                    <p className="font-bold text-[#B57F50] text-lg shrink-0">${row.amount.toFixed(2)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Rank tiers */}
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-2 text-center">Climb the ranks</h2>
            <p className="text-[#6B6862] text-center mb-10">
              Every contribution levels you up. Ramen Masters appear on city leaderboards.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {RANK_TIERS.map(tier => (
                <div key={tier.rank} className="rounded-2xl border border-black/5 bg-[#F5F4F0] p-5 text-center">
                  <div className="text-2xl mb-2">{tier.emoji}</div>
                  <p className="font-bold text-[#1E2026] text-sm">{tier.rank}</p>
                  <p className="text-[#B57F50] text-xs font-semibold mb-2">{tier.min}+ contributions</p>
                  <p className="text-[#9B9490] text-xs leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-8 text-center">Frequently asked questions</h2>
            <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 px-6">
              {faqs.map(({ q, a }, i) => (
                <details key={i} className="group py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 font-semibold text-[#1E2026] text-sm sm:text-base select-none">
                    {q}
                    <ChevronDown className="w-4 h-4 text-[#B57F50] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[#6B6862] text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>

            <div className="text-center mt-12">
              <RamenPassCheckoutButton className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-base font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 min-w-[220px]">
                Get Ramen Pass — ${RAMEN_PASS_PRICE}/mo
              </RamenPassCheckoutButton>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
