import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck, Crown, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimForm from './claim-form'
import { createClient } from '@/lib/supabase/server'
import { getRestaurant } from '@/lib/restaurants'
import { findSupplementListing, supplementToRestaurant } from '@/lib/places-supplements'
import { getPhoBySlug, phoToRestaurant } from '@/lib/pho'
import { getMiscPartnerBySlug } from '@/lib/misc-partners'
import { hasActiveClaimSubscription } from '@/lib/claim-subscriptions'

const CLAIM_PAYMENT_LINK = 'https://buy.stripe.com/28E4gAfuG58I9UG9pIfrW04'

const CLAIM_BENEFITS = [
  'Verified badge on your listing',
  'Update your hours, photos, and description anytime',
  'Correct your business name, phone, and details',
  'Priority placement in claim-verified search results',
]

export default async function ClaimPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  // Not every listing on the map/partners table has a DB row — Google
  // Places-supplement listings, pho listings, and misc partner listings are
  // all just as claimable, each adapted into the same Restaurant shape the
  // rest of this page expects.
  const dbr = getRestaurant(city, state, restaurant)
  const sup = !dbr ? findSupplementListing(city, state, restaurant) : null
  const pho = !dbr && !sup ? getPhoBySlug(restaurant) : null
  const misc = !dbr && !sup && !pho ? getMiscPartnerBySlug(restaurant) : null
  const r = dbr ?? (sup ? supplementToRestaurant(sup) : null) ?? (pho ? phoToRestaurant(pho) : null) ?? misc
  if (!r) notFound()
  // Pho and misc partner listings live at /partners/{slug} rather than
  // /{city}/{state}/{slug}.
  const backHref = pho ? `/partners/${pho.slug}` : misc ? `/partners/${misc.slug}` : `/${city}/${state}/${restaurant}`

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: existingClaim } = await supabase
    .from('claims')
    .select('id, status')
    .eq('restaurant_slug', r.slug)
    .single()

  const isPaid = !existingClaim && await hasActiveClaimSubscription(r.slug, user.email ?? '')

  const paymentUrl = `${CLAIM_PAYMENT_LINK}?client_reference_id=${encodeURIComponent(r.slug)}&prefilled_email=${encodeURIComponent(user.email ?? '')}`

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Claim Listing</p>
          <h1 className="font-serif text-4xl font-bold text-[#1E2026] mb-2">Claim {r.name}</h1>
          <p className="text-[#6B6862] mb-6">{r.address}</p>

          {existingClaim ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-amber-300 text-sm">
              This listing has already been claimed (status: {existingClaim.status}). If you believe this is an error, please contact us.
            </div>
          ) : !isPaid ? (
            // Claiming used to be free — it's now a $19.99/mo subscription,
            // same benefits, paid via the Stripe Payment Link below. The
            // webhook (app/api/webhooks/stripe/route.ts) marks the
            // claim_subscriptions row active on checkout completion; this
            // page re-checks that on every load, so returning here after
            // payment unlocks the form automatically.
            <div className="space-y-6">
              <div className="rounded-2xl border border-black/8 overflow-hidden bg-[#F5F4F0]">
                <div className="px-6 pt-6 pb-5 text-center border-b border-black/8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Crown className="w-3 h-3" /> Claim This Listing
                  </div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="font-serif text-3xl font-bold text-[#1E2026]">$19.99</span>
                    <span className="text-[#6B6862] text-xs">/ month</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#6B6862] text-xs leading-relaxed mb-4">
                    Everything included in a listing claim — now as a monthly subscription.
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {CLAIM_BENEFITS.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#1E2026]">
                        <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={paymentUrl}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Subscribe &amp; Claim This Listing
                  </a>
                  <p className="text-center text-[#1E2026]/30 text-xs mt-4">
                    Secure payment via Stripe · Cancel anytime
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-[#6B6862]">
                Already subscribed? Come back to this page after checkout and your claim form will unlock.
              </p>

              <div className="text-center">
                <Link
                  href={backHref}
                  className="text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
                >
                  ← Back to listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-3 bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-[#1E2026]">
                  <strong>Your $19.99/mo subscription is active.</strong>{' '}
                  <span className="text-[#6B6862]">
                    Submit your details below and our team will review your claim to verify ownership.
                    Once approved, you&apos;ll get a verified badge and can update your hours, photos,
                    and description anytime.
                  </span>
                </p>
              </div>

              <ClaimForm
                userEmail={user.email ?? ''}
                // Google sign-in populates full_name/name in user_metadata —
                // using it lets most visitors claim with a single click
                // instead of retyping their name into a form.
                userDisplayName={
                  user.user_metadata?.full_name ??
                  user.user_metadata?.name ??
                  user.user_metadata?.display_name ??
                  ''
                }
                restaurant={r}
              />

              <div className="text-center">
                <Link
                  href={backHref}
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
