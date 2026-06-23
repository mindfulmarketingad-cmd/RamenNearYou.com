import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tantanmen Near Me | Japanese Dan Dan Ramen | RamenNearYou',
  description: 'Find tantanmen near you — the creamy, nutty, spicy sesame-and-chili ramen. What tantanmen is, how it differs from dan dan noodles, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tantanmen' },
  openGraph: {
    title: 'Tantanmen Near Me',
    description: 'Find creamy, spicy sesame tantanmen near you.',
    url: 'https://www.ramennearyou.com/find/tantanmen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TantanmenPage() {
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
          initialBowls={['tantanmen']}
          pageTitle="Tantanmen Near Me"
          pageDescription="Showing tantanmen near you. Enter your ZIP or use your location to find a creamy, spicy sesame bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/tantanmen"
        heading="How I Find Great Tantanmen Near Me"
        intro={[
          'Tantanmen is comfort and fire in the same bowl — a creamy, nutty sesame broth spiked with chili oil and topped with savory ground pork. It is rich, spicy, and deeply satisfying in a way no other ramen quite matches. The map above is filtered to tantanmen near you; enter your ZIP or use your location to find the closest bowl.',
          'It descends from a famous Chinese dish but has become its own thing in Japan. Here is what tantanmen is, how it differs from its ancestor, and how I order it.',
        ]}
        sections={[
          {
            h2: 'What tantanmen is',
            body: (
              <p>
                Tantanmen is the Japanese take on Chinese dan dan noodles. The Japanese version is typically
                soupier and creamier, built on a sesame-paste broth balanced with chili oil for heat, savory
                ground pork, and often greens like bok choy or spinach. The result is a bowl that is
                simultaneously nutty, rich, spicy, and umami-packed — a lot going on, in the best way.
              </p>
            ),
            points: [
              { h3: 'Sesame base', text: 'Ground sesame (and often soy milk or a rich stock) gives the broth its signature creamy, nutty body.' },
              { h3: 'Chili oil heat', text: 'Rayu (chili oil) and chili paste bring the spice, balanced against the richness of the sesame.' },
              { h3: 'Ground pork and greens', text: 'Seasoned minced pork and leafy greens are the classic toppings, adding savoriness and freshness.' },
            ],
          },
          {
            h2: 'Tantanmen vs. dan dan noodles',
            body: (
              <p>
                The original Sichuan dan dan noodles are often served with little or no broth and a numbing
                Sichuan-peppercorn (mala) kick. Japanese tantanmen usually has more soup, leans creamier from
                the sesame, and dials the numbing spice down in favor of a rounder, richer heat. If you love one,
                it is worth trying the other — they are cousins with distinct personalities.
              </p>
            ),
          },
          {
            h2: 'How I order tantanmen',
            body: (
              <p>
                I order it at a medium-to-high spice level so the chili shows up without burying the sesame, add
                a soft egg for extra richness, and mix the chili oil through before digging in. If the shop
                offers extra sesame or a more numbing Sichuan version, I will try it. A side of rice is great for
                soaking up the last of that creamy, spicy broth.
              </p>
            ),
          },
        ]}
        tipsHeading="My tantanmen tips"
        tips={[
          'Filter to “Tantanmen,” then sort by distance for the nearest bowl.',
          'Order medium-to-high spice so the chili complements the sesame instead of burying it.',
          'Stir the chili oil through before eating to balance the bowl.',
          'Add a soft egg for extra richness against the heat.',
          'A side of rice soaks up the creamy, spicy broth at the end.',
        ]}
        faqs={[
          { q: 'What is tantanmen?', a: 'Tantanmen is the Japanese version of Chinese dan dan noodles — a creamy, nutty sesame broth spiked with chili oil and topped with seasoned ground pork and greens. It is rich and spicy at once.' },
          { q: 'How is tantanmen different from dan dan noodles?', a: 'Sichuan dan dan noodles are often nearly brothless with a numbing mala kick. Japanese tantanmen is usually soupier, creamier from sesame, and leans toward a rounder, richer heat.' },
          { q: 'Is tantanmen very spicy?', a: 'It is adjustable. The chili oil brings real heat, but the creamy sesame base balances it. Order a moderate spice level and add more if you want — the sesame keeps it from being purely fiery.' },
          { q: 'Is tantanmen vegetarian?', a: 'Usually no — it is typically topped with ground pork and built on a meat or sesame-and-stock base. Some shops offer a vegetarian or vegan tantanmen using a plant-based broth; confirm before ordering.' },
          { q: 'How do I find tantanmen near me?', a: 'The map above is filtered to tantanmen. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
