import type { Experience } from './experiences'
import { formatDuration } from './experiences'

// Viator descriptions arrive as one string that sometimes carries its own
// structure: a prose overview, then supplier-written highlight lines prefixed
// with "-", "•", "*" or "1.". 171 of the 1,226 synced products use it. This
// turns that string into blocks so the page can render it the way Viator does
// — an Overview paragraph followed by a bulleted list — instead of dumping a
// wall of text with stray hyphens in it.

export type DescriptionBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

const BULLET = /^\s*(?:[-•·*▪–—]|\d+[.)])\s+(.*)$/

/**
 * Parses in document order, so a product that puts prose after its bullets
 * still reads correctly rather than having the tail silently hoisted above
 * the list.
 */
export function parseDescription(raw: string | null | undefined): DescriptionBlock[] {
  if (!raw?.trim()) return []

  const blocks: DescriptionBlock[] = []
  let para: string[] = []
  let items: string[] = []

  const flushPara = () => {
    const text = para.join(' ').replace(/\s+/g, ' ').trim()
    if (text) blocks.push({ type: 'p', text })
    para = []
  }
  const flushList = () => {
    if (items.length) blocks.push({ type: 'ul', items })
    items = []
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed) {
      // Blank line ends a paragraph but not a list — suppliers routinely put
      // a blank line between bullets.
      flushPara()
      continue
    }

    const m = trimmed.match(BULLET)
    if (m) {
      flushPara()
      const text = m[1].trim()
      if (text) items.push(text)
      continue
    }

    flushList()
    para.push(trimmed)
  }

  flushPara()
  flushList()
  return blocks
}

/**
 * Factual bullets built only from fields Viator gave us — duration, booking
 * flags, price, location. Used for the ~86% of products whose description has
 * no highlight lines of its own.
 *
 * Deliberately not invented marketing copy: writing "Explore the historic
 * district!" for someone else's tour would be putting claims about their
 * product in their mouth. Everything here restates data we actually hold.
 */
export function factBullets(e: Experience): string[] {
  const out: string[] = []

  const duration = formatDuration(e.durationMinutes)
  if (duration) out.push(`Runs about ${duration}`)

  if (e.cityName) out.push(`Departs from ${e.cityName}`)

  if (e.flags.includes('FREE_CANCELLATION')) {
    out.push('Free cancellation available — check the date on Viator')
  }
  if (e.flags.includes('SKIP_THE_LINE')) out.push('Skip-the-line entry')
  if (e.flags.includes('PRIVATE_TOUR')) out.push('Private tour — your group only')
  if (e.flags.includes('LIKELY_TO_SELL_OUT')) out.push('Popular — often sells out')
  if (e.flags.includes('SPECIAL_OFFER')) out.push('Currently discounted on Viator')

  if (e.rating != null && e.reviewCount > 0) {
    out.push(`Rated ${e.rating.toFixed(1)} out of 5 from ${e.reviewCount.toLocaleString()} reviews`)
  }

  return out
}
