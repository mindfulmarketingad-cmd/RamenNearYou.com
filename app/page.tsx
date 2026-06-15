import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import StatsBar from '@/components/stats-bar'
import FeaturedListings from '@/components/featured-listings'
import BrothLinks from '@/components/broth-links'
import NearbyRestaurantsCarousel from '@/components/nearby-restaurants-carousel'
import ServiceDirectory from '@/components/service-directory'
import CityStateDirectory from '@/components/city-state-directory'
import CommunityCarousel from '@/components/community-carousel'
import HomepageReviews from '@/components/homepage-reviews'
import Footer from '@/components/footer'
import { getSiteStats } from '@/lib/restaurants'

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
  const { restaurants, cities, states } = getSiteStats()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <main className="min-h-screen bg-[#ffffff]">
        <Navbar />
        <Hero restaurantCount={restaurants} cityCount={cities} stateCount={states} />
        <StatsBar />

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

          <NearbyRestaurantsCarousel />
        <FeaturedListings />

        <div className="broth-stack">
          <BrothLinks
            links={[
              {
                href: '/tonkotsu-ramen-near-me',
                title: 'Tonkotsu Ramen Near Me',
                description: 'Discover rich, creamy tonkotsu ramen near you. Slow-simmered pork bone broth with deep umami flavor — the most indulgent and iconic bowl in Japanese ramen.',
              },
              {
                href: '/spicy-ramen-near-me',
                title: 'Spicy Ramen Near Me',
                description: 'Craving heat? These top-rated ramen restaurants near you serve bold, spicy broths — from tantanmen and chili oil to volcano ramen with tongue-tingling fire.',
              },
              {
                href: '/miso-ramen-near-me',
                title: 'Miso Ramen Near Me',
                description: 'Find rich, fermented miso ramen near you. Hokkaido-style miso broth with corn, butter, and thick noodles — one of the most warming bowls in Japanese cuisine.',
              },
              {
                href: '/shoyu-ramen-near-me',
                title: 'Shoyu Ramen Near Me',
                description: 'Discover classic shoyu ramen near you. The original Tokyo-style soy sauce broth — clear, savory, and balanced. The perfect entry point into great ramen.',
              },
              {
                href: '/vegan-ramen-near-me',
                title: 'Vegan Ramen Near Me',
                description: "Find delicious vegan ramen near you. Plant-based broths with rich umami depth — from mushroom dashi to creamy sesame — proving ramen doesn't need meat to be extraordinary.",
              },
              {
                href: '/vegetarian-ramen-near-me',
                title: 'Vegetarian Ramen Near Me',
                description: 'Discover vegetarian ramen near you. Hearty vegetable broths, miso-based soups, and egg-topped bowls — satisfying ramen options for plant-forward diners.',
              },
              {
                href: '/korean-ramen-near-me',
                title: 'Korean Ramen Near Me',
                description: 'Find Korean-style ramen near you. Explore bold, spicy ramyeon-inspired bowls, kimchi broths, and Korean-Japanese fusion spots serving unforgettable noodle dishes.',
              },
              {
                href: '/japanese-ramen-near-me',
                title: 'Japanese Ramen Near Me',
                description: 'Discover authentic Japanese ramen near you. From traditional Tokyo shoyu to Sapporo miso and Hakata tonkotsu — real Japanese ramen crafted with generations of technique.',
              },
            ]}
          />
        </div>

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
