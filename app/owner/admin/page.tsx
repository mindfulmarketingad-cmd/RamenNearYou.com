import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Spinner } from '@/components/owner/owner-app'
import OwnerAdmin from '@/components/owner/owner-admin'

export const metadata: Metadata = {
  title: 'Claim review — RamenNearYou',
  robots: { index: false, follow: false },
}

// Static shell. Access is enforced in Supabase: admin_list_claims() and
// review_claim() only answer for emails in owner_portal_admins.
export default function OwnerAdminPage() {
  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-ink mb-6">Claim review</h1>
        <Suspense fallback={<Spinner />}>
          <OwnerAdmin />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
