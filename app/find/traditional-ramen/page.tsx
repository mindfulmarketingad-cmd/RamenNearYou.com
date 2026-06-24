import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Traditional Ramen Near Me | Authentic Japanese Ramen | RamenNearYou',
  description: 'Find traditional ramen near you — authentic Japanese bowls built on classic broths like tonkotsu, shoyu, shio, and miso. How to spot the real thing and what to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/traditional-ramen' },
  openGraph: {
    title: 'Traditional Ramen Near Me',
    description: 'Find authentic, traditional Japanese ramen near you.',
    url: 'https://www.ramennearyou.com/find/traditional-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TraditionalRamenPage() {
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
          pageTitle="Traditional Ramen Near Me"
          pageDescription="Showing ramen restaurants near you. Enter your ZIP or use your location, then filter by classic broths like tonkotsu, shoyu, shio, and miso to find a traditional bowl."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/traditional-ramen"
        heading="How I Find Traditional Ramen Near Me"
        intro={[
          'When I want traditional ramen, I am looking for a bowl made the classic Japanese way — a broth simmered for hours, fresh noodles cut to match it, and a few perfect toppings rather than a pile of gimmicks. The map above shows ramen restaurants near you; enter your ZIP or tap “Use my location,” then lean on the broth filters to zero in on the classics.',
          'Traditional does not mean fancy. It means a kitchen that respects the fundamentals. Here is how I tell the real thing from a bowl that just borrows the name.',
        ]}
        sections={[
          {
            h2: 'What counts as traditional ramen?',
            body: (
              <p>
                Traditional ramen is defined by its broth and balance. The four classic styles — tonkotsu (pork
                bone), shoyu (soy sauce), shio (salt), and miso — each come from a specific region of Japan and
                follow a time-tested method. A traditional shop usually keeps the menu focused, makes its broth
                in-house, and finishes the bowl with restraint: chashu, scallion, menma, maybe an egg.
              </p>
            ),
            points: [
              { h3: 'House-made broth', text: 'The broth is simmered on-site for hours, not poured from a packet — the single clearest sign of a traditional kitchen.' },
              { h3: 'A focused menu', text: 'Traditional shops do a few bowls obsessively well rather than offering dozens of fusion options.' },
              { h3: 'Classic toppings', text: 'Chashu, soft egg, scallion, nori, and menma — balanced, not buried.' },
            ],
          },
          {
            h2: 'The four classic broths to look for',
            body: (
              <p>
                If you want the most traditional experience, start with the originals: rich, creamy tonkotsu from
                Fukuoka; clean, soy-savory shoyu from Tokyo; delicate, salt-seasoned shio from Hakodate; and
                hearty, fermented miso from Sapporo. Use the broth filters above to jump straight to whichever
                classic you are craving near you.
              </p>
            ),
          },
          {
            h2: 'How to spot an authentic bowl',
            body: (
              <p>
                I read the reviews and photos before I go. Steam rising off a glossy broth, noodles with real
                bite, and chashu with a proper sear are good signs. Recurring praise for the broth — not just the
                vibe — usually means the kitchen is doing the slow, traditional work that matters.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for traditional ramen"
        tips={[
          'Filter by a classic broth — tonkotsu, shoyu, shio, or miso — to find the most traditional bowls.',
          'Favor shops with a short, focused menu; they usually take the broth seriously.',
          'Read recent reviews for praise of the broth and noodles specifically, not just the atmosphere.',
          'Eat it fast — traditional ramen is built to be slurped hot, before the noodles soften.',
          'Skip heavy customization on your first visit; taste the bowl the way the chef intended.',
        ]}
        faqs={[
          { q: 'What is traditional ramen?', a: 'Traditional ramen is a bowl made the classic Japanese way — a house-simmered broth (tonkotsu, shoyu, shio, or miso), fresh noodles, and a few balanced toppings like chashu, egg, and scallion.' },
          { q: 'How do I find traditional ramen near me?', a: 'Use the map above — enter your ZIP or tap “Use my location,” then filter by a classic broth like tonkotsu or shoyu to surface the most traditional bowls nearby.' },
          { q: 'What are the four classic ramen styles?', a: 'Tonkotsu (pork-bone), shoyu (soy sauce), shio (salt), and miso. Each originates from a different region of Japan and defines a traditional bowl.' },
          { q: 'How can I tell if a ramen shop is authentic?', a: 'Look for house-made broth, a focused menu, and classic toppings. Reviews and photos that praise the broth and noodles specifically are a strong sign of a traditional kitchen.' },
          { q: 'Is traditional ramen the same as authentic ramen?', a: 'Largely yes — both describe bowls made with classic Japanese broths and methods rather than heavily Westernized or fusion versions.' },
        ]}
      />
    </main>
  )
}
