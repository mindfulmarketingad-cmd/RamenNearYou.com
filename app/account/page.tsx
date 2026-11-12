import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AccountApp from '@/components/pass/account-app'
import { Spinner } from '@/components/owner/owner-app'

export const metadata: Metadata = {
  title: 'Your account — RamenNearYou',
  description: 'Your saved ramen spots, passport and lists.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/account' },
}

// Static shell; everything account-specific runs in the browser against
// Supabase (components/pass/account-app.tsx, supabase/ramen-pass-membership.sql).
export default function AccountPage() {
  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-6">Your account</h1>
        <Suspense fallback={<Spinner />}>
          <AccountApp />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
