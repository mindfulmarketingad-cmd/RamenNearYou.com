import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import DashboardClient from './dashboard-client'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Your Dashboard | Ramen Near You',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/dashboard')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F4F0] pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <DashboardClient />
        </div>
      </main>
      <Footer />
    </>
  )
}
