import Navbar from '@/components/navbar'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import StatsBar from '@/components/stats-bar'
import FeaturedListings from '@/components/featured-listings'
import FilterShowcase from '@/components/filter-showcase'
import NearbyRestaurantsCarousel from '@/components/nearby-restaurants-carousel'
import ServiceDirectory from '@/components/service-directory'
import CityStateDirectory from '@/components/city-state-directory'
import CommunityCarousel from '@/components/community-carousel'
import HomepageReviews from '@/components/homepage-reviews'
import HomepageFAQ from '@/components/homepage-faq'
import FindCrossLinks from '@/components/find-cross-links'
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
              <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#B57F50] border-t-transparent animate-spin" />
              </div>
            </section>
          }
        >
          <HomeMapHero />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <StatsBar />
          <FilterShowcase />
          <NearbyRestaurantsCarousel />
          <FeaturedListings />

          <CommunityCarousel />
          <HomepageReviews />
          <ServiceDirectory />
          <CityStateDirectory />
          <HomepageFAQ />
          <FindCrossLinks />
          <Footer />
        </div>
      </main>
    </>
  )
}
