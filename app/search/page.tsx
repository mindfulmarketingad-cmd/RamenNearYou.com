import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SearchBox from './search-box'
import SearchExploreLinks from './search-explore-links'
import SearchView from './search-view'

// Static page: results are computed in the browser from ?q= (search-view.tsx).
export const metadata: Metadata = {
  title: 'Search Ramen Restaurants, Guides & Reviews',
  description: 'Search everything on RamenNearYou — restaurants, pho listings, guides, reviews, and map searches. Ask in plain English, like "best ramen in Phoenix" or "closest ramen near me".',
  alternates: { canonical: 'https://www.ramennearyou.com/search' },
}

export default function SearchPage() {
  const landing = (
    <>
        {/* The bar still owns the first screenful; the link hub sits below the
            fold so browsing is one scroll away without competing with it. */}
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 min-h-[calc(100vh-14rem)] py-16">
          <div className="w-full max-w-2xl text-center">
            <div className="text-5xl mb-5" aria-hidden="true">🍜</div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
              Search Ramen Near You
            </h1>
            <p className="text-ink-soft text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Ask in plain English. We&apos;ll pull matching restaurants, pho listings, guides,
              reviews, and map searches from across the site.
            </p>
            <SearchBox size="hero" autoFocus />
          </div>
        </div>
    </>
  )

  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <Suspense fallback={landing}>
        <SearchView landing={landing} />
      </Suspense>
      {/* Shown under the landing state and under results alike — a search
          that returned something narrow is still a good place to offer the
          browse route out. */}
      <SearchExploreLinks />
      <Footer />
    </main>
  )
}
