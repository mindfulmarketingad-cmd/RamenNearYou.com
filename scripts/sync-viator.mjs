#!/usr/bin/env node
/**
 * Pulls ramen experiences from the Viator Partner API into
 * lib/viator-experiences.json, grouped by US state.
 *
 *   VIATOR_API_KEY=... node scripts/sync-viator.mjs
 *   VIATOR_API_KEY=... node scripts/sync-viator.mjs --query "ramen" --dry-run
 *
 * The site never calls Viator at request time — it renders from the JSON this
 * writes. So this is the only place the key is needed, which is why it lives
 * in GitHub Actions secrets rather than in Vercel.
 *
 * How states are resolved: /destinations returns a flat list where every entry
 * carries a `lookupId` — a dot-separated ancestry path like "8.77.5.674". A
 * product reports the destinations it belongs to (usually a city), and we walk
 * that city's ancestry upward until we hit an entry the US state list knows
 * about. That's more reliable than matching city names, which are ambiguous
 * (Portland, Springfield, Columbus…).
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'lib/viator-experiences.json')

const VIATOR_BASE = 'https://api.viator.com/partner'
const AFFILIATE_PARAMS = { pid: 'P00320180', mcid: '42383', medium: 'link' }

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}
const QUERY = flag('query', 'ramen')
const PER_STATE = Number(flag('per-state', '30'))
const DRY_RUN = args.includes('--dry-run')

const API_KEY = process.env.VIATOR_API_KEY
if (!API_KEY) {
  console.error('VIATOR_API_KEY is not set.\n' +
    '  Local:  VIATOR_API_KEY=xxxx node scripts/sync-viator.mjs\n' +
    '  CI:     add it under repo Settings → Secrets → Actions')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Two-letter state codes, mirroring lib/state-lookups.ts
// ---------------------------------------------------------------------------
const STATE_NAME_TO_CODE = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI',
  Wyoming: 'WY', 'District of Columbia': 'DC',
  // Viator sometimes labels these differently.
  'Washington DC': 'DC', 'New York State': 'NY',
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
async function api(path, { method = 'GET', body } = {}) {
  const retries = 4
  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${VIATOR_BASE}${path}`, {
        method,
        headers: {
          'exp-api-key': API_KEY,
          Accept: 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          ...(body ? { 'Content-Type': 'application/json;version=2.0' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      if (res.ok) return res.json()
      const text = await res.text().catch(() => '')
      if (res.status !== 429 && res.status < 500) {
        throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`)
      }
      lastErr = new Error(`${method} ${path} → ${res.status}`)
    } catch (e) {
      if (String(e.message).match(/→ 4\d\d/) && !String(e.message).includes('429')) throw e
      lastErr = e
    }
    if (attempt < retries) {
      const wait = Math.min(2 ** attempt * 1000, 16_000)
      console.warn(`  retrying in ${wait}ms (${lastErr?.message ?? 'error'})`)
      await new Promise((r) => setTimeout(r, wait))
    }
  }
  throw lastErr
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------------------
// Helpers (mirrors of lib/viator.ts, duplicated so this runs as plain node)
// ---------------------------------------------------------------------------
function slugify(input) {
  return String(input)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 80).replace(/-+$/, '')
}

function pickImage(images, maxWidth = 900) {
  if (!images?.length) return null
  const img = images.find((i) => i.isCover) ?? images[0]
  const variants = (img.variants ?? []).filter((v) => v?.url)
  if (!variants.length) return img.imageSource ?? null
  const under = variants.filter((v) => v.width <= maxWidth).sort((a, b) => b.width - a.width)
  return under.length ? under[0].url : [...variants].sort((a, b) => a.width - b.width)[0].url
}

function galleryImages(images, limit = 6) {
  const out = []
  for (const img of images ?? []) {
    const url = pickImage([img], 1200)
    if (url && !out.includes(url)) out.push(url)
    if (out.length >= limit) break
  }
  return out
}

function affiliateUrl(productUrl) {
  try {
    const u = new URL(productUrl)
    for (const [k, v] of Object.entries(AFFILIATE_PARAMS)) u.searchParams.set(k, v)
    return u.toString()
  } catch { return productUrl }
}

function durationOf(d) {
  if (!d) return null
  if (d.fixedDurationInMinutes) return d.fixedDurationInMinutes
  if (d.variableDurationFromMinutes) return d.variableDurationFromMinutes
  return null
}

// ---------------------------------------------------------------------------
// 1. Destinations → US state index
// ---------------------------------------------------------------------------
async function buildStateIndex() {
  console.log('Fetching destinations…')
  const { destinations = [] } = await api('/destinations')
  console.log(`  ${destinations.length} destinations`)

  const byId = new Map(destinations.map((d) => [String(d.destinationId), d]))

  // Destinations whose name matches a US state. Type varies ("STATE" in most
  // cases, occasionally "REGION"), so match on name and confirm via ancestry
  // rather than trusting `type`.
  const stateIdToCode = new Map()
  for (const d of destinations) {
    const code = STATE_NAME_TO_CODE[d.name]
    if (!code) continue
    // Guard against same-named places abroad (e.g. Georgia the country):
    // a real US state sits below the United States in the lookup path.
    const ancestry = (d.lookupId ?? '').split('.')
    const isUnderUS = ancestry.some((id) => byId.get(id)?.name === 'United States')
    if (!isUnderUS && d.type === 'COUNTRY') continue
    if (!stateIdToCode.has(String(d.destinationId))) {
      stateIdToCode.set(String(d.destinationId), code)
    }
  }
  console.log(`  ${stateIdToCode.size} US state destinations matched`)

  /** Walk a destination's ancestry until we find a state. */
  function stateCodeFor(destId) {
    const id = String(destId)
    if (stateIdToCode.has(id)) return stateIdToCode.get(id)
    const d = byId.get(id)
    if (!d?.lookupId) return null
    // lookupId is root-first, so scan from the deepest ancestor upward.
    const parts = d.lookupId.split('.').reverse()
    for (const p of parts) {
      if (stateIdToCode.has(p)) return stateIdToCode.get(p)
    }
    return null
  }

  return { byId, stateIdToCode, stateCodeFor }
}

