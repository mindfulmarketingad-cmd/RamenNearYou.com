import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProfileBody from './profile-body'

// Kept as a server component (see app/contact/page.tsx for why) so Navbar
// and Footer's server-side data reads don't get pulled into this page's
// client bundle.
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <Navbar />
      <ProfileBody />
      <Footer />
    </div>
  )
}
