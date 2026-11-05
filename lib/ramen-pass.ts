'use client'

// Ramen Pass (free accounts + paid membership) — browser side.
//
// The site is a static export, so this module talks to Supabase directly.
// Every rule (5-save limit, who is a member, who may see deals) is enforced
// in Postgres by RLS and SECURITY DEFINER functions
// (supabase/ramen-pass-membership.sql); this file only mirrors the state so
// the UI can react. supabase-js is loaded lazily: visitors who have never
// signed in don't download it until they click Save, Check in or Sign in.

import { useSyncExternalStore } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

import { PASS_PRICES, FREE_SAVE_LIMIT, PASS_TRIAL_DAYS, ADVANCED_FILTER_KEYS, type PassPlan } from '@/lib/ramen-pass-config'
export { PASS_PRICES, FREE_SAVE_LIMIT, PASS_TRIAL_DAYS, ADVANCED_FILTER_KEYS, PASS_LOGIN_URL } from '@/lib/ramen-pass-config'
export type { PassPlan } from '@/lib/ramen-pass-config'

export type PassInfo = {
  signed_in: boolean
  active: boolean
  status: string
  plan: PassPlan | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  has_billing: boolean
}

export type Gate = null | { kind: 'signup' | 'save-limit' | 'filter' | 'feature'; detail?: string }

type State = {
  ready: boolean
  session: Session | null
  pass: PassInfo | null
  saves: Set<string>
  gate: Gate
}

const PROJECT = 'ucqlkhhjoriakjyeogbx'
const AD_FREE_KEY = 'rny_pass_until'
const CACHE_KEY = 'rny_pass_cache'
const LEGACY_SAVES_KEY = 'rny_saved_restaurants'

let state: State = { ready: false, session: null, pass: null, saves: new Set(), gate: null }
const listeners = new Set<() => void>()
function set(patch: Partial<State>) {
  state = { ...state, ...patch }
  listeners.forEach(l => l())
}
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } }
const serverState: State = { ready: false, session: null, pass: null, saves: new Set(), gate: null }

export function usePass(): State {
  return useSyncExternalStore(subscribe, () => state, () => serverState)
}
export const passState = () => state

let sbPromise: Promise<SupabaseClient> | null = null
export function sb(): Promise<SupabaseClient> {
  if (!sbPromise) {
    sbPromise = import('@/lib/owner-portal').then(m => {
      const c = m.supabase() as unknown as SupabaseClient
      c.auth.onAuthStateChange((_e, s) => {
        const changed = (s?.user.id ?? null) !== (state.session?.user.id ?? null)
        set({ session: s })
        if (changed) void refresh(true)
      })
      return c
    })
  }
  return sbPromise
}

function hasAuthCookie() {
  try { return document.cookie.includes(`sb-${PROJECT}-auth-token`) || !!localStorage.getItem(`sb-${PROJECT}-auth-token`) } catch { return false }
}

function setAdFree(pass: PassInfo | null) {
  try {
    if (pass?.active) {
      localStorage.setItem(AD_FREE_KEY, String(Date.now() + 3 * 864e5))
      document.documentElement.classList.add('rny-pass')
    } else {
      localStorage.removeItem(AD_FREE_KEY)
      document.documentElement.classList.remove('rny-pass')
    }
  } catch { /* storage blocked */ }
}

/** Load session, membership and saves. Cheap when nobody has ever signed in. */
export async function initPass() {
  if (state.ready) return
  if (!hasAuthCookie()) { set({ ready: true }); setAdFree(null); return }
  await refresh(false)
}

let refreshing: Promise<void> | null = null
export function refresh(force = true): Promise<void> {
  if (refreshing) return refreshing
  refreshing = (async () => {
    try {
      const c = await sb()
      const { data } = await c.auth.getSession()
      const session = data.session
      if (!session) { set({ ready: true, session: null, pass: null, saves: new Set() }); setAdFree(null); return }
      let pass: PassInfo | null = null
      let saves: string[] | null = null
      if (!force) {
        try {
          const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
          if (cached && cached.uid === session.user.id && Date.now() - cached.at < 30 * 60e3) { pass = cached.pass; saves = cached.saves }
        } catch { /* ignore */ }
      }
      if (!pass || !saves) {
        const [p, s] = await Promise.all([
          c.rpc('my_pass'),
          c.from('pass_saves').select('restaurant_slug'),
        ])
        pass = (p.data as PassInfo) ?? null
        saves = ((s.data as { restaurant_slug: string }[]) ?? []).map(r => r.restaurant_slug)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ uid: session.user.id, at: Date.now(), pass, saves })) } catch { /* ignore */ }
      }
      set({ ready: true, session, pass, saves: new Set(saves) })
      setAdFree(pass)
      void migrateLegacySaves()
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

