import Link from 'next/link'
import { Crown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ListingPlans from '@/components/listing-plans'

export const metadata = {
  title: 'Claim Your Listing | Ramen Near You',
  description:
    'Claim your ramen restaurant for $49.99/month. Includes a gold crown pin on the homepage map and Featured placement at the top of your city and state pages.',
  alternates: { canonical: 'https://www.ramennearyou.com/featured-listing' },
}

export default function FeaturedListingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400 text-xs font-medium uppercase tracking-widest">
              For restaurant owners
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">
            Claim your listing
          </h1>
          <p className="text-ink-soft leading-relaxed">
            $49.99/month includes the owner dashboard, listing analytics, a verified badge,
            and Featured placement labelled Featured / Sponsored: a gold crown pin on the homepage map,
            the top of your city page, and the top of your state page.
          </p>
        </div>
        <ListingPlans cardBg="bg-surface" />
        <p className="text-center text-sm text-ink-soft mt-8">
          <Link href="/claim-your-listing" className="text-brand-ink font-semibold hover:underline">Find your restaurant and claim it</Link>
        </p>
      </div>
      <Footer />
    </main>
  )
}
