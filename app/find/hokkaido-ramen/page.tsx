import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hokkaido Ramen Near Me | Sapporo Miso & Northern Styles | RamenNearYou',
  description: 'Find Hokkaido ramen near you — Sapporo miso, Hakodate shio, and Asahikawa shoyu. The northern Japanese styles to know and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hokkaido-ramen' },
  openGraph: {
    title: 'Hokkaido Ramen Near Me',
    description: 'Find Hokkaido-style ramen — Sapporo miso and more — near you.',
    url: 'https://www.ramennearyou.com/find/hokkaido-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function HokkaidoRamenPage() {
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
          initialQuery="hokkaido"
          pageTitle="Hokkaido Ramen Near Me"
          pageDescription="Find Hokkaido-style ramen near you — Sapporo miso and more. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/hokkaido-ramen"
        heading="My Guide to Hokkaido Ramen Near Me"
        intro={[
          'Hokkaido, Japan’s cold northern island, is one of ramen’s most important homelands — and its bowls are built for winter: hearty, warming, and deeply satisfying. The map above helps you find Hokkaido-style ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'When people say “Hokkaido ramen,” they usually mean one of three city styles. Here is what each one is and how I find a great version.',
        ]}
        sections={[
          {
            h2: 'The three great Hokkaido styles',
            body: (
              <p>
                Hokkaido’s ramen reputation rests on three cities, each with a signature broth. Together they
                cover rich, light, and balanced, so there is a Hokkaido bowl for every mood.
              </p>
            ),
            points: [
              { h3: 'Sapporo miso', text: 'The most famous — a hearty, fermented-soybean broth, often with corn, butter, bean sprouts, and ground pork over thick, curly noodles. Pure cold-weather comfort.' },
              { h3: 'Hakodate shio', text: 'A clear, delicate salt-based broth from the port city of Hakodate — light, clean, and refined.' },
              { h3: 'Asahikawa shoyu', text: 'A soy-based broth with a layer of lard on top to keep it piping hot in the cold, paired with wavy noodles.' },
            ],
          },
          {
            h2: 'Why Hokkaido ramen is built for cold',
            body: (
              <p>
                Hokkaido winters are brutal, and the ramen evolved to match. Sapporo’s miso broth is thick and
                warming, and Asahikawa shoyu famously floats a layer of fat on top specifically to trap heat so
                the bowl stays hot to the last sip. Even the toppings — corn, butter, plenty of pork — lean
                hearty. It is ramen as fuel against the cold, and it is wonderful any time you want comfort.
              </p>
            ),
          },
          {
            h2: 'How to find Hokkaido-style bowls',
            body: (
              <p>
                Sapporo miso is the most common Hokkaido style you will find, so the “Miso” filter is a great
                starting point. For the others, I check listings and menus for Sapporo, Hakodate, or Asahikawa
                references, and look for the corn-and-butter miso signature in photos. Shops that name a
                Hokkaido city are usually proud of the tradition and do it justice.
              </p>
            ),
          },
        ]}
        tipsHeading="My Hokkaido ramen tips"
        tips={[
          'For the classic Sapporo style, stack the “Miso” filter — it is the most common Hokkaido bowl.',
          'Look for the corn-and-butter miso signature in listing photos.',
          'Want something lighter? Seek out Hakodate-style shio instead.',
          'Asahikawa shoyu floats fat on top to stay hot — great on a cold day.',
          'Shops that name a Hokkaido city usually take the tradition seriously.',
        ]}
        faqs={[
          { q: 'What is Hokkaido ramen?', a: 'Hokkaido ramen refers to the hearty, warming styles from Japan’s northern island, centered on three cities: Sapporo (miso), Hakodate (shio), and Asahikawa (shoyu).' },
          { q: 'What is Sapporo ramen?', a: 'Sapporo ramen is the famous Hokkaido miso style — a rich, fermented-soybean broth often topped with corn, butter, bean sprouts, and ground pork over thick, curly noodles.' },
          { q: 'What are the three Hokkaido ramen styles?', a: 'Sapporo miso (hearty fermented-soybean broth), Hakodate shio (clear, delicate salt broth), and Asahikawa shoyu (soy broth with a layer of fat on top to keep it hot).' },
          { q: 'Why is Hokkaido ramen so rich?', a: 'It evolved for harsh northern winters. Thick miso broth, a fat layer on Asahikawa shoyu, and hearty toppings like corn and butter all help the bowl stay warming and filling against the cold.' },
          { q: 'How do I find Hokkaido ramen near me?', a: 'Use the map above and stack the “Miso” filter for the classic Sapporo style, or check listings and photos for Sapporo, Hakodate, or Asahikawa references.' },
        ]}
      />
    </main>
  )
}
