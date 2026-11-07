#!/usr/bin/env node
// Copies every listing's public facts (name, city, website, phone, hours…)
// from lib/restaurants.json into Supabase `listing_directory`, which the
// owner portal's claim_listing() uses to compare an owner's verified email
// domain with the restaurant's website — server-side, never trusting the
// browser. Runs at the end of production builds; never fails the build.
//
//   node scripts/sync-listing-directory.mjs           # only when VERCEL_ENV=production
//   node scripts/sync-listing-directory.mjs --force   # any environment
import { readFileSync } from 'node:fs'

const force = process.argv.includes('--force')
if (!force && process.env.VERCEL_ENV !== 'production') {
  console.log('sync-listing-directory: skipped (not a production build)')
  process.exit(0)
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.log('sync-listing-directory: skipped (no SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(0)
}

const data = JSON.parse(readFileSync(new globalThis.URL('../lib/restaurants.json', import.meta.url), 'utf8'))
const rows = data
  .filter(r => r.slug && r.name)
  .map(r => ({
    restaurant_slug: r.slug,
    name: r.name,
    city: r.city || null,
    state_code: r.stateCode || null,
    path: `/${r.citySlug}/${r.stateSlug}/${r.slug}`,
    website: r.website || null,
    phone: r.phone || null,
    description: r.description || null,
    hours: r.hours && typeof r.hours === 'object' ? r.hours : null,
    menu_link: r.menuLink || null,
    updated_at: new Date().toISOString(),
  }))
// A few hundred slugs are shared by several locations (chains, and some
// generic names like "asian-fusion"). Claims and owner edits are keyed by
// slug site-wide, so keep one row per slug — and when the locations don't
// share one website host, drop the website so the claim goes to manual
// review instead of auto-approving every location.
const host = u => (u || '').toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, '').split(/[/?#]/)[0].replace(/:\d+$/, '').replace(/^www\d*\./, '')
const bySlug = new Map()
for (const r of rows) {
  const prev = bySlug.get(r.restaurant_slug)
  if (!prev) { bySlug.set(r.restaurant_slug, { ...r, _hosts: new Set([host(r.website)]) }); continue }
  prev._hosts.add(host(r.website))
}
const unique = [...bySlug.values()].map(({ _hosts, ...r }) => (_hosts.size > 1 ? { ...r, website: null } : r))

let ok = 0
try {
  for (let i = 0; i < unique.length; i += 500) {
    const res = await fetch(`${URL}/rest/v1/listing_directory?on_conflict=restaurant_slug`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(unique.slice(i, i + 500)),
    })
    if (!res.ok) {
      console.log(`sync-listing-directory: stopped at row ${i}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
      process.exit(0)
    }
    ok += Math.min(500, unique.length - i)
  }
  console.log(`sync-listing-directory: upserted ${ok} listings`)
} catch (e) {
  console.log('sync-listing-directory: failed, continuing build:', e?.message ?? e)
}
