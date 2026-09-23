import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PersonalFeed from '@/components/personal-feed'

export const metadata: Metadata = {
  title: 'My Ramen Feed | RamenNearYou',
  description:
    'Follow the ZIP codes you eat in and scroll every ramen shop in them — your own personal ramen feed.',
  // Every visitor's feed is different and none of it is public, so there's
  // nothing here for a crawler to index.
  robots: { index: false, follow: false },
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-page">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <header className="mb-5">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
            My Feed
          </h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Every ramen shop in the ZIP codes you follow.
          </p>
        </header>

        <PersonalFeed />
      </div>

      <Footer />
    </main>
  )
}
