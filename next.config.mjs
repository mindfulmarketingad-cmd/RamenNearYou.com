/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Don't advertise the framework to attackers.
  poweredByHeader: false,
  // Baseline security headers applied to every response. Intentionally NOT a
  // strict Content-Security-Policy — the site loads AdSense, Stripe, Google
  // Maps tiles, Supabase, and OpenStreetMap/Nominatim, so a locked-down CSP
  // would need careful per-source allow-listing before it could ship without
  // breaking those. These headers cover the high-value, zero-risk protections
  // (clickjacking, MIME sniffing, referrer leakage, transport security).
  async headers() {
    // Target Content-Security-Policy, shipped in REPORT-ONLY mode: it blocks
    // nothing, but browsers POST a report to /api/csp-report for anything it
    // *would* block. Watch those reports (function logs), widen the allow-lists
    // until they go quiet, then switch the header key to 'Content-Security-Policy'
    // to enforce. Sources below cover the site's known third parties: Google
    // AdSense/Analytics/Tag Manager, Stripe, Supabase, and OpenStreetMap tiles.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://js.stripe.com https://www.google.com https://adservice.google.com https://*.googleadservices.com https://tpc.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://nominatim.openstreetmap.org https://api.stripe.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleapis.com https://pagead2.googlesyndication.com",
      "frame-src https://js.stripe.com https://*.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net",
      "worker-src 'self' blob:",
      "report-uri /api/csp-report",
    ].join('; ')

    const securityHeaders = [
      { key: 'Content-Security-Policy-Report-Only', value: csp },
      // Force HTTPS for two years (Vercel serves this site over HTTPS only).
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      // Stop browsers from MIME-sniffing responses into a different type.
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Clickjacking protection — our pages can't be framed by other origins.
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Don't leak full URLs (which can carry query params) to other origins.
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Only our own origin may use geolocation (the search map); deny the
      // rest and opt out of FLoC/Topics.
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), geolocation=(self), browsing-topics=()' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ]
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // Old 2-letter state code → full state name slug
    const stateMap = {
      al: 'alabama',
      ca: 'california',
      ct: 'connecticut',
      dc: 'district-of-columbia',
      fl: 'florida',
      ga: 'georgia',
      il: 'illinois',
      'in': 'indiana',
      ks: 'kansas',
      ky: 'kentucky',
      md: 'maryland',
      mi: 'michigan',
      mn: 'minnesota',
      nc: 'north-carolina',
      nd: 'north-dakota',
      nj: 'new-jersey',
      nv: 'nevada',
      ny: 'new-york',
      oh: 'ohio',
      or: 'oregon',
      pa: 'pennsylvania',
      ri: 'rhode-island',
      sc: 'south-carolina',
      tn: 'tennessee',
      tx: 'texas',
      ut: 'utah',
      va: 'virginia',
      vt: 'vermont',
    }

    const stateRedirects = Object.entries(stateMap).flatMap(([code, full]) => [
      // /ga → /georgia
      { source: `/${code}`, destination: `/${full}`, permanent: true },
      // /:city/ga → /:city/georgia
      { source: `/:city/${code}`, destination: `/:city/${full}`, permanent: true },
      // /:city/ga/:restaurant → /:city/georgia/:restaurant
      { source: `/:city/${code}/:restaurant`, destination: `/:city/${full}/:restaurant`, permanent: true },
    ])

    return [
      // Broth-type service pages → /find searchmap equivalents
      { source: '/tonkotsu-ramen-near-me', destination: '/find/tonkotsu-ramen', permanent: true },
      { source: '/spicy-ramen-near-me', destination: '/find/spicy-ramen', permanent: true },
      { source: '/miso-ramen-near-me', destination: '/find/miso-ramen', permanent: true },
      { source: '/shoyu-ramen-near-me', destination: '/find/shoyu-ramen', permanent: true },
      { source: '/vegan-ramen-near-me', destination: '/find/vegan-ramen', permanent: true },
      { source: '/vegetarian-ramen-near-me', destination: '/find/vegetarian-ramen', permanent: true },
      { source: '/korean-ramen-near-me', destination: '/find/korean-ramen', permanent: true },
      { source: '/japanese-ramen-near-me', destination: '/find/japanese-ramen', permanent: true },
      // Renamed pages
      { source: '/featured/apply', destination: '/featured-listing', permanent: true },
      // Removed sections — fold back into the homepage map
      { source: '/searchmap', destination: '/', permanent: true },
      { source: '/ramen-pass', destination: '/', permanent: true },
      { source: '/pass', destination: '/', permanent: true },
      { source: '/join', destination: '/', permanent: true },
      { source: '/dashboard', destination: '/profile', permanent: true },
      // Specific slug fixes
      {
        source: '/sandy-springs/georgia/one-sushi-korean-japanese-caf%C3%A9',
        destination: '/sandy-springs/georgia/one-sushi-korean-japanese-cafe',
        permanent: true,
      },
      {
        source: '/:city/:state/sushi-one-bobalicious-caf%C3%A9',
        destination: '/:city/:state/sushi-one-bobalicious-cafe',
        permanent: true,
      },
      // Non-restaurant DB rows pulled out of the ramen dataset (landmarks,
      // malls, etc. mismatched into it by the original scrape) — redirected
      // to their new home at /partners/{slug}. See lib/misc-partners.ts.
      {
        source: '/sacramento/california/old-sacramento-waterfront',
        destination: '/partners/old-sacramento-waterfront',
        permanent: true,
      },
      ...stateRedirects,
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'streetviewpixels-pa.googleapis.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
    ],
  },
}

export default nextConfig
