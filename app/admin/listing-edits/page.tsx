import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import ListingEditsList from './listing-edits-list'

export const metadata: Metadata = { title: 'Admin — Listing Edits | RamenNearYou' }

export default async function AdminListingEditsPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/admin/listing-edits')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/listing-edits')
  if (!process.env.ADMIN_EMAIL || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const admin = createAdminClient()
  let edits: Record<string, unknown>[] = []
  if (admin) {
    const { data } = await admin
      .from('listing_edit_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
    edits = data ?? []
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">Listing Edits</h1>
            <p className="text-[#6B6862] mb-4">
              Review and approve owner-submitted edits, photos, and review responses.
            </p>
            <div className="flex gap-3 flex-wrap text-sm">
              <Link href="/admin/claims" className="text-[#B57F50] hover:underline">Claims</Link>
              <span className="text-[#9B9490]">·</span>
              <Link href="/admin/listings" className="text-[#B57F50] hover:underline">Listings</Link>
              <span className="text-[#9B9490]">·</span>
              <Link href="/admin/contributions" className="text-[#B57F50] hover:underline">Contributions</Link>
              <span className="text-[#9B9490]">·</span>
              <span className="text-[#1E2026] font-semibold">Listing Edits</span>
            </div>
          </div>
          <ListingEditsList initial={edits} />
        </div>
      </main>
    </>
  )
}
