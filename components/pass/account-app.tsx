'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Heart, Stamp, Map as MapIcon, Tag, Mail, Crown, Trash2, Plus, LogOut, Lock } from 'lucide-react'
import SignIn from '@/components/owner/sign-in'
import {
  usePass, initPass, refresh, sb, signOut, toggleSave, checkoutUrl, afterCheckoutClaim, passError,
  FREE_SAVE_LIMIT, PASS_PRICES, type PassInfo, type PassPlan,
} from '@/lib/ramen-pass'

type Spot = { slug: string; name: string | null; city: string | null; state_code: string | null; path: string | null }
type CheckIn = Spot & { id: number; bowl: string | null; note: string | null; at: string }
type Deal = Spot & { deal: string; fine_print: string | null }
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
  const router = useRouter()
  const { ready, session, pass } = usePass()
  const [claim, setClaim] = useState<{ busy: boolean; msg?: string; ok?: boolean } | null>(null)

  // sb() also subscribes to auth changes, so finishing sign-in (code,
  // magic link or Google) flips this page to the signed-in view.
  useEffect(() => { void initPass(); void sb() }, [])

  const plan = (params.get('plan') === 'monthly' || params.get('plan') === 'yearly' ? params.get('plan') : null) as PassPlan | null
  const sessionId = params.get('session_id')
  const next = params.get('next')
  const here = `/account${params.toString() ? `?${params.toString()}` : ''}`

  // Back from Stripe Checkout: link the subscription to this account.
  useEffect(() => {
    if (!session || !sessionId || claim) return
    setClaim({ busy: true })
    ;(async () => {
      const c = await sb()
      const { data, error } = await c.rpc('pass_claim_session', { p_session_id: sessionId })
      if (error) { setClaim({ busy: false, msg: passError(error) }); return }
      afterCheckoutClaim(data as PassInfo)
      await refresh(true)
      setClaim({ busy: false, ok: true, msg: 'Welcome to the Ramen Pass! Everything is unlocked.' })
      router.replace('/account')
    })()
  }, [session, sessionId, claim, router])

  if (!ready) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ink-soft" /></div>

  if (!session) {
    return (
      <SignIn
        redirectPath={here}
        label="Your email"
        placeholder="you@example.com"
        hint="No password — we email you a link and a 6-digit code. Free accounts get 5 saves, check-ins and badges."
        intro={
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink">{plan ? 'First, create your free account' : 'Sign in or create a free account'}</h2>
            <p className="text-sm text-ink-mid mt-1">
              {plan
                ? `Then you can subscribe to the Ramen Pass (${PASS_PRICES[plan].label}/${PASS_PRICES[plan].per}).`
                : 'Save spots, check in to bowls and earn badges.'}
            </p>
          </div>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      {claim && (
        <div className={`rounded-xl p-4 text-sm ${claim.ok ? 'bg-green-50 text-green-900 border border-green-200' : claim.busy ? 'bg-sunken text-ink' : 'bg-red-50 text-red-900 border border-red-200'}`}>
          {claim.busy ? 'Activating your Ramen Pass…' : claim.msg}
        </div>
      )}
      {next && next.startsWith('/') && !next.startsWith('//') && (
        <Link href={next} className="block text-sm text-brand-ink font-semibold">← Back to where you were</Link>
      )}
      <PlanCard pass={pass} plan={plan} />
      <Saves />
      <Passport active={!!pass?.active} />
      <Lists active={!!pass?.active} />
      <Deals active={!!pass?.active} />
      <Settings active={!!pass?.active} />
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>Signed in as {session.user.email}</span>
        <button onClick={() => void signOut()} className="inline-flex items-center gap-1 underline"><LogOut className="w-4 h-4" /> Sign out</button>
      </div>
    </div>
  )
}

function PlanCard({ pass, plan }: { pass: PassInfo | null; plan: PassPlan | null }) {
  const { session } = usePass()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function portal() {
    setBusy(true); setErr(null)
    const c = await sb()
    const { data, error } = await c.rpc('pass_portal_url')
    setBusy(false)
    if (error || !data) setErr(passError(error)); else window.location.href = data as string
  }

  if (pass?.active) {
    return (
      <div className={`${box} border-brand/30`}>
        <div className="flex items-center gap-2 text-brand-ink font-semibold"><Crown className="w-5 h-5" /> Ramen Pass member</div>
        <p className="text-sm text-ink-mid mt-1">
          {pass.plan === 'yearly' ? `${PASS_PRICES.yearly.label}/year` : `${PASS_PRICES.monthly.label}/month`}
          {pass.current_period_end && (pass.cancel_at_period_end
            ? ` · ends ${fmtDate(pass.current_period_end)} (won’t renew)`
            : ` · ${pass.status === 'trialing' ? 'first charge' : 'renews'} ${fmtDate(pass.current_period_end)}`)}
          {pass.status === 'past_due' && ' · payment failed — please update your card'}
        </p>
        <button onClick={portal} disabled={busy} className={`${btn} mt-4 border border-line/15 text-ink hover:bg-sunken`}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Manage billing or cancel
        </button>
        {err && <p className="text-sm text-red-700 mt-2">{err}</p>}
      </div>
    )
  }

  const order: PassPlan[] = plan === 'monthly' ? ['monthly', 'yearly'] : ['yearly', 'monthly']
  return (
    <div className={box}>
      <div className="flex items-center gap-2 font-semibold text-ink"><Crown className="w-5 h-5 text-brand-ink" /> Free account</div>
      <p className="text-sm text-ink-mid mt-1">
        Upgrade to the Ramen Pass for unlimited saves, every filter, trip lists, member deals and no ads.
        {pass?.has_billing && pass.status === 'canceled' && ' Your previous Pass has ended.'}
      </p>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {order.map((p, i) => (
          <a key={p} href={checkoutUrl(p, session)} className={`${btn} py-3 ${i === 0 ? 'bg-brand text-white hover:bg-brand-hi' : 'border border-line/15 text-ink hover:bg-sunken'}`}>
            Get Ramen Pass · {PASS_PRICES[p].label}/{PASS_PRICES[p].per === 'month' ? 'mo' : 'yr'}
          </a>
        ))}
      </div>
      <p className="text-xs text-ink-soft mt-3">Billed by Stripe. Cancel anytime. <Link href="/ramen-pass" className="underline">Compare plans</Link></p>
      {pass?.has_billing && (
        <button onClick={portal} disabled={busy} className="text-xs underline text-ink-soft mt-2">Billing history</button>
      )}
      {err && <p className="text-sm text-red-700 mt-2">{err}</p>}
    </div>
  )
}

function Saves() {
  const { saves, pass } = usePass()
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
        <span className="text-xs font-normal text-ink-soft">{saves.size}{pass?.active ? '' : ` / ${FREE_SAVE_LIMIT}`}</span>
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

function Passport({ active }: { active: boolean }) {
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
            {active ? (
              <p className="text-sm text-ink-mid mt-1">
                {rows.length} bowls · {new Set(rows.map(r => r.slug)).size} shops · {byState.reduce((n, [, c]) => n + c.size, 0)} cities · {byState.length} states
                <span className="block mt-1">{byState.map(([st, c]) => `${st} (${[...c].join(', ')})`).join(' · ')}</span>
              </p>
            ) : (
              <p className="text-sm text-ink-mid mt-1"><Lock className="inline w-3.5 h-3.5" /> Your cities-and-states stats map comes with the <Link href="/ramen-pass" className="underline">Ramen Pass</Link>.</p>
            )}
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

function Lists({ active }: { active: boolean }) {
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
      {!active ? (
        <p className="text-sm text-ink-mid mt-2"><Lock className="inline w-3.5 h-3.5" /> Build lists like “Tokyo-style in LA” or plan a ramen crawl with dates and notes. <Link href="/ramen-pass" className="underline">Included with the Ramen Pass</Link>.</p>
      ) : (
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
      )}
    </section>
  )
}

function Deals({ active }: { active: boolean }) {
  const [rows, setRows] = useState<Deal[] | null>(null)
  useEffect(() => {
    if (!active) return
    sb().then(c => c.rpc('member_deals')).then(({ data }) => setRows((data as Deal[]) ?? []))
  }, [active])
  return (
    <section className={box}>
      <h2 className="flex items-center gap-2 font-semibold text-ink"><Tag className="w-5 h-5 text-brand-ink" /> Member deals</h2>
      {!active ? (
        <p className="text-sm text-ink-mid mt-2"><Lock className="inline w-3.5 h-3.5" /> Owner-run shops offer perks to Ramen Pass members — a free topping, a discount, a secret bowl. <Link href="/ramen-pass" className="underline">Get the Pass</Link>.</p>
      ) : !rows ? <Loader2 className="w-4 h-4 animate-spin mt-3 text-ink-soft" /> : rows.length === 0 ? (
        <p className="text-sm text-ink-mid mt-2">No deals yet — shops are just starting to add them. Check back soon.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line/8">
          {rows.map(d => (
            <li key={d.slug} className="py-2 text-sm">
              <Link href={spotHref(d)} className="font-semibold text-ink hover:underline">{spotName(d)}</Link>
              <span className="text-ink-soft"> · {d.city}, {d.state_code}</span>
              <p className="text-ink">{d.deal}</p>
              {d.fine_print && <p className="text-xs text-ink-soft">{d.fine_print}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Settings({ active }: { active: boolean }) {
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
        <span>Send me the monthly roundup of new ramen shops near me{active ? '' : ' (a Ramen Pass perk — you’ll get it once you’re a member)'}. Unsubscribe anytime.</span>
      </label>
    </section>
  )
}
