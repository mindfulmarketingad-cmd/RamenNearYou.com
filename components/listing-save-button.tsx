'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'
import { getSavedSlugs, toggleSaved } from '@/lib/saves'

// Circle-style save control matching the Directions/Website/Call actions on
// the restaurant listing page. Saves are tied to a logged-in account —
// logged-out clicks redirect to login instead of toggling.
export default function ListingSaveButton({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getSavedSlugs().then((slugs) => setSaved(slugs.includes(slug)))
  }, [slug])

  async function handleClick() {
    if (busy) return
    setBusy(true)
    const result = await toggleSaved(slug, saved)
    setBusy(false)
    if (result.unauthorized) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }
    setSaved(result.saved)
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-label={saved ? `Remove ${restaurantName} from saved` : `Save ${restaurantName}`}
      className="flex flex-col items-center gap-1 text-[#B57F50] text-[11px] font-medium disabled:opacity-60"
    >
      <span className="w-11 h-11 rounded-full bg-[#B57F50]/10 flex items-center justify-center hover:bg-[#B57F50]/20 transition-colors">
        <Heart className={`w-5 h-5 transition-all ${saved ? 'fill-[#B57F50]' : ''}`} />
      </span>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
