import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimForm from './claim-form'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getRestaurant } from '@/lib/restaurants'
import PricingToggle from './pricing-toggle'

const STRIPE_CLAIM_LINK_MONTHLY = 'https://buy.stripe.com/28E4gAfuG58I9UG9pIfrW04'
const STRIPE_CLAIM_LINK_ANNUAL = 'https://buy.stripe.com/5kQ5kE2HU44Eff0eK2frW0b'

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

  const emailParam = encodeURIComponent(user.email ?? '')
  const monthlyLink = `${STRIPE_CLAIM_LINK_MONTHLY}?prefilled_email=${emailParam}&client_reference_id=${r.slug}`
  const annualLink = `${STRIPE_CLAIM_LINK_ANNUAL}?prefilled_email=${emailParam}&client_reference_id=${r.slug}`

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Claim Listing</p>
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
              <PricingToggle monthlyLink={monthlyLink} annualLink={annualLink} />

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
