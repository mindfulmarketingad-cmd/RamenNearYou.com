/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
