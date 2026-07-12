import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Crown, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import StatsChart from './stats-chart'

export const metadata = {
  title: 'Featured Listing Dashboard | Ramen Near You',
}

export default async function FeaturedDashboardPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/featured/dashboard')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/featured/dashboard')

  const admin = createAdminClient()
  const client = admin ?? supabase

  const { data: listings } = await client
    .from('featured_listings')
    .select('id, restaurant_name, city, state_code, status, created_at, stripe_subscription_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const active = (listings ?? []).filter(l => l.status === 'active')
  const pending = (listings ?? []).filter(l => l.status === 'pending')
  const cancelled = (listings ?? []).filter(l => l.status === 'cancelled')

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <p className="text-amber-400 text-xs font-medium uppercase tracking-widest">Featured Listing Dashboard</p>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">My Featured Listings</h1>
          <p className="text-[#6B6862] text-sm">Track views, clicks, and performance for your featured placements.</p>
        </div>

        {/* No listings */}
        {!listings?.length && (
          <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-[#1E2026] font-medium mb-1">No featured listings yet</p>
            <p className="text-[#6B6862] text-sm mb-6">Get your restaurant in front of thousands of ramen lovers every month.</p>
            <Link
              href="/featured/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
            >
              Get Featured <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Pending listings */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Pending Review</h2>
            <div className="space-y-3">
              {pending.map(l => (
                <div key={l.id} className="flex items-center justify-between gap-4 bg-[#F5F4F0] border border-amber-500/20 rounded-xl p-5">
                  <div className="min-w-0">
                    <p className="text-[#1E2026] font-medium truncate">{l.restaurant_name}</p>
                    <p className="text-[#6B6862] text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#96602F]" /> {l.city}, {l.state_code}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium">
                    Under Review
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active listings with analytics */}
        {active.length > 0 && (
          <section className="mb-10 space-y-10">
            {active.map(l => (
              <div key={l.id} className="border border-[#B57F50]/20 rounded-2xl p-6 bg-[#FDFCF9]">
                <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-black/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[#1E2026] font-semibold text-lg">{l.restaurant_name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        Active
                      </span>
                    </div>
                    <p className="text-[#6B6862] text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#96602F]" /> {l.city}, {l.state_code}
                    </p>
                  </div>
                  <Link
                    href="/featured/apply"
                    className="shrink-0 px-3 py-2 rounded-lg bg-[#B57F50]/10 hover:bg-[#B57F50]/20 text-[#96602F] text-xs font-medium transition-colors border border-[#B57F50]/20"
                  >
                    + Add Another
                  </Link>
                </div>

                <StatsChart listingId={l.id} restaurantName={l.restaurant_name} />
              </div>
            ))}
          </section>
        )}

        {/* Cancelled listings */}
        {cancelled.length > 0 && (
          <section>
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Past Listings</h2>
            <div className="space-y-3">
              {cancelled.map(l => (
                <div key={l.id} className="flex items-center justify-between gap-4 bg-[#F5F4F0] border border-black/8 rounded-xl p-5 opacity-60">
                  <div className="min-w-0">
                    <p className="text-[#1E2026] font-medium truncate">{l.restaurant_name}</p>
                    <p className="text-[#6B6862] text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#96602F]" /> {l.city}, {l.state_code}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-black/8 text-[#6B6862] text-xs font-medium">
                    Cancelled
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA footer */}
        <div className="mt-12 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6B6862] text-sm">Want to boost visibility even more?</p>
          <Link
            href="/featured/apply"
            className="flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
          >
            <Crown className="w-4 h-4" /> Get Another Featured Spot
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
