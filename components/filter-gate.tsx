'use client'

import { useCallback, useState } from 'react'
import SigninGateModal from '@/components/signin-gate-modal'
import SubscribeGateModal from '@/components/subscribe-gate-modal'
import { useGate } from '@/lib/use-gate'

// One gate for every filter surface — the map's filter panel and the
// homepage feed's filter chips.
//
// Filters are the paid feature (RamenNearYou+, $2.99/mo). Sorting is not:
// it's free everywhere, so a visitor can reorder the feed and see it work
// before meeting the wall.
//
// `unlocked` starts true while auth is still resolving, so a subscriber never
// sees their own filters flash as locked on a slow connection. `requireAccess`
// re-checks at click time, which is the moment that actually matters.

export type FilterGateState = null | 'signin' | 'subscribe'

export function useFilterGate() {
  const { evaluatePremium, signedIn, subscribed } = useGate()
  const [gate, setGate] = useState<FilterGateState>(null)

  // Only report "locked" once we actually know the answer.
  const resolved = signedIn !== null && subscribed !== null
  const unlocked = !resolved || evaluatePremium() === 'ok'

  /** Returns true when the caller may proceed; otherwise opens the right modal. */
  const requireAccess = useCallback((): boolean => {
    const result = evaluatePremium()
    if (result === 'ok') return true
    setGate(result)
    return false
  }, [evaluatePremium])

  return { unlocked, resolved, gate, setGate, requireAccess }
}

export function FilterGateModals({
  gate,
  onClose,
  redirectTo = '/',
}: {
  gate: FilterGateState
  onClose: () => void
  redirectTo?: string
}) {
  if (gate === 'signin') {
    return (
      <SigninGateModal
        onClose={onClose}
        redirectTo={redirectTo}
        body={
          <>
            Filtering by bowl, mood, hours and amenities is a member feature.
            Create a <strong>free account</strong> to continue — the filter
            add-on is $2.99/month after that.
          </>
        }
      />
    )
  }
  if (gate === 'subscribe') return <SubscribeGateModal onClose={onClose} />
  return null
}
