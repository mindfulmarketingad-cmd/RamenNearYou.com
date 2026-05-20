import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimSearch from './claim-search'

export const metadata = {
  title: 'Claim Your Free Listing | Ramen Near You',
  description: 'Claim your ramen restaurant listing on Ramen Near You — free forever. Update hours, photos, and details.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-emerald-600 text-xs font-medium uppercase tracking-widest">Free Forever</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Claim Your Free Listing
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            Already listed on Ramen Near You? Claim your restaurant to manage your page, update details, and respond to reviews — completely free.
          </p>
        </div>

        <ClaimSearch />

        <p className="text-center text-[#6B6862]/50 text-xs mt-8">
          Want more visibility?{' '}
          <a href="/featured/apply" className="text-[#B57F50] hover:underline transition-colors">
            See featured listing options
          </a>
        </p>
      </div>
      <Footer />
    </main>
  )
}
