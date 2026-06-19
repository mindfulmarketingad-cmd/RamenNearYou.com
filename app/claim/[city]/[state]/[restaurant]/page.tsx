import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, BadgeCheck, BarChart2, Globe, Clock, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimForm from './claim-form'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getRestaurant } from '@/lib/restaurants'

const STRIPE_CLAIM_LINK = 'https://buy.stripe.com/28E4gAfuG58I9UG9pIfrW04'

const BENEFITS = [
  { icon: BadgeCheck, text: 'Verified owner badge on your listing' },
  { icon: Globe, text: 'Update your website, phone, and description' },
  { icon: Clock, text: 'Keep your hours accurate and up to date' },
  { icon: BarChart2, text: 'See weekly page visit analytics' },
  { icon: MapPin, text: 'Featured placement on your city page' },
]

export default async function ClaimPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  const r = getRestaurant(city, state, restaurant)
  if (!r) notFound()

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: existingClaim } = await supabase
    .from('claims')
    .select('id, status')
    .eq('restaurant_slug', r.slug)
    .single()

  // Check for active claim subscription via admin client (bypasses RLS)
  const admin = createAdminClient()
  let hasSubscription = false
  if (admin) {
    const { data: sub } = await admin
      .from('claim_subscriptions')
      .select('id')
      .eq('restaurant_slug', r.slug)
      .eq('customer_email', user.email ?? '')
      .eq('status', 'active')
      .maybeSingle()
    hasSubscription = !!sub
  }

  const stripeLink = `${STRIPE_CLAIM_LINK}?prefilled_email=${encodeURIComponent(user.email ?? '')}&client_reference_id=${r.slug}`

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Claim Listing</p>
          <h1 className="font-serif text-4xl font-bold text-[#1E2026] mb-2">Claim {r.name}</h1>
          <p className="text-[#6B6862] mb-8">{r.address}</p>

          {existingClaim ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-amber-300 text-sm">
              This listing has already been claimed (status: {existingClaim.status}). If you believe this is an error, please contact us.
            </div>
          ) : hasSubscription ? (
            <ClaimForm userEmail={user.email ?? ''} restaurant={r} />
          ) : (
            // Pricing wall
            <div className="space-y-6">
              <div className="bg-[#F5F4F0] rounded-2xl border border-black/5 p-8">
                {/* Free trial badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 text-xs font-semibold mb-5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  14-Day Free Trial — $0 Up Front
                </div>

                <div className="flex items-end gap-2 mb-1">
                  <span className="font-serif text-5xl font-bold text-[#1E2026]">$19.99</span>
                  <span className="text-[#6B6862] text-sm mb-2">/month</span>
                </div>
                <p className="text-[#9B9490] text-sm mb-6">After your free trial. Cancel anytime.</p>

                <ul className="space-y-3 mb-8">
                  {BENEFITS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-[#1E2026]">
                      <CheckCircle2 className="w-4 h-4 text-[#B57F50] shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                <a
                  href={stripeLink}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
                >
                  Start Free Trial — $0 Today
                </a>

                <p className="text-center text-xs text-[#9B9490] mt-4">
                  No charge for 14 days. After that, $19.99/mo. After subscribing, return here to complete your claim.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href={`/${city}/${state}/${restaurant}`}
                  className="text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
                >
                  ← Back to listing
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
