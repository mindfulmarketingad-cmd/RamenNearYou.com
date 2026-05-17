import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import BrowseCities from '@/components/browse-cities'
import BrowseBroth from '@/components/browse-broth'
import BrothNearMeSection from '@/components/broth-near-me-section'
import LeadGenBanner from '@/components/lead-gen-banner'
import RecentlyAdded from '@/components/recently-added'
import Footer from '@/components/footer'
import { restaurants } from '@/lib/restaurants'

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

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <main className="min-h-screen bg-[#2F323A]">
        <Navbar />
        <Hero />
        <BrowseCities />
        <BrowseBroth />

        <BrothNearMeSection
          title="Spicy Ramen Near Me"
          description="Craving heat? These top-rated ramen restaurants near you serve bold, spicy broths — from tantanmen and chili oil to volcano ramen with tongue-tingling fire."
          href="/spicy-ramen-near-me"
          restaurants={sorted.slice(0, 4)}
        />

        <BrothNearMeSection
          title="Miso Ramen Near Me"
          description="Find rich, fermented miso ramen near you. Hokkaido-style miso broth with corn, butter, and thick noodles — one of the most warming bowls in Japanese cuisine."
          href="/miso-ramen-near-me"
          restaurants={sorted.slice(4, 8)}
        />

        <BrothNearMeSection
          title="Shoyu Ramen Near Me"
          description="Discover classic shoyu ramen near you. The original Tokyo-style soy sauce broth — clear, savory, and balanced. The perfect entry point into great ramen."
          href="/shoyu-ramen-near-me"
          restaurants={sorted.slice(8, 12)}
        />

        <LeadGenBanner />
        <RecentlyAdded />
        <Footer />
      </main>
    </>
  )
}
