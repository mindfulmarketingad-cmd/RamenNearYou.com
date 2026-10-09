// The site is static HTML with no backend, so forms don't post anywhere:
// they compose an email the visitor sends from their own mail app — the same
// handoff pumpkinpatchesnearme.com uses.
export const CONTACT_EMAIL = 'hello@ramennearyou.com'

/** mailto: URL with a subject and a body built from labelled fields. Empty
 *  fields are left out. */
export function buildMailto(subject: string, fields: Array<[label: string, value: unknown]>, intro?: string): string {
  const lines = fields
    .map(([label, value]) => [label, typeof value === 'string' ? value.trim() : value] as const)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `${label}: ${value}`)
  const body = [intro, ...lines].filter(Boolean).join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Opens the visitor's mail app with the composed message. */
export function sendViaMail(subject: string, fields: Array<[label: string, value: unknown]>, intro?: string): void {
  window.location.href = buildMailto(subject, fields, intro)
}

export function claimMailto(name: string, city?: string, stateCode?: string): string {
  const where = [city, stateCode].filter(Boolean).join(', ')
  return buildMailto(
    `Claim listing: ${name}${where ? ` (${where})` : ''}`,
    [['Restaurant', name], ['Location', where], ['Your name', ' '], ['Your role', ' '], ['Best phone', ' ']],
    "I'd like to claim this restaurant's listing on RamenNearYou.",
  )
}
