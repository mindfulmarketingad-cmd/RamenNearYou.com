import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import DashboardView from './dashboard-view'

// Static shell; the numbers load in the browser (dashboard-view.tsx).
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <Suspense>
        <DashboardView />
      </Suspense>
      <Footer />
    </main>
  )
}
