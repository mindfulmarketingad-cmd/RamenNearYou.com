import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import ClaimsList from './claims-list'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const metadata: Metadata = {
  title: 'Admin — Review Claims | RamenNearYou',
}

export default async function AdminClaimsPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/admin/claims')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/claims')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) {
    redirect('/')
  }

  // Prefer service role client (bypasses RLS); fall back to admin session
  // (requires "Admin manages all claims" RLS policy from supabase/admin-rls-policies.sql)
  const client = createAdminClient() ?? supabase
  let claims: unknown[] = []
  const { data } = await client
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false })
  claims = data ?? []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">Restaurant Claims</h1>
            <p className="text-[#6B6862]">Review, approve, or reject ownership claims submitted by restaurant owners.</p>
          </div>

          <ClaimsList initialClaims={claims as Parameters<typeof ClaimsList>[0]['initialClaims']} />
        </div>
      </main>
    </>
  )
}
