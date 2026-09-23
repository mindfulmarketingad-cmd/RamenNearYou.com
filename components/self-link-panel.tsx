'use client'

import { useOwnerStatus } from '@/lib/use-owner-status'
import ConnectAccountPanel from '@/components/connect-account-panel'

// Shows the "connect this claim to your account" panel when the logged-in
// visitor's email matches the approved claim but their account isn't linked
// yet. Client-side so the listing page itself stays statically cached.
export default function SelfLinkPanel({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const { canSelfLink } = useOwnerStatus(slug)
  if (!canSelfLink) return null
  return (
    <div className="mt-5">
      <ConnectAccountPanel slug={slug} restaurantName={restaurantName} />
    </div>
  )
}
