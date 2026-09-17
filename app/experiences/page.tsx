import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdSquare from '@/components/ad-square'
import { experiences, getExperienceFacets } from '@/lib/experiences'
import ExperiencesList from './experiences-list'

export const metadata: Metadata = {
  title: 'Ramen Experiences — Cooking Classes, Food Tours & Tastings',
  description:
    'Book hands-on ramen experiences: cooking classes where you make noodles and broth from scratch, food tours, and tastings. Hand-picked, with free cancellation on most bookings.',
  alternates: { canonical: 'https://www.ramennearyou.com/experiences' },
  openGraph: {
    title: 'Ramen Experiences — Cooking Classes, Food Tours & Tastings',
    description:
      'Hands-on ramen cooking classes, food tours, and tastings — hand-picked and bookable online.',
    url: 'https://www.ramennearyou.com/experiences',
  },
}

export default function ExperiencesPage() {
  const { destinations, categories } = getExperienceFacets()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ramen Experiences',
    itemListElement: experiences.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: e.name,
        url: `https://www.ramennearyou.com/experiences/${e.slug}`,
        address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: e.country },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: e.rating,
          reviewCount: e.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />

        <div className="bg-[#F5F0EA] px-4 sm:px-6 pt-24 pb-8">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-4">
              <Link href="/" className="hover:text-[#96602F] transition-colors">Ramen Near You</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1E2026]">Experiences</span>
            </nav>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
              Ramen Experiences
            </h1>
            <p className="text-[#6B6862] text-sm leading-relaxed max-w-2xl">
              Cooking classes, food tours, and tastings for people who want to do more than eat a
              bowl — make one from scratch, or eat your way through a city with someone who knows
              it. Booked through Viator, with free cancellation on most experiences.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <ExperiencesList
            experiences={experiences}
            destinations={destinations}
            categories={categories}
          />

          <div className="mt-8 min-h-[250px]">
            <AdSquare />
          </div>

          <p className="text-[11px] text-[#6B6862]/80 mt-8">
            Experiences are booked through Viator. We may earn a commission at no extra cost to you.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
