import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hidden Gem Ramen Near Me | Underrated Ramen Spots | RamenNearYou',
  description: 'Discover hidden gem ramen near you — highly rated spots locals love before the crowds arrive. How I spot an under-the-radar bowl worth the trip.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-hidden-gems' },
  openGraph: {
    title: 'Hidden Gem Ramen Near Me',
    description: 'Discover underrated, highly rated ramen spots near you.',
    url: 'https://www.ramennearyou.com/find/ramen-hidden-gems',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenHiddenGemsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ErrorBoundary
        fallback={
          <section className="pt-16 bg-[#F5F4F0]">
            <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
            </div>
          </section>
        }
      >
        <HomeMapHero
          initialFlags={['hidden-gems']}
          pageTitle="Hidden Gem Ramen Near Me"
          pageDescription="Showing highly rated ramen spots that haven’t hit the mainstream yet. Enter your ZIP or use your location to find an underrated bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-hidden-gems"
        heading="How I Hunt Down Hidden Gem Ramen Near Me"
        intro={[
          'Some of the best bowls I have ever had came from places nobody was talking about — a tiny shop in a strip mall, a counter with ten seats and no marketing budget. The map above is filtered to hidden gems: ramen restaurants near you rated 4.5 stars and up that still have a relatively small number of reviews. Enter your ZIP or use your location to surface the under-the-radar spots closest to you.',
          'A “hidden gem” is not just a low-review-count restaurant — it is one that is genuinely excellent but has not gone viral yet. Here is how I read the signals, why these spots are worth seeking out, and how to enjoy them before everyone else catches on.',
        ]}
        sections={[
          {
            h2: 'What makes a real hidden gem',
            body: (
              <p>
                The filter combines two signals: a high rating (4.5+) and a smaller review count. That
                combination is the sweet spot. A high rating tells me the people who have been love it; the low
                review count tells me it has not been discovered at scale yet. Together they point to newer
                shops, neighborhood favorites, and quietly excellent spots the algorithms have not surfaced.
              </p>
            ),
            points: [
              { h3: 'Consistently high rating', text: 'A 4.5+ average means the bowls are landing for the people who show up — quality is there even if the crowd is not.' },
              { h3: 'Smaller review count', text: 'Fewer reviews usually means newer, off the beaten path, or simply under-marketed — not lower quality.' },
              { h3: 'The combination', text: 'Either signal alone is noise. Together, they reliably point to a spot worth the trip before the lines form.' },
            ],
          },
          {
            h2: 'Why hidden gems are worth the trip',
            body: (
              <p>
                Beyond the thrill of finding something first, these spots come with real perks. Shorter waits
                are the obvious one — a place with 80 reviews rarely has the hour-long line of a viral shop.
                You also tend to get more attentive service, owners who are often behind the counter, and the
                satisfaction of supporting a small business early. I have found some of my all-time favorites
                exactly this way.
              </p>
            ),
          },
          {
            h2: 'How to vet a hidden gem before you go',
            body: (
              <p>
                I open the listing and skim the most recent reviews, look at the photos to see whether the
                bowls look carefully made, and check the hours since smaller shops sometimes keep limited
                schedules. If the recent reviews are glowing and the photos show real care, I go. Stacking the
                “Open Now” filter helps confirm they are actually serving before you make the trip.
              </p>
            ),
          },
        ]}
        tipsHeading="My hidden-gem hunting tips"
        tips={[
          'Filter to “Hidden Gems,” then sort by distance to find the nearest under-the-radar spot.',
          'Skim the most recent reviews and the photos — fresh praise and careful-looking bowls are the green lights.',
          'Expect shorter waits than viral spots; fewer reviews usually means a calmer room.',
          'Check hours before you go — small shops sometimes keep limited or unusual schedules.',
          'Stack “Open Now” to confirm they are serving, and go support a great small business early.',
        ]}
        faqs={[
          { q: 'What counts as a hidden gem ramen spot?', a: 'Highly rated restaurants (4.5 stars and up) that still have a relatively small number of reviews — under-the-radar spots locals love before the crowds arrive.' },
          { q: 'How do I find hidden gem ramen near me?', a: 'The map above is pre-filtered to hidden gems. Enter your ZIP or tap “Use my location” to sort these underrated spots by distance from you.' },
          { q: 'Are highly rated spots with few reviews actually good?', a: 'Often, yes. A strong rating from a smaller crowd usually signals a newer or neighborhood favorite that has not gone viral. Fewer reviews also tends to mean shorter waits.' },
          { q: 'How do I vet a hidden gem before going?', a: 'Skim the most recent reviews, check the photos for carefully made bowls, and confirm the hours. Glowing recent reviews and quality photos are reliable green lights.' },
          { q: 'Why seek out hidden gems instead of popular spots?', a: 'Shorter waits, more attentive service, owners often behind the counter, and the satisfaction of finding something great early and supporting a small business before the lines form.' },
        ]}
      />
    </main>
  )
}
