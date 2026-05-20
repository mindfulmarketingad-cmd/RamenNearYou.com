'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { getVisitedSlugs, toggleVisited } from '@/lib/visits'

export default function VisitButton({ slug, restaurantName, initialCount = 0 }: { slug: string; restaurantName: string; initialCount?: number }) {
  const [visited, setVisited] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setVisited(getVisitedSlugs().includes(slug))
  }, [slug])

  async function handleToggle() {
    if (submitting) return
    setSubmitting(true)
    const wasVisited = visited
    const nowVisited = await toggleVisited(slug)
    setVisited(nowVisited)
    if (!wasVisited && nowVisited) setCount(c => c + 1)
    setSubmitting(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={submitting}
      aria-label={visited ? `Unmark ${restaurantName} as visited` : `Mark ${restaurantName} as visited`}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium disabled:opacity-60 ${
        visited
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
          : 'bg-black/5 border-black/8 text-[#6B6862] hover:border-black/15 hover:text-[#1E2026]'
      }`}
    >
      {visited ? <CheckCircle2 className="w-4 h-4 fill-emerald-400/20" /> : <Circle className="w-4 h-4" />}
      {visited ? 'Visited' : 'Mark Visited'}
      {count > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${visited ? 'bg-emerald-400/20' : 'bg-black/8'}`}>
          {count}
        </span>
      )}
    </button>
  )
}
