import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extra Spicy Ramen Near Me | Extreme Heat Ramen | RamenNearYou',
  description: 'Find extra spicy ramen near you — the bowls for serious heat seekers. Where to find max-heat ramen, how to order it, and how to survive the burn.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/extra-spicy-ramen' },
  openGraph: {
    title: 'Extra Spicy Ramen Near Me',
    description: 'Find the hottest, most fiery ramen near you.',
    url: 'https://www.ramennearyou.com/find/extra-spicy-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ExtraSpicyRamenPage() {
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
          initialMoods={['extra-spicy']}
          pageTitle="Extra Spicy Ramen Near Me"
          pageDescription="Showing extra spicy ramen near you. Enter your ZIP or use your location to find the hottest bowls nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/extra-spicy-ramen"
        heading="Where I Find Extra Spicy Ramen Near Me"
        intro={[
          'This page is for my fellow heat seekers — the people who ask for it hot and then ask for more chili oil. The map above is filtered to the spiciest ramen near you, the bowls built for serious capsaicin chasers. Enter your ZIP or use your location to find the closest fire.',
          'Extra spicy ramen is its own pursuit. Here is where the real heat lives, how to order it without ruining the bowl, and how to actually survive (and enjoy) the burn.',
        ]}
        sections={[
          {
            h2: 'Where the real heat lives',
            body: (
              <p>
                The hottest bowls usually come from a few places: shops with a named “extra spicy” or
                numbered spice scale, Korean-influenced spicy ramen, fiery tantanmen, and spicy miso cranked to
                the top level. Some restaurants build a reputation around heat challenges or a signature
                blow-your-head-off bowl — those are the ones to seek out when moderate spicy just is not cutting it.
              </p>
            ),
            points: [
              { h3: 'Numbered spice scales', text: 'Shops that let you pick a level (often 1–10) are where you can truly max it out — ask for the top tier.' },
              { h3: 'Spicy tantanmen and kara miso', text: 'These rich, chili-forward styles take heat the best, since the broth carries the burn instead of just scorching.' },
              { h3: 'Korean-influenced bowls', text: 'Gochugaru- and gochujang-spiked ramen brings a different, deeper kind of heat worth chasing.' },
            ],
          },
          {
            h2: 'Ordering max heat without ruining the bowl',
            body: (
              <p>
                The mistake heat seekers make is drowning a delicate broth until it tastes like pure chili. The
                best extra-spicy bowls keep the ramen recognizable — you still taste the miso, sesame, or pork
                under the fire. I order a rich base that can carry the heat, push the spice level up, and add
                chili oil at the table so I can dial in the exact burn without nuking the flavor from the start.
              </p>
            ),
          },
          {
            h2: 'How to survive the burn',
            body: (
              <p>
                Real talk: capsaicin is fat- and dairy-soluble, not water-soluble, so chugging water just spreads
                it around. The fat in a rich broth and a soft egg help, and if a bowl truly defeats you, a sip
                of something cold and slightly sweet does more than ice water. Pace yourself, eat noodles and
                broth together, and lean into the endorphin rush — that is the whole point.
              </p>
            ),
          },
        ]}
        tipsHeading="My extra-spicy tips"
        tips={[
          'Filter to “Extra Spicy,” then sort by distance for the nearest fire.',
          'Seek out shops with a numbered spice scale and ask for the top tier.',
          'Order a rich base (spicy miso, tantanmen) that can carry heat without losing flavor.',
          'Add chili oil at the table to dial in the exact burn rather than over-spicing from the start.',
          'Cold, slightly sweet drinks beat water for the burn — capsaicin is not water-soluble.',
        ]}
        faqs={[
          { q: 'Where can I find extra spicy ramen near me?', a: 'The map above is filtered to the spiciest bowls. Enter your ZIP or tap “Use my location” to find max-heat ramen nearby, especially shops with a numbered spice scale.' },
          { q: 'What ramen is the spiciest?', a: 'Bowls with adjustable numbered spice levels set to the top, fiery tantanmen, spicy miso cranked up, and Korean-influenced gochugaru/gochujang ramen tend to bring the most heat.' },
          { q: 'How do I order the hottest possible ramen?', a: 'Choose a shop with a spice scale and request the top level, pick a rich base that carries heat, and add chili oil at the table so you can push the burn without losing the flavor.' },
          { q: 'What helps with the burn from spicy ramen?', a: 'Capsaicin is fat- and dairy-soluble, not water-soluble, so the broth’s fat, a soft egg, and a cold, slightly sweet drink help far more than chugging water.' },
          { q: 'Is extra spicy ramen still supposed to taste good?', a: 'Yes — the best ones keep the ramen recognizable under the heat. You should still taste the miso, sesame, or pork beneath the chili, not just pure burn.' },
        ]}
      />
    </main>
  )
}
