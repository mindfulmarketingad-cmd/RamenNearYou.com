import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Open Early Near Me | Morning & Early Lunch Ramen | RamenNearYou',
  description: 'Find ramen that opens early near you — morning ramen and early lunch spots serving before 10:30 AM. Plus why asa-ra (breakfast ramen) is worth trying.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-open-early' },
  openGraph: {
    title: 'Ramen Open Early Near Me',
    description: 'Find ramen restaurants that open early near you.',
    url: 'https://www.ramennearyou.com/find/ramen-open-early',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenOpenEarlyPage() {
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
          initialFlags={['open-early']}
          pageTitle="Ramen Open Early Near Me"
          pageDescription="Showing ramen restaurants that open early. Enter your ZIP or use your location to find a morning or early-lunch bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-open-early"
        heading="Where I Find Ramen That Opens Early Near Me"
        intro={[
          'Most ramen shops do not unlock the doors until lunch, so when I want a bowl before noon — an early lunch, a pre-shift meal, or honest-to-goodness breakfast ramen — I have to know where to look. The map above is filtered to ramen restaurants near you that open early, by around 10:30 AM on at least one day. Enter your ZIP or use your location to find the closest early openers.',
          'Eating ramen in the morning sounds unusual if you grew up on cereal, but it is a real and wonderful tradition. Here is why early ramen is worth it, what to order before noon, and how to make sure your spot is actually serving when you arrive.',
        ]}
        sections={[
          {
            h2: 'Breakfast ramen is a real tradition',
            body: (
              <p>
                In parts of Japan, “asa-ra” (morning ramen) is a beloved ritual — a warm, savory bowl to start
                the day instead of something sweet. Once you try it, it makes total sense: ramen is basically
                soup, noodles, and protein, which is a perfectly reasonable breakfast. A lighter bowl in the
                morning is comforting without weighing you down for the rest of the day.
              </p>
            ),
          },
          {
            h2: 'What I order before noon',
            body: (
              <p>
                In the morning I reach for lighter, cleaner bowls rather than the heaviest, fattiest options.
                A clear shoyu or shio is my go-to — savory and warming without sitting like a brick. If I want
                something heartier before a long day, a chicken paitan splits the difference: rich but not as
                heavy as a full tonkotsu.
              </p>
            ),
            points: [
              { h3: 'Shoyu and shio', text: 'Clean, soy- or salt-based broths are the ideal morning bowl — savory and light enough to start the day.' },
              { h3: 'Chicken paitan', text: 'Creamy and satisfying without the heaviness of pork tonkotsu — a good middle ground before a busy day.' },
              { h3: 'Add an egg', text: 'A soft, jammy egg makes any early bowl feel like a proper breakfast.' },
            ],
          },
          {
            h2: 'Confirm they are actually open',
            body: (
              <p>
                Early hours vary a lot by day of the week — a shop might open at 10 on weekends but not until
                11:30 on weekdays. This filter flags spots that open early on at least one day, so before you
                head out, add the “Open Now” filter to confirm they are serving this minute, or open the
                listing to check today’s exact hours.
              </p>
            ),
          },
        ]}
        tipsHeading="My early-ramen tips"
        tips={[
          'Filter to “Open Early,” then add “Open Now” to confirm they are serving right now.',
          'Order lighter bowls — shoyu, shio, or chicken paitan — to start the day without feeling weighed down.',
          'Add a soft egg to turn an early bowl into a proper breakfast.',
          'Check today’s exact hours on the listing; early openings often differ by day of the week.',
          'Going right at opening usually means the freshest broth and an empty, calm room.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants open early near me?', a: 'The map above is filtered to spots that open early — by around 10:30 AM on at least one day. Enter your ZIP or tap “Use my location” to find an early bowl nearby.' },
          { q: 'Can you eat ramen for breakfast?', a: 'Yes. Morning ramen (“asa-ra”) is a tradition in parts of Japan. A lighter shoyu or shio bowl makes a warming, savory start to the day.' },
          { q: 'What time do ramen restaurants usually open?', a: 'Most open for lunch around 11 AM or 11:30 AM. The early openers on this page start sooner, which is great for an early lunch or a morning bowl.' },
          { q: 'What ramen is best in the morning?', a: 'Lighter bowls like shoyu and shio, or a chicken paitan if you want something heartier. Add a soft egg to make it feel like breakfast.' },
          { q: 'How do I know an early spot is open today?', a: 'Early hours vary by day. Add the “Open Now” filter to confirm they are serving, or open the listing to check today’s exact schedule before you go.' },
        ]}
      />
    </main>
  )
}
