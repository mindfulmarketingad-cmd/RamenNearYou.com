import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import StatsBar from '@/components/stats-bar'
import FeaturedListings from '@/components/featured-listings'
import NearbyRestaurantsCarousel from '@/components/nearby-restaurants-carousel'
import ServiceDirectory from '@/components/service-directory'
import CityStateDirectory from '@/components/city-state-directory'
import CommunityCarousel from '@/components/community-carousel'
import HomepageReviews from '@/components/homepage-reviews'
import Footer from '@/components/footer'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RamenNearYou',
  url: 'https://www.ramennearyou.com',
  description: 'Find the best ramen restaurants near you. Browse by city, broth type, or restaurant name.',
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RamenNearYou',
  url: 'https://www.ramennearyou.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.ramennearyou.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <main className="min-h-screen bg-[#ffffff]">
        <Navbar />
        <Hero />

        {/* Everything below scrolls up over the fixed parallax hero */}
        <div className="relative z-10 bg-white shadow-[0_-24px_48px_rgba(0,0,0,0.18)]">
          {/* Wave transition at the top edge of the scrolling content */}
          <div className="absolute left-0 right-0 -top-10 sm:-top-14 z-10 leading-none pointer-events-none">
            <svg
              viewBox="0 0 1440 60"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-10 sm:h-14 block"
            >
              <path
                d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          <StatsBar />
          <NearbyRestaurantsCarousel />
        <FeaturedListings />

          <CommunityCarousel />
          <HomepageReviews />
          <ServiceDirectory />
          <CityStateDirectory />
          <Footer />
        </div>
      </main>
    </>
  )
}
