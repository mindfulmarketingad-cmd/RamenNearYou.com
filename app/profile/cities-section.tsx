'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface Follow {
  city_slug: string
  state_slug: string
  created_at: string
}

export default function CitiesSection() {
  const [follows, setFollows] = useState<Follow[] | null>(null)

  useEffect(() => {
    fetch('/api/city-follows')
      .then(r => r.json())
      .then(({ follows }) => setFollows(Array.isArray(follows) ? follows : []))
      .catch(() => setFollows([]))
  }, [])

  if (follows === null) return null

  if (follows.length === 0) {
    return (
      <div className="bg-[#1E2026] border border-white/10 rounded-xl p-8 text-center">
        <MapPin className="w-10 h-10 text-[#77567A]/30 mx-auto mb-3" />
        <p className="text-white text-sm font-medium mb-1">No cities followed yet</p>
        <p className="text-[#B0B3BB] text-xs mb-4">Follow a city to get updates on new ramen spots.</p>
        <Link
          href="/cities"
          className="inline-block px-4 py-2 rounded-lg bg-[#77567A] text-white text-xs font-medium hover:bg-[#8a6a8d] transition-colors"
        >
          Browse Cities
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#1E2026] border border-white/10 rounded-xl divide-y divide-white/5">
      {follows.map(f => (
        <Link
          key={`${f.city_slug}-${f.state_slug}`}
          href={`/${f.city_slug}/${f.state_slug}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <span className="flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4 text-[#77567A]" />
            <span className="capitalize">{f.city_slug.replace(/-/g, ' ')}, {f.state_slug.toUpperCase()}</span>
          </span>
          <span className="text-[#77567A] text-xs group-hover:underline">View →</span>
        </Link>
      ))}
    </div>
  )
}
