// Writes vercel.json. The site is a static export (next.config.mjs:
// output 'export'), so Next.js can't serve redirects or headers itself —
// Vercel does, from vercel.json, the way pumpkinpatchesnearme.com works.
// Vercel reads vercel.json before building, so the output is committed;
// rerun this after changing anything below:
//
//   npx tsx --tsconfig tsconfig.json scripts/generate-vercel-json.ts
import fs from 'fs'
import path from 'path'
import { CITY_GUIDE_REDIRECTS } from '../lib/city-guide-migration'
import { STATE_SLUG_TO_CODE } from '../lib/state-lookups'
import { getReviewRestaurants, getReviewSlug } from '../lib/reviews'
import { isRetiredPage } from '../lib/retired-pages'

// `permanent` defaults to true (308) in vercel.json; left out to keep the file small.
type Redirect = { source: string; destination: string; statusCode?: number }
const r = (source: string, destination: string): Redirect => ({ source, destination })

// Top-level routes whose second segment can look like a state. A two-segment
// URL whose second segment is a state (/atlanta/georgia) is a city link and
// goes to /find/{city}-{st} — unless its first segment is one of these.
const RESERVED = [
  ...fs.readdirSync(path.join(__dirname, '..', 'app'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('[') && !d.name.startsWith('('))
    .map((d) => d.name),
  '_next', 'api',
].sort()
const CITY = `:city((?!(?:${RESERVED.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})/)[^/.]+)`

// Old two-letter state slugs that once appeared in listing URLs.
// 'hi': Hawaii listings lived under /{city}/hi/{listing} until Oct 2026.
const LEGACY_STATE_CODES = ['al', 'ca', 'ct', 'dc', 'fl', 'ga', 'hi', 'il', 'in', 'ks', 'ky', 'md', 'mi', 'mn', 'nc', 'nd', 'nj', 'nv', 'ny', 'oh', 'or', 'pa', 'ri', 'sc', 'tn', 'tx', 'ut', 'va', 'vt']
const CODE_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_SLUG_TO_CODE).map(([slug, code]) => [code.toLowerCase(), slug]),
)

const redirects: Redirect[] = [
  // ads.txt lives on Journey by Mediavine's servers so it stays current with
  // their demand partners; Mediavine's recommended setup is a 301 to it (no
  // static public/ads.txt — a stale copy shows up as "Ads.txt out of date" in
  // the Journey dashboard and costs bids).
  { source: '/ads.txt', destination: 'https://adstxt.journeymv.com/sites/e55dbddf-57ec-4b5a-a0b1-35bcd3ad3e71/ads.txt', statusCode: 301 },
  // Removed sections.
  r('/experiences', '/'),
  r('/experiences/:path*', '/'),
  r('/compare', '/'),
  r('/compare/:path*', '/'),
  r('/auth/:path*', '/'),
  r('/profile', '/'),
  r('/saved', '/'),
  r('/feed', '/'),
  r('/plus', '/'),
  r('/owner', '/claim-your-listing'),
  r('/owner/:path*', '/claim-your-listing'),
  r('/claim/:path*', '/claim-your-listing'),
  r('/list', '/contact'),
  r('/admin', '/'),
  r('/admin/:path*', '/'),
  r('/review-cards', '/reviews'),
  r('/review-cards/:path*', '/reviews'),
  r('/featured/dashboard', '/featured-listing'),
  r('/searchmap', '/'),
  r('/ramen-pass', '/'),
  r('/pass', '/'),
  r('/join', '/'),
  r('/featured/apply', '/featured-listing'),
  // Broth-type service pages → their /find map pages.
  r('/tonkotsu-ramen-near-me', '/find/tonkotsu-ramen'),
  r('/spicy-ramen-near-me', '/find/spicy-ramen'),
  r('/miso-ramen-near-me', '/find/miso-ramen'),
  r('/shoyu-ramen-near-me', '/find/shoyu-ramen'),
  r('/vegan-ramen-near-me', '/find/vegan-ramen'),
  r('/vegetarian-ramen-near-me', '/find/vegetarian-ramen'),
  r('/korean-ramen-near-me', '/find/korean-ramen'),
  r('/japanese-ramen-near-me', '/find/japanese-ramen'),
  // Specific slug fixes.
  r('/sandy-springs/georgia/one-sushi-korean-japanese-caf%C3%A9', '/sandy-springs/georgia/one-sushi-korean-japanese-cafe'),
  r('/:city/:state/sushi-one-bobalicious-caf%C3%A9', '/:city/:state/sushi-one-bobalicious-cafe'),
  r('/sacramento/california/old-sacramento-waterfront', '/partners/old-sacramento-waterfront'),
  // Retired blog city guides → their /find page.
  ...Object.entries(CITY_GUIDE_REDIRECTS).map(([slug, to]) => r(`/blog/${slug}`, to)),
  // Legacy two-letter state slugs.
  ...LEGACY_STATE_CODES.flatMap((code) => [
    r(`/${code}`, `/${CODE_TO_SLUG[code]}`),
    r(`/${CITY}/${code}/:restaurant`, `/:city/${CODE_TO_SLUG[code]}/:restaurant`),
  ]),
  // Hawaii broth-city pages used the same "hi" slug.
  r('/:broth(tonkotsu|miso|spicy|vegan)/:city/hi', '/:broth/:city/hawaii'),
  // City links: /{city}/{state-slug} and /{city}/{st} → /find/{city}-{st}.
  ...Object.entries(STATE_SLUG_TO_CODE).flatMap(([slug, code]) => [
    r(`/${CITY}/${slug}`, `/find/:city-${code.toLowerCase()}`),
    r(`/${CITY}/${code.toLowerCase()}`, `/find/:city-${code.toLowerCase()}`),
  ]),
]

