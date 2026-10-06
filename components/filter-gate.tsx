'use client'

// Filters used to be the paid RamenNearYou+ feature, gated behind sign-in and
// a subscription. The site is static now (no accounts), so every filter is
// open to everyone. The hook keeps its old shape so the map and the homepage
// feed didn't need restructuring.

export type FilterGateState = null

export function useFilterGate() {
  return {
    unlocked: true,
    resolved: true,
    gate: null as FilterGateState,
    setGate: (_: FilterGateState) => {},
    requireAccess: () => true,
  }
}

export function FilterGateModals(_props: { gate: FilterGateState; onClose: () => void; redirectTo?: string }) {
  return null
}
