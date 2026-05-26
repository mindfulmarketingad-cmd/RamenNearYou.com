'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
  restaurantName: string
}

// Shared in-memory cache so all cards on the page share save state without
// re-fetching. Populated once per page load.
let savedCache: Set<string> | null = null
let cachePromise: Promise<Set<string>> | null = null

async function fetchSaved(): Promise<Set<string>> {
  if (savedCache) return savedCache
  if (!cachePromise) {
    cachePromise = fetch('/api/saves')
      .then(r => r.json())
      .then(({ saves }) => {
        savedCache = new Set(saves ?? [])
        return savedCache
      })
      .catch(() => {
        cachePromise = null
        return new Set<string>()
      })
  }
  return cachePromise
}

export default function CardSaveButton({ slug, restaurantName }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    // Check auth + load saved state
    import('@/lib/supabase/client').then(({ createClient }) => {
      const client = createClient()
      if (!client) { setAuthed(false); return }
      client.auth.getUser().then(({ data: { user } }) => {
        setAuthed(!!user)
        if (user) {
          fetchSaved().then(set => setSaved(set.has(slug)))
        }
      })
    })
  }, [slug])

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!authed) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (loading) return
    setLoading(true)

    const next = !saved
    setSaved(next)

    // Update cache
    if (savedCache) {
      if (next) savedCache.add(slug)
      else savedCache.delete(slug)
    }

    try {
      await fetch('/api/saves', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
    } catch {
      // Revert on error
      setSaved(!next)
      if (savedCache) {
        if (!next) savedCache.add(slug)
        else savedCache.delete(slug)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? `Remove ${restaurantName} from saved` : `Save ${restaurantName}`}
      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md z-10 ${
        saved
          ? 'bg-white text-red-500'
          : 'bg-white/80 backdrop-blur-sm text-[#6B6862] hover:bg-white hover:text-red-400'
      } ${loading ? 'opacity-60' : ''}`}
    >
      <Heart className={`w-4 h-4 transition-all ${saved ? 'fill-red-500' : ''}`} />
    </button>
  )
}
