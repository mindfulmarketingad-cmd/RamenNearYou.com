// Client-safe metered usage counter. Tracks how many times a signed-in,
// non-subscribed user has used a members-only feature in the current month.
// Resets automatically each calendar month. Stored in localStorage.
const KEY = 'rny-usage-v1'

export const FREE_MONTHLY_LIMIT = 3

function monthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getUsageCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || '{}')
    return raw.month === monthKey() ? Number(raw.count) || 0 : 0
  } catch {
    return 0
  }
}

export function incrementUsage(): number {
  if (typeof window === 'undefined') return 0
  const next = getUsageCount() + 1
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ month: monthKey(), count: next }))
  } catch {
    /* ignore quota / privacy-mode errors */
  }
  return next
}

export function hasFreeUsesLeft(): boolean {
  return getUsageCount() < FREE_MONTHLY_LIMIT
}

export function freeUsesRemaining(): number {
  return Math.max(0, FREE_MONTHLY_LIMIT - getUsageCount())
}
