'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2, Heart, Stamp, Map as MapIcon, Mail, Trash2, Plus, LogOut } from 'lucide-react'
import SignIn from '@/components/owner/sign-in'
import {
  usePass, initPass, sb, signOut, toggleSave, passError,
} from '@/lib/ramen-pass'

type Spot = { slug: string; name: string | null; city: string | null; state_code: string | null; path: string | null }
type CheckIn = Spot & { id: number; bowl: string | null; note: string | null; at: string }
type List = { id: string; name: string; city: string | null; trip_date: string | null; notes: string | null; pass_list_items: { restaurant_slug: string; note: string | null; position: number }[] }

const box = 'bg-surface border border-line/8 rounded-2xl p-5 sm:p-6'
const btn = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm disabled:opacity-60'
const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')
const spotHref = (s: Spot) => s.path || `/search?q=${encodeURIComponent(s.name || s.slug)}`
const spotName = (s: Spot) => s.name || s.slug.replace(/-/g, ' ')

function badgesFor(c: CheckIn[]) {
  const shops = new Set(c.map(x => x.slug)).size
  const cities = new Set(c.filter(x => x.city).map(x => `${x.city},${x.state_code}`)).size
  const states = new Set(c.filter(x => x.state_code).map(x => x.state_code)).size
  const bowls = new Set(c.filter(x => x.bowl).map(x => x.bowl)).size
  return [
    { emoji: '🍜', name: 'First Slurp', got: c.length >= 1, how: 'Check in once' },
    { emoji: '🥢', name: 'Regular', got: c.length >= 5, how: '5 check-ins' },
    { emoji: '🧭', name: 'Noodle Explorer', got: shops >= 10, how: '10 different shops' },
    { emoji: '🥣', name: 'Broth Collector', got: bowls >= 4, how: '4 bowl styles' },
    { emoji: '🚗', name: 'Road Tripper', got: cities >= 3, how: '3 cities' },
    { emoji: '🗺️', name: 'State Hopper', got: states >= 3, how: '3 states' },
    { emoji: '👑', name: 'Ramen Master', got: c.length >= 25, how: '25 check-ins' },
  ]
}

