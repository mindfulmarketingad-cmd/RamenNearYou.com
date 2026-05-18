import Link from 'next/link'
import { Crown, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Featured Listing Confirmed | Ramen Near You',
}

export default async function FeaturedSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ listing_id?: string }>
}) {
  const { listing_id } = await searchParams

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          <Crown className="w-9 h-9 text-amber-400" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Payment confirmed</span>
        </div>
        <h1 className="font-serif text-4xl font-bold text-white mb-4">
          You&apos;re Featured!
        </h1>
        <p className="text-[#B0B3BB] leading-relaxed mb-8">
          Your listing is now live on the Ramen Near You homepage. Thousands of ramen lovers will discover your restaurant every month.
        </p>

        {listing_id && (
          <p className="text-white/30 text-xs mb-8">Listing ID: {listing_id}</p>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#1E2026] font-semibold rounded-xl transition-colors"
          >
            View Homepage
          </Link>
          <Link
            href="/featured/apply"
            className="block w-full py-3 border border-white/10 text-[#B0B3BB] hover:text-white rounded-xl transition-colors text-sm"
          >
            Apply for Another Listing
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
