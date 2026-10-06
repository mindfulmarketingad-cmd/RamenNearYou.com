import { Store, BadgeCheck } from 'lucide-react'
import { claimMailto } from '@/lib/mailto'

interface Props {
  slug: string
  citySlug: string
  stateSlug: string
  restaurantName: string
  isVerified: boolean
}

// Owner-facing card on the review page: "Claim" for unclaimed listings (an
// email to us — the site is static, with no accounts), "Verified" once
// claimed.
export default function OwnerCtaCard({ restaurantName, isVerified }: Props) {

  if (isVerified) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line/8 bg-sunken p-4">
        <span className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-5 h-5 text-sky-500" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-ink">Verified Listing</span>
          <span className="block text-xs text-ink-soft">This business has already been claimed</span>
        </span>
      </div>
    )
  }

  return (
    <a
      href={claimMailto(restaurantName)}
      className="flex items-center gap-3 rounded-xl border border-line/8 bg-surface p-4 hover:border-brand/40 transition-colors"
    >
      <span className="w-10 h-10 rounded-full bg-contrast/8 flex items-center justify-center shrink-0">
        <Store className="w-5 h-5 text-ink" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">Own This Business?</span>
        <span className="block text-xs text-ink-soft">Claim and manage the {restaurantName} listing</span>
      </span>
    </a>
  )
}
