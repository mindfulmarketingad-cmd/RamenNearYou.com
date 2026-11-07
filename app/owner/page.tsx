import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import OwnerApp, { Spinner } from '@/components/owner/owner-app'

export const metadata: Metadata = {
  title: 'Owner dashboard — RamenNearYou',
  description: 'Claim and manage your restaurant’s RamenNearYou listing.',
  robots: { index: false, follow: false },
}

// Static shell; sign-in, claiming and editing run in the browser against
// Supabase (components/owner/owner-app.tsx, supabase/owner-portal.sql).
export default function OwnerPage() {
  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-2">Owner dashboard</h1>
        <p className="text-ink-mid mb-8">Claim your listing, keep your details current, and see how many diners find you.</p>
        <Suspense fallback={<Spinner />}>
          <OwnerApp />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
