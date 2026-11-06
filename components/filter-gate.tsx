'use client'

// Filters are open to everyone. requireAccess stays so existing call sites
// don't change; it no longer blocks anything.

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
