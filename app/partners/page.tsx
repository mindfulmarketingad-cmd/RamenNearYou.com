import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PartnersDirectory from './partners-directory'

export const metadata = {
  title: 'Partners — Every Ramen Business on RamenNearYou',
  description: 'Search and filter every ramen restaurant listed on RamenNearYou. Find your business and claim your free listing to update hours, photos, and get featured placement.',
  alternates: { canonical: 'https://www.ramennearyou.com/partners' },
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">Partners</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
            Every Ramen Business on RamenNearYou
          </h1>
          <p className="text-[#6B6862] text-sm max-w-2xl mb-8">
            Search or filter to find your restaurant, then claim your free listing to update your hours,
            photos, and description — and get featured placement on the map.
          </p>

          <PartnersDirectory />
        </div>
      </div>
      <Footer />
    </main>
  )
}
