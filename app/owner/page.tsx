import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck, MapPin, Edit3, Clock } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL_RESTAURANTS } from '@/lib/restaurants'

export const metadata = {
  title: 'Owner Dashboard | Ramen Near You',
}

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

  // For each approved claim, lookup the restaurant slug → city/state to build the URL
  const slugMap = new Map(ALL_RESTAURANTS.map(r => [r.slug, r]))

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-8">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-widest mb-2">Owner Dashboard</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">My Restaurants</h1>
          <p className="text-[#6B6862] text-sm">Manage content for restaurants you&apos;ve claimed.</p>
        </div>

        {approved.length === 0 && pending.length === 0 && (
          <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-8 text-center">
            <p className="text-[#1E2026] mb-2">You haven&apos;t claimed any restaurants yet.</p>
            <p className="text-[#6B6862] text-sm mb-5">Find your restaurant and submit a claim to start managing its listing.</p>
            <Link
              href="/cities"
              className="inline-block px-4 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
            >
              Browse Cities
            </Link>
          </div>
        )}

        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Pending Review</h2>
            <div className="space-y-3">
              {pending.map(c => (
                <div key={c.restaurant_slug} className="bg-[#F5F4F0] border border-amber-500/20 rounded-xl p-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[#1E2026] font-medium truncate">{c.restaurant_name}</p>
                    <p className="text-[#6B6862] text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#B57F50]" /> {c.restaurant_city}
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

        {approved.length > 0 && (
          <section>
            <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-wide mb-3">Verified Restaurants</h2>
            <div className="space-y-3">
              {approved.map(c => {
                const r = slugMap.get(c.restaurant_slug)
                return (
                  <div key={c.restaurant_slug} className="bg-[#F5F4F0] border border-black/8 rounded-xl p-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-[#1E2026] font-medium">{c.restaurant_name}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      </div>
                      <p className="text-[#6B6862] text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B57F50]" /> {c.restaurant_city}
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
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  )
}