export default function AccountApp() {
  const params = useSearchParams()
  const { ready, session } = usePass()

  // sb() also subscribes to auth changes, so finishing sign-in (code,
  // magic link or Google) flips this page to the signed-in view.
  useEffect(() => { void initPass(); void sb() }, [])

  const next = params.get('next')
  const here = `/account${params.toString() ? `?${params.toString()}` : ''}`

  if (!ready) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ink-soft" /></div>

  if (!session) {
    return (
      <SignIn
        redirectPath={here}
        label="Your email"
        placeholder="you@example.com"
        hint="No password — we email you a link and a 6-digit code."
        intro={
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink">Sign in or create a free account</h2>
            <p className="text-sm text-ink-mid mt-1">Save spots, check in to bowls and earn badges.</p>
          </div>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      {next && next.startsWith('/') && !next.startsWith('//') && (
        <Link href={next} className="block text-sm text-brand-ink font-semibold">← Back to where you were</Link>
      )}
      <Saves />
      <Passport />
      <Lists />
      <Settings />
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>Signed in as {session.user.email}</span>
        <button onClick={() => void signOut()} className="inline-flex items-center gap-1 underline"><LogOut className="w-4 h-4" /> Sign out</button>
      </div>
    </div>
  )
}

function Saves() {
  const { saves } = usePass()
  const [rows, setRows] = useState<Spot[] | null>(null)
  const key = [...saves].sort().join('|')
  useEffect(() => {
    let off = false
    sb().then(c => c.rpc('my_pass_saves')).then(({ data }) => { if (!off) setRows((data as Spot[]) ?? []) })
    return () => { off = true }
  }, [key])
  return (
    <section className={box}>
      <h2 className="flex items-center gap-2 font-semibold text-ink"><Heart className="w-5 h-5 text-brand-ink" /> Saved spots
        <span className="text-xs font-normal text-ink-soft">{saves.size}</span>
      </h2>
      {!rows ? <Loader2 className="w-4 h-4 animate-spin mt-3 text-ink-soft" /> : rows.length === 0 ? (
        <p className="text-sm text-ink-mid mt-2">Tap the ♥ on any restaurant to save it here. <Link href="/" className="underline">Browse the map</Link></p>
      ) : (
        <ul className="mt-3 divide-y divide-line/8">
          {rows.map(r => (
            <li key={r.slug} className="flex items-center justify-between py-2 gap-3">
              <Link href={spotHref(r)} className="text-sm text-ink hover:underline capitalize">{spotName(r)} <span className="text-ink-soft normal-case">{r.city ? `· ${r.city}, ${r.state_code}` : ''}</span></Link>
              <button onClick={() => void toggleSave(r.slug)} aria-label="Remove" className="p-1 text-ink-soft hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Passport() {
  const [rows, setRows] = useState<CheckIn[] | null>(null)
  useEffect(() => {
    sb().then(c => c.rpc('my_checkins')).then(({ data }) => setRows((data as CheckIn[]) ?? []))
  }, [])
  const badges = useMemo(() => badgesFor(rows ?? []), [rows])
  const byState = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const r of rows ?? []) if (r.state_code) { if (!m.has(r.state_code)) m.set(r.state_code, new Set()); if (r.city) m.get(r.state_code)!.add(r.city) }
    return [...m.entries()].sort((a, b) => b[1].size - a[1].size)
  }, [rows])
  return (
    <section className={box}>
      <h2 className="flex items-center gap-2 font-semibold text-ink"><Stamp className="w-5 h-5 text-brand-ink" /> Ramen passport</h2>
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-7 gap-2">
        {badges.map(b => (
          <div key={b.name} title={b.how} className={`rounded-xl border p-2 text-center ${b.got ? 'border-brand/40 bg-brand/5' : 'border-line/10 opacity-50 grayscale'}`}>
            <div className="text-2xl">{b.emoji}</div>
            <div className="text-[11px] font-semibold text-ink leading-tight">{b.name}</div>
            <div className="text-[10px] text-ink-soft">{b.how}</div>
          </div>
        ))}
      </div>
      {!rows ? null : rows.length === 0 ? (
        <p className="text-sm text-ink-mid mt-3">Hit <strong>Check in</strong> on a restaurant page when you eat there.</p>
      ) : (
        <>
          <div className="mt-4">
            <h3 className="flex items-center gap-1 text-sm font-semibold text-ink"><MapIcon className="w-4 h-4" /> Your ramen map</h3>
            <p className="text-sm text-ink-mid mt-1">
              {rows.length} bowls · {new Set(rows.map(r => r.slug)).size} shops · {byState.reduce((n, [, c]) => n + c.size, 0)} cities · {byState.length} states
              <span className="block mt-1">{byState.map(([st, c]) => `${st} (${[...c].join(', ')})`).join(' · ')}</span>
            </p>
          </div>
          <ul className="mt-3 divide-y divide-line/8">
            {rows.slice(0, 30).map(r => (
              <li key={r.id} className="py-2 text-sm flex justify-between gap-3">
                <Link href={spotHref(r)} className="text-ink hover:underline capitalize">{spotName(r)}{r.bowl ? <span className="text-ink-soft normal-case"> · {r.bowl}</span> : null}</Link>
                <span className="text-ink-soft shrink-0">{fmtDate(r.at)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function Lists() {
  const { saves } = usePass()
  const [lists, setLists] = useState<List[] | null>(null)
  const [savedSpots, setSavedSpots] = useState<Spot[]>([])
  const [form, setForm] = useState({ name: '', city: '', trip_date: '' })
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    const c = await sb()
    const [{ data }, s] = await Promise.all([
      c.from('pass_lists').select('id,name,city,trip_date,notes,pass_list_items(restaurant_slug,note,position)').order('created_at', { ascending: false }),
      c.rpc('my_pass_saves'),
    ])
    setLists((data as List[]) ?? [])
    setSavedSpots((s.data as Spot[]) ?? [])
  }
  useEffect(() => { void load() }, [saves.size])

  async function create(e: React.FormEvent) {
    e.preventDefault(); setErr(null)
    const c = await sb()
    const { error } = await c.from('pass_lists').insert({ name: form.name.trim(), city: form.city.trim() || null, trip_date: form.trip_date || null })
    if (error) setErr(passError(error)); else { setForm({ name: '', city: '', trip_date: '' }); void load() }
  }
  async function addItem(list: List, slug: string) {
    const c = await sb()
    const { error } = await c.from('pass_list_items').insert({ list_id: list.id, restaurant_slug: slug, position: list.pass_list_items.length })
    if (error) setErr(passError(error)); else void load()
  }
  async function removeItem(list: List, slug: string) {
    const c = await sb()
    await c.from('pass_list_items').delete().eq('list_id', list.id).eq('restaurant_slug', slug)
    void load()
  }
  async function saveNotes(list: List, notes: string) {
    const c = await sb()
    await c.from('pass_lists').update({ notes: notes.slice(0, 1000) || null }).eq('id', list.id)
  }
  async function remove(list: List) {
    if (!confirm(`Delete “${list.name}”?`)) return
    const c = await sb()
    await c.from('pass_lists').delete().eq('id', list.id)
    void load()
  }
  const nameOf = (slug: string) => savedSpots.find(s => s.slug === slug)

  return (
    <section className={box}>
      <h2 className="flex items-center gap-2 font-semibold text-ink"><MapIcon className="w-5 h-5 text-brand-ink" /> Lists &amp; trip planner</h2>
      <>
          <form onSubmit={create} className="mt-3 grid sm:grid-cols-[1fr_9rem_9rem_auto] gap-2">
            <input required maxLength={80} placeholder="List or trip name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-line/15 bg-page px-3 py-2 text-sm" />
            <input maxLength={80} placeholder="City (optional)" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-line/15 bg-page px-3 py-2 text-sm" />
            <input type="date" value={form.trip_date} onChange={e => setForm({ ...form, trip_date: e.target.value })} className="rounded-xl border border-line/15 bg-page px-3 py-2 text-sm" aria-label="Trip date" />
            <button className={`${btn} bg-brand text-white hover:bg-brand-hi`}><Plus className="w-4 h-4" /> Add</button>
          </form>
          {err && <p className="text-sm text-red-700 mt-2">{err}</p>}
          <div className="mt-4 space-y-4">
            {(lists ?? []).map(l => {
              const inList = new Set(l.pass_list_items.map(i => i.restaurant_slug))
              const addable = savedSpots.filter(s => !inList.has(s.slug))
              return (
                <div key={l.id} className="rounded-xl border border-line/10 p-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">{l.name}</p>
                      <p className="text-xs text-ink-soft">{[l.city, l.trip_date && fmtDate(l.trip_date + 'T12:00:00')].filter(Boolean).join(' · ')}</p>
                    </div>
                    <button onClick={() => void remove(l)} aria-label="Delete list" className="p-1 text-ink-soft hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
                    {[...l.pass_list_items].sort((a, b) => a.position - b.position).map(i => {
                      const s = nameOf(i.restaurant_slug)
                      return (
                        <li key={i.restaurant_slug}>
                          {s ? <Link href={spotHref(s)} className="hover:underline capitalize">{spotName(s)}</Link> : <span className="capitalize">{i.restaurant_slug.replace(/-/g, ' ')}</span>}
                          <button onClick={() => void removeItem(l, i.restaurant_slug)} className="ml-2 text-xs text-ink-soft underline">remove</button>
                        </li>
                      )
                    })}
                  </ol>
                  {addable.length > 0 && (
                    <select className="mt-2 rounded-lg border border-line/15 bg-page px-2 py-1 text-sm" value="" onChange={e => e.target.value && void addItem(l, e.target.value)}>
                      <option value="">+ Add a saved spot…</option>
                      {addable.map(s => <option key={s.slug} value={s.slug}>{spotName(s)}{s.city ? ` — ${s.city}` : ''}</option>)}
                    </select>
                  )}
                  <textarea defaultValue={l.notes ?? ''} onBlur={e => void saveNotes(l, e.target.value)} maxLength={1000} rows={2} placeholder="Trip notes (order, parking, who’s coming…)" className="mt-2 w-full rounded-lg border border-line/15 bg-page px-3 py-2 text-sm" />
                </div>
              )
            })}
          </div>
      </>
    </section>
  )
}

function Settings() {
  const { session } = usePass()
  const [optIn, setOptIn] = useState<boolean | null>(null)
  useEffect(() => {
    sb().then(c => c.from('pass_settings').select('newsletter_opt_in').maybeSingle()).then(({ data }) => setOptIn(!!data?.newsletter_opt_in))
  }, [])
  async function toggle(v: boolean) {
    setOptIn(v)
    const c = await sb()
    await c.from('pass_settings').upsert({ user_id: session!.user.id, newsletter_opt_in: v, updated_at: new Date().toISOString() })
  }
  return (
    <section className={box}>
      <h2 className="flex items-center gap-2 font-semibold text-ink"><Mail className="w-5 h-5 text-brand-ink" /> New-openings email</h2>
      <label className="mt-2 flex items-start gap-2 text-sm text-ink-mid">
        <input type="checkbox" className="mt-1" checked={!!optIn} disabled={optIn === null} onChange={e => void toggle(e.target.checked)} />
        <span>Send me the monthly roundup of new ramen shops near me. Unsubscribe anytime.</span>
      </label>
    </section>
  )
}
