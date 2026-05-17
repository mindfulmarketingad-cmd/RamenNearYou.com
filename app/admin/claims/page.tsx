import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import ClaimsList from './claims-list'
import { createClient } from '@/lib/supabase/server'

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

  // Use service role key to read all claims
  let claims: unknown[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { data } = await admin
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false })
    claims = data ?? []
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1a1c22] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-2">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">Restaurant Claims</h1>
            <p className="text-[#B0B3BB]">Review, approve, or reject ownership claims submitted by restaurant owners.</p>
          </div>

          <ClaimsList initialClaims={claims as Parameters<typeof ClaimsList>[0]['initialClaims']} />
        </div>
      </main>
    </>
  )
}
