import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'

const ADDRESS = '401 S Broad St Space 4A, Alpharetta, GA 30009'
const LAT = 34.06512
const LNG = -84.29421
const NAME = '401 S Broad St Space 4A Alpharetta GA 30009'
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`

export const metadata: Metadata = {
  title: '401 S Broad St Space 4A Alpharetta GA 30009 — Map & Directions',
  description:
    'Map and directions for 401 S Broad St Space 4A, Alpharetta, GA 30009. View the exact location on an interactive map and get driving directions.',
  alternates: { canonical: 'https://www.ramennearyou.com/401-s-broad-st-space-4a-alpharetta-ga-30009' },
  openGraph: {
    title: '401 S Broad St Space 4A Alpharetta GA 30009 — Map & Directions',
    description:
      'Interactive map and directions for 401 S Broad St Space 4A, Alpharetta, GA 30009.',
    url: 'https://www.ramennearyou.com/401-s-broad-st-space-4a-alpharetta-ga-30009',
  },
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: NAME,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '401 S Broad St Space 4A',
    addressLocality: 'Alpharetta',
    addressRegion: 'GA',
    postalCode: '30009',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: LAT,
    longitude: LNG,
  },
}

export default function AddressMapPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />
      <main className="min-h-screen bg-[#ffffff]">
        <Navbar />
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
              401 S Broad St Space 4A Alpharetta GA 30009
            </h1>
            <p className="text-[#6B6862] text-sm sm:text-base mb-6">
              Map and directions for {ADDRESS}. Coordinates: {LAT.toFixed(5)}, {LNG.toFixed(5)}.
            </p>
            <RestaurantMiniMapClient
              lat={LAT}
              lng={LNG}
              name={NAME}
              address={ADDRESS}
              directionsUrl={DIRECTIONS_URL}
            />
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
