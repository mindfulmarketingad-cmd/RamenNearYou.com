import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen With Outdoor Seating Near Me | Patio Ramen | RamenNearYou',
  description: 'Find ramen restaurants with outdoor seating near you — patios and sidewalk tables. Plus my take on which ramen styles actually shine when you eat outside.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-outdoor-seating' },
  openGraph: {
    title: 'Ramen With Outdoor Seating Near Me',
    description: 'Find ramen restaurants with patios and outdoor tables near you.',
    url: 'https://www.ramennearyou.com/find/ramen-outdoor-seating',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenOutdoorSeatingPage() {
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
          initialFlags={['outdoor-seating']}
          pageTitle="Ramen With Outdoor Seating Near Me"
          pageDescription="Showing ramen restaurants with outdoor seating. Enter your ZIP or use your location to find a patio near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-outdoor-seating"
        heading="Where I Go for Ramen With a Patio Near Me"
        intro={[
          'Slurping a bowl of ramen outside on a cool evening is one of my favorite ways to eat it. The steam, the fresh air, the people-watching — it just hits differently than a cramped counter. The map above is filtered to ramen spots near you that have outdoor seating, so you can grab a patio table instead of a waitlist buzzer. Enter your ZIP or use your location to sort the closest ones first.',
          'Outdoor seating is a little different from most filters because it is seasonal and weather-dependent, so I will walk through how to use it well, which bowls I actually order when I am eating al fresco, and how to make sure the patio is open before you head over.',
        ]}
        sections={[
          {
            h2: 'Why ramen and patios go together better than you think',
            body: (
              <p>
                People assume a steaming bowl is a cold-weather, indoors-only thing. I disagree. A hot bowl
                of ramen on a crisp fall or spring night, outside under a heat lamp, is genuinely one of the
                best seats in the city. And in summer, the right styles turn ramen into a perfect warm-weather
                meal. The trick is matching the bowl to the temperature.
              </p>
            ),
            points: [
              { h3: 'Cool evenings', text: 'This is peak ramen-patio weather. A rich tonkotsu or miso bowl plus a cold beer outside is hard to beat — the warmth of the bowl and the cool air balance perfectly.' },
              { h3: 'Hot summer days', text: 'Reach for hiyashi (chilled) ramen or tsukemen with cold dipping noodles. Brothless mazemen also works well when you do not want a face full of soup steam in the heat.' },
              { h3: 'Bringing a group or dog', text: 'Patios are usually the most flexible seating a shop has, and many are dog-friendly, which makes outdoor ramen great for casual hangs.' },
            ],
          },
          {
            h2: 'How to make sure the patio is actually open',
            body: (
              <p>
                Outdoor seating data comes from each restaurant’s listed amenities, and patios open and close
                with the seasons and the weather. Before I drive over on a borderline day, I open the listing,
                grab the phone number, and call to confirm the patio is set up. It takes 30 seconds and saves a
                wasted trip when a sudden rainstorm has them folding the umbrellas.
              </p>
            ),
          },
          {
            h2: 'Stacking outdoor seating with other filters',
            body: (
              <p>
                Outdoor seating pairs nicely with the other filters in the bar above the map. If I want a
                relaxed evening, I add “Open Late” or “Full Bar.” If I am out with family, I add
                “Family-Friendly.” And if I just want the best possible bowl on a patio, I add “Top Rated” and
                let the highest-rated outdoor spots rise to the top of the list.
              </p>
            ),
          },
        ]}
        tipsHeading="My patio-ramen tips"
        tips={[
          'Filter to “Outdoor Seating,” then sort by distance to find the nearest patio.',
          'Call ahead on iffy-weather days — patios open and close seasonally and with the forecast.',
          'Match the bowl to the temperature: rich and hot when it is cool, chilled or brothless when it is warm.',
          'Add the “Full Bar” filter for a beer or sake to go with the fresh air.',
          'Going earlier in the evening usually means easier patio seating before the dinner rush.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants have outdoor seating near me?', a: 'The map above is filtered to spots with outdoor seating. Enter your ZIP or tap “Use my location” to sort patios and sidewalk tables by distance from you.' },
          { q: 'Is ramen good to eat outside?', a: 'Absolutely. A hot bowl is fantastic on a cool patio, and in warm weather, chilled (hiyashi) ramen, tsukemen, or brothless mazemen make great outdoor options.' },
          { q: 'How do I know if a ramen spot’s patio is open?', a: 'Outdoor seating comes from each restaurant’s listed amenities, and patios are seasonal. Open the listing, call the restaurant, and confirm before heading over on borderline weather days.' },
          { q: 'What should I order for ramen on a patio in summer?', a: 'Go for chilled ramen, cold tsukemen dipping noodles, or mazemen. They give you the ramen experience without a steaming bowl of broth in the heat.' },
          { q: 'Are ramen patios usually dog-friendly?', a: 'Many are — outdoor seating is typically where restaurants allow dogs. It varies by city and shop, so call ahead if you are bringing a pup.' },
        ]}
      />
    </main>
  )
}
