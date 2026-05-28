import type { Restaurant } from './restaurants'

function hasLateNightHours(hours: Restaurant['hours']): boolean {
  if (!hours) return false
  for (const ranges of Object.values(hours)) {
    if (!ranges) continue
    for (const range of ranges) {
      const m = range.match(/(\d{1,2})(?::\d{2})?\s*(am|pm|AM|PM)?\s*[–-]\s*(\d{1,2})(?::\d{2})?\s*(am|pm|AM|PM)?/)
      if (!m) continue
      const closeHour = parseInt(m[3], 10)
      const closeMer = (m[4] || '').toLowerCase()
      const close24 = closeMer === 'am' && closeHour < 6 ? closeHour + 24
                    : closeMer === 'pm' && closeHour !== 12 ? closeHour + 12
                    : closeHour
      if (close24 >= 22) return true
    }
  }
  return false
}

function hasLunchHours(hours: Restaurant['hours']): boolean {
  if (!hours) return false
  for (const ranges of Object.values(hours)) {
    if (!ranges) continue
    for (const range of ranges) {
      const m = range.match(/(\d{1,2})(?::\d{2})?\s*(am|pm|AM|PM)?/)
      if (!m) continue
      const openHour = parseInt(m[1], 10)
      const openMer = (m[2] || '').toLowerCase()
      const open24 = openMer === 'pm' && openHour !== 12 ? openHour + 12 : openHour
      if (open24 <= 12) return true
    }
  }
  return false
}

export function getPerfectFor(r: Restaurant): string[] {
  const subtypes = (r.subtypes || '').toLowerCase()
  const a = r.amenities

  const candidates: { tag: string; weight: number }[] = []

  if (a?.acceptsReservations || a?.trendy) candidates.push({ tag: 'Date Night', weight: 9 })
  if (a?.familyFriendly) candidates.push({ tag: 'Family Dinners', weight: 8 })
  if (a?.casual && a?.dineIn) candidates.push({ tag: 'Casual Dinner', weight: 7 })
  if (hasLunchHours(r.hours)) candidates.push({ tag: 'Lunch', weight: 6 })
  if (hasLateNightHours(r.hours)) candidates.push({ tag: 'Late Night', weight: 8 })
  if (a?.takeout) candidates.push({ tag: 'Takeout', weight: 5 })
  if (a?.delivery) candidates.push({ tag: 'Delivery', weight: 4 })
  if (a?.outdoorSeating) candidates.push({ tag: 'Outdoor Seating', weight: 5 })
  if (a?.alcohol) candidates.push({ tag: 'Drinks & Ramen', weight: 6 })
  if (a?.veganOptions) candidates.push({ tag: 'Vegan Options', weight: 7 })
  if (a?.vegetarianOptions && !a?.veganOptions) candidates.push({ tag: 'Vegetarian Options', weight: 6 })
  if (a?.cozy) candidates.push({ tag: 'Cozy Solo Bowl', weight: 5 })
  if (subtypes.includes('tsukemen')) candidates.push({ tag: 'Tsukemen Lovers', weight: 9 })
  if (subtypes.includes('izakaya')) candidates.push({ tag: 'After-Work Drinks', weight: 8 })
  if (subtypes.includes('ramen bar') || subtypes.includes('ramen restaurant')) candidates.push({ tag: 'Ramen Fans', weight: 4 })

  const seen = new Set<string>()
  const ranked = candidates
    .sort((x, y) => y.weight - x.weight)
    .filter(c => { if (seen.has(c.tag)) return false; seen.add(c.tag); return true })
    .slice(0, 3)
    .map(c => c.tag)

  while (ranked.length < 3) {
    const fallback = ['Casual Dinner', 'Lunch', 'Ramen Fans'].find(f => !ranked.includes(f))
    if (!fallback) break
    ranked.push(fallback)
  }
  return ranked
}

export function slugifyAuthor(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
