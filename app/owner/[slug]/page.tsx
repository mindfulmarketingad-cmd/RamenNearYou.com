import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BadgeCheck } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'
import OwnerEditForm from './edit-form'

export const metadata = { title: 'Edit Listing | Ramen Near You' }

export default async function OwnerEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/owner/${slug}`)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/owner/${slug}`)

  const admin = createAdminClient()
  const client = admin ?? supabase

  // Verify this user has an approved claim for this restaurant
  const { data: claim } = await client
    .from('claims')
    .select('id')
    .eq('restaurant_slug', slug)
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .maybeSingle()

  if (!claim) {
    redirect('/owner')
  }

  const base = ALL.find(r => r.slug === slug)
  if (!base) notFound()

  const { data: override } = await client
    .from('restaurant_overrides')
    .select('description, phone, website, menu_link, hours')
    .eq('restaurant_slug', slug)
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
        <Link href="/owner" className="inline-flex items-center gap-1 text-[#6B6862] hover:text-[#1E2026] text-sm mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">{base.name}</h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold">
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        </div>
        <p className="text-[#6B6862] text-sm mb-6">{base.address}</p>
        <p className="text-[#6B6862] text-sm mb-8 leading-relaxed">
          Edit the content shown on your listing. Changes go live immediately. Our team is notified of every edit for quality control.
        </p>

        <OwnerEditForm slug={base.slug} restaurantName={base.name} initial={initial} />
      </div>
      <Footer />
    </main>
  )
}
