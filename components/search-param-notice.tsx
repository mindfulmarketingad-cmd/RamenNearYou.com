'use client'

import { useSearchParams } from 'next/navigation'

// Renders a line only when a query param is present. Reading the param on the
// client is what lets the page around it be generated once at build time:
// reading searchParams on the server would make every request a fresh render.
//
// Must sit inside a <Suspense> boundary — useSearchParams opts the nearest
// boundary out of static rendering, and without one that would be the page.

export function CheckoutCancelledNotice() {
  const params = useSearchParams()
  if (params.get('cancelled') !== '1') return null
  return (
    <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm text-center">
      Checkout was cancelled — nothing was charged. Pick it back up
      whenever you&apos;re ready.
    </div>
  )
}

export function ListingIdNotice() {
  const params = useSearchParams()
  const id = params.get('listing_id')
  if (!id) return null
  return <p className="text-ink/30 text-xs mb-8">Listing ID: {id}</p>
}
