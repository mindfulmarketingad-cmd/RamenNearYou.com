import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimSearch from './claim-search'

export const metadata = {
  title: 'Claim Your Listing | Ramen Near You',
  description: 'Claim your ramen restaurant listing on Ramen Near You for $19.99/month. Update hours, photos, manage your page, and reach more ramen lovers.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-4">
            <span className="text-[#B57F50] text-xs font-medium uppercase tracking-widest">Owner Access</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Claim Your Listing
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            Take control of your restaurant&apos;s page on Ramen Near You. Update your hours, photos, and details — and reach thousands of ramen lovers every month.
          </p>
        </div>

        <ClaimSearch />
      </div>
      <Footer />
    </main>
  )
}
