const VISITS_KEY = 'ramennearyou:visits'
const TOKEN_KEY = 'ramennearyou:visitor-token'

export function getVisitedSlugs(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(VISITS_KEY) ?? '[]') } catch { return [] }
}

export function getVisitorToken(): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    try { localStorage.setItem(TOKEN_KEY, token) } catch {}
  }
  return token
}

export async function toggleVisited(slug: string): Promise<boolean> {
  const visits = getVisitedSlugs()
  const isVisited = visits.includes(slug)
  const next = isVisited ? visits.filter(s => s !== slug) : [...visits, slug]
  try { localStorage.setItem(VISITS_KEY, JSON.stringify(next)) } catch {}

  if (!isVisited) {
    try {
      await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, token: getVisitorToken() }),
      })
    } catch {}
  }

  return !isVisited
}
