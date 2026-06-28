import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BadgeCheck, ShieldAlert, Edit3, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'
import OwnerEditForm from '@/app/owner/[slug]/edit-form'
import VisitStatsCard from '@/components/visit-stats-card'

export const metadata = { title: 'Admin: Owner Dashboard Preview | Ramen Near You' }

export default async function AdminOwnerViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/admin/owner-view/${slug}`)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/admin/owner-view/${slug}`)

  // Admin-only
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) redirect('/')

  const admin = createAdminClient()
  const client = admin ?? supabase

  const base = ALL.find(r => r.slug === slug)
  if (!base) notFound()

  const { data: override } = await client
    .from('restaurant_overrides')
    .select('description, phone, website, menu_link, hours')
    .eq('restaurant_slug', slug)
    .maybeSingle()

  const { data: claim } = await client
    .from('claims')
    .select('user_id, status, created_at, contact_name, contact_email, restaurant_name')
    .eq('restaurant_slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  const initial = {
    description: override?.description ?? base.description ?? '',
    phone: override?.phone ?? base.phone ?? '',
    website: override?.website ?? base.website ?? '',
    menu_link: override?.menu_link ?? base.menuLink ?? '',
    hours: (override?.hours ?? base.hours ?? {}) as Record<string, string[] | string>,
  }

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Admin banner */}
        <div className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Admin preview — owner dashboard</p>
            <p className="text-amber-700 text-xs mt-0.5">
              You are viewing this as an admin. Any edits submitted here will be attributed to your admin account.
              {claim
                ? ` Claimed by ${claim.contact_name ?? 'unknown'} (${claim.contact_email ?? claim.user_id.slice(0, 8) + '…'})`
                : ' No approved claim found for this listing.'}
            </p>
          </div>
        </div>

        <Link href="/admin/claims" className="inline-flex items-center gap-1 text-[#6B6862] hover:text-[#1E2026] text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to claims
        </Link>

        {/* Restaurant header — matches owner dashboard style */}
        <div className="bg-[#F5F4F0] border border-black/8 rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">{base.name}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-[#6B6862] text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#B57F50]" /> {base.address}
              </p>
            </div>
            <Link
              href={`/${base.citySlug}/${base.stateSlug}/${base.slug}`}
              className="shrink-0 px-3 py-2 rounded-lg bg-black/5 hover:bg-black/8 text-[#6B6862] hover:text-[#1E2026] text-xs font-medium transition-colors"
            >
              View Public Page
            </Link>
          </div>

          <div className="border-t border-black/6 my-4" />

          {/* Visit analytics */}
          <VisitStatsCard slug={base.slug} restaurantName={base.name} />
        </div>

        {/* Edit form section */}
        <div className="flex items-center gap-2 mb-4">
          <Edit3 className="w-4 h-4 text-[#B57F50]" />
          <h2 className="font-semibold text-[#1E2026]">Edit Listing Content</h2>
        </div>
        <p className="text-[#6B6862] text-sm mb-6 leading-relaxed">
          Changes submitted here will be attributed to your admin account. Use this to fix or update listing content on behalf of the owner.
        </p>

        <OwnerEditForm slug={base.slug} restaurantName={base.name} initial={initial} />
      </div>
      <Footer />
    </main>
  )
}
