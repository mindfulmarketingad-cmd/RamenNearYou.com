'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, X, Loader2, MapPin, Lock, Check, Rss } from 'lucide-react'
import FeedPostCard, { type FeedPost } from '@/components/feed-post-card'
import AdInFeed from '@/components/ad-infeed'
import ProductsCarousel from '@/components/products-carousel'
import { useGate } from '@/lib/use-gate'

// The member feed at /feed: pick ZIP codes, then scroll every ramen shop in
// them like a timeline.
//
// Access is checked here to decide what to render, and again inside every
// /api/feed* route to decide what data is actually returned — the client gate
// is a UI affordance, not the security boundary.

const STRIPE_LINK = 'https://buy.stripe.com/9B6aEYgyK44EaYK45ofrW08'
const PAGE_SIZE = 10
/** Break the scroll every N posts, the same rhythm the other feeds use. */
const AD_EVERY = 8
const CAROUSEL_AT = 4

interface FollowedZip {
  zip: string
  label: string | null
}

export default function PersonalFeed() {
  const { signedIn, subscribed, isAdmin } = useGate()
  const resolved = signedIn !== null && subscribed !== null
  const hasAccess = signedIn === true && (subscribed === true || isAdmin)

  const [zips, setZips] = useState<FollowedZip[]>([])
  const [zipsLoaded, setZipsLoaded] = useState(false)
  const [input, setInput] = useState('')
  const [zipError, setZipError] = useState('')
  const [adding, setAdding] = useState(false)

  const [posts, setPosts] = useState<FeedPost[]>([])
  const [total, setTotal] = useState(0)
  const [nextOffset, setNextOffset] = useState<number | null>(0)
  const [loading, setLoading] = useState(false)
  const [firstLoadDone, setFirstLoadDone] = useState(false)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  // Mirrors the paging state for the IntersectionObserver callback, which is
  // registered once and would otherwise close over the first render's values.
  const stateRef = useRef({ loading: false, nextOffset: 0 as number | null })
  stateRef.current = { loading, nextOffset }

  const zipKey = zips.map((z) => z.zip).sort().join(',')

  /** Load followed ZIPs once we know the visitor is entitled. */
  useEffect(() => {
    if (!hasAccess) return
    let cancelled = false
    fetch('/api/feed/zips')
      .then((r) => (r.ok ? r.json() : { zips: [] }))
      .then((d) => { if (!cancelled) { setZips(d.zips ?? []); setZipsLoaded(true) } })
      .catch(() => { if (!cancelled) setZipsLoaded(true) })
    return () => { cancelled = true }
  }, [hasAccess])

  const loadPage = useCallback(async (offset: number, replace: boolean) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/feed?offset=${offset}&limit=${PAGE_SIZE}`)
      if (!res.ok) { setNextOffset(null); return }
      const d = await res.json()
      const incoming: FeedPost[] = Array.isArray(d.posts) ? d.posts : []
      setPosts((prev) => (replace ? incoming : [...prev, ...incoming]))
      setTotal(d.total ?? 0)
      setNextOffset(d.nextOffset ?? null)
    } catch {
      setNextOffset(null)
    } finally {
      setLoading(false)
      setFirstLoadDone(true)
    }
  }, [])

  /** Reset and refetch from the top whenever the ZIP set changes. */
  useEffect(() => {
    if (!hasAccess || !zipsLoaded) return
    if (zips.length === 0) {
      setPosts([]); setTotal(0); setNextOffset(null); setFirstLoadDone(true)
      return
    }
    setPosts([]); setNextOffset(0); setFirstLoadDone(false)
    loadPage(0, true)
  }, [hasAccess, zipsLoaded, zipKey, loadPage]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Infinite scroll — fetch the next page as the sentinel comes into view. */
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        const { loading: busy, nextOffset: next } = stateRef.current
        if (busy || next === null) return
        loadPage(next, false)
      },
      // Start the next page before the reader actually hits the bottom.
      { rootMargin: '600px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadPage, firstLoadDone])

  async function addZip(e: React.FormEvent) {
    e.preventDefault()
    const zip = input.trim()
    setZipError('')
    if (!/^[0-9]{5}$/.test(zip)) { setZipError('Enter a 5-digit ZIP code'); return }
    if (zips.some((z) => z.zip === zip)) { setZipError('You already follow that ZIP'); setInput(''); return }

    setAdding(true)
    try {
      const res = await fetch('/api/feed/zips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) { setZipError(d.error ?? 'Could not add that ZIP'); return }
      setZips((prev) => [{ zip, label: d.label ?? null }, ...prev])
      setInput('')
    } catch {
      setZipError('Could not add that ZIP')
    } finally {
      setAdding(false)
    }
  }

  async function removeZip(zip: string) {
    setZips((prev) => prev.filter((z) => z.zip !== zip))
    try {
      await fetch('/api/feed/zips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip }),
      })
    } catch {
      // Put it back if the delete didn't land, so the UI doesn't lie.
      fetch('/api/feed/zips')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d?.zips) setZips(d.zips) })
        .catch(() => {})
    }
  }

  // ---- Locked states -------------------------------------------------------

  if (!resolved) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-ink-soft">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading your feed…
      </div>
    )
  }

  if (!hasAccess) {
    return <FeedUpsell needsAccount={signedIn === false} />
  }

  // ---- The feed ------------------------------------------------------------

  return (
    <>
      {/* ZIP manager */}
      <div className="bg-surface border border-line/8 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <MapPin className="w-4 h-4 text-brand-ink" />
          <h2 className="font-bold text-sm text-ink">Your ZIP codes</h2>
          {zips.length > 0 && (
            <span className="text-xs text-ink-soft">
              {total.toLocaleString()} {total === 1 ? 'spot' : 'spots'} in your feed
            </span>
          )}
        </div>

        <form onSubmit={addZip} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value.replace(/\D/g, '').slice(0, 5)); setZipError('') }}
            inputMode="numeric"
            placeholder="Add a ZIP code…"
            aria-label="Add a ZIP code to your feed"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-line/10 bg-surface text-sm text-ink placeholder-ink-faint outline-none focus:border-brand tabular-nums"
          />
          <button
            type="submit"
            disabled={adding}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-contrast hover:bg-contrast-hi text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Follow
          </button>
        </form>
        {zipError && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{zipError}</p>}

        {zips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {zips.map((z) => (
              <span
                key={z.zip}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-brand/10 border border-brand/30 text-xs font-semibold text-brand-ink"
              >
                <span className="tabular-nums">{z.zip}</span>
                {z.label && <span className="font-normal text-ink-soft">{z.label}</span>}
                <button
                  type="button"
                  onClick={() => removeZip(z.zip)}
                  aria-label={`Stop following ${z.zip}`}
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-brand/25 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Empty state — no ZIPs followed yet */}
      {zipsLoaded && zips.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line/12 bg-raised px-4 py-14 text-center">
          <Rss className="w-6 h-6 text-brand mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-ink">Your feed is empty</p>
          <p className="text-sm text-ink-soft mt-1.5 max-w-sm mx-auto leading-relaxed">
            Follow a ZIP code above and every ramen shop in it lands here. Add your
            neighbourhood, your office, and anywhere you travel often.
          </p>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((p, i) => (
            <div key={p.slug}>
              <FeedPostCard post={p} />
              {i === CAROUSEL_AT && <div className="mt-4"><ProductsCarousel variant="inline" /></div>}
              {i > 0 && (i + 1) % AD_EVERY === 0 && <div className="mt-4"><AdInFeed /></div>}
            </div>
          ))}
        </div>
      )}

      {/* Sentinel + status. Kept mounted so the observer has something to
          watch as soon as the first page lands. */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink-soft">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading more…
        </div>
      )}

      {firstLoadDone && !loading && nextOffset === null && posts.length > 0 && (
        <p className="text-center text-xs text-ink-soft py-8">
          That&apos;s every ramen spot in your ZIP codes. Follow another to see more.
        </p>
      )}
    </>
  )
}

function FeedUpsell({ needsAccount }: { needsAccount: boolean }) {
  return (
    <div className="bg-surface border border-line/8 rounded-2xl p-7 sm:p-9 text-center">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6 text-brand-ink" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/25 text-brand-ink text-xs font-semibold mb-3">
        RamenNearYou+ — $2.99/month
      </div>

      <h2 className="font-serif text-2xl font-bold text-ink mb-2">
        Your own ramen feed
      </h2>
      <p className="text-ink-soft text-sm leading-relaxed mb-5 max-w-md mx-auto">
        Follow the ZIP codes you actually eat in and scroll every ramen shop in them —
        your neighbourhood, your office, anywhere you travel.
      </p>

      <ul className="text-left space-y-2 mb-6 max-w-sm mx-auto">
        {[
          'Follow up to 25 ZIP codes',
          'An endless scroll of every shop in them',
          'Vote, save and get directions without leaving the feed',
          'All map and feed filters unlocked too',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
        {needsAccount ? (
          <>
            <Link
              href="/auth/signup?redirectTo=%2Ffeed"
              className="w-full px-5 py-3 rounded-xl bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
            >
              Create a free account
            </Link>
            <Link
              href="/auth/login?redirectTo=%2Ffeed"
              className="w-full px-5 py-3 rounded-xl bg-surface border border-line/10 text-ink hover:border-line/20 text-sm font-semibold transition-colors"
            >
              I already have an account
            </Link>
          </>
        ) : (
          <a
            href={STRIPE_LINK}
            className="w-full px-5 py-3 rounded-xl bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
          >
            Subscribe — $2.99/month
          </a>
        )}
        <Link href="/" className="text-xs font-semibold text-ink-soft hover:text-ink pt-1">
          Browse ramen near you instead →
        </Link>
      </div>
    </div>
  )
}
