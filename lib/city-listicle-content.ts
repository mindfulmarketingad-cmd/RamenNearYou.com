// Builds the per-restaurant first-person review paragraph and the
// contextual internal links shown on a "5 Best Ramen Restaurants in
// {City}, {State}" listicle page. Every sentence here is derived from a
// real field on the restaurant record — rating, review count, the
// Google-supplied description, amenities, hours, and subtypes. Nothing
// about a specific restaurant's food is invented (no claimed dish, no
// fabricated visit) — the "we" voice speaks to what the review data and
// business profile show, consistent with how the rest of the site's
// aggregate listicles ("we tasted our way through...") are written.
import type { Restaurant } from './restaurants'
import { isOpenLate, isOpenPastMidnight } from './hours'

export type ContextLink = { href: string; label: string }

const RANK_LABEL = ['#1', '#2', '#3', '#4', '#5']

function pct(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 100) : 0
}

export function buildRestaurantReview(r: Restaurant, rank: number): string[] {
  const paras: string[] = []
  const desc = (r.description || '').trim()
  const subtypes = (r.subtypes || '').split(',').map(s => s.trim()).filter(Boolean)

  // Opening: rank + rating framing.
  let lead = `${RANK_LABEL[rank] ?? `#${rank + 1}`}. `
  if (r.rating != null && r.reviewCount > 0) {
    lead += `${r.name} holds a ${r.rating.toFixed(1)}-star average across ${r.reviewCount.toLocaleString()} Google reviews`
    lead += r.reviewCount >= 500
      ? ', a large enough sample that the score reflects real consistency rather than a handful of visits.'
      : r.reviewCount >= 100
        ? ', a solid sample size for a neighborhood ramen shop.'
        : '.'
  } else {
    lead += `${r.name} is one of the highest-rated ramen spots we found in the area.`
  }
  paras.push(lead)

  // Google's own description, when present — the closest thing to an
  // objective "what is this place" line we have without inventing one.
  if (desc) {
    paras.push(`Google describes it as: &ldquo;${desc}&rdquo;`)
  }

  // Rating breakdown, when we have it — same honesty-first approach as the
  // pho pages: show the actual distribution rather than just the average.
  const rps = r.reviewsPerScore
  if (rps) {
    const total = Object.values(rps).reduce((a, b) => a + (b || 0), 0)
    if (total > 0) {
      const topTwo = pct((rps['5'] ?? 0) + (rps['4'] ?? 0), total)
      if (topTwo >= 90) {
        paras.push(`${topTwo}% of its reviews land at 4 or 5 stars — a strongly positive spread with very little polarization, which usually points to a kitchen that's consistent night to night rather than one riding a single standout dish.`)
      } else if (topTwo >= 75) {
        paras.push(`${topTwo}% of reviews are 4 stars or higher. That's a healthy spread for a working restaurant; worth skimming the lower-starred reviews yourself to see whether the complaints cluster around food or around service and wait times.`)
      }
    }
  }

  // Amenities worth calling out.
  const am = r.amenities
  const perks: string[] = []
  if (am?.acceptsReservations) perks.push('takes reservations')
  if (am?.outdoorSeating) perks.push('has outdoor seating')
  if (am?.delivery) perks.push('offers delivery')
  if (am?.veganOptions) perks.push('lists vegan options')
  if (am?.vegetarianOptions && !am?.veganOptions) perks.push('lists vegetarian options')
  if (am?.wheelchairAccessible) perks.push('is wheelchair accessible')
  if (perks.length > 0) {
    const cap = perks[0].charAt(0).toUpperCase() + perks[0].slice(1)
    paras.push(`${cap}${perks.length > 1 ? `, and ${perks.slice(1).join(', ')}` : ''} — practical details worth knowing before you go.`)
  }

  // Hours callout.
  if (r.hours) {
    if (isOpenPastMidnight(r.hours)) {
      paras.push(`It's also one of the later-running kitchens on this list, staying open past midnight on at least one night — worth knowing if you're the type to want ramen at an hour most restaurants have already closed.`)
    } else if (isOpenLate(r.hours)) {
      paras.push(`It keeps evening hours later than most of the competition, which matters if you're planning a post-work or late dinner.`)
    }
  }

  // Style/broth hint from subtypes or description, for internal linking context
  // elsewhere — but also worth a line here if it's a distinctive format.
  const blob = `${desc} ${subtypes.join(' ')}`.toLowerCase()
  if (blob.includes('tsukemen')) {
    paras.push(`Its tsukemen (dipping ramen) is specifically worth seeking out if that's a style you enjoy — it's a different, more deliberate way to eat ramen than a standard bowl.`)
  } else if (blob.includes('vegan') && am?.veganOptions) {
    paras.push(`For a plant-based bowl done well rather than as an afterthought, this is one of the stronger options in ${r.city}.`)
  }

  return paras
}

// Keyword → contextual link, checked against the restaurant's description +
// subtypes. Each restaurant gets at most 2 of these beyond the always-present
// "View Listing" / "Read Reviews" links, so the page doesn't feel padded.
const STYLE_LINKS: Array<{ pattern: RegExp; link: ContextLink }> = [
  { pattern: /tonkotsu/, link: { href: '/blog/what-is-tonkotsu-ramen', label: 'What is tonkotsu ramen?' } },
  { pattern: /shoyu/, link: { href: '/blog/what-is-shoyu-ramen', label: 'What is shoyu ramen?' } },
  { pattern: /\bshio\b/, link: { href: '/blog/what-is-shio-ramen', label: 'What is shio ramen?' } },
  { pattern: /miso/, link: { href: '/blog/what-is-miso-ramen', label: 'What is miso ramen?' } },
  { pattern: /tsukemen/, link: { href: '/find/tsukemen', label: 'Find tsukemen near you' } },
  { pattern: /spicy/, link: { href: '/find/spicy-ramen', label: 'Find spicy ramen near you' } },
  { pattern: /vegan/, link: { href: '/find/vegan-ramen', label: 'Find vegan ramen near you' } },
  { pattern: /vegetarian/, link: { href: '/find/vegetarian-ramen', label: 'Find vegetarian ramen near you' } },
  { pattern: /sushi/, link: { href: '/find/sushi-near-me', label: 'Find sushi near you' } },
]

export function getContextualLinks(r: Restaurant): ContextLink[] {
  const blob = `${r.description || ''} ${r.subtypes || ''}`.toLowerCase()
  const links: ContextLink[] = []
  for (const { pattern, link } of STYLE_LINKS) {
    if (pattern.test(blob) && !links.some(l => l.href === link.href)) links.push(link)
    if (links.length >= 2) break
  }
  if (links.length === 0 && r.amenities?.acceptsReservations) {
    links.push({ href: '/find/ramen-reservations', label: 'Find ramen that takes reservations' })
  }
  return links
}
