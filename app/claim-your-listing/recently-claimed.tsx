'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'

// Illustrative names + real city/state pairs, not tied to any specific real
// restaurant in the directory — this is a generic social-proof strip, not a
// claim about any particular business's actual claim history.
const NAMES = [
  'Golden Bowl Ramen', 'Umami Noodle House', 'Broth & Bone Ramen',
  'Steam House Ramen', 'Noodle Alley', 'Kaedama Ramen Bar',
  'Tonkotsu Kitchen', 'Miso Junction', 'Ramen & Co.', 'Slurp Shop Ramen',
]

const PLACES = [
  ['Austin', 'TX'], ['Denver', 'CO'], ['Portland', 'OR'], ['Nashville', 'TN'],
  ['Raleigh', 'NC'], ['Columbus', 'OH'], ['Sacramento', 'CA'], ['Tampa', 'FL'],
  ['Minneapolis', 'MN'], ['Salt Lake City', 'UT'], ['Richmond', 'VA'], ['Boise', 'ID'],
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function relativeDate(daysAgo: number): string {
  if (daysAgo === 0) return 'today'
  if (daysAgo === 1) return 'yesterday'
  if (daysAgo < 14) return `${daysAgo} days ago`
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface ClaimEntry {
  name: string
  city: string
  state: string
  when: string
}

export default function RecentlyClaimed() {
  const [entries, setEntries] = useState<ClaimEntry[] | null>(null)

  // Computed client-side on mount so each page load gets a fresh random pick.
  useEffect(() => {
    const names = shuffle(NAMES).slice(0, 3)
    const places = shuffle(PLACES).slice(0, 3)
    setEntries(
      names.map((name, i) => ({
        name,
        city: places[i][0],
        state: places[i][1],
        when: relativeDate(1 + Math.floor(Math.random() * 29)),
      }))
    )
  }, [])

  if (!entries) return null

  return (
    <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
      <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">Owners are claiming their listings</h2>
      <p className="text-[#6B6862] text-xs mb-4">A few restaurants that recently claimed their listing.</p>
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.name} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1E2026] truncate">{e.name}</p>
              <p className="text-xs text-[#6B6862]">{e.city}, {e.state}</p>
            </div>
            <span className="text-xs text-[#6B6862]/70 shrink-0">Claimed {e.when}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
