import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spicy Ramen Near Me | Spicy Miso, Tantanmen & More | RamenNearYou',
  description: 'Find spicy ramen near you — spicy miso, tantanmen, and chili-oil bowls with real heat. The spicy styles to know, how to order, and how to handle the burn.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/spicy-ramen' },
  openGraph: {
    title: 'Spicy Ramen Near Me',
    description: 'Find bold, spicy ramen with real heat near you.',
    url: 'https://www.ramennearyou.com/find/spicy-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function SpicyRamenPage() {
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
          initialBowls={['spicy-miso']}
          pageTitle="Spicy Ramen Near Me"
          pageDescription="Showing spicy ramen near you. Enter your ZIP or use your location to find a bold, fiery bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/spicy-ramen"
        heading="How I Find Spicy Ramen Near Me"
        intro={[
          'For me, a little heat makes a great bowl even better — the way chili plays against rich broth and springy noodles is pure magic. The map above is filtered to spicy ramen near you, from spicy miso to tantanmen to chili-oil-laced bowls. Enter your ZIP or use your location to find the closest fiery bowl.',
          'Spicy ramen is a whole category, not a single dish, so it helps to know the styles. Here are the spicy bowls worth seeking out, how I order for the right heat level, and how to handle the burn.',
        ]}
        sections={[
          {
            h2: 'The spicy ramen styles to know',
            body: (
              <p>
                Heat shows up in a few classic forms. Spicy miso (kara miso) builds chili into a hearty miso
                broth, where the sweetness balances the burn beautifully. Tantanmen is the Japanese take on
                Chinese dan dan — a creamy, sesame-and-chili broth with ground pork that is rich and fiery at
                once. And plenty of shops offer a chili oil (rayu) or spicy tare you can add to any bowl to dial
                the heat up.
              </p>
            ),
            points: [
              { h3: 'Spicy miso (kara miso)', text: 'Hearty miso broth with chili paste or oil — the natural sweetness of miso tames and balances the heat.' },
              { h3: 'Tantanmen', text: 'Creamy sesame-and-chili broth with ground pork; rich, nutty, and spicy all at once.' },
              { h3: 'Add-your-own heat', text: 'Many shops offer chili oil (rayu) or a spicy tare so you can spice up tonkotsu, shoyu, or any base to taste.' },
            ],
          },
          {
            h2: 'Ordering for the right heat level',
            body: (
              <p>
                Some shops let you choose a spice level, and I always start one notch below where I think I want
                to be — you can add more, but you cannot take it out. If you genuinely chase the burn, look for
                shops known for serious heat or check the “Extra Spicy” filter. And remember that good spicy
                ramen should still taste like ramen; heat is there to enhance the broth, not bury it.
              </p>
            ),
          },
          {
            h2: 'How to handle the heat',
            body: (
              <p>
                When a bowl is genuinely fiery, the fat in the broth and a soft egg help mellow it, and a cold
                drink on the side is your friend — a crisp lager or a slightly sweet highball both work. Eat the
                noodles and broth together so no single bite is pure chili, and pace yourself. The goal is the
                slow, satisfying warmth, not a five-alarm regret.
              </p>
            ),
          },
        ]}
        tipsHeading="My spicy ramen tips"
        tips={[
          'Filter to spicy, then sort by distance for the nearest fiery bowl.',
          'Start one heat level below your limit — you can always add chili oil at the table.',
          'Spicy miso is the most balanced starting point; tantanmen is the rich, nutty option.',
          'Want maximum burn? Check the “Extra Spicy” filter for the boldest bowls.',
          'A soft egg and a crisp or slightly sweet drink tame the heat without killing the flavor.',
        ]}
        faqs={[
          { q: 'What is spicy ramen?', a: 'Spicy ramen is any bowl built around chili heat — most often spicy miso (kara miso), tantanmen (sesame-and-chili broth), or a standard bowl boosted with chili oil or a spicy tare.' },
          { q: 'What is the best spicy ramen for beginners?', a: 'Spicy miso is the friendliest entry point — the sweetness of the miso balances the chili. Start at a moderate spice level and add chili oil at the table if you want more.' },
          { q: 'What is tantanmen?', a: 'Tantanmen is the Japanese version of Chinese dan dan noodles — a creamy, nutty sesame-and-chili broth topped with seasoned ground pork. It is rich and spicy at the same time.' },
          { q: 'How do I handle very spicy ramen?', a: 'Lean on the broth’s fat and a soft egg to mellow the heat, keep a cold drink handy, eat noodles and broth together, and pace yourself for a steady warmth rather than overload.' },
          { q: 'How do I find spicy ramen near me?', a: 'The map above is filtered to spicy ramen. Enter your ZIP or tap “Use my location” to sort the closest bowls, and add the “Extra Spicy” filter if you want the boldest heat.' },
        ]}
      />
    </main>
  )
}
