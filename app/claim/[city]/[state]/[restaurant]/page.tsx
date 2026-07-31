import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimForm from './claim-form'
import { createClient } from '@/lib/supabase/server'
import { getRestaurant } from '@/lib/restaurants'
import { findSupplementListing, supplementToRestaurant } from '@/lib/places-supplements'
import { getPhoBySlug, phoToRestaurant } from '@/lib/pho'

export default async function ClaimPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  // Not every listing on the map/partners table has a DB row — Google
  // Places-supplement listings and pho listings are just as claimable, each
  // adapted into the same Restaurant shape the rest of this page expects.
  const dbr = getRestaurant(city, state, restaurant)
  const sup = !dbr ? findSupplementListing(city, state, restaurant) : null
  const pho = !dbr && !sup ? getPhoBySlug(restaurant) : null
  const r = dbr ?? (sup ? supplementToRestaurant(sup) : null) ?? (pho ? phoToRestaurant(pho) : null)
  if (!r) notFound()
  // Pho listings live at /partners/{slug} rather than /{city}/{state}/{slug}.
  const backHref = pho ? `/partners/${pho.slug}` : `/${city}/${state}/${restaurant}`

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: existingClaim } = await supabase
    .from('claims')
    .select('id, status')
    .eq('restaurant_slug', r.slug)
    .single()

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
          ) : (
            // Claiming is free — submissions go in as pending and are
            // reviewed/approved by our team before the listing is verified.
            <div className="space-y-6">
              <div className="flex items-start gap-3 bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-[#1E2026]">
                  <strong>Claiming is 100% free.</strong>{' '}
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
