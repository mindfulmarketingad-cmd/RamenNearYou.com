import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FeaturedTiers from './featured-form'

export const metadata = {
  title: 'Get a Featured Listing | Ramen Near You',
  description: 'Promote your ramen restaurant on Ramen Near You — homepage, state, or city featured placements starting at $29.99/month.',
}

export default async function FeaturedApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { cancelled } = await searchParams

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">Featured Listings</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Put Your Restaurant on the Map
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-2xl mx-auto">
            Claim your listing for $49.99/month, or boost your visibility with a city or homepage featured placement in front of thousands of ramen lovers every month.
          </p>
        </div>

        {cancelled === '1' && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
            Payment was cancelled. Your information is saved — complete checkout when you&apos;re ready.
          </div>
        )}

        <FeaturedTiers />

        <p className="text-center text-[#1E2026]/30 text-xs mt-8">
          After checkout, email{' '}
          <a href="mailto:hello@ramennearyou.com" className="text-amber-400/60 hover:text-amber-400 transition-colors">
            hello@ramennearyou.com
          </a>{' '}
          with your restaurant name, photos, and description. We&apos;ll have your listing live within 24 hours.
        </p>
      </div>
      <Footer />
    </main>
  )
}
