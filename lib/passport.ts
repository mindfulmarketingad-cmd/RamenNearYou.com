// Client-safe Ramen Passport — visited tracking + badges via localStorage.
const PASSPORT_KEY = 'ramen-passport-v1'

export function loadPassport(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(PASSPORT_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function savePassport(visited: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PASSPORT_KEY, JSON.stringify([...visited]))
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export type Badge = { key: string; label: string; emoji: string; threshold: number }
export const BADGES: Badge[] = [
  { key: 'first-slurp', label: 'First Slurp', emoji: '🥢', threshold: 1 },
  { key: 'regular', label: 'Regular', emoji: '🍜', threshold: 5 },
  { key: 'connoisseur', label: 'Connoisseur', emoji: '⭐', threshold: 15 },
  { key: 'ramen-master', label: 'Ramen Master', emoji: '👑', threshold: 40 },
]

export function earnedBadges(count: number): Badge[] {
  return BADGES.filter(b => count >= b.threshold)
}

export function nextBadge(count: number): Badge | null {
  return BADGES.find(b => count < b.threshold) ?? null
}
