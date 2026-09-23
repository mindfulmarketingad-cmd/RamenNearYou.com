import Link from 'next/link'
import { Crown, Check, ArrowUpRight, BarChart3 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BillboardDiagram from '@/components/billboard-diagram'
import {
  BILLBOARD_SLOTS,
  BILLBOARD_PRICE,
  BILLBOARD_PERIOD,
  BILLBOARD_CHECKOUT_URL,
} from '@/lib/homepage-billboard'

export const metadata = {
  title: 'Get Featured on the Homepage | Ramen Near You',
  description:
    'Put your restaurant on the billboard at the top of RamenNearYou.com. $99/month, cancel anytime.',
  alternates: { canonical: 'https://www.ramennearyou.com/featured-listing' },
}

const INCLUDED = [
  'The full-width billboard at the very top of the homepage — above the map and every listing',
  'Your own photo, full bleed, as the background',
  'A "Get Directions" button that opens Google Maps at your door',
  'A second button straight to your site — "Order Now" when you give us an online ordering link, "View Menu & Hours" otherwise',
  'Your slot stays live for as long as your subscription does',
]

export default async function FeaturedListingPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { cancelled } = await searchParams

  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400 text-xs font-medium uppercase tracking-widest">
              Homepage Billboard
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">
            Put Your Restaurant at the Top
          </h1>
          <p className="text-ink-soft leading-relaxed">
            One placement, one price. Your restaurant takes over the billboard
            at the very top of the homepage — the first thing every visitor
            sees before they reach the map.
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

        {/* Real traffic numbers, so the decision isn't made on our say-so. */}
        <Link
          href="/dashboard"
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
            View <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        {cancelled === '1' && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm text-center">
            Checkout was cancelled — nothing was charged. Pick it back up
            whenever you&apos;re ready.
          </div>
        )}

        {/* The one and only paywall on this page. */}
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
            href="mailto:hello@ramennearyou.com?subject=Homepage%20Billboard"
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