function invalidateCache() { try { sessionStorage.removeItem(CACHE_KEY) } catch { /* ignore */ } }

// Saves made before accounts existed lived only in this browser.
async function migrateLegacySaves() {
  let legacy: string[] = []
  try { legacy = JSON.parse(localStorage.getItem(LEGACY_SAVES_KEY) || '[]') } catch { return }
  if (!Array.isArray(legacy) || !legacy.length || !state.session) return
  const c = await sb()
  const room = state.pass?.active ? legacy.length : Math.max(0, FREE_SAVE_LIMIT - state.saves.size)
  const todo = legacy.filter(s => typeof s === 'string' && !state.saves.has(s)).slice(0, room)
  for (const slug of todo) {
    const { error } = await c.from('pass_saves').insert({ restaurant_slug: slug })
    if (!error) state.saves.add(slug)
  }
  try { localStorage.removeItem(LEGACY_SAVES_KEY) } catch { /* ignore */ }
  invalidateCache()
  set({ saves: new Set(state.saves) })
}

export function openGate(gate: Gate) { set({ gate }) }
export function closeGate() { set({ gate: null }) }

/** Toggle a saved spot. Opens the sign-up / upgrade card when needed. */
export async function toggleSave(slug: string): Promise<boolean> {
  await initPass()
  if (!state.session) { openGate({ kind: 'signup', detail: 'save' }); return false }
  const c = await sb()
  const saves = new Set(state.saves)
  if (saves.has(slug)) {
    saves.delete(slug); set({ saves })
    const { error } = await c.from('pass_saves').delete().eq('restaurant_slug', slug)
    if (error) { saves.add(slug); set({ saves: new Set(saves) }) }
  } else {
    if (!state.pass?.active && saves.size >= FREE_SAVE_LIMIT) { openGate({ kind: 'save-limit' }); return false }
    saves.add(slug); set({ saves })
    const { error } = await c.from('pass_saves').insert({ restaurant_slug: slug })
    if (error) {
      saves.delete(slug); set({ saves: new Set(saves) })
      if (error.message.includes('save_limit')) openGate({ kind: 'save-limit' })
      return false
    }
  }
  invalidateCache()
  return true
}

/** True when the filter is free, or the visitor has the Pass. */
export function canUseFilter(key: string): boolean {
  if (!ADVANCED_FILTER_KEYS.has(key)) return true
  if (state.pass?.active) return true
  // Members whose state hasn't loaded yet: the ad-free flag says they paid recently.
  try { if (+(localStorage.getItem(AD_FREE_KEY) || 0) > Date.now()) return true } catch { /* ignore */ }
  openGate({ kind: 'filter', detail: key })
  return false
}

export function checkoutUrl(plan: PassPlan, session: Session | null): string {
  const u = new URL(PASS_PRICES[plan].checkoutUrl)
  if (session) {
    u.searchParams.set('client_reference_id', session.user.id)
    if (session.user.email) u.searchParams.set('prefilled_email', session.user.email)
  }
  return u.toString()
}

export async function checkIn(slug: string, bowl?: string): Promise<'ok' | 'dupe' | 'signup' | 'error'> {
  await initPass()
  if (!state.session) { openGate({ kind: 'signup', detail: 'checkin' }); return 'signup' }
  const c = await sb()
  const { error } = await c.from('pass_checkins').insert({ restaurant_slug: slug, bowl: bowl || null })
  if (!error) return 'ok'
  return error.code === '23505' ? 'dupe' : 'error'
}

export async function signOut() {
  const c = await sb()
  await c.auth.signOut()
  invalidateCache()
  setAdFree(null)
  set({ session: null, pass: null, saves: new Set() })
}

export function afterCheckoutClaim(info: PassInfo) {
  invalidateCache()
  set({ pass: info })
  setAdFree(info)
}

export const PASS_ERRORS: Record<string, string> = {
  checkout_incomplete: 'Stripe hasn’t finished your checkout yet. Refresh in a minute.',
  session_not_yours: 'That checkout belongs to a different account. Sign in with the email you used at checkout.',
  bad_session: 'We couldn’t find that checkout.',
  email_not_verified: 'Please confirm your email address first.',
  pass_required: 'This needs the Ramen Pass.',
  no_billing: 'No billing account yet.',
  save_limit: `Free accounts can save ${FREE_SAVE_LIMIT} spots.`,
  stripe_not_configured: 'Payments are being set up. Try again shortly.',
  too_many: 'You’ve hit the limit for that.',
}
export function passError(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? String(e)
  for (const [k, v] of Object.entries(PASS_ERRORS)) if (msg.includes(k)) return v
  return 'Something went wrong. Please try again in a minute.'
}
