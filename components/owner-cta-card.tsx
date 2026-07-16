'use client'

import Link from 'next/link'
import { Store, BadgeCheck, Edit3 } from 'lucide-react'
import { useOwnerStatus } from '@/lib/use-owner-status'

interface Props {
  slug: string
  citySlug: string
  stateSlug: string
  restaurantName: string
  isVerified: boolean
}

// Owner-facing card on the review page: "Claim" for unclaimed listings,
// "Verified" once claimed, upgraded to "Manage" when the logged-in visitor
// owns the claim. Owner state resolves client-side (useOwnerStatus) so the
// page itself stays statically cached.
export default function OwnerCtaCard({ slug, citySlug, stateSlug, restaurantName, isVerified }: Props) {
  const { isOwner } = useOwnerStatus(slug)

  if (isOwner) {
    return (
      <Link
        href={`/owner/${slug}`}
        className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 hover:bg-sky-100 transition-colors"
      >
        <span className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center shrink-0">
          <Edit3 className="w-5 h-5 text-sky-600" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-[#1E2026]">Manage Your Listing</span>
          <span className="block text-xs text-[#6B6862]">Update hours, photos, and info</span>
        </span>
      </Link>
    )
  }

  if (isVerified) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-[#F5F4F0] p-4">
        <span className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-5 h-5 text-sky-500" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-[#1E2026]">Verified Listing</span>
          <span className="block text-xs text-[#6B6862]">This business has already been claimed</span>
        </span>
      </div>
    )
  }

  return (
    <Link
      href={`/claim/${citySlug}/${stateSlug}/${slug}`}
      className="flex items-center gap-3 rounded-xl border border-black/8 bg-white p-4 hover:border-[#B57F50]/40 transition-colors"
    >
      <span className="w-10 h-10 rounded-full bg-[#1E2026]/8 flex items-center justify-center shrink-0">
        <Store className="w-5 h-5 text-[#1E2026]" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-[#1E2026]">Own This Business?</span>
        <span className="block text-xs text-[#6B6862]">Claim and manage the {restaurantName} listing</span>
      </span>
    </Link>
  )
}
