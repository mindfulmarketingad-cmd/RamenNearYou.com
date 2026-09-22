/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Don't advertise the framework to attackers.
  poweredByHeader: false,
  // Baseline security headers applied to every response. Intentionally NOT a
  // strict Content-Security-Policy — the site loads Mediavine, Stripe, Google
  // Maps tiles, Supabase, and OpenStreetMap/Nominatim, so a locked-down CSP
  // would need careful per-source allow-listing before it could ship without
  // breaking those. These headers cover the high-value, zero-risk protections
  // (clickjacking, MIME sniffing, referrer leakage, transport security).
  async headers() {
    // Target Content-Security-Policy, shipped in REPORT-ONLY mode: it blocks
    // nothing. Sources below cover the site's known third parties: Google
    // Analytics/Tag Manager, Stripe, Supabase, Crazy Egg, Mediavine (whose ads
    // still serve through the Google ad stack, so the googlesyndication /
    // doubleclick / googleadservices entries below are load-bearing), and
    // OpenStreetMap tiles.
    //
    // `report-uri` is deliberately NOT set. Report-only mode makes the browser
    // POST a report for every would-be violation on every page load, and each
    // of those is a serverless invocation plus a log line — on a site this size
    // that was the single largest source of Vercel observability events, all of
    // it re-reporting the same handful of hosts. The allow-lists below were
    // widened from those reports; to collect fresh ones, add
    // "report-uri /api/csp-report" back temporarily, read the logs, then remove
    // it again.
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
      "connect-src 'self' https://scripts.scriptwrapper.com https://*.mediavine.com https://*.crazyegg.com https://fundingchoicesmessages.google.com https://*.fundingchoicesmessages.google.com https://*.supabase.co https://nominatim.openstreetmap.org https://api.stripe.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleapis.com https://pagead2.googlesyndication.com",
      "frame-src https://*.mediavine.com https://fundingchoicesmessages.google.com https://js.stripe.com https://*.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net",
      "worker-src 'self' blob:",
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
    // The first Viator experience shipped at a flat /experiences/{slug}. That
    // shape now belongs to /experiences/{state}, so the old URL would resolve
    // to a non-existent state and 404. It's in the live sitemap, so send it to
    // the hub rather than dropping it.
    const legacyExperience = [{
      source: '/experiences/authentic-ramen-making-experience-kyoto',
      destination: '/experiences',
      permanent: true,
    }]

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

    // ads.txt is hosted by Mediavine so their partner list stays current
    // without us redeploying. The local public/ads.txt is gone — it listed the
    // old AdSense pub IDs, and leaving a stale copy in the repo is how you end
    // up serving it again by accident.
    //
    // statusCode: 301 rather than `permanent: true`, which emits a 308. The two
    // are semantically equivalent, but Mediavine asks for a 301 and the IAB
    // ads.txt crawlers that read this are old and literal-minded — no reason to
    // hand them a status code they might not follow.
    //
    // Next resolves redirects() BEFORE the public/ filesystem check, so this
    // would win even if the old file came back.
    const adsTxt = [{
      source: '/ads.txt',
      destination: 'https://adstxt.journeymv.com/sites/e55dbddf-57ec-4b5a-a0b1-35bcd3ad3e71/ads.txt',
      statusCode: 301,
    }]

    return [
      ...adsTxt,
      ...legacyExperience,
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
      // NOTE: /dashboard used to redirect to /profile (the old owner
      // dashboard). It is now the public site-analytics page, so the
      // redirect is gone — the signed-in owner view still lives at /profile
      // and /featured/dashboard.
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
