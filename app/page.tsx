import Link from 'next/link'
import Navbar from '@/components/navbar'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import FeaturedListings from '@/components/featured-listings'
import ClaimedShowcase from '@/components/claimed-showcase'
import FilterShowcase from '@/components/filter-showcase'
import SearchMapShowcase from '@/components/searchmap-showcase'
import ServiceDirectory from '@/components/service-directory'
import CityStateDirectory from '@/components/city-state-directory'
import CommunityCarousel from '@/components/community-carousel'
import UgcGrid from '@/components/ugc-grid'
import HomepageReviews from '@/components/homepage-reviews'
import HomepageAbout from '@/components/homepage-about'
import HomepageFAQ from '@/components/homepage-faq'
import FindCrossLinks from '@/components/find-cross-links'
import Footer from '@/components/footer'
import AdUnitVertical from '@/components/ad-unit-vertical'
import AdUnitHorizontal from '@/components/ad-unit-horizontal'
import AdUnitInFeed from '@/components/ad-unit-infeed'

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
          <HomeMapHero introAnimation />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <ClaimedShowcase />
          <FilterShowcase />
          <SearchMapShowcase />

          {/* First in-content slot — right below the map showcase, the point
              where a homepage visitor has finished the hero and started
              scrolling. */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <AdUnitHorizontal />
          </div>

          <UgcGrid />

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

          <FeaturedListings />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <AdUnitVertical />
          </div>

          {/* Photo grid — every bowl tells a story */}
          <section className="bg-[#F5F4F0] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">Every bowl tells a story</h2>
              <p className="text-[#6B6862] text-sm mb-8">Discover the ramen style that speaks to you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/find/vegetarian-ramen" className="group relative rounded-2xl overflow-hidden block aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://assets.bonappetit.com/photos/5e3c7a3c866b940008106763/1:1/w_1920,c_limit/HLY-Veggie-Ramen-16x9.jpg"
                    alt="Vibrant vegetarian ramen with soft-boiled egg, corn, and fresh vegetables"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-white text-xs font-semibold uppercase tracking-widest opacity-75">Plant-Based</span>
                    <p className="text-white font-serif text-lg font-bold leading-tight">Vegetarian Ramen Near Me</p>
                  </div>
                </Link>

                <Link href="/find/tantanmen" className="group relative rounded-2xl overflow-hidden block aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://56d3203e.delivery.rocketcdn.me/wp-content/uploads/2025/10/Tan-Tan-Tantanmen-Ramen-Recipe-6-scaled.jpg.webp"
                    alt="Creamy tantanmen ramen with sesame broth, ground pork, and chili oil"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-white text-xs font-semibold uppercase tracking-widest opacity-75">Spicy & Nutty</span>
                    <p className="text-white font-serif text-lg font-bold leading-tight">Tantanmen Near Me</p>
                  </div>
                </Link>

                <Link href="/find/tonkotsu-ramen" className="group relative rounded-2xl overflow-hidden block aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://thewoodenskillet.com/wp-content/uploads/2021/04/pork-belly-ramen-recipe-8-640x640.jpg"
                    alt="Rich tonkotsu ramen topped with tender pork belly chashu and a soft-boiled egg"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-white text-xs font-semibold uppercase tracking-widest opacity-75">Rich & Porky</span>
                    <p className="text-white font-serif text-lg font-bold leading-tight">Tonkotsu Ramen Near Me</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <CommunityCarousel />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <AdUnitInFeed />
          </div>

          <HomepageReviews />
          <ServiceDirectory />
          <CityStateDirectory />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <AdUnitVertical />
          </div>

          <HomepageAbout />
          <HomepageFAQ />
          <FindCrossLinks />
          <Footer />
        </div>
      </main>
    </>
  )
}
