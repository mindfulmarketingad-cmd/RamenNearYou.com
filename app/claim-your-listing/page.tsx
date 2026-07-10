import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimSearch from './claim-search'

export const metadata = {
  title: 'Get More Visitors To My Ramen Restaurant | Ramen Near You',
  description: 'Get the #1 featured spot at the top of the ramen search map. Free to claim for 14 days, then just $19.99/month. Your restaurant shows up first when people search for ramen nearby.',
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
            Get More Visitors To My Ramen Restaurant
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            Get the <strong className="text-[#1E2026]">#1 featured spot</strong> at the top of the ramen search map — your restaurant appears first when someone searches for ramen near you. Free to claim for 14 days, then just $19.99/month.
          </p>
        </div>

        <ClaimSearch />
      </div>
      <Footer />
    </main>
  )
}
