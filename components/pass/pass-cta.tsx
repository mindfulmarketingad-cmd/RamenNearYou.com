import Link from 'next/link'
import { Crown } from 'lucide-react'
import { PASS_PRICES, PASS_TRIAL_DAYS } from '@/lib/ramen-pass-config'

// End-of-post Ramen Pass card (blog template). Static, no JS, no pop-up.
export default function PassCta({ className = '' }: { className?: string }) {
  return (
    <aside className={`rounded-2xl border border-brand/25 bg-brand/5 p-6 ${className}`}>
      <p className="flex items-center gap-2 text-brand-ink text-xs font-bold uppercase tracking-widest"><Crown className="w-4 h-4" /> Ramen Pass</p>
      <p className="font-serif text-xl font-bold text-ink mt-2">Keep a list of every bowl you want to try</p>
      <p className="text-sm text-ink-mid mt-1">
        A free account saves spots and stamps your ramen passport. The Pass adds broth, vegan and open-late filters,
        trip lists, member deals and no ads — {PASS_PRICES.monthly.label}/mo or {PASS_PRICES.yearly.label}/yr, {PASS_TRIAL_DAYS} days free.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/account" className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hi">Create a free account</Link>
        <Link href="/ramen-pass" className="px-5 py-2.5 rounded-xl border border-line/15 text-ink font-semibold text-sm hover:bg-sunken">See what’s in the Pass</Link>
      </div>
    </aside>
  )
}
