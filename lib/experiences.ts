import snapshot from './viator-experiences.json'
import { STATE_CODE_TO_NAME, STATE_CODE_TO_SLUG } from './state-lookups'
import { pickStockPhoto } from './stock-photos'

// Viator experiences, grouped by US state.
//
// Everything here is read from lib/viator-experiences.json — a snapshot written
// by `npm run sync:viator` (and by the nightly GitHub Action, which is where
// the VIATOR_API_KEY secret lives). Nothing in the request path talks to
// Viator, so the pages are fully static and don't need the key on Vercel.
//
// Re-run the sync when you want fresh prices: `fromPrice` and the review
// counts are claims shown to buyers, and they move.

export interface Experience {
  /** URL segment under /experiences/{state}/ — includes the Viator product code. */
  slug: string
  productCode: string
  title: string
  description: string
  /** Two-letter state code, e.g. "CA". */
  stateCode: string
  /** Viator destination name for this product, e.g. "Los Angeles". */
  cityName: string | null
  priceFrom: number | null
  currency: string
  rating: number | null
  reviewCount: number
  durationMinutes: number | null
  /** Cover photo from Viator, already size-selected. */
  image: string | null
  /** Extra photos for the detail page. */
  gallery: string[]
  /** Viator product URL with our affiliate params already applied. */
  affiliateUrl: string
  flags: string[]
}

interface Snapshot {
  /** ISO timestamp of the last successful sync. */
  syncedAt: string | null
  /** Search term the snapshot was built from. */
  query: string
  experiences: Experience[]
}

const data = snapshot as Snapshot

export const experiences: Experience[] = data.experiences ?? []
export const syncedAt: string | null = data.syncedAt ?? null

export interface StateGroup {
  stateCode: string
  stateName: string
  stateSlug: string
  count: number
  /** Best-rated experience in the state — used for the hub card's thumbnail. */
  cover: Experience | null
}

/** Highest rated first, then most-reviewed, then title — a total order, so
 *  page ordering is stable between builds. */
function rank(a: Experience, b: Experience): number {
  return (
    (b.rating ?? 0) - (a.rating ?? 0) ||
    (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
    a.title.localeCompare(b.title)
  )
}

const byState = new Map<string, Experience[]>()
for (const e of experiences) {
  const list = byState.get(e.stateCode)
  if (list) list.push(e)
  else byState.set(e.stateCode, [e])
}
for (const list of byState.values()) list.sort(rank)

/** Only states that actually have experiences — no empty pages. */
export const stateGroups: StateGroup[] = [...byState.entries()]
  .filter(([code]) => STATE_CODE_TO_NAME[code] && STATE_CODE_TO_SLUG[code])
  .map(([code, list]) => ({
    stateCode: code,
    stateName: STATE_CODE_TO_NAME[code],
    stateSlug: STATE_CODE_TO_SLUG[code],
    count: list.length,
    cover: list[0] ?? null,
  }))
  .sort((a, b) => b.count - a.count || a.stateName.localeCompare(b.stateName))

const groupBySlug = new Map(stateGroups.map((g) => [g.stateSlug, g]))

export function getStateGroup(stateSlug: string): StateGroup | undefined {
  return groupBySlug.get(stateSlug)
}

export function getStateExperiences(stateSlug: string): Experience[] {
  const g = groupBySlug.get(stateSlug)
  return g ? (byState.get(g.stateCode) ?? []) : []
}

export function getExperience(stateSlug: string, slug: string): Experience | undefined {
  return getStateExperiences(stateSlug).find((e) => e.slug === slug)
}

/** Every (state, experience) pair, for generateStaticParams. */
export function allExperienceParams(): { state: string; experience: string }[] {
  return stateGroups.flatMap((g) =>
    getStateExperiences(g.stateSlug).map((e) => ({ state: g.stateSlug, experience: e.slug }))
  )
}

export const totalExperiences = experiences.length

/** Listing photo when Viator gave us one, otherwise a stable stock shot. */
export function experienceImage(e: Experience): string {
  return e.image ?? pickStockPhoto(e.slug)
}

export function formatPrice(e: Experience): string | null {
  if (e.priceFrom == null) return null
  const currency = e.currency || 'USD'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(e.priceFrom)
  } catch {
    return `${currency} ${e.priceFrom.toFixed(2)}`
  }
}

export function formatDuration(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} hour${h === 1 ? '' : 's'}` : `${h}h ${m}m`
}
