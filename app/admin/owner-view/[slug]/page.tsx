import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BadgeCheck, ShieldAlert } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'
import OwnerEditForm from '@/app/owner/[slug]/edit-form'

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

  // Fetch the owner's claim info to show context
  const { data: claim } = await client
    .from('claims')
    .select('user_id, status, created_at')
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Admin banner */}
        <div className="flex items-start gap-3 mb-8 px-4 py-3 rounded-xl bg-amber-50 border border-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Admin preview — owner dashboard</p>
            <p className="text-amber-700 text-xs mt-0.5">
              You are viewing this as an admin. Any edits submitted here will be attributed to your admin account.
              {claim ? ` Claimed by user ${claim.user_id.slice(0, 8)}…` : ' No approved claim found for this listing.'}
            </p>
          </div>
        </div>

        <Link href="/admin/claims" className="inline-flex items-center gap-1 text-[#6B6862] hover:text-[#1E2026] text-sm mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to claims
        </Link>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">{base.name}</h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold">
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        </div>
        <p className="text-[#6B6862] text-sm mb-6">{base.address}</p>
        <p className="text-[#6B6862] text-sm mb-8 leading-relaxed">
          Edit the content shown on this listing. Changes are reviewed before going live, usually within 24 hours.
        </p>

        <OwnerEditForm slug={base.slug} restaurantName={base.name} initial={initial} />
      </div>
      <Footer />
    </main>
  )
}
