'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { getSavedSlugs, toggleSaved } from '@/lib/saves'

export default function SaveButton({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(getSavedSlugs().includes(slug))
  }, [slug])

  function handleToggle() {
    const isSaved = toggleSaved(slug)
    setSaved(isSaved)
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={saved ? `Remove ${restaurantName} from saved` : `Save ${restaurantName}`}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
        saved
          ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
          : 'bg-black/5 border-black/8 text-[#6B6862] hover:border-black/15 hover:text-[#1E2026]'
      }`}
    >
      <Heart className={`w-4 h-4 transition-all ${saved ? 'fill-red-400 text-red-400' : ''}`} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
