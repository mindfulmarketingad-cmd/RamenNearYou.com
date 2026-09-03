import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PlusBody from './plus-body'

// Kept as a server component (see app/contact/page.tsx for why) so Navbar
// and Footer's server-side data reads don't get pulled into this page's
// client bundle.
export default function PlusPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <PlusBody />
      <Footer />
    </main>
  )
}
