import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BadgeCheck, MapPin, Edit3, Clock, Crown, Eye,
  Globe, Phone, AlignLeft, Star, ChevronRight,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL_RESTAURANTS } from '@/lib/restaurants'
import VisitStatsCard from '@/components/visit-stats-card'

export const metadata = {
  title: 'Owner Dashboard | Ramen Near You',
}

const BENEFITS = [
  { icon: BadgeCheck, label: 'Verified owner badge', desc: 'A blue verified badge on your public listing builds trust with customers.' },
  { icon: AlignLeft, label: 'Edit your description', desc: 'Control how your restaurant appears — update your story, specialties, and highlights.' },
  { icon: Phone, label: 'Update phone & website', desc: 'Keep contact info accurate so customers can reach you and order online.' },
  { icon: Clock, label: 'Accurate hours', desc: 'Set your current hours so visitors know exactly when you\'re open.' },
  { icon: Eye, label: 'Weekly visit analytics', desc: 'See how many people are visiting your listing each week, month, and all-time.' },
  { icon: Star, label: 'Featured city placement', desc: 'Upgrade to appear at the top of your city\'s ramen results page.', cta: true },
]

export default async function OwnerDashboardPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/owner')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/owner')

  const admin = createAdminClient()
  const client = admin ?? supabase

  const { data: claims } = await client
    .from('claims')
    .select('restaurant_slug, restaurant_name, restaurant_city, status, reviewed_at')
    .eq('user_id', user.id)
    .order('reviewed_at', { ascending: false, nullsFirst: false })

  const approved = (claims ?? []).filter(c => c.status === 'approved')
  const pending  = (claims ?? []).filter(c => c.status === 'pending')

  const slugMap = new Map(ALL_RESTAURANTS.map(r => [r.slug, r]))

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Owner Dashboard</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">My Restaurants</h1>
          <p className="text-[#6B6862] text-sm">Manage your listings, track visits, and keep your info accurate.</p>
        </div>

        {/* No claims at all — show benefits + CTA */}
        {approved.length === 0 && pending.length === 0 && (
          <>
            <div className="bg-[#F5F4F0] border border-black/8 rounded-2xl p-8 text-center mb-8">
              <p className="text-[#1E2026] font-medium mb-2">You haven&apos;t claimed any restaurants yet.</p>
              <p className="text-[#6B6862] text-sm mb-5">Find your restaurant and submit a claim to start managing its listing.</p>
              <Link
                href="/claim-your-listing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
              >
                Claim Your Listing <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <BenefitsList />
          </>
        )}

        {/* Pending claims */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Pending Review</h2>
            <div className="space-y-3">
              {pending.map(c => (
                <div key={c.restaurant_slug} className="bg-[#F5F4F0] border border-amber-500/20 rounded-xl p-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[#1E2026] font-medium truncate">{c.restaurant_name}</p>
                    <p className="text-[#6B6862] text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#96602F]" /> {c.restaurant_city}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Approved claims with analytics */}
        {approved.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Verified Restaurants</h2>
            <div className="space-y-6">
              {approved.map(c => {
                const r = slugMap.get(c.restaurant_slug)
                return (
                  <div key={c.restaurant_slug} className="bg-[#F5F4F0] border border-black/8 rounded-2xl p-5">
                    {/* Restaurant header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-[#1E2026] font-semibold text-base">{c.restaurant_name}</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-500 text-xs font-semibold">
                            <BadgeCheck className="w-3 h-3" /> Verified Owner
                          </span>
                        </div>
                        <p className="text-[#6B6862] text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#96602F]" /> {c.restaurant_city}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {r && (
                          <Link
                            href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                            className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/8 text-[#6B6862] hover:text-[#1E2026] text-xs font-medium transition-colors"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/owner/${c.restaurant_slug}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Listing
                        </Link>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-black/6 my-4" />

                    {/* Visit analytics */}
                    <VisitStatsCard slug={c.restaurant_slug} restaurantName={c.restaurant_name} />

                    {/* Featured upsell */}
                    <div className="mt-4 flex items-center justify-between gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                        <p className="text-[#1E2026] text-xs leading-snug">
                          <span className="font-semibold">Get featured</span> — appear at the top of your city page and reach more ramen lovers.
                        </p>
                      </div>
                      <Link
                        href="/featured/apply"
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        Get Featured
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Benefits list (shown after approved listings too) */}
        {(approved.length > 0 || pending.length > 0) && (
          <section className="mt-6">
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-4">Your Subscription Includes</h2>
            <BenefitsList />
          </section>
        )}

        {/* Claim another CTA */}
        {(approved.length > 0 || pending.length > 0) && (
          <div className="mt-8 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#6B6862] text-sm">Own another ramen restaurant?</p>
            <Link
              href="/claim-your-listing"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#B57F50]/30 text-[#96602F] text-sm font-medium hover:bg-[#B57F50]/5 transition-colors"
            >
              Claim Another Listing <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

function BenefitsList() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {BENEFITS.map(({ icon: Icon, label, desc, cta }) => (
        <div
          key={label}
          className={`flex gap-3 p-4 rounded-xl border ${cta ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#F5F4F0] border-black/6'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cta ? 'bg-amber-500/15' : 'bg-[#B57F50]/10'}`}>
            <Icon className={`w-4 h-4 ${cta ? 'text-amber-500' : 'text-[#96602F]'}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[#1E2026] text-sm font-semibold">{label}</p>
            <p className="text-[#6B6862] text-xs mt-0.5 leading-snug">{desc}</p>
            {cta && (
              <Link
                href="/featured/apply"
                className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold mt-1.5 hover:underline"
              >
                Learn more <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