// Retired pages (lib/retired-pages.json) as real server-side 308s. They used
// to answer 404 (the 404 page only forwarded people, client-side), which left
// Google with ~20k 404s. vercel.json allows at most 2,048 redirects of up to
// 4,096 characters each, and the ~18k retired paths go to ~1.5k distinct
// targets, so they're packed one rule per target (split when a pattern gets
// long): `/:retired(a/b/(?:c|d)|e/f/g)` -> target. Exact paths only, so a
// built page can never be caught by one (scripts/check-static-build.mjs
// verifies that against out/ after every build). The `:retired` param name
// marks these rules for scripts/resolve-dead-links.mjs.
const MAX_SOURCE = 4000
const reEscape = (s: string) => s.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&')
const retiredMap: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'retired-pages.json'), 'utf8')).redirects
// Retired review pages are listed one by one only when they go to a live
// listing. The ~7k that go to a /find city page or a state page aren't (that
// would push vercel.json past what Vercel accepts). A catch-all after the exact rules sends every /reviews/x
// that isn't a built review page to /reviews instead (see below).
const isListingTarget = (to: string) => /^\/[^/]+\/[^/]+\/[^/]+$/.test(to) && !to.startsWith('/find/')
const byTarget = new Map<string, string[]>()
for (const [from, to] of Object.entries(retiredMap)) {
  if (from.startsWith('/reviews/') && !isListingTarget(to)) continue
  if (!byTarget.has(to)) byTarget.set(to, [])
  byTarget.get(to)!.push(encodeURI(from).slice(1))
}
const retiredRedirects: Redirect[] = []
for (const [to, paths] of [...byTarget.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  // Group leaves that share the same set of parent directories:
  // (?:dir1|dir2)/(?:leaf1|leaf2). A closed listing and its review page
  // (/{city}/{state}/x and /reviews/x) usually go to the same target, so the
  // slug is written once. Keeps vercel.json small: Vercel rejects a
  // vercel.json somewhere between ~360KB and ~690KB as "Invalid vercel.json".
  const dirsByLeaf = new Map<string, string[]>()
  for (const p of paths.sort()) {
    const i = p.lastIndexOf('/')
    const leaf = p.slice(i + 1)
    if (!dirsByLeaf.has(leaf)) dirsByLeaf.set(leaf, [])
    dirsByLeaf.get(leaf)!.push(i < 0 ? '' : p.slice(0, i))
  }
  const byDirs = new Map<string, { dirs: string[]; leaves: string[] }>()
  for (const [leaf, dirs] of dirsByLeaf) {
    const key = dirs.join('\n')
    if (!byDirs.has(key)) byDirs.set(key, { dirs, leaves: [] })
    byDirs.get(key)!.leaves.push(reEscape(leaf))
  }
  const parts: string[] = []
  for (const { dirs, leaves } of byDirs.values()) {
    const prefix = dirs.length === 1 && dirs[0] === '' ? '' : (dirs.length === 1 ? reEscape(dirs[0]) : `(?:${dirs.map(reEscape).join('|')})`) + '/'
    if (prefix.length + 40 > MAX_SOURCE) throw new Error(`retired dir group too long for one rule: ${prefix.slice(0, 80)}`)
    // A group can exceed the limit on its own; split its leaves.
    let cur: string[] = []
    const flush = () => { if (cur.length) parts.push(prefix + (cur.length === 1 ? cur[0] : `(?:${cur.join('|')})`)); cur = [] }
    for (const leaf of leaves) {
      if (cur.length && prefix.length + cur.join('|').length + leaf.length + 20 > MAX_SOURCE) flush()
      cur.push(leaf)
    }
    flush()
  }
  let group: string[] = []
  const emit = () => { if (group.length) retiredRedirects.push(r(`/:retired(${group.join('|')})`, to)); group = [] }
  for (const part of parts) {
    if (group.length && group.join('|').length + part.length + 20 > MAX_SOURCE) emit()
    group.push(part)
  }
  emit()
}
// The /reviews catch-all: anything under /reviews/ that isn't a built review
// page. Live review slugs are excluded with a negative lookahead, split by
// first character so each source stays under 4,096 characters.
const liveReviews = [...new Set(getReviewRestaurants().map(getReviewSlug))]
  .filter((slug) => !isRetiredPage(`/reviews/${slug}`))
  .map((slug) => reEscape(encodeURI(slug)))
  .sort()
const firsts = [...new Set('0123456789abcdefghijklmnopqrstuvwxyz'.split('').concat(liveReviews.map((s) => s[0])))].sort()
let chunk: string[] = []
let chunkSlugs: string[] = []
const emitReviews = (rest: boolean) => {
  // rest: also match slugs that start with anything not in a previous chunk.
  const cls = chunk.map(reEscape).join('')
  const look = chunkSlugs.length ? `(?!(?:${chunkSlugs.join('|')})$)` : ''
  retiredRedirects.push(r(`/reviews/:retired(${rest ? `(?![${firstsDone.map(reEscape).join('')}])` : `(?=[${cls}])`}${look}[^/]+)`, '/reviews'))
  firstsDone.push(...chunk)
  chunk = []
  chunkSlugs = []
}
const firstsDone: string[] = []
for (const f of firsts) {
  const slugs = liveReviews.filter((s) => s[0] === f)
  if (chunk.length && chunkSlugs.join('|').length + slugs.join('|').length + 60 > MAX_SOURCE) emitReviews(false)
  chunk.push(f)
  chunkSlugs.push(...slugs)
}
if (chunk.length) emitReviews(false)
// Slugs starting with any other character (none are built).
chunk = []
emitReviews(true)
redirects.push(...retiredRedirects)
if (redirects.length > 2000) throw new Error(`vercel.json: ${redirects.length} redirects; Vercel allows 2,048 routes per deployment. Move the overflow to bulk redirects (redirects.csv).`)
for (const x of redirects) if (x.source.length > 4096) throw new Error(`redirect source over 4,096 chars: ${x.source.slice(0, 80)}`)

// Baseline security headers (moved from next.config.mjs). Intentionally NOT a
// strict Content-Security-Policy: it ships report-only, with no report-uri.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://scripts.scriptwrapper.com https://*.mediavine.com https://script.crazyegg.com https://*.crazyegg.com https://fundingchoicesmessages.google.com https://*.fundingchoicesmessages.google.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://js.stripe.com https://www.google.com https://adservice.google.com https://*.googleadservices.com https://tpc.googlesyndication.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://scripts.scriptwrapper.com https://*.mediavine.com https://*.crazyegg.com https://fundingchoicesmessages.google.com https://*.fundingchoicesmessages.google.com https://*.supabase.co https://api.stripe.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleapis.com https://pagead2.googlesyndication.com https://api.zippopotam.us",
  "frame-src https://fundingchoicesmessages.google.com https://js.stripe.com https://*.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net",
  "worker-src 'self' blob:",
].join('; ')

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: null,
  buildCommand: 'npm run build',
  outputDirectory: 'out',
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy-Report-Only', value: csp },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), geolocation=(self), browsing-topics=()' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
    {
      source: '/data/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
    },
  ],
  redirects,
}

