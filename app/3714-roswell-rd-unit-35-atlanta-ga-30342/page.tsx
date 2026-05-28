import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantMiniMapClient from '@/components/restaurant-mini-map-client'

const ADDRESS = '3714 Roswell Rd Unit 35, Atlanta, GA 30342'
const LAT = 33.86876
const LNG = -84.37361
const NAME = '3714 Roswell Rd Unit 35 Atlanta GA 30342'
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`

export const metadata: Metadata = {
  title: '3714 Roswell Rd Unit 35 Atlanta GA 30342 — Map & Directions',
  description:
    'Map and directions for 3714 Roswell Rd Unit 35, Atlanta, GA 30342. View the exact location on an interactive map and get driving directions.',
  alternates: { canonical: 'https://www.ramennearyou.com/3714-roswell-rd-unit-35-atlanta-ga-30342' },
  openGraph: {
    title: '3714 Roswell Rd Unit 35 Atlanta GA 30342 — Map & Directions',
    description:
      'Interactive map and directions for 3714 Roswell Rd Unit 35, Atlanta, GA 30342.',
    url: 'https://www.ramennearyou.com/3714-roswell-rd-unit-35-atlanta-ga-30342',
  },
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: NAME,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3714 Roswell Rd Unit 35',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    postalCode: '30342',
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
              3714 Roswell Rd Unit 35 Atlanta GA 30342
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
