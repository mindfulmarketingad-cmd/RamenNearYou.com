/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/sandy-springs/ga/one-sushi-korean-japanese-caf%C3%A9',
        destination: '/sandy-springs/ga/one-sushi-korean-japanese-cafe',
        permanent: true,
      },
      {
        source: '/:city/:state/sushi-one-bobalicious-caf%C3%A9',
        destination: '/:city/:state/sushi-one-bobalicious-cafe',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com' },
      { protocol: 'https', hostname: 'streetviewpixels-pa.googleapis.com' },
    ],
  },
}

export default nextConfig
