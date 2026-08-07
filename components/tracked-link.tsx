'use client'

import type { AnchorHTMLAttributes } from 'react'
import { trackEvent } from '@/lib/analytics-client'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Analytics event to fire on click, e.g. 'directions_click'. */
  event: string
  listingSlug?: string
  listingName?: string
  city?: string
}

/**
 * A plain <a> that reports a click before navigating.
 *
 * Exists so Server Component pages (the restaurant detail template, the
 * /partners pages) can instrument a single outbound link without the whole
 * page having to become a Client Component.
 */
export default function TrackedLink({
  event,
  listingSlug,
  listingName,
  city,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, { listingSlug, listingName, city })
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
