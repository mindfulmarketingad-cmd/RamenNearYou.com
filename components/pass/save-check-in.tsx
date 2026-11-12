'use client'

import { useEffect, useState } from 'react'
import { Heart, Stamp } from 'lucide-react'
import { usePass, initPass, toggleSave, checkIn } from '@/lib/ramen-pass'
import { BOWL_META } from '@/lib/ramen-taxonomy'

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

