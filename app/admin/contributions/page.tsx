import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import ContributionsList, { type AdminContribution } from './contributions-list'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin — Contributions | RamenNearYou',
}

export default async function AdminContributionsPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/admin/contributions')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/contributions')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) redirect('/')

  let contributions: AdminContribution[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    )
    const { data: rows } = await admin
      .from('contribution_rewards')
      .select('id, user_id, type, amount, status, reference_id, billing_period, created_at')
      .order('created_at', { ascending: false })
      .limit(300)

    const userIds = [...new Set((rows ?? []).map(r => r.user_id))]
    const { data: profiles } = await admin
      .from('user_profiles')
      .select('user_id, display_name')
      .in('user_id', userIds.length ? userIds : ['00000000-0000-0000-0000-000000000000'])

    const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.display_name]))
    contributions = (rows ?? []).map(r => ({
      ...r,
      amount: Number(r.amount),
      display_name: nameMap[r.user_id] ?? null,
    }))
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">Contributions</h1>
            <p className="text-[#6B6862]">
              Approve or reject contributions that require manual review. Approving issues
              cap-limited Ramen Pass credit; rejecting issues none.
            </p>
          </div>

          <ContributionsList initial={contributions} />
        </div>
      </main>
    </>
  )
}
