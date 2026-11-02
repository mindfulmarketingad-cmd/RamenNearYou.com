import Link from 'next/link'
import type { Restaurant } from '@/lib/restaurants'
import { getPremiumSlugSet } from '@/lib/paid-listings'
import { getRestaurantsByCity } from '@/lib/restaurants'

// Premium tier perk: a clearly labelled "Featured partner" box on the city's
// blog ramen guide. It sits outside the ranked list on purpose — the ranking
// stays editorial, the paid spot is marked as paid.
export default function PremiumPartnerBox({ citySlug, stateSlug, cityLabel }: { citySlug: string; stateSlug: string; cityLabel: string }) {
  const premium = getPremiumSlugSet()
  if (premium.size === 0) return null
  const partners: Restaurant[] = getRestaurantsByCity(citySlug, stateSlug).filter(r => premium.has(r.slug))
  if (partners.length === 0) return null
  return (
    <aside className="my-8 rounded-2xl border-2 border-amber-400/50 bg-amber-50/60 dark:bg-amber-500/10 p-5 sm:p-6">
      <p className="text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-3">
        Featured partner in {cityLabel} · Sponsored
      </p>
      <ul className="space-y-3">
        {partners.map(r => (
          <li key={r.slug}>
            <Link href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`} className="font-serif text-lg font-bold text-ink hover:text-brand-ink">
              {r.name}
            </Link>
            <p className="text-ink-soft text-sm">
              {[r.address, r.rating ? `${r.rating.toFixed(1)}★ on Google (${(r.reviewCount ?? 0).toLocaleString()} reviews)` : null].filter(Boolean).join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
