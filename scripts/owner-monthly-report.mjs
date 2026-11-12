#!/usr/bin/env node
// Monthly owner report — DRAFTS ONLY. Nothing here sends email.
//
// For every approved claim (and every paid listing in lib/paid-listings.ts)
// it counts last month's listing views and clicks from the site's analytics
// table (ramennearyou_dashboard — the table the live tracker writes to; the
// older listing_analytics table is legacy and not used) and writes:
//   reports/owner-reports/<YYYY-MM>/summary.csv      one row per listing
//   reports/owner-reports/<YYYY-MM>/<slug>.txt       a draft email to review
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/owner-monthly-report.mjs [YYYY-MM]
// Month defaults to the previous calendar month (UTC). The service-role key
// is needed to read the claims table (owner names / emails); reports/ is
// git-ignored because it contains owner contact details.
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY (Supabase → Project settings → API) and re-run.')
  process.exit(1)
}
const db = createClient(URL, KEY, { auth: { persistSession: false } })

// ── Month window ─────────────────────────────────────────────────────────────
const arg = process.argv[2]
let year, month // month is 1-12
if (arg && /^\d{4}-\d{2}$/.test(arg)) {
  ;[year, month] = arg.split('-').map(Number)
} else {
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  year = d.getUTCFullYear(); month = d.getUTCMonth() + 1
}
const ym = `${year}-${String(month).padStart(2, '0')}`
const start = new Date(Date.UTC(year, month - 1, 1)).toISOString()
const end = new Date(Date.UTC(year, month, 1)).toISOString()
const monthLabel = new Date(start).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

// ── Paid tiers from the repo data file (no TS import needed) ────────────────
const paidSrc = readFileSync(new URL('../lib/paid-listings.ts', import.meta.url), 'utf8')
const paidBlock = paidSrc.slice(paidSrc.indexOf('export const PAID_LISTINGS'), paidSrc.indexOf('\n]', paidSrc.indexOf('export const PAID_LISTINGS')))
const paid = new Map()
for (const m of paidBlock.replace(/\/\/.*$/gm, '').matchAll(/slug:\s*'([^']+)'[^}]*?tier:\s*'(featured|premium)'/g)) paid.set(m[1], m[2])

// ── Listings to report on ───────────────────────────────────────────────────
const { data: claims, error: claimErr } = await db
  .from('claims')
  .select('restaurant_slug, restaurant_name, contact_email, status')
  .eq('status', 'approved')
if (claimErr) { console.error('claims query failed:', claimErr.message); process.exit(1) }

const listings = new Map()
for (const c of claims ?? []) {
  if (!c.restaurant_slug) continue
  listings.set(c.restaurant_slug, { slug: c.restaurant_slug, name: c.restaurant_name ?? c.restaurant_slug, email: c.contact_email ?? '' })
}
for (const slug of paid.keys()) if (!listings.has(slug)) listings.set(slug, { slug, name: slug, email: '' })
if (listings.size === 0) { console.log('No approved claims or paid listings — nothing to report.'); process.exit(0) }

// ── Events (paged; Supabase caps a response at 1,000 rows) ───────────────────
const EVENTS = ['listing_view', 'call_click', 'directions_click', 'review_click']
const counts = new Map([...listings.keys()].map(s => [s, Object.fromEntries(EVENTS.map(e => [e, 0]))]))
const slugs = [...listings.keys()]
for (let i = 0; i < slugs.length; i += 100) {
  const chunk = slugs.slice(i, i + 100)
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from('ramennearyou_dashboard')
      .select('listing_slug, event_type')
      .in('listing_slug', chunk)
      .in('event_type', EVENTS)
      .gte('created_at', start)
      .lt('created_at', end)
      .range(from, from + 999)
    if (error) { console.error('analytics query failed:', error.message); process.exit(1) }
    for (const row of data) counts.get(row.listing_slug)[row.event_type]++
    if (data.length < 1000) break
  }
}

// ── Write drafts ─────────────────────────────────────────────────────────────
const outDir = join('reports', 'owner-reports', ym)
mkdirSync(outDir, { recursive: true })
const csv = [['slug', 'restaurant', 'owner_email', 'tier', 'month', 'listing_views', 'call_clicks', 'directions_clicks', 'review_clicks', 'total_clicks']]
const esc = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))

for (const l of listings.values()) {
  const c = counts.get(l.slug)
  const clicks = c.call_click + c.directions_click + c.review_click
  const tier = paid.get(l.slug) ?? 'claimed'
  csv.push([l.slug, l.name, l.email, tier, ym, c.listing_view, c.call_click, c.directions_click, c.review_click, clicks])
  const upsell = tier === 'claimed'
    ? `\nWant more of these? Featured ($29/month) puts ${l.name} first on your city page with a gold pin on our maps:\nhttps://www.ramennearyou.com/featured-listing?restaurant=${l.slug}\n`
    : ''
  writeFileSync(join(outDir, `${l.slug}.txt`), `DRAFT — review before sending. Not sent.
To: ${l.email || '(no email on the claim)'}
Subject: ${l.name} on RamenNearYou — ${monthLabel}

Hi,

Here's how ${l.name} did on RamenNearYou in ${monthLabel}:

  Listing page views:     ${c.listing_view}
  Call taps:              ${c.call_click}
  Directions taps:        ${c.directions_click}
  Review link taps:       ${c.review_click}

Your listing: https://www.ramennearyou.com/ (search "${l.name}")
${upsell}
Need to update hours, photos or your menu? Just reply to this email.

— RamenNearYou
`)
}
writeFileSync(join(outDir, 'summary.csv'), csv.map(r => r.map(esc).join(',')).join('\n') + '\n')
console.log(`Wrote ${listings.size} draft(s) and summary.csv to ${outDir}. Nothing was sent.`)
