'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { getSavedSlugs, toggleSaved } from '@/lib/saves'

// Circle-style save control matching the Directions/Website/Call actions on
// the restaurant listing page. Saves persist in localStorage (no account).
export default function ListingSaveButton({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSaved(getSavedSlugs().includes(slug)) }, [slug])

  return (
    <button
      onClick={() => setSaved(toggleSaved(slug))}
      aria-label={saved ? `Remove ${restaurantName} from saved` : `Save ${restaurantName}`}
      className="flex flex-col items-center gap-1 text-[#B57F50] text-[11px] font-medium"
    >
      <span className="w-11 h-11 rounded-full bg-[#B57F50]/10 flex items-center justify-center hover:bg-[#B57F50]/20 transition-colors">
        <Heart className={`w-5 h-5 transition-all ${saved ? 'fill-[#B57F50]' : ''}`} />
      </span>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