// Minified: Vercel rejects an oversized vercel.json ("Invalid vercel.json file
// provided", no build log). A 362KB file deployed; a 688KB one didn't.
const json = JSON.stringify(config) + '\n'
const MAX_BYTES = 450_000
if (json.length > MAX_BYTES) throw new Error(`vercel.json is ${json.length} bytes; keep it under ${MAX_BYTES} (Vercel rejects large files). Retire fewer paths or move them to bulk redirects (redirects.csv).`)
fs.writeFileSync(path.join(__dirname, '..', 'vercel.json'), json)
console.log(`vercel.json: ${json.length} bytes, ${redirects.length} redirects (${retiredRedirects.length} for ${Object.keys(retiredMap).length} retired pages)`)

// Every retired page as a CSV in Vercel's bulk-redirect format. Not wired in
// (vercel.json already 308s every retired page and bulk redirects past the
// 1,000 included with Pro are a paid add-on); kept as a ready fallback if the
// retired list ever outgrows vercel.json's 2,048-rule limit: set
// `bulkRedirectsPath: "redirects.csv"` in the config above.
const retired: { redirects: Record<string, string> } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'retired-pages.json'), 'utf8'))
const csvRow = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
fs.writeFileSync(
  path.join(__dirname, '..', 'redirects.csv'),
  ['source,destination,permanent', ...Object.entries(retired.redirects).map(([from, to]) => `${csvRow(encodeURI(from))},${csvRow(to)},true`)].join('\n') + '\n',
)
console.log(`redirects.csv: ${Object.keys(retired.redirects).length} retired pages`)
