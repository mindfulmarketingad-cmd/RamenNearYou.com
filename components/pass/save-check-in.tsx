'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Stamp, Tag } from 'lucide-react'
import { usePass, initPass, toggleSave, checkIn, sb } from '@/lib/ramen-pass'
import { BOWL_META } from '@/lib/ramen-taxonomy'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config'

const iconBtn = 'flex flex-col items-center gap-1 text-brand-ink text-[11px] font-medium shrink-0'
const iconCircle = 'w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center hover:bg-brand/20 transition-colors'

/** Save + Check in buttons for the listing page action row. */
export function SaveCheckInButtons({ slug }: { slug: string }) {
  const { saves, session } = usePass()
  const [checked, setChecked] = useState<null | 'ok' | 'dupe'>(null)
  const [picking, setPicking] = useState(false)
  async function stamp(bowl?: string) {
    setPicking(false)
    const r = await checkIn(slug, bowl)
    if (r === 'ok' || r === 'dupe') setChecked(r)
  }
  useEffect(() => { void initPass() }, [])
  const saved = saves.has(slug)
  return (
    <>
      <button type="button" className={iconBtn} onClick={() => void toggleSave(slug)} aria-pressed={saved}>
        <span className={iconCircle}><Heart className={`w-5 h-5 ${saved ? 'fill-brand' : ''}`} /></span>
        {saved ? 'Saved' : 'Save'}
      </button>
      <button type="button" className={iconBtn} onClick={() => (session ? setPicking(true) : void stamp())}>
        <span className={iconCircle}><Stamp className="w-5 h-5" /></span>
        {checked ? 'Checked in' : 'Check in'}
      </button>
      {picking && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40" onClick={() => setPicking(false)}>
          <div className="w-full sm:max-w-sm bg-surface rounded-t-2xl sm:rounded-2xl p-5" onClick={e => e.stopPropagation()}>
            <p className="font-semibold text-ink">What did you have?</p>
            <p className="text-xs text-ink-soft mb-3">Adds a stamp to your ramen passport.</p>
            <div className="flex flex-wrap gap-2">
              {BOWL_META.map(b => (
                <button key={b.key} type="button" onClick={() => void stamp(b.label)}
                  className="px-3 py-1.5 rounded-full border border-line/15 text-sm text-ink hover:bg-sunken">{b.emoji} {b.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => void stamp()} className="mt-4 w-full rounded-xl bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-hi">Just check in</button>
          </div>
        </div>
      )}
    </>
  )
}

/** "Members get a deal here" teaser; the deal text only reaches members. */
export function ListingDeal({ slug }: { slug: string }) {
  const { ready, pass, session } = usePass()
  const [deal, setDeal] = useState<{ has_deal: boolean; deal?: string; fine_print?: string | null } | null>(null)
  useEffect(() => { void initPass() }, [])
  useEffect(() => {
    if (!ready) return
    let cancelled = false
    // Signed-out visitors only need the yes/no teaser: one tiny REST call,
    // without downloading supabase-js on every listing page.
    const req = session
      ? sb().then(c => c.rpc('listing_deal', { p_slug: slug })).then(r => r.data)
      : fetch(`${SUPABASE_URL}/rest/v1/rpc/listing_deal`, {
          method: 'POST',
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_slug: slug }),
        }).then(r => (r.ok ? r.json() : null))
    req.then(data => { if (!cancelled && data) setDeal(data) }).catch(() => {})
    return () => { cancelled = true }
  }, [ready, pass?.active, session, slug])
  if (!deal?.has_deal) return null
  return (
    <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4 flex gap-3">
      <Tag className="w-5 h-5 text-brand-ink shrink-0 mt-0.5" />
      {deal.deal ? (
        <div>
          <p className="font-semibold text-ink">Ramen Pass deal: {deal.deal}</p>
          {deal.fine_print && <p className="text-xs text-ink-soft mt-1">{deal.fine_print}</p>}
          <p className="text-xs text-ink-soft mt-1">Show your Ramen Pass on the Account page when you order.</p>
        </div>
      ) : (
        <p className="text-sm text-ink">This shop has a <strong>member deal</strong>. <Link href="/ramen-pass" className="underline font-semibold">Get the Ramen Pass</Link> to see it.</p>
      )}
    </div>
  )
}
