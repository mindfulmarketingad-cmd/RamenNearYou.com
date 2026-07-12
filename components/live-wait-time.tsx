'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface Props {
  hours: Record<string, string[]> | null
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function parseSlot(slot: string): [number, number] | null {
  // Handles "11:30AM-3PM", "5-9PM", "11AM-10PM", etc.
  const m = slot.match(/^(\d+(?::\d+)?)\s*(AM|PM)?\s*-\s*(\d+(?::\d+)?)\s*(AM|PM)$/i)
  if (!m) return null
  const [, startStr, startMer, endStr, endMer] = m

  function parse(time: string, mer: string | undefined): number {
    const [hStr, mStr] = time.split(':')
    let h = parseInt(hStr)
    const min = mStr ? parseInt(mStr) : 0
    const meridiem = mer?.toUpperCase()
    if (meridiem === 'PM' && h !== 12) h += 12
    else if (meridiem === 'AM' && h === 12) h = 0
    return h * 60 + min
  }

  const endMinutes = parse(endStr, endMer)

  // Infer start meridiem if missing (e.g. "5-9PM" → 5PM)
  let startMeridiem = startMer
  if (!startMeridiem) {
    const sh = parseInt(startStr.split(':')[0])
    const endH = Math.floor(endMinutes / 60)
    startMeridiem = sh < 6 && endH >= 12 ? 'PM' : 'AM'
  }

  const startMinutes = parse(startStr, startMeridiem)
  return [startMinutes, endMinutes]
}

function isCurrentlyOpen(hours: Record<string, string[]>): boolean {
  const now = new Date()
  const daySlots = hours[DAY_NAMES[now.getDay()]]
  if (!daySlots || daySlots[0] === 'Closed') return false
  const cur = now.getHours() * 60 + now.getMinutes()
  for (const slot of daySlots) {
    const parsed = parseSlot(slot)
    if (parsed && cur >= parsed[0] && cur < parsed[1]) return true
  }
  return false
}

type BusyLevel = 'low' | 'moderate' | 'high' | 'closed'

function getEstimate(hours: Record<string, string[]> | null): { label: string; busy: BusyLevel; sublabel: string } {
  if (!hours || !isCurrentlyOpen(hours)) {
    return { label: 'Currently Closed', busy: 'closed', sublabel: 'Check hours below' }
  }
  const now = new Date()
  const h = now.getHours()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6

  const lunchPeak = isWeekend ? (h >= 11 && h < 14) : (h >= 12 && h < 14)
  const dinnerPeak = isWeekend ? (h >= 17 && h < 20) : (h >= 18 && h < 20)

  if (lunchPeak || dinnerPeak) return { label: '25–45 min', busy: 'high', sublabel: 'Peak hours right now' }
  if ((h >= 11 && h < 15) || (h >= 17 && h < 21)) return { label: '10–25 min', busy: 'moderate', sublabel: 'Moderate traffic' }
  return { label: 'Little to no wait', busy: 'low', sublabel: 'Not a peak hour' }
}

export default function LiveWaitTime({ hours }: Props) {
  const [estimate, setEstimate] = useState<ReturnType<typeof getEstimate> | null>(null)

  useEffect(() => {
    setEstimate(getEstimate(hours))
    const t = setInterval(() => setEstimate(getEstimate(hours)), 60_000)
    return () => clearInterval(t)
  }, [hours])

  const colorMap: Record<BusyLevel, string> = {
    low: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    moderate: 'text-amber-700 bg-amber-50 border-amber-200',
    high: 'text-red-700 bg-red-50 border-red-200',
    closed: 'text-[#6B6862] bg-[#F5F4F0] border-black/8',
  }

  if (!estimate) return <div className="h-20 rounded-xl bg-[#F5F4F0] animate-pulse" />

  return (
    <div className={`rounded-xl border p-4 ${colorMap[estimate.busy]}`}>
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm">{estimate.label}</p>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-current/10 opacity-70 uppercase tracking-wide">Live</span>
          </div>
          <p className="text-xs opacity-60 mt-0.5">{estimate.sublabel}</p>
        </div>
      </div>
    </div>
  )
}