// ---------------------------------------------------------------------------
// 2. Search each state for the query term
// ---------------------------------------------------------------------------
async function searchState(destinationId, count) {
  const body = {
    searchTerm: QUERY,
    searchTypes: [{ searchType: 'PRODUCTS', pagination: { start: 1, count } }],
    currency: 'USD',
    productFiltering: { destination: String(destinationId) },
  }
  const json = await api('/search/freetext', { method: 'POST', body })
  return json?.products?.results ?? []
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const { byId, stateIdToCode, stateCodeFor } = await buildStateIndex()

  const seen = new Map() // productCode → experience
  const states = [...stateIdToCode.entries()]

  console.log(`\nSearching "${QUERY}" across ${states.length} states…`)
  for (const [destId, code] of states) {
    const name = byId.get(destId)?.name ?? code
    let results = []
    try {
      results = await searchState(destId, PER_STATE)
    } catch (e) {
      console.warn(`  ${code} ${name}: FAILED — ${e.message}`)
      continue
    }

    let added = 0
    for (const p of results) {
      if (!p?.productCode || !p?.title) continue
      if (seen.has(p.productCode)) continue

      // A product can list several destinations; prefer the primary one, and
      // fall back to whichever first resolves to a state.
      const refs = (p.destinations ?? []).map((d) => String(d.ref))
      const primary = (p.destinations ?? []).find((d) => d.primary)
      const resolved =
        (primary && stateCodeFor(primary.ref)) ||
        refs.map(stateCodeFor).find(Boolean) ||
        code

      const cityRef = primary?.ref ?? refs[0]
      const cityName = cityRef ? (byId.get(String(cityRef))?.name ?? null) : null

      seen.set(p.productCode, {
        slug: `${slugify(p.title)}-${p.productCode.toLowerCase()}`,
        productCode: p.productCode,
        title: p.title,
        description: (p.description ?? '').trim(),
        stateCode: resolved,
        cityName,
        priceFrom: p.pricing?.summary?.fromPrice ?? null,
        currency: p.pricing?.currency ?? 'USD',
        rating: p.reviews?.combinedAverageRating ?? null,
        reviewCount: p.reviews?.totalReviews ?? 0,
        durationMinutes: durationOf(p.duration),
        image: pickImage(p.images),
        gallery: galleryImages(p.images),
        affiliateUrl: affiliateUrl(p.productUrl ?? `https://www.viator.com/tours/${p.productCode}`),
        flags: p.flags ?? [],
      })
      added++
    }
    if (added) console.log(`  ${code} ${name}: +${added}`)

    // Be polite: the affiliate tier is rate limited and a 429 storm just
    // makes the whole sync slower.
    await sleep(350)
  }

  const experiences = [...seen.values()].sort(
    (a, b) =>
      a.stateCode.localeCompare(b.stateCode) ||
      (b.rating ?? 0) - (a.rating ?? 0) ||
      (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
      a.title.localeCompare(b.title)
  )

  const withImages = experiences.filter((e) => e.image).length
  const byStateCount = experiences.reduce((m, e) => m.set(e.stateCode, (m.get(e.stateCode) ?? 0) + 1), new Map())

  console.log(`\n${experiences.length} unique experiences across ${byStateCount.size} states`)
  console.log(`${withImages}/${experiences.length} have a Viator image`)

  if (DRY_RUN) {
    console.log('\n--dry-run: not writing. Sample:')
    console.log(JSON.stringify(experiences.slice(0, 2), null, 2))
    return
  }

  // Refuse to overwrite a populated snapshot with nothing — a transient API
  // failure shouldn't empty the whole section on the next deploy.
  if (experiences.length === 0) {
    let existing = 0
    try { existing = JSON.parse(readFileSync(OUT, 'utf8')).experiences?.length ?? 0 } catch {}
    if (existing > 0) {
      console.error(`\nRefusing to write 0 experiences over an existing ${existing}. ` +
        'Investigate the API response before re-running.')
      process.exit(1)
    }
  }

  writeFileSync(OUT, JSON.stringify({
    syncedAt: new Date().toISOString(),
    query: QUERY,
    experiences,
  }, null, 2) + '\n')
  console.log(`\nWrote ${OUT}`)
}

main().catch((e) => {
  console.error('\nSync failed:', e.message)
  process.exit(1)
})
