import type { Metadata } from 'next'
import { Check, Utensils, Camera, MapPin, Plus, Users, ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RamenPassCheckoutButton from '@/components/ramen-pass-checkout-button'
import { REWARD_AMOUNTS, RANK_TIERS, RAMEN_PASS_PRICE, MONTHLY_CREDIT_CAP } from '@/lib/ramen-pass'

export const metadata: Metadata = {
  title: 'Ramen Pass — Earn Credit Back Every Month | Ramen Near You',
  description: `Join Ramen Pass for $${RAMEN_PASS_PRICE}/month and earn up to $${MONTHLY_CREDIT_CAP.toFixed(0)} back every month by contributing reviews, photos, check-ins, and more.`,
  alternates: { canonical: 'https://www.ramennearyou.com/pass' },
}

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
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Join Ramen Pass for ${RAMEN_PASS_PRICE}/month and earn up to ${MONTHLY_CREDIT_CAP.toFixed(0)} back
            every month just by contributing to the community — reviews, photos, check-ins, and more.
          </p>
          <RamenPassCheckoutButton className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-base font-bold shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 min-w-[220px]">
            Get Ramen Pass — ${RAMEN_PASS_PRICE}/mo
          </RamenPassCheckoutButton>
          <p className="text-white/40 text-xs mt-4">Cancel anytime · Credit applied automatically</p>
        </section>

        {/* Rewards table */}
        <section className="py-16 px-4 sm:px-6">
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
