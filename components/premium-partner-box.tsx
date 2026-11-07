import type { Restaurant } from '@/lib/restaurants'
import { getPremiumSlugSet } from '@/lib/paid-listings'
import { getRestaurantsByCity } from '@/lib/restaurants'
import PremiumPartnerLive from '@/components/premium-partner-live'

// Premium tier perk: a clearly labelled "Featured partner" box on the city's
// blog ramen guide. It sits outside the ranked list on purpose — the ranking
// stays editorial, the paid spot is marked as paid.
export default function PremiumPartnerBox({ citySlug, stateSlug, cityLabel }: { citySlug: string; stateSlug: string; cityLabel: string }) {
  const premium = getPremiumSlugSet()
  const initial = getRestaurantsByCity(citySlug, stateSlug)
    .filter(r => premium.has(r.slug))
    .map(partnerFromRestaurant)
  return <PremiumPartnerLive citySlug={citySlug} stateSlug={stateSlug} cityLabel={cityLabel} initial={initial} />
}

function partnerFromRestaurant(r: Restaurant) {
  return {
    slug: r.slug,
    name: r.name,
    href: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    detail: [r.address, r.rating ? `${r.rating.toFixed(1)}★ on Google (${(r.reviewCount ?? 0).toLocaleString()} reviews)` : null].filter(Boolean).join(' · '),
  }
}
