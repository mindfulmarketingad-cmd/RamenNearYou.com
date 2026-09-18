'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  slug: string
  restaurantName: string
  /** `sm` for inline use next to a card title, `md` beside a page heading. */
  size?: 'sm' | 'md'
}

export default function RestaurantVoteButtons({ slug, restaurantName, size = 'md' }: Props) {
  const router = useRouter()
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  const [myVote, setMyVote] = useState<0 | 1 | -1>(0)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/votes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setUp(d?.tallies?.[slug]?.up ?? 0)
        setDown(d?.tallies?.[slug]?.down ?? 0)
        setMyVote((d?.myVotes?.[slug] ?? 0) as 0 | 1 | -1)
        setLoaded(true)
      })
      .catch(() => {
        // Counts just stay at zero if the lookup fails — the buttons still work.
        if (!cancelled) setLoaded(true)
      })
    return () => { cancelled = true }
  }, [slug])

  async function cast(choice: 1 | -1) {
    if (busy) return
    setBusy(true)

    // Clicking the vote you already hold clears it.
    const next = myVote === choice ? 0 : choice
    const prev = { up, down, myVote }

    // Optimistic: remove the old vote's contribution, add the new one's.
    let nextUp = up
    let nextDown = down
    if (myVote === 1) nextUp -= 1
    if (myVote === -1) nextDown -= 1
    if (next === 1) nextUp += 1
    if (next === -1) nextDown += 1
    setUp(nextUp)
    setDown(nextDown)
    setMyVote(next)

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, vote: next }),
      })

      if (res.status === 401) {
        setUp(prev.up); setDown(prev.down); setMyVote(prev.myVote)
        toast('Log in to vote', {
          description: `Tell everyone what you think of ${restaurantName}.`,
          action: {
            label: 'Log In',
            onClick: () =>
              router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`),
          },
        })
        return
      }

      if (!res.ok) throw new Error('vote failed')

      // Trust the server's tally over the optimistic one.
      const d = await res.json().catch(() => null)
      if (d?.tally) { setUp(d.tally.up ?? nextUp); setDown(d.tally.down ?? nextDown) }
    } catch {
      setUp(prev.up); setDown(prev.down); setMyVote(prev.myVote)
    } finally {
      setBusy(false)
    }
  }

  const pad = size === 'sm' ? 'px-2 py-1 gap-1' : 'px-2.5 py-1.5 gap-1.5'
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const text = size === 'sm' ? 'text-[11px]' : 'text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 ${loaded ? '' : 'opacity-60'}`}>
      <button
        type="button"
        onClick={() => cast(1)}
        disabled={busy}
        aria-pressed={myVote === 1}
        aria-label={`Thumbs up ${restaurantName} (${up} ${up === 1 ? 'vote' : 'votes'})`}
        className={`inline-flex items-center rounded-full border font-semibold transition-colors ${pad} ${text} ${
          myVote === 1
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
            : 'bg-white border-black/10 text-[#6B6862] hover:border-emerald-400 hover:text-emerald-700'
        } ${busy ? 'opacity-60' : ''}`}
      >
        <ThumbsUp className={`${icon} ${myVote === 1 ? 'fill-emerald-500/20' : ''}`} />
        <span className="tabular-nums">{up}</span>
      </button>

      <button
        type="button"
        onClick={() => cast(-1)}
        disabled={busy}
        aria-pressed={myVote === -1}
        aria-label={`Thumbs down ${restaurantName} (${down} ${down === 1 ? 'vote' : 'votes'})`}
        className={`inline-flex items-center rounded-full border font-semibold transition-colors ${pad} ${text} ${
          myVote === -1
            ? 'bg-rose-50 border-rose-500 text-rose-700'
            : 'bg-white border-black/10 text-[#6B6862] hover:border-rose-400 hover:text-rose-700'
        } ${busy ? 'opacity-60' : ''}`}
      >
        <ThumbsDown className={`${icon} ${myVote === -1 ? 'fill-rose-500/20' : ''}`} />
        <span className="tabular-nums">{down}</span>
      </button>
    </span>
  )
}
