const SAVES_KEY = 'ramennearyou:saves'

export function getSavedSlugs(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(SAVES_KEY) ?? '[]') } catch { return [] }
}

export function toggleSaved(slug: string): boolean {
  const saves = getSavedSlugs()
  const isSaved = saves.includes(slug)
  const next = isSaved ? saves.filter(s => s !== slug) : [...saves, slug]
  try { localStorage.setItem(SAVES_KEY, JSON.stringify(next)) } catch {}
  return !isSaved
}
