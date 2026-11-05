#!/usr/bin/env node
// Ramen Pass "new ramen near you" monthly email — DRAFTS ONLY. Nothing here
// sends email; review the drafts and send them yourself (or wire Resend up
// later, once you've approved the copy).
//
// New openings = listing_directory slugs that weren't in last month's
// snapshot (reports/pass-openings/known-slugs.json). The first run only
// records the baseline. Recipients = Ramen Pass members who are active and
// opted in (pass_settings.newsletter_opt_in). Each member gets the new shops
// in the states they've saved or checked in at (all states if none).
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/pass-monthly-openings.mjs
// Writes reports/pass-openings/<YYYY-MM>/{summary.csv,<n>.txt}. reports/ is
// git-ignored because it contains member emails.
import { createClient } from '@supabase/supabase-js'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY and re-run.'); process.exit(1) }
const db = createClient(URL, KEY, { auth: { persistSession: false } })
const SITE = 'https://www.ramennearyou.com'

async function all(table, cols, filter = q => q) {
  const out = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await filter(db.from(table).select(cols)).range(from, from + 999)
    if (error) throw new Error(`${table}: ${error.message}`)
    out.push(...data)
    if (data.length < 1000) return out
  }
}

const dir = join('reports', 'pass-openings')
mkdirSync(dir, { recursive: true })
const snapPath = join(dir, 'known-slugs.json')
const listings = await all('listing_directory', 'restaurant_slug,name,city,state_code,path')
const known = existsSync(snapPath) ? new Set(JSON.parse(readFileSync(snapPath, 'utf8'))) : null
writeFileSync(snapPath, JSON.stringify(listings.map(l => l.restaurant_slug)))
if (!known) { console.log(`Baseline saved (${listings.length} listings). Run again next month for drafts.`); process.exit(0) }

const fresh = listings.filter(l => !known.has(l.restaurant_slug))
console.log(`${fresh.length} new listings since the last snapshot.`)

const now = new Date()
const members = (await all('pass_members', 'user_id,email,status,current_period_end'))
  .filter(m => ['active', 'trialing', 'past_due'].includes(m.status) && new Date(m.current_period_end) > now)
const optIn = new Set((await all('pass_settings', 'user_id', q => q.eq('newsletter_opt_in', true))).map(s => s.user_id))
const bySlug = new Map(listings.map(l => [l.restaurant_slug, l]))
const saves = await all('pass_saves', 'user_id,restaurant_slug')
const checkins = await all('pass_checkins', 'user_id,restaurant_slug')
const states = new Map()
for (const r of [...saves, ...checkins]) {
  const st = bySlug.get(r.restaurant_slug)?.state_code
  if (!st) continue
  if (!states.has(r.user_id)) states.set(r.user_id, new Set())
  states.get(r.user_id).add(st)
}

const ym = now.toISOString().slice(0, 7)
const out = join(dir, ym)
mkdirSync(out, { recursive: true })
const rows = [['email', 'states', 'new_shops', 'draft']]
let n = 0
for (const m of members) {
  if (!optIn.has(m.user_id) || !m.email) continue
  const mine = states.get(m.user_id)
  const picks = fresh.filter(l => !mine || mine.has(l.state_code)).slice(0, 15)
  if (!picks.length) continue
  n++
  const file = `${n}.txt`
  writeFileSync(join(out, file), [
    `To: ${m.email}`,
    `Subject: New ramen near you — ${now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    '',
    'Fresh bowls just added to RamenNearYou:',
    '',
    ...picks.map(l => `• ${l.name} — ${l.city}, ${l.state_code}\n  ${SITE}${l.path ?? ''}`),
    '',
    `Your saves, passport and member deals: ${SITE}/account`,
    'You get this because you’re a Ramen Pass member and opted in. Turn it off on your account page.',
  ].join('\n'))
  rows.push([m.email, mine ? [...mine].join(' ') : 'all', String(picks.length), file])
}
writeFileSync(join(out, 'summary.csv'), rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'))
console.log(`${n} draft(s) in ${out}. Nothing was sent.`)
