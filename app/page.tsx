import Link from 'next/link'
import Navbar from '@/components/navbar'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
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
        <ErrorBoundary
          fallback={
            <section className="pt-16 bg-[#F5F4F0]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">Find Ramen Near You</h1>
                <p className="text-[#6B6862] text-sm mt-2 mb-5">The map is taking a break — browse ramen by city instead.</p>
                <Link href="/cities" className="inline-block px-5 py-2.5 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors">
                  Browse Cities
                </Link>
              </div>
            </section>
          }
        >
          <HomeMapHero />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
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
