// Shared Ramen Pass constants — single source of truth for amounts, caps, ranks.

export const RAMEN_PASS_PRICE = 9.99
export const MONTHLY_CREDIT_CAP = 5.0

export type ContributionType =
  | 'review_with_photo'
  | 'review_only'
  | 'checkin'
  | 'add_restaurant'
  | 'update_info'
  | 'first_review_bonus'
  | 'referral'
  | 'profile_complete'

export const REWARD_AMOUNTS: Record<ContributionType, number> = {
  review_with_photo: 5.0,
  review_only: 2.0,
  checkin: 0.5,
  add_restaurant: 3.0,
  update_info: 1.0,
  first_review_bonus: 2.0,
  referral: 2.0,
  profile_complete: 1.0,
}

export const CONTRIBUTION_LABELS: Record<ContributionType, string> = {
  review_with_photo: 'Review + Photo',
  review_only: 'Review',
  checkin: 'Check-in',
  add_restaurant: 'Added a restaurant',
  update_info: 'Updated listing info',
  first_review_bonus: 'First review bonus',
  referral: 'Referral',
  profile_complete: 'Completed profile',
}

// Contribution types that require admin approval before credit is issued.
export const ADMIN_APPROVED_TYPES: ContributionType[] = ['add_restaurant', 'update_info']

export type RamenRank = 'Noobie' | 'Regular' | 'Connoisseur' | 'Ramen Master'

export interface RankTier {
  rank: RamenRank
  min: number
  emoji: string
  description: string
}

export const RANK_TIERS: RankTier[] = [
  { rank: 'Noobie', min: 0, emoji: '🍜', description: 'Starting rank for all new members' },
  { rank: 'Regular', min: 5, emoji: '🍜🍜', description: 'Getting into the groove' },
  { rank: 'Connoisseur', min: 15, emoji: '🍜🍜🍜', description: 'Trusted voice in the community' },
  { rank: 'Ramen Master', min: 40, emoji: '🍜🍜🍜🍜', description: 'Elite — shown on city leaderboards' },
]

export function getRank(count: number): RamenRank {
  if (count >= 40) return 'Ramen Master'
  if (count >= 15) return 'Connoisseur'
  if (count >= 5) return 'Regular'
  return 'Noobie'
}

// Current billing period as YYYY-MM (UTC).
export function currentBillingPeriod(date = new Date()): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

// Previous billing period as YYYY-MM (UTC).
export function previousBillingPeriod(date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1))
  return currentBillingPeriod(d)
}

// Generate a short, URL-safe, unambiguous referral code (no nanoid dependency).
export function generateReferralCode(length = 8): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ' // no 0/O/1/I
  let out = ''
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length]
  return out
}
