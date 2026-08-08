'use client'

import { useEffect, useState, type ReactNode } from 'react'

// Device-targeted ad container. Splits the job in two, because CSS and JS each
// solve half of it:
//
//  - The wrapper is hidden/shown with plain responsive classes, so the space an
//    ad will occupy is reserved from the very first paint. Reserving it in JS
//    instead would shift the page every time a unit resolved, and layout shift
//    costs both Core Web Vitals and the viewability AdSense prices against.
//
//  - The ad itself is mounted only once matchMedia confirms the viewport. This
//    is the part a `hidden lg:block` class cannot do: a hidden wrapper still
//    mounts its children, so an `<ins class="adsbygoogle">` inside one still
//    calls adsbygoogle.push({}), and AdSense measures the collapsed container,
//    gets availableWidth=0, and burns the slot without ever filling it. A
//    desktop-only rail written that way costs mobile visitors dead slots.
//
// Breakpoint matches Tailwind's `lg` so these line up with the layout's own
// mobile/desktop split.
const CONFIG = {
  mobile: { query: '(max-width: 1023px)', hide: 'lg:hidden' },
  desktop: { query: '(min-width: 1024px)', hide: 'hidden lg:block' },
} as const

export default function AdSlot({
  only,
  className = '',
  minHeight,
  children,
}: {
  only: keyof typeof CONFIG
  className?: string
  /** Reserve the unit's expected height so it never shifts content when filled. */
  minHeight?: number
  children: ReactNode
}) {
  // Starts false so server and first client render agree; the ad mounts on the
  // effect pass once the real viewport is known.
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(CONFIG[only].query)
    setMatches(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [only])

  return (
    <div
      className={`${CONFIG[only].hide} ${className}`.trim()}
      style={minHeight ? { minHeight } : undefined}
    >
      {matches ? children : null}
    </div>
  )
}
