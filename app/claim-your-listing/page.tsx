import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimSearch from './claim-search'

export const metadata = {
  title: 'Claim Your Listing | Ramen Near You',
  description: 'Get a dedicated landing page with fully editable content and the #1 featured spot on the search map. Start free for 14 days, then $19.99/month.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-4">
            <span className="text-[#B57F50] text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Own Your Spot on the Map
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            Get a dedicated landing page with fully editable content and the <strong className="text-[#1E2026]">#1 featured spot</strong> on the ramen search map. Start free for 14 days — no upfront cost. Then just $19.99/month.
          </p>
        </div>

        <ClaimSearch />
      </div>
      <Footer />
    </main>
  )
}
