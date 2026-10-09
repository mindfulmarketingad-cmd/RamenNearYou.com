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

type Redirect = { source: string; destination: string; permanent: true }
const r = (source: string, destination: string): Redirect => ({ source, destination, permanent: true })

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
const LEGACY_STATE_CODES = ['al', 'ca', 'ct', 'dc', 'fl', 'ga', 'il', 'in', 'ks', 'ky', 'md', 'mi', 'mn', 'nc', 'nd', 'nj', 'nv', 'ny', 'oh', 'or', 'pa', 'ri', 'sc', 'tn', 'tx', 'ut', 'va', 'vt']
const CODE_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_SLUG_TO_CODE).map(([slug, code]) => [code.toLowerCase(), slug]),
)

const redirects: Redirect[] = [
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
  // City links: /{city}/{state-slug} and /{city}/{st} → /find/{city}-{st}.
  ...Object.entries(STATE_SLUG_TO_CODE).flatMap(([slug, code]) => [
    r(`/${CITY}/${slug}`, `/find/:city-${code.toLowerCase()}`),
    r(`/${CITY}/${code.toLowerCase()}`, `/find/:city-${code.toLowerCase()}`),
  ]),
]

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

fs.writeFileSync(path.join(__dirname, '..', 'vercel.json'), JSON.stringify(config, null, 2) + '\n')
console.log(`vercel.json: ${redirects.length} redirects`)

// Optional: every retired page (lib/retired-pages.json) as a CSV for Vercel's
// project-level bulk redirects. Without it, retired URLs answer 404 and the
// 404 page forwards visitors; uploading it (`vercel redirects upload
// redirects.csv`) turns them into real 308s instead.
const retired: { redirects: Record<string, string> } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'retired-pages.json'), 'utf8'))
const csvRow = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
fs.writeFileSync(
  path.join(__dirname, '..', 'redirects.csv'),
  ['source,destination,permanent', ...Object.entries(retired.redirects).map(([from, to]) => `${csvRow(encodeURI(from))},${csvRow(to)},true`)].join('\n') + '\n',
)
console.log(`redirects.csv: ${Object.keys(retired.redirects).length} retired pages`)
