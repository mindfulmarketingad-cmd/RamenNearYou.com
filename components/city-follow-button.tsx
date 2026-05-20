'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  city: string
  state: string
}

export default function CityFollowButton({ city, state }: Props) {
  const router = useRouter()
  const [following, setFollowing] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setLoggedIn(true)
      const res = await fetch(`/api/city-follows?city=${city}&state=${state}`)
      const json = await res.json()
      setFollowing(json.following ?? false)
      setLoading(false)
    })
  }, [city, state])

  async function toggle() {
    if (!loggedIn) {
      router.push(`/auth/login?redirectTo=/${city}/${state}`)
      return
    }
    const wasFollowing = following
    setFollowing(!wasFollowing)
    await fetch('/api/city-follows', {
      method: wasFollowing ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, state }),
    })
  }

  if (loading) {
    return (
      <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#B0B3BB] text-xs font-medium opacity-50">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Follow City
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
        following
          ? 'bg-[#B57F50]/20 border-[#B57F50]/50 text-[#B57F50] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
          : 'bg-white/5 border-white/10 text-[#B0B3BB] hover:border-[#B57F50]/50 hover:text-[#B57F50]'
      }`}
    >
      {following ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
      {following ? 'Following' : 'Follow City'}
    </button>
  )
}
