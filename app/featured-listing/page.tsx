import Image from 'next/image'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PlanToggle from './plan-toggle'

export const metadata = {
  title: 'Get Featured on the Ramen Search Map | Ramen Near You',
  description: 'Get your restaurant featured with a stand-out icon on the ramen search map and top placement on the homepage restaurant list. $19.99/month or $250/year.',
  alternates: { canonical: 'https://www.ramennearyou.com/featured-listing' },
}

export default async function FeaturedListingPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { cancelled } = await searchParams

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <span className="text-amber-600 text-xs font-medium uppercase tracking-widest">Featured Listing</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Get Featured in Our Search Map
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-2xl mx-auto">
            Put your business in front of customers actively searching for places like yours.
            With over 1,000+ monthly pageviews, your listing gains valuable visibility from
            people ready to discover, visit, or buy.
          </p>
        </div>

        {/* Preview of the stand-out map icon a featured listing gets */}
        <div className="rounded-2xl border border-black/8 overflow-hidden mb-10 bg-[#F5F4F0]">
          <Image
            src="/images/featured-searchmap-preview.png"
            alt="The ramen search map, showing a gold crown icon that marks a featured restaurant standing out among the regular pins"
            width={1160}
            height={703}
            className="w-full h-auto"
          />
          <p className="text-center text-xs text-[#6B6862] py-2.5 border-t border-black/5">
            The gold crown icon is how a Featured listing stands out on the search map.
          </p>
        </div>

        {cancelled === '1' && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm text-center">
            Payment was cancelled. Your information is saved — complete checkout when you&apos;re ready.
          </div>
        )}

        <PlanToggle />

        <p className="text-center text-[#1E2026]/40 text-xs mt-8">
          After checkout, email{' '}
          <a href="mailto:hello@ramennearyou.com" className="text-amber-600/70 hover:text-amber-600 transition-colors">
            hello@ramennearyou.com
          </a>{' '}
          with your restaurant name and any updated photos. We&apos;ll have your Featured badge live within 24 hours.
        </p>
      </div>
      <Footer />
    </main>
  )
}
