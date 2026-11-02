import { Suspense } from 'react'
import Link from 'next/link'
import { Crown, Check, ArrowUpRight, BarChart3 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BillboardDiagram from '@/components/billboard-diagram'
import ListingPlans from '@/components/listing-plans'
import { CheckoutCancelledNotice } from '@/components/search-param-notice'
import {
  BILLBOARD_SLOTS,
  BILLBOARD_PRICE,
  BILLBOARD_PERIOD,
  BILLBOARD_CHECKOUT_URL,
} from '@/lib/homepage-billboard'

export const metadata = {
  title: 'Featured & Premium Listings for Ramen Restaurants | Ramen Near You',
  description:
    'Featured ($29/month) puts your restaurant first on its city page with a gold map pin. Premium ($79/month) adds your state page and city ramen guide. Homepage billboard $99/month. Cancel anytime.',
  alternates: { canonical: 'https://www.ramennearyou.com/featured-listing' },
}

const INCLUDED = [
  'The full-width billboard at the very top of the homepage — above the map and every listing',
  'Your own photo, full bleed, as the background',
  'A "Get Directions" button that opens Google Maps at your door',
  'A second button straight to your site — "Order Now" when you give us an online ordering link, "View Menu & Hours" otherwise',
  'Your slot stays live for as long as your subscription does',
]

export default function FeaturedListingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400 text-xs font-medium uppercase tracking-widest">
              Featured Listings
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">
            Put Your Restaurant at the Top
          </h1>
          <p className="text-ink-soft leading-relaxed">
            Be the first ramen shop diners see in your city. Paid placements
            are always labelled “Featured” — our rankings and reviews stay
            independent.
          </p>
        </div>

        <div className="mb-14">
          <ListingPlans />
        </div>

        <div id="billboard" className="scroll-mt-24 text-center mb-6">
          <p className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Add-on</p>
          <h2 className="font-serif text-3xl font-bold text-ink mb-3">The Homepage Billboard</h2>
          <p className="text-ink-soft leading-relaxed">
            Your restaurant takes over the billboard at the very top of the
            homepage — the first thing every visitor sees before they reach the map.
          </p>
        </div>

        {/* What the space actually looks like, before anyone is asked to pay. */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-ink mb-1">
            Here&apos;s the space
          </h2>
          <p className="text-ink-soft text-sm mb-5">
            This is the slot your subscription fills.
          </p>
          <BillboardDiagram
            price={BILLBOARD_PRICE}
            period={BILLBOARD_PERIOD}
            totalSlots={BILLBOARD_SLOTS}
          />
        </div>

        {/* Real traffic numbers, so the decision isn't made on our say-so.
            Opens in a new tab on purpose — someone checking the traffic is
            mid-decision, and navigating them off the offer is a good way to
            lose them. */}
        <Link
          href="/dashboard"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-4 p-5 mb-10 rounded-2xl border border-line/10 bg-sunken hover:border-brand/40 transition-colors group"
        >
          <span className="shrink-0 w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-brand-ink" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold text-ink text-sm mb-0.5">
              See the traffic before you pay
            </span>
            <span className="block text-ink-soft text-xs leading-relaxed">
              Our analytics dashboard is public — visitors, searches, and clicks
              on real listings, updated live. Check what the homepage is
              actually worth, then decide.
            </span>
          </span>
          <span className="shrink-0 inline-flex items-center gap-1 text-brand-ink text-sm font-semibold group-hover:underline">
            View traffic <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Suspense>
          <CheckoutCancelledNotice />
        </Suspense>

        {/* Billboard checkout (plan checkouts are in ListingPlans above). */}
        <div className="rounded-2xl border-2 border-amber-400/60 overflow-hidden bg-sunken">
          <div className="px-6 py-6 text-center border-b border-amber-400/30 bg-amber-500/10">
            <p className="text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              Homepage Billboard
            </p>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="font-serif text-5xl font-bold text-ink">
                {BILLBOARD_PRICE}
              </span>
              <span className="text-ink-soft text-sm">/ {BILLBOARD_PERIOD}</span>
            </div>
          </div>

          <div className="p-6">
            <ul className="space-y-3 mb-6">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink leading-relaxed">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={BILLBOARD_CHECKOUT_URL}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
            >
              <Crown className="w-4 h-4" />
              Claim the Billboard — {BILLBOARD_PRICE}/{BILLBOARD_PERIOD}
            </a>

            <p className="text-center text-ink-soft text-xs mt-4">
              Secure payment via Stripe · Cancel anytime · Your slot goes live
              once we have your photo and links
            </p>
          </div>
        </div>

        <p className="text-center text-ink-soft text-sm mt-8 leading-relaxed">
          Questions first?{' '}
          <a
            href="mailto:hello@ramennearyou.com?subject=Featured%20listing%20question"
            className="text-brand-ink font-semibold hover:underline"
          >
            hello@ramennearyou.com
          </a>
        </p>
      </div>
      <Footer />
    </main>
  )
}
