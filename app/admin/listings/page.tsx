import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import ListingsList from './listings-list'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin — Review Listings | RamenNearYou',
}

export default async function AdminListingsPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/admin/listings')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/listings')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) redirect('/')

  let listings: unknown[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { data } = await admin
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    listings = data ?? []
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1a1c22] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">Listing Submissions</h1>
            <p className="text-[#B0B3BB]">Review, approve, or reject restaurant listings submitted through the directory.</p>
          </div>
          <ListingsList initialListings={listings as Parameters<typeof ListingsList>[0]['initialListings']} />
        </div>
      </main>
    </>
  )
}
