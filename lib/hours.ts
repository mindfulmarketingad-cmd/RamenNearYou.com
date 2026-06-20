const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function toMinutes(timeStr: string): number {
  const upper = timeStr.trim().toUpperCase()
  const isPM = upper.endsWith('PM')
  const isAM = upper.endsWith('AM')
  const clean = upper.replace('AM', '').replace('PM', '')
  const [hStr, mStr] = clean.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr ? parseInt(mStr, 10) : 0
  if (isPM && h !== 12) h += 12
  if (isAM && h === 12) h = 0
  return h * 60 + m
}

function parseSlot(slot: string): { start: number; end: number } | null {
  const s = slot.trim()
  if (s === 'Closed') return null
  if (s === 'Open 24 hours') return { start: 0, end: 1440 }
  const idx = s.indexOf('-')
  if (idx === -1) return null
  const startRaw = s.slice(0, idx)
  const endRaw = s.slice(idx + 1)
  const end = toMinutes(endRaw)
  const hasPeriod = /AM|PM/i.test(startRaw)
  let start: number
  if (hasPeriod) {
    start = toMinutes(startRaw)
  } else {
    const endPeriod = /PM$/i.test(endRaw) ? 'PM' : 'AM'
    start = toMinutes(startRaw + endPeriod)
  }
  return { start, end }
}

export function isOpenNow(hours: Record<string, string[]> | null): boolean | null {
  if (!hours || Object.keys(hours).length === 0) return null
  const now = new Date()
  const dayName = DAYS[now.getDay()]
  const slots = hours[dayName]
  if (!slots || slots.length === 0) return null
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  for (const slot of slots) {
    if (slot === 'Closed') return false
    const parsed = parseSlot(slot)
    if (!parsed) continue
    if (parsed.start === 0 && parsed.end === 1440) return true
    if (currentMinutes >= parsed.start && currentMinutes < parsed.end) return true
  }
  return false
}

/** Latest closing time today in minutes from midnight (overnight slots > 1440). */
export function latestCloseToday(hours: Record<string, string[]> | null): number | null {
  if (!hours || Object.keys(hours).length === 0) return null
  const slots = hours[DAYS[new Date().getDay()]]
  if (!slots || slots.length === 0) return null
  let latest: number | null = null
  for (const slot of slots) {
    if (slot === 'Closed') continue
    const p = parseSlot(slot)
    if (!p) continue
    let end = p.end
    if (p.start === 0 && p.end === 1440) end = 2880 // "Open 24 hours" → very late
    else if (end <= p.start) end += 1440 // closes after midnight
    if (latest === null || end > latest) latest = end
  }
  return latest
}

/** Open until `minClose` (default 9 PM) or later today. */
export function isOpenLate(hours: Record<string, string[]> | null, minClose = 21 * 60): boolean {
  const c = latestCloseToday(hours)
  return c != null && c >= minClose
}

/** Open past midnight today. */
export function isOpenPastMidnight(hours: Record<string, string[]> | null): boolean {
  const c = latestCloseToday(hours)
  return c != null && c > 1440
}

function minutesToLabel(minutes: number): string {
  if (minutes >= 1440) minutes = minutes % 1440
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h < 12 ? 'AM' : 'PM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${displayH} ${period}` : `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

/** Returns the closing time of the currently-active slot, or null if not open. */
export function getClosingTime(hours: Record<string, string[]>): string | null {
  if (!hours || Object.keys(hours).length === 0) return null
  const now = new Date()
  const dayName = DAYS[now.getDay()]
  const slots = hours[dayName]
  if (!slots || slots.length === 0) return null
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  for (const slot of slots) {
    if (slot === 'Closed') return null
    const parsed = parseSlot(slot)
    if (!parsed) continue
    if (parsed.start === 0 && parsed.end === 1440) return 'midnight'
    if (currentMinutes >= parsed.start && currentMinutes < parsed.end) {
      return minutesToLabel(parsed.end)
    }
  }
  return null
}

function formatSlotLabel(slot: string): string {
  const s = slot.trim()
  if (s === 'Closed' || s === 'Open 24 hours') return s
  return s.replace('-', '–')
}

export function getTodayHoursLabel(hours: Record<string, string[]>): string {
  if (!hours || Object.keys(hours).length === 0) return 'Hours unavailable'
  const now = new Date()
  const dayName = DAYS[now.getDay()]
  const slots = hours[dayName]
  if (!slots || slots.length === 0) return 'Hours unavailable'
  if (slots.length === 1 && slots[0] === 'Closed') return 'Closed today'
  return slots.map(formatSlotLabel).join(', ')
}
