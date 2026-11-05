'use client'

// Filter paywall for the Ramen Pass. Basic filters (delivery, takeout, price,
// moods…) are free for everyone; the advanced ones in ADVANCED_FILTER_KEYS
// (broth styles, vegan/gluten-free, open now/late, extra spicy) need the Pass.
// The upgrade card itself is rendered once, site-wide, by <PassGateHost/>
// in the root layout, so FilterGateModals is a no-op kept for the call sites.
// Opening the filter panel is always free — people should see what's there.

import { canUseFilter } from '@/lib/ramen-pass'

export type FilterGateState = null

export function useFilterGate() {
  return {
    unlocked: true,
    resolved: true,
    gate: null as FilterGateState,
    setGate: (_: FilterGateState) => {},
    requireAccess: (key?: string) => (key ? canUseFilter(key) : true),
  }
}

export function FilterGateModals(_props: { gate: FilterGateState; onClose: () => void; redirectTo?: string }) {
  return null
}
