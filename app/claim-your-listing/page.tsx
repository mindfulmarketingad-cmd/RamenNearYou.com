import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import ClaimSearch from './claim-search'

export const metadata = {
  title: 'Claim Your Ramen Restaurant Listing — Free | Ramen Near You',
  description: 'Claim your restaurant on RamenNearYou for free. Create an account, submit your claim, and once verified you can update your hours, photos, menu, and description anytime.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden mb-6">
            <RestaurantImage src={pickStockPhoto('claim-your-listing')} alt="A bowl of ramen" fill className="object-cover" sizes="576px" priority />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-4">
            <span className="text-[#96602F] text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Claim Your Restaurant Listing — Free
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            Claiming your listing on RamenNearYou is <strong className="text-[#1E2026]">completely free</strong>.
            Create an account, find your restaurant below, and submit your claim — our team verifies
            ownership, and once approved you control your hours, photos, menu, and description.
          </p>
        </div>

        <ClaimSearch />
      </div>
      <Footer />
    </main>
  )
}
