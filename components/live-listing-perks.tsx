'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { displayTier, loadPlacements, placementBySlug } from '@/lib/live-placements'

// Badges and the ad-free listing page follow the live subscription, so a
// customer does not wait on a rebuild. Baked-in flags still show if the
// feed is unreachable.
export default function LiveListingPerks({
  slug,
  bakedVerified,
  bakedFeatured,
}: {
  slug: string
  bakedVerified: boolean
  bakedFeatured: boolean
}) {
  const [verified, setVerified] = useState(bakedVerified)
  const [featured, setFeatured] = useState(bakedFeatured)

  useEffect(() => {
    let cancelled = false
    loadPlacements()
      .then(feed => {
        if (cancelled) return
        const row = placementBySlug(feed).get(slug)
        const lapsed = feed.lapsed.has(slug)
        const claim = lapsed ? false : (bakedVerified || !!row?.claim)
        const tier = displayTier(slug, lapsed ? null : row?.tier)
        setVerified(claim)
        setFeatured(!!tier || (bakedFeatured && !lapsed))
        if (claim) {
          document.documentElement.classList.add('rny-listing-adfree')
          document.getElementById('unclaimed-listing')?.remove()
          document.getElementById('page-list-view')?.removeAttribute('id')
        } else if (!bakedVerified) {
          document.documentElement.classList.remove('rny-listing-adfree')
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
      document.documentElement.classList.remove('rny-listing-adfree')
    }
  }, [slug, bakedVerified, bakedFeatured])

  if (!verified && !featured) return null
  return (
    <>
      {verified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold shrink-0">
          <BadgeCheck className="w-3.5 h-3.5" /> Verified
        </span>
      )}
      {featured && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-semibold shrink-0">
          👑 Featured
        </span>
      )}
    </>
  )
}
