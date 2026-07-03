import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import ReviewCardOrdersList from './review-card-orders-list'

export const metadata: Metadata = { title: 'Admin — Review Card Orders | RamenNearYou' }

export default async function AdminReviewCardsPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/admin/review-cards')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/review-cards')
  if (!process.env.ADMIN_EMAIL || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const client = createAdminClient() ?? supabase
  const { data: orders } = await client
    .from('review_card_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  // Scan counts per restaurant, so fulfilled orders show QR traction at a glance.
  const { data: scans } = await client
    .from('review_card_scans')
    .select('restaurant_slug')
    .limit(10000)
  const scanCounts: Record<string, number> = {}
  for (const s of scans ?? []) {
    scanCounts[s.restaurant_slug] = (scanCounts[s.restaurant_slug] ?? 0) + 1
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">Review Card Orders</h1>
            <p className="text-[#6B6862] mb-4">
              Confirm each payment in Stripe, then fulfill: email the buyer their print link and mark the order done.
            </p>
            <div className="flex gap-3 flex-wrap text-sm">
              <Link href="/admin/claims" className="text-[#B57F50] hover:underline">Claims</Link>
              <span className="text-[#9B9490]">·</span>
              <Link href="/admin/listings" className="text-[#B57F50] hover:underline">Listings</Link>
              <span className="text-[#9B9490]">·</span>
              <Link href="/admin/contributions" className="text-[#B57F50] hover:underline">Contributions</Link>
              <span className="text-[#9B9490]">·</span>
              <Link href="/admin/listing-edits" className="text-[#B57F50] hover:underline">Listing Edits</Link>
              <span className="text-[#9B9490]">·</span>
              <span className="text-[#1E2026] font-semibold">Review Cards</span>
            </div>
          </div>
          <ReviewCardOrdersList initial={orders ?? []} scanCounts={scanCounts} />
        </div>
      </main>
    </>
  )
}
