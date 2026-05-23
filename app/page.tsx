import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import FeaturedListings from '@/components/featured-listings'
import BrowseBroth from '@/components/browse-broth'
import BrothNearMeCarousel from '@/components/broth-near-me-carousel'
import NearbyRestaurantsCarousel from '@/components/nearby-restaurants-carousel'
import LeadGenBanner from '@/components/lead-gen-banner'
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
        <NearbyRestaurantsCarousel />
        <FeaturedListings />
        <BrowseBroth />

        <BrothNearMeCarousel
          brothType="Tonkotsu"
          title="Tonkotsu Ramen Near Me"
          description="Discover rich, creamy tonkotsu ramen near you. Slow-simmered pork bone broth with deep umami flavor — the most indulgent and iconic bowl in Japanese ramen."
          href="/tonkotsu-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Spicy"
          title="Spicy Ramen Near Me"
          description="Craving heat? These top-rated ramen restaurants near you serve bold, spicy broths — from tantanmen and chili oil to volcano ramen with tongue-tingling fire."
          href="/spicy-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Miso"
          title="Miso Ramen Near Me"
          description="Find rich, fermented miso ramen near you. Hokkaido-style miso broth with corn, butter, and thick noodles — one of the most warming bowls in Japanese cuisine."
          href="/miso-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Shoyu"
          title="Shoyu Ramen Near Me"
          description="Discover classic shoyu ramen near you. The original Tokyo-style soy sauce broth — clear, savory, and balanced. The perfect entry point into great ramen."
          href="/shoyu-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Vegan"
          title="Vegan Ramen Near Me"
          description="Find delicious vegan ramen near you. Plant-based broths with rich umami depth — from mushroom dashi to creamy sesame — proving ramen doesn't need meat to be extraordinary."
          href="/vegan-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Vegetarian"
          title="Vegetarian Ramen Near Me"
          description="Discover vegetarian ramen near you. Hearty vegetable broths, miso-based soups, and egg-topped bowls — satisfying ramen options for plant-forward diners."
          href="/vegetarian-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Korean"
          title="Korean Ramen Near Me"
          description="Find Korean-style ramen near you. Explore bold, spicy ramyeon-inspired bowls, kimchi broths, and Korean-Japanese fusion spots serving unforgettable noodle dishes."
          href="/korean-ramen-near-me"
        />

        <BrothNearMeCarousel
          brothType="Japanese"
          title="Japanese Ramen Near Me"
          description="Discover authentic Japanese ramen near you. From traditional Tokyo shoyu to Sapporo miso and Hakata tonkotsu — real Japanese ramen crafted with generations of technique."
          href="/japanese-ramen-near-me"
        />

        <LeadGenBanner />
        <Footer />
      </main>
    </>
  )
}
