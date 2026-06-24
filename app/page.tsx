import Link from 'next/link'
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

          {/* Editorial image band */}
          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="relative rounded-3xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.savvytokyo.com/app/uploads/2021/05/iStock-1007793982.jpg"
                  alt="A steaming bowl of authentic Japanese ramen with chashu, egg, and scallions"
                  className="w-full h-[280px] sm:h-[400px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent flex items-center">
                  <div className="px-6 sm:px-12 max-w-lg">
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                      Slurp your way to the perfect bowl
                    </h2>
                    <p className="text-white/85 text-sm sm:text-base mb-6 leading-relaxed">
                      From rich, porky tonkotsu to delicate shio, discover top-rated ramen near you — open now, close by, and exactly your style.
                    </p>
                    <Link
                      href="/find"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
                    >
                      Explore ramen near you →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
