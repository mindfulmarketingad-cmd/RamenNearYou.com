'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SaveButton({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setLoggedIn(true)
      const res = await fetch('/api/saves')
      const json = await res.json()
      setSaved((json.saves ?? []).includes(slug))
      setLoading(false)
    })
  }, [slug])

  async function toggle() {
    if (!loggedIn) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    const wasSaved = saved
    setSaved(!wasSaved)
    await fetch('/api/saves', {
      method: wasSaved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? `Remove ${restaurantName} from saved` : `Save ${restaurantName}`}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        saved
          ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
          : 'bg-white/5 border-white/10 text-[#B0B3BB] hover:border-white/25 hover:text-white'
      }`}
    >
      <Heart className={`w-4 h-4 transition-all ${saved ? 'fill-red-400 text-red-400' : ''}`} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
